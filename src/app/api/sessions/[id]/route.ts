import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schema for updating a session
const updateSessionSchema = z.object({
  endTime: z.string().datetime().optional(),
  duration: z.number().positive().optional(),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'INTERRUPTED', 'CANCELLED']).optional(),
  completed: z.boolean().optional(),
  notes: z.string().optional(),
  subjectId: z.string().nullable().optional(),
})

// GET /api/sessions/[id] - Get a specific session
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const studySession = await prisma.studySession.findFirst({
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

    if (!studySession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(studySession)
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}

// PUT /api/sessions/[id] - Update a specific session
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
    const validatedData = updateSessionSchema.parse(body)

    // Check if session exists and belongs to user
    const existingSession = await prisma.studySession.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Update the session
    const updatedSession = await prisma.studySession.update({
      where: {
        id: params.id,
      },
      data: {
        ...validatedData,
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

    return NextResponse.json(updatedSession)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating session:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}

// DELETE /api/sessions/[id] - Delete a specific session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if session exists and belongs to user
    const existingSession = await prisma.studySession.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Delete the session
    await prisma.studySession.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json(
      { message: 'Session deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    )
  }
}