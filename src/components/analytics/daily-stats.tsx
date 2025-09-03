"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, Target, Zap, TrendingUp } from 'lucide-react'

// Mock data - will be replaced with API call
const mockDailyStats = {
  totalMinutes: 180,
  sessionsCompleted: 7,
  goal: 240,
  streak: 5,
  productivity: 85,
  focusScore: 92
}

export function DailyStats() {
  const stats = mockDailyStats
  const goalProgress = (stats.totalMinutes / stats.goal) * 100

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
          <div className="text-2xl font-bold">{Math.round(goalProgress)}%</div>
          <Progress value={goalProgress} className="h-2 mt-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {formatTime(stats.goal - stats.totalMinutes)} remaining
          </div>
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
          <div className="text-xs text-muted-foreground">days</div>
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
            Excellent
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}