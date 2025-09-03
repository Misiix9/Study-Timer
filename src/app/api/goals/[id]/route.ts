import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schema for updating a goal
const updateGoalSchema = z.object({
  targetMinutes: z.number().positive().optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  completed: z.boolean().optional(),
  achievedMinutes: z.number().min(0).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// GET /api/goals/[id] - Get a specific goal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const goal = await prisma.goal.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    })

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    // Calculate real-time progress
    const sessions = await prisma.studySession.findMany({
      where: {
        userId: session.user.id,
        subjectId: goal.subjectId,
        startTime: {
          gte: goal.startDate,
          lte: goal.endDate,
        },
        completed: true,
        type: 'WORK',
      },
      select: {
        duration: true,
        startTime: true,
      },
    })

    const achievedMinutes = sessions.reduce((total, session) => {
      return total + (session.duration || 0) / 60
    }, 0)

    const progress = Math.min((achievedMinutes / goal.targetMinutes) * 100, 100)

    // Calculate daily progress for the goal period
    const dailyProgress = sessions.reduce((acc, session) => {
      const date = session.startTime.toISOString().split('T')[0]
      if (!acc[date]) acc[date] = 0
      acc[date] += (session.duration || 0) / 60
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      ...goal,
      achievedMinutes: Math.round(achievedMinutes),
      progress: Math.round(progress),
      dailyProgress,
      sessionsCount: sessions.length,
    })
  } catch (error) {
    console.error('Error fetching goal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goal' },
      { status: 500 }
    )
  }
}

// PUT /api/goals/[id] - Update a specific goal
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateGoalSchema.parse(body)

    // Check if goal exists and belongs to user
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    // Validate date range if both dates are provided
    if (validatedData.startDate && validatedData.endDate) {
      const startDate = new Date(validatedData.startDate)
      const endDate = new Date(validatedData.endDate)
      
      if (endDate <= startDate) {
        return NextResponse.json(
          { error: 'End date must be after start date' },
          { status: 400 }
        )
      }
    }

    // Update the goal
    const updatedGoal = await prisma.goal.update({
      where: {
        id: params.id,
      },
      data: {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
        updatedAt: new Date(),
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    })

    return NextResponse.json(updatedGoal)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating goal:', error)
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    )
  }
}

// DELETE /api/goals/[id] - Delete a specific goal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if goal exists and belongs to user
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    // Delete the goal
    await prisma.goal.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json(
      { message: 'Goal deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    )
  }
}