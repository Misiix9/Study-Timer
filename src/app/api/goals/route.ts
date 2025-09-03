import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schema for creating a goal
const createGoalSchema = z.object({
  type: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM']),
  targetMinutes: z.number().positive(),
  subjectId: z.string().optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
})

// Validation schema for updating a goal
const updateGoalSchema = z.object({
  targetMinutes: z.number().positive().optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  completed: z.boolean().optional(),
  achievedMinutes: z.number().min(0).optional(),
})

// GET /api/goals - Fetch user's goals
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const active = searchParams.get('active') === 'true'
    const subjectId = searchParams.get('subjectId')

    // Build where clause
    const where: Record<string, any> = {
      userId: session.user.id,
    }

    if (type) {
      where.type = type
    }

    if (subjectId) {
      where.subjectId = subjectId
    }

    if (active !== null) {
      const now = new Date()
      where.startDate = { lte: now }
      where.endDate = { gte: now }
      if (active) {
        where.completed = false
      }
    }

    const goals = await prisma.goal.findMany({
      where,
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
      orderBy: [
        { completed: 'asc' },
        { endDate: 'asc' },
      ],
    })

    // Calculate progress for each goal
    const goalsWithProgress = await Promise.all(
      goals.map(async (goal) => {
        // Calculate achieved minutes from sessions within the goal period
        const sessions = await prisma.studySession.findMany({
          where: {
            userId: session.user.id,
            subjectId: goal.subjectId,
            startTime: {
              gte: goal.startDate,
              lte: goal.endDate,
            },
            completed: true,
            type: 'WORK', // Only count work sessions towards goals
          },
          select: {
            duration: true,
          },
        })

        const achievedMinutes = sessions.reduce((total, session) => {
          return total + (session.duration || 0) / 60
        }, 0)

        // Calculate progress percentage
        const progress = Math.min((achievedMinutes / goal.targetMinutes) * 100, 100)

        // Check if goal should be marked as completed
        const shouldBeCompleted = achievedMinutes >= goal.targetMinutes

        // Update achieved minutes and completion status
        if (Math.abs(goal.achievedMinutes - achievedMinutes) > 0.1 || 
            (shouldBeCompleted && !goal.completed)) {
          await prisma.goal.update({
            where: { id: goal.id },
            data: {
              achievedMinutes: Math.round(achievedMinutes),
              completed: shouldBeCompleted,
            },
          })
        }

        return {
          ...goal,
          achievedMinutes: Math.round(achievedMinutes),
          progress: Math.round(progress),
          completed: shouldBeCompleted,
        }
      })
    )

    return NextResponse.json({ goals: goalsWithProgress })
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}

// POST /api/goals - Create a new goal
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createGoalSchema.parse(body)

    // Validate date range
    const startDate = new Date(validatedData.startDate)
    const endDate = new Date(validatedData.endDate)
    
    if (endDate <= startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Validate subject exists if provided
    if (validatedData.subjectId) {
      const subject = await prisma.subject.findFirst({
        where: {
          id: validatedData.subjectId,
          userId: session.user.id,
        },
      })

      if (!subject) {
        return NextResponse.json(
          { error: 'Subject not found' },
          { status: 404 }
        )
      }
    }

    // Check for overlapping goals of the same type and subject
    const overlappingGoal = await prisma.goal.findFirst({
      where: {
        userId: session.user.id,
        type: validatedData.type,
        subjectId: validatedData.subjectId || null,
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    })

    if (overlappingGoal) {
      return NextResponse.json(
        { error: 'A goal of this type already exists for the specified period' },
        { status: 400 }
      )
    }

    // Create the goal
    const goal = await prisma.goal.create({
      data: {
        userId: session.user.id,
        subjectId: validatedData.subjectId || null,
        type: validatedData.type,
        targetMinutes: validatedData.targetMinutes,
        title: validatedData.title,
        description: validatedData.description,
        startDate: startDate,
        endDate: endDate,
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

    return NextResponse.json({ goal }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating goal:', error)
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    )
  }
}

// PUT /api/goals - Update multiple goals (bulk update)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { goalIds, updates } = body

    if (!Array.isArray(goalIds) || goalIds.length === 0) {
      return NextResponse.json(
        { error: 'Goal IDs array is required' },
        { status: 400 }
      )
    }

    const validatedUpdates = updateGoalSchema.parse(updates)

    // Update goals
    const updatedGoals = await prisma.goal.updateMany({
      where: {
        id: { in: goalIds },
        userId: session.user.id, // Ensure user owns the goals
      },
      data: {
        ...validatedUpdates,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      updated: updatedGoals.count,
      message: `${updatedGoals.count} goals updated successfully`,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating goals:', error)
    return NextResponse.json(
      { error: 'Failed to update goals' },
      { status: 500 }
    )
  }
}