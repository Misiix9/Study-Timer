"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface ProductivityData {
  date: string
  workMinutes: number
  focusScore: number
  sessions: number
}

interface ProductivityTrendChartProps {
  data: ProductivityData[]
  period?: 'week' | 'month' | 'year'
}

// Mock data - will be replaced with real API data
const mockData: ProductivityData[] = [
  { date: '2025-01-01', workMinutes: 120, focusScore: 85, sessions: 5 },
  { date: '2025-01-02', workMinutes: 180, focusScore: 92, sessions: 7 },
  { date: '2025-01-03', workMinutes: 90, focusScore: 78, sessions: 4 },
  { date: '2025-01-04', workMinutes: 200, focusScore: 95, sessions: 8 },
  { date: '2025-01-05', workMinutes: 150, focusScore: 88, sessions: 6 },
  { date: '2025-01-06', workMinutes: 220, focusScore: 96, sessions: 9 },
  { date: '2025-01-07', workMinutes: 100, focusScore: 82, sessions: 4 },
]

export function ProductivityTrendChart({ data = mockData, period = 'week' }: ProductivityTrendChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    if (period === 'week') {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else if (period === 'month') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short' })
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'workMinutes' 
                ? `Study Time: ${formatTime(entry.value)}`
                : entry.name === 'focusScore'
                ? `Focus Score: ${entry.value}%`
                : `Sessions: ${entry.value}`
              }
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const averageFocusScore = data.reduce((sum, day) => sum + day.focusScore, 0) / data.length
  const totalMinutes = data.reduce((sum, day) => sum + day.workMinutes, 0)
  const totalSessions = data.reduce((sum, day) => sum + day.sessions, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Productivity Trends
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Last {period}
          </div>
        </div>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-muted-foreground">Total Time: </span>
            <span className="font-medium">{formatTime(totalMinutes)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Sessions: </span>
            <span className="font-medium">{totalSessions}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Avg Focus: </span>
            <span className="font-medium">{Math.round(averageFocusScore)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                className="text-sm fill-muted-foreground"
              />
              <YAxis yAxisId="minutes" orientation="left" className="text-sm fill-muted-foreground" />
              <YAxis yAxisId="percentage" orientation="right" domain={[0, 100]} className="text-sm fill-muted-foreground" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="minutes"
                type="monotone"
                dataKey="workMinutes"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                name="Study Time"
              />
              <Line
                yAxisId="percentage"
                type="monotone"
                dataKey="focusScore"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                name="Focus Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}