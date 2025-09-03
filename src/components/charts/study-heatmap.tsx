"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeatmapData {
  date: string
  minutes: number
  sessions: number
}

interface StudyHeatmapProps {
  data?: HeatmapData[]
  period?: 'month' | 'year'
}

// Generate empty data for new users
const generateEmptyData = (): HeatmapData[] => {
  const data: HeatmapData[] = []
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 90) // Last 90 days
  
  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    data.push({
      date: date.toISOString().split('T')[0],
      minutes: 0, // New users have no study time
      sessions: 0,
    })
  }
  
  return data
}

export function StudyHeatmap({ data = generateEmptyData(), period = 'month' }: StudyHeatmapProps) {
  // Handle empty data state for new users
  const hasAnyData = data.some(d => d.minutes > 0)
  
  if (!hasAnyData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            Study Consistency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mb-4 opacity-50" />
            <h3 className="font-medium mb-2">No study sessions yet</h3>
            <p className="text-sm text-center max-w-md">
              Start studying to build your consistency heatmap and track your progress over time.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  const maxMinutes = Math.max(...data.map(d => d.minutes))
  const totalMinutes = data.reduce((sum, d) => sum + d.minutes, 0)
  const studyDays = data.filter(d => d.minutes > 0).length
  const currentStreak = calculateStreak(data)

  function calculateStreak(data: HeatmapData[]): number {
    let streak = 0
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].minutes > 0) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  const getIntensityColor = (minutes: number): string => {
    if (minutes === 0) return 'bg-muted/30'
    const intensity = minutes / maxMinutes
    if (intensity <= 0.25) return 'bg-green-200 dark:bg-green-900/40'
    if (intensity <= 0.5) return 'bg-green-300 dark:bg-green-800/60'
    if (intensity <= 0.75) return 'bg-green-400 dark:bg-green-700/80'
    return 'bg-green-500 dark:bg-green-600'
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Group data by weeks
  const weeks: HeatmapData[][] = []
  let currentWeek: HeatmapData[] = []
  
  data.forEach((day, index) => {
    const date = new Date(day.date)
    const dayOfWeek = date.getDay()
    
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push([...currentWeek])
      currentWeek = []
    }
    
    currentWeek.push(day)
    
    if (index === data.length - 1 && currentWeek.length > 0) {
      weeks.push(currentWeek)
    }
  })

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            Study Consistency
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {studyDays} days
            </Badge>
            <Badge variant="outline" className="text-xs">
              {currentStreak} streak
            </Badge>
          </div>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Total: {formatTime(totalMinutes)}</span>
          <span>Average: {formatTime(Math.round(totalMinutes / data.length))}/day</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Weekday labels */}
              <div className="flex gap-1 mb-2">
                <div className="w-8"></div> {/* Space for week labels */}
                {weekdays.map(day => (
                  <div key={day} className="w-3 text-xs text-muted-foreground text-center">
                    {day[0]}
                  </div>
                ))}
              </div>
              
              {/* Heatmap rows */}
              {weeks.slice(-13).map((week, weekIndex) => (
                <div key={weekIndex} className="flex gap-1 mb-1 items-center">
                  <div className="w-8 text-xs text-muted-foreground text-right pr-2">
                    {new Date(week[0]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  {weekdays.map((_, dayIndex) => {
                    const day = week.find(d => new Date(d.date).getDay() === dayIndex)
                    return (
                      <div
                        key={dayIndex}
                        className={cn(
                          "w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-green-400",
                          day ? getIntensityColor(day.minutes) : 'bg-muted/20'
                        )}
                        title={day ? `${formatDate(day.date)}: ${formatTime(day.minutes)}, ${day.sessions} sessions` : 'No data'}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-muted/30" />
                <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/40" />
                <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-800/60" />
                <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700/80" />
                <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-600" />
              </div>
              <span className="text-muted-foreground">More</span>
            </div>
            
            <div className="text-muted-foreground">
              Last 90 days
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold">{studyDays}</div>
              <div className="text-sm text-muted-foreground">Study Days</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">
                {Math.round((studyDays / data.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Consistency</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}