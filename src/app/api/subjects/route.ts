import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schema for creating/updating a subject
const subjectSchema = z.object({
  name: z.string().min(1).max(200),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  icon: z.string().max(50).optional(),
  archived: z.boolean().optional(),
})

// GET /api/subjects - Fetch user's subjects
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeArchived = searchParams.get('includeArchived') === 'true'
    const includeStats = searchParams.get('includeStats') === 'true'

    const where: any = {
      userId: session.user.id,
    }

    if (!includeArchived) {
      where.archived = false
    }

    let subjects
    if (includeStats) {
      // Include usage statistics
      subjects = await prisma.subject.findMany({
        where,
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
            },
          },
        },
        orderBy: [
          { archived: 'asc' },
          { name: 'asc' },
        ],
      })

      // Calculate additional stats
      subjects = subjects.map(subject => {
        const totalMinutes = subject.studySessions.reduce((sum, session) => {
          return sum + (session.duration || 0) / 60
        }, 0)

        const completedSessions = subject.studySessions.filter(s => s.completed).length
        const completionRate = subject.studySessions.length > 0 
          ? (completedSessions / subject.studySessions.length) * 100 
          : 0

        return {
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
          },
        }
      })
    } else {
      subjects = await prisma.subject.findMany({
        where,
        select: {
          id: true,
          name: true,
          color: true,
          icon: true,
          archived: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: [
          { archived: 'asc' },
          { name: 'asc' },
        ],
      })
    }

    return NextResponse.json({ subjects })
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    )
  }
}

// POST /api/subjects - Create a new subject
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = subjectSchema.parse(body)

    // Check if subject name already exists for this user
    const existingSubject = await prisma.subject.findFirst({
      where: {
        userId: session.user.id,
        name: validatedData.name,
        archived: false,
      },
    })

    if (existingSubject) {
      return NextResponse.json(
        { error: 'Subject with this name already exists' },
        { status: 400 }
      )
    }

    // Create the subject
    const subject = await prisma.subject.create({
      data: {
        userId: session.user.id,
        name: validatedData.name,
        color: validatedData.color || '#3b82f6', // Default blue color
        icon: validatedData.icon || '📚', // Default book icon
        archived: validatedData.archived || false,
      },
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating subject:', error)
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    )
  }
}