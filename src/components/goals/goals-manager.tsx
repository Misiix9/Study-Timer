"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Target, Calendar, CheckCircle, Clock, Edit, Trash2 } from 'lucide-react'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } from 'date-fns'

interface Goal {
  id: string
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM'
  title: string
  description?: string
  targetMinutes: number
  achievedMinutes: number
  progress: number
  completed: boolean
  startDate: Date
  endDate: Date
  subject?: {
    id: string
    name: string
    color: string
    icon: string
  }
}

interface Subject {
  id: string
  name: string
  color: string
  icon: string
}

export function GoalsManager() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('active')
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    const loadGoalsAndSubjects = async () => {
      try {
        // Real API calls would go here
        // For new users, start with empty arrays
        const userGoals: Goal[] = []
        const userSubjects: Subject[] = []
        
        setGoals(userGoals)
        setSubjects(userSubjects)
      } catch (error) {
        console.error('Failed to load goals and subjects:', error)
        setGoals([])
        setSubjects([])
      } finally {
        setLoading(false)
      }
    }

    loadGoalsAndSubjects()
  }, [])

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getGoalTypeColor = (type: string): string => {
    switch (type) {
      case 'DAILY': return 'bg-green-500'
      case 'WEEKLY': return 'bg-blue-500'
      case 'MONTHLY': return 'bg-purple-500'
      case 'CUSTOM': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const activeGoals = goals.filter(g => !g.completed)
  const completedGoals = goals.filter(g => g.completed)

  const GoalCard = ({ goal }: { goal: Goal }) => (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-4 w-4" />
              {goal.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`text-white ${getGoalTypeColor(goal.type)}`}
              >
                {goal.type}
              </Badge>
              {goal.subject && (
                <Badge 
                  variant="outline" 
                  style={{ borderColor: goal.subject.color, color: goal.subject.color }}
                >
                  {goal.subject.icon} {goal.subject.name}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {goal.description && (
          <p className="text-sm text-muted-foreground">{goal.description}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Progress</span>
            <span className="font-medium">
              {formatTime(goal.achievedMinutes)} / {formatTime(goal.targetMinutes)}
            </span>
          </div>
          <Progress value={Math.min(goal.progress, 100)} className="h-2" />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{goal.progress}% complete</span>
            {goal.completed && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-3 w-3" />
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>
            {format(goal.startDate, 'MMM d')} - {format(goal.endDate, 'MMM d, yyyy')}
          </span>
        </div>
      </CardContent>
      
      {goal.progress >= 100 && !goal.completed && (
        <div className="absolute top-2 right-2">
          <Badge variant="default" className="bg-green-500">
            Ready to Complete!
          </Badge>
        </div>
      )}
    </Card>
  )

  const CreateGoalDialog = () => {
    const [formData, setFormData] = useState({
      type: 'WEEKLY' as const,
      title: '',
      description: '',
      targetMinutes: 480, // 8 hours default
      subjectId: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      // TODO: Create goal via API
      console.log('Creating goal:', formData)
      setShowCreateDialog(false)
    }

    const updateEndDate = (type: string, startDate: string) => {
      const start = new Date(startDate)
      let end: Date

      switch (type) {
        case 'DAILY':
          end = start
          break
        case 'WEEKLY':
          end = endOfWeek(start)
          break
        case 'MONTHLY':
          end = endOfMonth(start)
          break
        default:
          end = addDays(start, 7)
      }

      setFormData(prev => ({ ...prev, endDate: format(end, 'yyyy-MM-dd') }))
    }

    return (
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Study 20 hours this week"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Goal Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => {
                    setFormData(prev => ({ ...prev, type: value }))
                    updateEndDate(value, formData.startDate)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="CUSTOM">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Target Hours</Label>
                <Input
                  id="target"
                  type="number"
                  min="1"
                  step="0.5"
                  value={formData.targetMinutes / 60}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    targetMinutes: Math.round(parseFloat(e.target.value) * 60) 
                  }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Select
                value={formData.subjectId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subjectId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.icon} {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, startDate: e.target.value }))
                    updateEndDate(formData.type, e.target.value)
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  min={formData.startDate}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add notes about this goal..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Goal</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Study Goals</h2>
          <p className="text-muted-foreground">
            Set and track your learning objectives
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Active ({activeGoals.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ({completedGoals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeGoals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Active Goals</h3>
                <p className="text-muted-foreground mb-4">
                  Set your first study goal to start tracking your progress
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedGoals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Completed Goals</h3>
                <p className="text-muted-foreground">
                  Your completed goals will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {completedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateGoalDialog />
    </div>
  )
}