"use client"

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock } from 'lucide-react'

interface SessionHistoryProps {
  limit?: number
}

interface Session {
  id: string
  type: 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK'
  duration: number
  subject?: string
  completed: boolean
  startTime: Date
}

export function SessionHistory({ limit = 10 }: SessionHistoryProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSessions = async () => {
      try {
        // Real API call would go here
        // For now, return empty array for new users
        const userSessions: Session[] = []
        setSessions(userSessions)
      } catch (error) {
        console.error('Failed to load sessions:', error)
        setSessions([])
      } finally {
        setIsLoading(false)
      }
    }

    loadSessions()
  }, [])

  const displaySessions = sessions.slice(0, limit)

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

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50 animate-pulse" />
        <p>Loading sessions...</p>
      </div>
    )
  }

  if (displaySessions.length === 0) {
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
        {displaySessions.map((session) => {
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