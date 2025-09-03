"use client"

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useTimerStore } from '@/lib/stores/timer'
import { Play, Pause, Square, SkipForward, Settings, Volume2 } from 'lucide-react'
import { TimerSettings } from './timer-settings'
import { SoundSettingsComponent } from '@/components/settings/sound-settings'
import { soundManager } from '@/lib/audio/sound-manager'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export function Timer() {
  const {
    currentSessionType,
    timeRemaining,
    totalTime,
    status,
    currentRound,
    completedSessions,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    tick,
  } = useTimerStore()

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Timer effect
  useEffect(() => {
    if (status === 'RUNNING') {
      intervalRef.current = setInterval(() => {
        tick()
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [status, tick])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return // Don't trigger shortcuts when typing in inputs
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault()
          if (status === 'RUNNING') {
            pauseTimer()
          } else {
            startTimer()
          }
          break
        case 'Escape':
          event.preventDefault()
          resetTimer()
          break
        case 'KeyS':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            skipSession()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [status, startTimer, pauseTimer, resetTimer, skipSession])

  // Notification and sound effects
  useEffect(() => {
    if (status === 'COMPLETED') {
      // Play completion sound
      const soundType = currentSessionType === 'WORK' ? 'work-complete' : 'break-complete'
      soundManager.playNotification(soundType as any)
      
      // Browser notifications
      if (settings.notificationsEnabled) {
        // Request permission if not already granted
        if (Notification.permission === 'default') {
          Notification.requestPermission()
        }
        
        // Show notification
        if (Notification.permission === 'granted') {
          const sessionName = currentSessionType === 'WORK' ? 'Work Session' : 
                             currentSessionType === 'SHORT_BREAK' ? 'Short Break' : 'Long Break'
          
          new Notification(`${sessionName} Complete!`, {
            body: 'Time to switch to the next session.',
            icon: '/favicon.ico',
          })
        }
      }
    }
  }, [status, currentSessionType, settings.notificationsEnabled])

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getSessionDisplayName = (type: string): string => {
    switch (type) {
      case 'WORK': return 'Focus Time'
      case 'SHORT_BREAK': return 'Short Break'
      case 'LONG_BREAK': return 'Long Break'
      default: return 'Session'
    }
  }

  const getSessionColor = (type: string): string => {
    switch (type) {
      case 'WORK': return 'bg-blue-500'
      case 'SHORT_BREAK': return 'bg-green-500'
      case 'LONG_BREAK': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={cn("text-white", getSessionColor(currentSessionType))}
          >
            {getSessionDisplayName(currentSessionType)}
          </Badge>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Sound Settings</DialogTitle>
                </DialogHeader>
                <SoundSettingsComponent />
              </DialogContent>
            </Dialog>
            <TimerSettings />
          </div>
        </div>
        <CardTitle className="text-lg">
          {currentSessionType === 'WORK' ? `Pomodoro ${currentRound}` : 'Break Time'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-6xl font-mono font-bold mb-4">
            {formatTime(timeRemaining)}
          </div>
          <Progress 
            value={progress} 
            className={cn("h-3", `[&>div]:${getSessionColor(currentSessionType)}`)} 
          />
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center gap-3">
          <Button
            size="lg"
            onClick={status === 'RUNNING' ? pauseTimer : startTimer}
            className="flex items-center gap-2"
          >
            {status === 'RUNNING' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {status === 'RUNNING' ? 'Pause' : status === 'PAUSED' ? 'Resume' : 'Start'}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={resetTimer}
            disabled={status === 'IDLE'}
            className="flex items-center gap-2"
          >
            <Square className="h-4 w-4" />
            Reset
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={skipSession}
            className="flex items-center gap-2"
          >
            <SkipForward className="h-4 w-4" />
            Skip
          </Button>
        </div>

        {/* Session Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Sessions completed today: {completedSessions}</p>
          <p className="text-xs mt-1">
            Press <kbd className="px-1 py-0.5 bg-muted rounded">Space</kbd> to start/pause, 
            <kbd className="px-1 py-0.5 bg-muted rounded mx-1">Esc</kbd> to reset
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge 
            variant={status === 'RUNNING' ? 'default' : status === 'PAUSED' ? 'secondary' : 'outline'}
          >
            {status === 'RUNNING' ? 'In Progress' : 
             status === 'PAUSED' ? 'Paused' : 
             status === 'COMPLETED' ? 'Completed' : 'Ready'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}