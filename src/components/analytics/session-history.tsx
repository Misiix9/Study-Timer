"use client"

import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock } from 'lucide-react'

interface SessionHistoryProps {
  limit?: number
}

// Mock data - will be replaced with API call
const mockSessions = [
  {
    id: '1',
    type: 'WORK',
    duration: 25,
    subject: 'Mathematics',
    completed: true,
    startTime: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: '2',
    type: 'SHORT_BREAK',
    duration: 5,
    completed: true,
    startTime: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
  },
  {
    id: '3',
    type: 'WORK',
    duration: 25,
    subject: 'Physics',
    completed: true,
    startTime: new Date(Date.now() - 1000 * 60 * 90) // 1.5 hours ago
  },
  {
    id: '4',
    type: 'WORK',
    duration: 20,
    subject: 'Computer Science',
    completed: false,
    startTime: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
  },
  {
    id: '5',
    type: 'LONG_BREAK',
    duration: 15,
    completed: true,
    startTime: new Date(Date.now() - 1000 * 60 * 180) // 3 hours ago
  },
]

export function SessionHistory({ limit = 10 }: SessionHistoryProps) {
  const sessions = mockSessions.slice(0, limit)

  const formatTime = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins < 60) {
      return `${diffMins}m ago`
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)}h ago`
    } else {
      return `${Math.floor(diffMins / 1440)}d ago`
    }
  }

  const getSessionTypeDisplay = (type: string): { name: string; color: string } => {
    switch (type) {
      case 'WORK':
        return { name: 'Focus', color: 'bg-blue-500' }
      case 'SHORT_BREAK':
        return { name: 'Short Break', color: 'bg-green-500' }
      case 'LONG_BREAK':
        return { name: 'Long Break', color: 'bg-purple-500' }
      default:
        return { name: 'Session', color: 'bg-gray-500' }
    }
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No recent sessions</p>
        <p className="text-sm">Start a timer to see your session history</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-3">
        {sessions.map((session) => {
          const sessionType = getSessionTypeDisplay(session.type)
          
          return (
            <div 
              key={session.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div 
                  className={`w-3 h-3 rounded-full ${sessionType.color} ${!session.completed ? 'opacity-50' : ''}`} 
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {sessionType.name}
                    </span>
                    {!session.completed && (
                      <Badge variant="outline" className="text-xs">
                        Incomplete
                      </Badge>
                    )}
                  </div>
                  {session.subject && (
                    <p className="text-xs text-muted-foreground truncate">
                      {session.subject}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-medium">
                  {session.duration}m
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTime(session.startTime)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}