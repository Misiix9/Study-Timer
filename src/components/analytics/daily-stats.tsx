"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, Target, Zap, TrendingUp, Calendar } from 'lucide-react'

interface DailyStats {
  totalMinutes: number
  sessionsCompleted: number
  goal: number
  streak: number
  productivity: number
  focusScore: number
}

export function DailyStats() {
  const [stats, setStats] = useState<DailyStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDailyStats()
  }, [])

  const loadDailyStats = async () => {
    try {
      setIsLoading(true)
      // In a real app, this would fetch from API
      // For new users, start with empty stats
      const today = new Date().toISOString().split('T')[0]
      const userStats = {
        totalMinutes: 0,
        sessionsCompleted: 0,
        goal: 0, // No goal set initially
        streak: 0,
        productivity: 0,
        focusScore: 0
      }
      setStats(userStats)
    } catch (error) {
      console.error('Failed to load daily stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-16 bg-gray-100 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">Unable to load today's stats</p>
        </CardContent>
      </Card>
    )
  }
  const goalProgress = stats.goal > 0 ? (stats.totalMinutes / stats.goal) * 100 : 0

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Time */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Total Time</span>
          </div>
          <div className="text-2xl font-bold">{formatTime(stats.totalMinutes)}</div>
          <div className="text-xs text-muted-foreground">
            {stats.sessionsCompleted} sessions
          </div>
        </CardContent>
      </Card>

      {/* Goal Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Goal</span>
          </div>
          {stats.goal > 0 ? (
            <>
              <div className="text-2xl font-bold">{Math.round(goalProgress)}%</div>
              <Progress value={goalProgress} className="h-2 mt-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {stats.goal > stats.totalMinutes 
                  ? `${formatTime(stats.goal - stats.totalMinutes)} remaining`
                  : 'Goal achieved! 🎉'
                }
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-gray-400">-</div>
              <div className="text-xs text-gray-400 mt-1">
                No goal set
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Streak */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-muted-foreground">Streak</span>
          </div>
          <div className="text-2xl font-bold">{stats.streak}</div>
          <div className="text-xs text-muted-foreground">
            {stats.streak === 0 ? 'Start your streak!' : stats.streak === 1 ? 'day' : 'days'}
          </div>
        </CardContent>
      </Card>

      {/* Focus Score */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-muted-foreground">Focus</span>
          </div>
          <div className="text-2xl font-bold">{stats.focusScore}%</div>
          <Badge variant="secondary" className="text-xs">
            {stats.focusScore === 0 
              ? 'No data yet' 
              : stats.focusScore >= 90 
                ? 'Excellent' 
                : stats.focusScore >= 70 
                  ? 'Good' 
                  : stats.focusScore >= 50 
                    ? 'Fair' 
                    : 'Needs work'
            }
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}