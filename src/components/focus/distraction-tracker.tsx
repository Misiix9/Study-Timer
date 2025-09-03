'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  AlertCircle,
  Eye,
  TrendingDown,
  TrendingUp,
  Clock,
  Brain,
  Zap,
  Plus,
  X,
  Target,
  Calendar
} from 'lucide-react'
import { format } from 'date-fns'

interface Distraction {
  id: string
  type: string
  description: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high'
  duration?: number
  trigger?: string
  sessionId?: string
}

interface DistractionPattern {
  type: string
  frequency: number
  avgDuration: number
  commonTriggers: string[]
  timeOfDay: string[]
}

const DISTRACTION_TYPES = [
  { value: 'social-media', label: 'Social Media', icon: '📱' },
  { value: 'notifications', label: 'Notifications', icon: '🔔' },
  { value: 'environment', label: 'Environment', icon: '🏠' },
  { value: 'thoughts', label: 'Internal Thoughts', icon: '💭' },
  { value: 'physical', label: 'Physical Needs', icon: '🚶' },
  { value: 'other', label: 'Other', icon: '❓' }
]

const SEVERITY_COLORS = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-orange-100 text-orange-800 border-orange-200',
  high: 'bg-red-100 text-red-800 border-red-200'
}

export function DistractionTracker() {
  const [distractions, setDistractions] = useState<Distraction[]>([])
  const [newDistraction, setNewDistraction] = useState({
    type: '',
    description: '',
    severity: 'medium' as const,
    duration: 0,
    trigger: ''
  })
  const [patterns, setPatterns] = useState<DistractionPattern[]>([])
  const [todayDistractions, setTodayDistractions] = useState(0)
  const [averageDaily, setAverageDaily] = useState(0)
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  useEffect(() => {
    calculatePatterns()
    calculateStats()
  }, [distractions])

  const calculatePatterns = () => {
    const typeGroups = distractions.reduce((acc, distraction) => {
      if (!acc[distraction.type]) {
        acc[distraction.type] = []
      }
      acc[distraction.type].push(distraction)
      return acc
    }, {} as Record<string, Distraction[]>)

    const newPatterns = Object.entries(typeGroups).map(([type, items]) => ({
      type,
      frequency: items.length,
      avgDuration: items.reduce((sum, item) => sum + (item.duration || 0), 0) / items.length,
      commonTriggers: [...new Set(items.map(item => item.trigger).filter(Boolean))].slice(0, 3),
      timeOfDay: items.map(item => format(item.timestamp, 'HH')).reduce((acc, hour) => {
        acc[hour] = (acc[hour] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    })).map(pattern => ({
      ...pattern,
      timeOfDay: Object.entries(pattern.timeOfDay)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 2)
        .map(([hour]) => `${hour}:00`)
    }))

    setPatterns(newPatterns.sort((a, b) => b.frequency - a.frequency))
  }

  const calculateStats = () => {
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    
    const todayCount = distractions.filter(d => d.timestamp >= todayStart).length
    setTodayDistractions(todayCount)
    
    const days = Math.max(1, Math.ceil((Date.now() - Math.min(...distractions.map(d => d.timestamp.getTime()))) / (1000 * 60 * 60 * 24)))
    setAverageDaily(Math.round(distractions.length / days * 10) / 10)
  }

  const addDistraction = () => {
    if (newDistraction.type && newDistraction.description) {
      const distraction: Distraction = {
        id: Date.now().toString(),
        ...newDistraction,
        timestamp: new Date()
      }
      
      setDistractions(prev => [distraction, ...prev])
      setNewDistraction({
        type: '',
        description: '',
        severity: 'medium',
        duration: 0,
        trigger: ''
      })
      setShowQuickAdd(false)
    }
  }

  const quickAddDistraction = (type: string, description: string) => {
    const distraction: Distraction = {
      id: Date.now().toString(),
      type,
      description,
      severity: 'medium',
      timestamp: new Date()
    }
    
    setDistractions(prev => [distraction, ...prev])
  }

  const removeDistraction = (id: string) => {
    setDistractions(prev => prev.filter(d => d.id !== id))
  }

  const getTypeIcon = (type: string) => {
    return DISTRACTION_TYPES.find(t => t.value === type)?.icon || '❓'
  }

  const getTypeLabel = (type: string) => {
    return DISTRACTION_TYPES.find(t => t.value === type)?.label || type
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <TrendingDown className="h-4 w-4" />
      case 'high': return <TrendingUp className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold">{todayDistractions}</p>
                <p className="text-xs text-gray-500">distractions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-green-600" />
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Daily Average</p>
                <p className="text-2xl font-bold">{averageDaily}</p>
                <p className="text-xs text-gray-500">per day</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-orange-600" />
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Focus Score</p>
                <p className="text-2xl font-bold">{Math.max(0, 100 - todayDistractions * 5)}</p>
                <p className="text-xs text-gray-500">out of 100</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Add Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Quick Distraction Logging</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuickAdd(!showQuickAdd)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Custom
            </Button>
          </CardTitle>
          <CardDescription>
            Tap to quickly log common distractions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-6">
            <Button
              variant="outline"
              onClick={() => quickAddDistraction('social-media', 'Checked social media')}
              className="flex items-center space-x-2 justify-start"
            >
              <span>📱</span>
              <span>Social Media</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => quickAddDistraction('notifications', 'Phone notification')}
              className="flex items-center space-x-2 justify-start"
            >
              <span>🔔</span>
              <span>Notification</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => quickAddDistraction('environment', 'Noise distraction')}
              className="flex items-center space-x-2 justify-start"
            >
              <span>🏠</span>
              <span>Noise</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => quickAddDistraction('thoughts', 'Mind wandered')}
              className="flex items-center space-x-2 justify-start"
            >
              <span>💭</span>
              <span>Mind Wander</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => quickAddDistraction('physical', 'Bathroom break')}
              className="flex items-center space-x-2 justify-start"
            >
              <span>🚶</span>
              <span>Break</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => quickAddDistraction('other', 'Quick distraction')}
              className="flex items-center space-x-2 justify-start"
            >
              <span>❓</span>
              <span>Other</span>
            </Button>
          </div>
          
          {showQuickAdd && (
            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={newDistraction.type}
                        onValueChange={(value) => setNewDistraction(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {DISTRACTION_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Severity</Label>
                      <Select
                        value={newDistraction.severity}
                        onValueChange={(value: 'low' | 'medium' | 'high') => 
                          setNewDistraction(prev => ({ ...prev, severity: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Impact</SelectItem>
                          <SelectItem value="medium">Medium Impact</SelectItem>
                          <SelectItem value="high">High Impact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="What distracted you?"
                      value={newDistraction.description}
                      onChange={(e) => setNewDistraction(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Duration (minutes)</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={newDistraction.duration || ''}
                        onChange={(e) => setNewDistraction(prev => ({ 
                          ...prev, 
                          duration: parseInt(e.target.value) || 0 
                        }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Trigger (optional)</Label>
                      <Input
                        placeholder="What triggered this?"
                        value={newDistraction.trigger}
                        onChange={(e) => setNewDistraction(prev => ({ ...prev, trigger: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={addDistraction} disabled={!newDistraction.type || !newDistraction.description}>
                      Add Distraction
                    </Button>
                    <Button variant="outline" onClick={() => setShowQuickAdd(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Distraction Patterns */}
      {patterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Distraction Patterns</span>
            </CardTitle>
            <CardDescription>
              Insights from your distraction history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patterns.slice(0, 3).map(pattern => (
                <div key={pattern.type} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getTypeIcon(pattern.type)}</span>
                      <h4 className="font-medium">{getTypeLabel(pattern.type)}</h4>
                    </div>
                    <Badge variant="outline">
                      {pattern.frequency} occurrences
                    </Badge>
                  </div>
                  
                  <div className="grid gap-2 md:grid-cols-3 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Avg Duration:</span> {pattern.avgDuration.toFixed(1)}min
                    </div>
                    <div>
                      <span className="font-medium">Peak Times:</span> {pattern.timeOfDay.join(', ')}
                    </div>
                    <div>
                      <span className="font-medium">Common Triggers:</span> {pattern.commonTriggers.join(', ') || 'None'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Distractions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Recent Distractions</span>
          </CardTitle>
          <CardDescription>
            Your latest logged distractions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {distractions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>No distractions logged yet</p>
                <p className="text-sm">Use the quick buttons above to start tracking</p>
              </div>
            ) : (
              <div className="space-y-3">
                {distractions.map(distraction => (
                  <div key={distraction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getTypeIcon(distraction.type)}</span>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{distraction.description}</p>
                          <Badge className={SEVERITY_COLORS[distraction.severity]} variant="outline">
                            {getSeverityIcon(distraction.severity)}
                            {distraction.severity}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{format(distraction.timestamp, 'MMM d, h:mm a')}</span>
                          {distraction.duration && distraction.duration > 0 && (
                            <>
                              <span>•</span>
                              <span>{distraction.duration}min</span>
                            </>
                          )}
                          {distraction.trigger && (
                            <>
                              <span>•</span>
                              <span>Trigger: {distraction.trigger}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDistraction(distraction.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}