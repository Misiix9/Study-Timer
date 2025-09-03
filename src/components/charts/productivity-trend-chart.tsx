"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, BarChart3 } from 'lucide-react'

interface ProductivityData {
  date: string
  workMinutes: number
  focusScore: number
  sessions: number
}

interface ProductivityTrendChartProps {
  data?: ProductivityData[]
  period?: 'week' | 'month' | 'year'
}

export function ProductivityTrendChart({ data = [], period = 'week' }: ProductivityTrendChartProps) {
  // Handle empty data state
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Productivity Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
            <h3 className="font-medium mb-2">No productivity data yet</h3>
            <p className="text-sm text-center max-w-md">
              Complete some study sessions to see your productivity trends and focus patterns over time.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
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

  const averageFocusScore = data.length > 0 ? data.reduce((sum, day) => sum + day.focusScore, 0) / data.length : 0
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