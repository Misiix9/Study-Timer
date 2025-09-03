"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

interface SubjectData {
  name: string
  minutes: number
  color: string
  icon: string
  sessions: number
}

interface SubjectDistributionChartProps {
  data: SubjectData[]
  showLegend?: boolean
}

// Mock data - will be replaced with real API data
const mockData: SubjectData[] = [
  { name: 'Mathematics', minutes: 180, color: '#3b82f6', icon: '📐', sessions: 7 },
  { name: 'Physics', minutes: 120, color: '#10b981', icon: '⚛️', sessions: 5 },
  { name: 'Computer Science', minutes: 240, color: '#8b5cf6', icon: '💻', sessions: 9 },
  { name: 'Literature', minutes: 90, color: '#f59e0b', icon: '📚', sessions: 4 },
  { name: 'Chemistry', minutes: 60, color: '#ef4444', icon: '🧪', sessions: 3 },
]

export function SubjectDistributionChart({ data = mockData, showLegend = true }: SubjectDistributionChartProps) {
  const total = data.reduce((sum, subject) => sum + subject.minutes, 0)

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = ((data.minutes / total) * 100).toFixed(1)
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium flex items-center gap-2">
            <span>{data.icon}</span>
            {data.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Time: {formatTime(data.minutes)} ({percentage}%)
          </p>
          <p className="text-sm text-muted-foreground">
            Sessions: {data.sessions}
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.payload.icon}</span>
            <span>{entry.value}</span>
            <span className="text-muted-foreground">
              ({formatTime(entry.payload.minutes)})
            </span>
          </div>
        ))}
      </div>
    )
  }

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    if (percent < 0.05) return null // Hide labels for slices smaller than 5%
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Subject Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No subject data available</p>
            <p className="text-sm">Start studying with subjects to see distribution</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-500" />
          Subject Distribution
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Total study time: {formatTime(total)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="minutes"
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend content={<CustomLegend />} />}
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Subject breakdown table */}
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Breakdown</h4>
          <div className="space-y-1">
            {data
              .sort((a, b) => b.minutes - a.minutes)
              .map((subject, index) => (
                <div key={subject.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: subject.color }}
                    />
                    <span>{subject.icon}</span>
                    <span>{subject.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span>{formatTime(subject.minutes)}</span>
                    <span>{((subject.minutes / total) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </CardContent>
    </Card>
  )
}