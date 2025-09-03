import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'today' // today, week, month, year
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Determine date range
    const now = new Date()
    let dateFilter: { gte: Date; lte?: Date } = { gte: now }

    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    } else {
      switch (period) {
        case 'today':
          dateFilter.gte = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          const weekStart = new Date(now)
          weekStart.setDate(now.getDate() - now.getDay())
          weekStart.setHours(0, 0, 0, 0)
          dateFilter.gte = weekStart
          break
        case 'month':
          dateFilter.gte = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'year':
          dateFilter.gte = new Date(now.getFullYear(), 0, 1)
          break
      }
    }

    // Fetch sessions for the period
    const sessions = await prisma.studySession.findMany({
      where: {
        userId: session.user.id,
        startTime: dateFilter,
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
      orderBy: {
        startTime: 'desc',
      },
    })

    // Calculate analytics
    const totalSessions = sessions.length
    const completedSessions = sessions.filter(s => s.completed).length
    const workSessions = sessions.filter(s => s.type === 'WORK')
    const breakSessions = sessions.filter(s => s.type !== 'WORK')

    // Calculate total minutes
    const totalMinutes = sessions.reduce((total, session) => {
      return total + (session.duration || 0) / 60
    }, 0)

    const workMinutes = workSessions.reduce((total, session) => {
      return total + (session.duration || 0) / 60
    }, 0)

    const breakMinutes = breakSessions.reduce((total, session) => {
      return total + (session.duration || 0) / 60
    }, 0)

    // Calculate productivity metrics
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) : 0
    const focusScore = workSessions.length > 0 ? 
      (workSessions.filter(s => s.completed).length / workSessions.length) : 0

    // Subject breakdown
    const subjectStats = sessions.reduce((acc, session) => {
      if (session.subject) {
        const subjectName = session.subject.name
        if (!acc[subjectName]) {
          acc[subjectName] = {
            name: subjectName,
            color: session.subject.color,
            icon: session.subject.icon,
            minutes: 0,
            sessions: 0,
          }
        }
        acc[subjectName].minutes += (session.duration || 0) / 60
        acc[subjectName].sessions += 1
      }
      return acc
    }, {} as Record<string, any>)

    // Peak hours analysis
    const hourlyStats = sessions.reduce((acc, session) => {
      const hour = new Date(session.startTime).getHours()
      acc[hour] = (acc[hour] || 0) + (session.duration || 0) / 60
      return acc
    }, {} as Record<number, number>)

    const peakHour = Object.entries(hourlyStats).reduce((peak, [hour, minutes]) => {
      return minutes > peak.minutes ? { hour: parseInt(hour), minutes } : peak
    }, { hour: 0, minutes: 0 })

    // Streak calculation (simplified - would need more complex logic for actual streaks)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todaysSessions = sessions.filter(s => {
      const sessionDate = new Date(s.startTime)
      sessionDate.setHours(0, 0, 0, 0)
      return sessionDate.getTime() === today.getTime()
    })
    const hasStudiedToday = todaysSessions.length > 0

    return NextResponse.json({
      period,
      dateRange: {
        start: dateFilter.gte,
        end: dateFilter.lte || now,
      },
      summary: {
        totalMinutes: Math.round(totalMinutes),
        workMinutes: Math.round(workMinutes),
        breakMinutes: Math.round(breakMinutes),
        totalSessions,
        completedSessions,
        completionRate: Math.round(completionRate * 100),
        focusScore: Math.round(focusScore * 100),
        peakHour: peakHour.hour,
        hasStudiedToday,
      },
      subjects: Object.values(subjectStats).map(subject => ({
        ...subject,
        minutes: Math.round(subject.minutes),
      })),
      hourlyDistribution: hourlyStats,
      recentSessions: sessions.slice(0, 10),
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}