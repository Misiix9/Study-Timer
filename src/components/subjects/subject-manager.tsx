"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  BookOpen, 
  Edit, 
  Trash2, 
  Archive, 
  BarChart3, 
  Clock,
  Target,
  TrendingUp
} from 'lucide-react'

interface Subject {
  id: string
  name: string
  color: string
  icon: string
  archived: boolean
  createdAt: Date
  stats?: {
    totalSessions: number
    totalMinutes: number
    completedSessions: number
    completionRate: number
    averageSessionLength: number
    lastStudied?: Date
  }
}

const colorOptions = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Indigo', value: '#6366f1' },
]

const iconOptions = [
  '📚', '📐', '💻', '⚛️', '🧪', '🎨', '🎵', '🌍',
  '🔬', '📝', '💡', '🎯', '🏛️', '📊', '🔢', '📖',
  '🎭', '🌱', '🔬', '📈', '🎪', '🏥', '⚖️', '🎮'
]

export function SubjectManager() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [activeTab, setActiveTab] = useState('active')

  // Mock data - will be replaced with API calls
  useEffect(() => {
    const mockSubjects: Subject[] = [
      {
        id: '1',
        name: 'Mathematics',
        color: '#3b82f6',
        icon: '📐',
        archived: false,
        createdAt: new Date('2025-01-01'),
        stats: {
          totalSessions: 45,
          totalMinutes: 2250,
          completedSessions: 42,
          completionRate: 93,
          averageSessionLength: 25,
          lastStudied: new Date('2025-01-02')
        }
      },
      {
        id: '2',
        name: 'Computer Science',
        color: '#8b5cf6',
        icon: '💻',
        archived: false,
        createdAt: new Date('2025-01-01'),
        stats: {
          totalSessions: 38,
          totalMinutes: 1900,
          completedSessions: 35,
          completionRate: 92,
          averageSessionLength: 27,
          lastStudied: new Date('2025-01-03')
        }
      },
      {
        id: '3',
        name: 'Physics',
        color: '#10b981',
        icon: '⚛️',
        archived: false,
        createdAt: new Date('2025-01-01'),
        stats: {
          totalSessions: 28,
          totalMinutes: 1400,
          completedSessions: 26,
          completionRate: 93,
          averageSessionLength: 25,
          lastStudied: new Date('2025-01-01')
        }
      },
      {
        id: '4',
        name: 'Old Course',
        color: '#6b7280',
        icon: '📚',
        archived: true,
        createdAt: new Date('2024-09-01'),
        stats: {
          totalSessions: 15,
          totalMinutes: 375,
          completedSessions: 13,
          completionRate: 87,
          averageSessionLength: 25
        }
      }
    ]
    
    setSubjects(mockSubjects)
    setLoading(false)
  }, [])

  const activeSubjects = subjects.filter(s => !s.archived)
  const archivedSubjects = subjects.filter(s => s.archived)

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const CreateEditSubjectDialog = ({ subject, onClose }: { subject?: Subject; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: subject?.name || '',
      color: subject?.color || colorOptions[0].value,
      icon: subject?.icon || iconOptions[0],
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      // TODO: Create/update subject via API
      console.log(subject ? 'Updating subject:' : 'Creating subject:', formData)
      onClose()
    }

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{subject ? 'Edit Subject' : 'Create New Subject'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Subject Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Mathematics, Computer Science"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
              >
                <SelectTrigger>
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      <span>{formData.icon}</span>
                      <span>Select an icon</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <div className="grid grid-cols-6 gap-1 p-2">
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon} className="text-center p-2">
                        <span className="text-lg">{icon}</span>
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <Button
                    key={color.value}
                    type="button"
                    variant="outline"
                    className={`h-12 flex items-center justify-center ${
                      formData.color === color.value ? 'ring-2 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: color.value + '20', borderColor: color.value }}
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  >
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color.value }}
                    />
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {subject ? 'Update Subject' : 'Create Subject'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  const SubjectCard = ({ subject }: { subject: Subject }) => (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-medium"
              style={{ backgroundColor: subject.color }}
            >
              {subject.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{subject.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Created {subject.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setEditingSubject(subject)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {subject.stats && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Total Time</span>
              </div>
              <div className="font-medium">{formatTime(subject.stats.totalMinutes)}</div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Sessions</span>
              </div>
              <div className="font-medium">{subject.stats.totalSessions}</div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Target className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Completion Rate</span>
              </div>
              <div className="font-medium">{subject.stats.completionRate}%</div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Avg Session</span>
              </div>
              <div className="font-medium">{subject.stats.averageSessionLength}m</div>
            </div>
          </div>
          
          {subject.stats.lastStudied && (
            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground">
                Last studied: {subject.stats.lastStudied.toLocaleDateString()}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress this week</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        </CardContent>
      )}
      
      {subject.archived && (
        <div className="absolute top-2 right-2">
          <Badge variant="secondary">Archived</Badge>
        </div>
      )}
    </Card>
  )

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
          <h2 className="text-2xl font-bold">Subject Management</h2>
          <p className="text-muted-foreground">
            Organize and track your study subjects
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Active ({activeSubjects.length})
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Archived ({archivedSubjects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeSubjects.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Subjects Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first subject to start organizing your studies
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Subject
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeSubjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          {archivedSubjects.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Archive className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Archived Subjects</h3>
                <p className="text-muted-foreground">
                  Subjects you archive will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {archivedSubjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {showCreateDialog && (
        <CreateEditSubjectDialog onClose={() => setShowCreateDialog(false)} />
      )}
      
      {editingSubject && (
        <CreateEditSubjectDialog 
          subject={editingSubject} 
          onClose={() => setEditingSubject(null)} 
        />
      )}
    </div>
  )
}