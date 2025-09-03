import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schema for updating a subject
const updateSubjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  icon: z.string().max(50).optional(),
  archived: z.boolean().optional(),
})

// GET /api/subjects/[id] - Get a specific subject
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get('includeStats') === 'true'

    if (includeStats) {
      const subject = await prisma.subject.findFirst({
        where: {
          id: params.id,
          userId: session.user.id,
        },
        include: {
          _count: {
            select: {
              studySessions: true,
            },
          },
          studySessions: {
            select: {
              duration: true,
              completed: true,
              startTime: true,
              type: true,
            },
            orderBy: {
              startTime: 'desc',
            },
            take: 50,
          },
        },
      })

      if (!subject) {
        return NextResponse.json(
          { error: 'Subject not found' },
          { status: 404 }
        )
      }

      // Calculate detailed stats
      const totalMinutes = subject.studySessions.reduce((sum, session) => {
        return sum + (session.duration || 0) / 60
      }, 0)

      const completedSessions = subject.studySessions.filter(s => s.completed).length
      const completionRate = subject.studySessions.length > 0 
        ? (completedSessions / subject.studySessions.length) * 100 
        : 0

      // Daily breakdown for the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const recentSessions = subject.studySessions.filter(session => 
        new Date(session.startTime) >= thirtyDaysAgo
      )

      const dailyBreakdown = recentSessions.reduce((acc, session) => {
        const date = new Date(session.startTime).toISOString().split('T')[0]
        if (!acc[date]) {
          acc[date] = { minutes: 0, sessions: 0 }
        }
        acc[date].minutes += (session.duration || 0) / 60
        acc[date].sessions += 1
        return acc
      }, {} as Record<string, { minutes: number; sessions: number }>)

      const response = {
        id: subject.id,
        name: subject.name,
        color: subject.color,
        icon: subject.icon,
        archived: subject.archived,
        createdAt: subject.createdAt,
        updatedAt: subject.updatedAt,
        stats: {
          totalSessions: subject._count.studySessions,
          totalMinutes: Math.round(totalMinutes),
          completedSessions,
          completionRate: Math.round(completionRate),
          dailyBreakdown,
          recentSessions: subject.studySessions.slice(0, 10),
        },
      }

      return NextResponse.json(response)
    } else {
      const subject = await prisma.subject.findFirst({
        where: {
          id: params.id,
          userId: session.user.id,
        },
        select: {
          id: true,
          name: true,
          color: true,
          icon: true,
          archived: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      if (!subject) {
        return NextResponse.json(
          { error: 'Subject not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(subject)
    }
  } catch (error) {
    console.error('Error fetching subject:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subject' },
      { status: 500 }
    )
  }
}

// PUT /api/subjects/[id] - Update a specific subject
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
    const validatedData = updateSubjectSchema.parse(body)

    // Check if subject exists and belongs to user
    const existingSubject = await prisma.subject.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingSubject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      )
    }

    // If updating name, check for duplicates
    if (validatedData.name && validatedData.name !== existingSubject.name) {
      const duplicateSubject = await prisma.subject.findFirst({
        where: {
          userId: session.user.id,
          name: validatedData.name,
          archived: false,
          id: { not: params.id },
        },
      })

      if (duplicateSubject) {
        return NextResponse.json(
          { error: 'Subject with this name already exists' },
          { status: 400 }
        )
      }
    }

    // Update the subject
    const updatedSubject = await prisma.subject.update({
      where: {
        id: params.id,
      },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedSubject)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating subject:', error)
    return NextResponse.json(
      { error: 'Failed to update subject' },
      { status: 500 }
    )
  }
}

// DELETE /api/subjects/[id] - Delete a specific subject
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if subject exists and belongs to user
    const existingSubject = await prisma.subject.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            studySessions: true,
          },
        },
      },
    })

    if (!existingSubject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      )
    }

    // Check if subject has associated sessions
    if (existingSubject._count.studySessions > 0) {
      // Archive instead of delete to preserve data integrity
      const archivedSubject = await prisma.subject.update({
        where: {
          id: params.id,
        },
        data: {
          archived: true,
          updatedAt: new Date(),
        },
      })

      return NextResponse.json({
        message: 'Subject archived successfully (has associated sessions)',
        subject: archivedSubject,
      })
    } else {
      // Safe to delete - no associated sessions
      await prisma.subject.delete({
        where: {
          id: params.id,
        },
      })

      return NextResponse.json(
        { message: 'Subject deleted successfully' },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('Error deleting subject:', error)
    return NextResponse.json(
      { error: 'Failed to delete subject' },
      { status: 500 }
    )
  }
}