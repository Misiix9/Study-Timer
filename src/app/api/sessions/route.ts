import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schema for creating a session
const createSessionSchema = z.object({
  subjectId: z.string().optional(),
  type: z.enum(['WORK', 'SHORT_BREAK', 'LONG_BREAK']),
  pomodoroRound: z.number().min(1).max(8).optional(),
  cycleId: z.string().optional(),
})

// Validation schema for updating a session
const updateSessionSchema = z.object({
  endTime: z.string().datetime().optional(),
  duration: z.number().positive().optional(),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'INTERRUPTED', 'CANCELLED']).optional(),
  completed: z.boolean().optional(),
  notes: z.string().optional(),
})

// GET /api/sessions - Fetch user's sessions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const subjectId = searchParams.get('subjectId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const type = searchParams.get('type')

    // Build where clause
    const where: any = {
      userId: session.user.id,
    }

    if (subjectId) {
      where.subjectId = subjectId
    }

    if (type) {
      where.type = type
    }

    if (startDate || endDate) {
      where.startTime = {}
      if (startDate) {
        where.startTime.gte = new Date(startDate)
      }
      if (endDate) {
        where.startTime.lte = new Date(endDate)
      }
    }

    const sessions = await prisma.studySession.findMany({
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
      orderBy: {
        startTime: 'desc',
      },
      take: limit,
      skip: offset,
    })

    const totalCount = await prisma.studySession.count({ where })

    return NextResponse.json({
      sessions,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

// POST /api/sessions - Create a new session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createSessionSchema.parse(body)

    // Create the session
    const studySession = await prisma.studySession.create({
      data: {
        userId: session.user.id,
        subjectId: validatedData.subjectId || null,
        type: validatedData.type,
        startTime: new Date(),
        status: 'IN_PROGRESS',
        pomodoroRound: validatedData.pomodoroRound,
        cycleId: validatedData.cycleId,
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

    return NextResponse.json(studySession, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

// PUT /api/sessions - Update multiple sessions (bulk update)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { sessionIds, updates } = body

    if (!Array.isArray(sessionIds) || sessionIds.length === 0) {
      return NextResponse.json(
        { error: 'Session IDs array is required' },
        { status: 400 }
      )
    }

    const validatedUpdates = updateSessionSchema.parse(updates)

    // Update sessions
    const updatedSessions = await prisma.studySession.updateMany({
      where: {
        id: { in: sessionIds },
        userId: session.user.id, // Ensure user owns the sessions
      },
      data: {
        ...validatedUpdates,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      updated: updatedSessions.count,
      message: `${updatedSessions.count} sessions updated successfully`,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating sessions:', error)
    return NextResponse.json(
      { error: 'Failed to update sessions' },
      { status: 500 }
    )
  }
}