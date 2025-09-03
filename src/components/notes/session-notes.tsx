"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { StickyNote, Plus, Calendar, Clock, BookOpen, Lightbulb, Target } from 'lucide-react'
import { format } from 'date-fns'

interface SessionNote {
  id: string
  sessionId: string
  content: string
  type: 'quick' | 'reflection' | 'insight'
  timestamp: Date
  sessionType: 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK'
  subject?: {
    name: string
    color: string
    icon: string
  }
}

interface ReflectionPrompt {
  id: string
  question: string
  category: 'learning' | 'focus' | 'improvement' | 'goals'
}

const reflectionPrompts: ReflectionPrompt[] = [
  { id: '1', question: 'What was the most important thing I learned in this session?', category: 'learning' },
  { id: '2', question: 'What distracted me the most during this session?', category: 'focus' },
  { id: '3', question: 'How could I improve my focus for the next session?', category: 'improvement' },
  { id: '4', question: 'What concepts do I still need to review?', category: 'learning' },
  { id: '5', question: 'How did I feel about my progress today?', category: 'goals' },
  { id: '6', question: 'What study technique worked best for me?', category: 'improvement' },
  { id: '7', question: 'What would I do differently next time?', category: 'improvement' },
  { id: '8', question: 'What connections did I make between different concepts?', category: 'learning' },
]

export function SessionNotes() {
  const [notes, setNotes] = useState<SessionNote[]>([])
  const [currentNote, setCurrentNote] = useState('')
  const [noteType, setNoteType] = useState<'quick' | 'reflection' | 'insight'>('quick')
  const [showReflectionDialog, setShowReflectionDialog] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<ReflectionPrompt | null>(null)
  const [reflectionResponse, setReflectionResponse] = useState('')

  // Mock data - will be replaced with API calls
  useEffect(() => {
    const mockNotes: SessionNote[] = [
      {
        id: '1',
        sessionId: 'session1',
        content: 'Learned about integration by parts. Need to practice more examples.',
        type: 'quick',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        sessionType: 'WORK',
        subject: { name: 'Mathematics', color: '#3b82f6', icon: '📐' }
      },
      {
        id: '2',
        sessionId: 'session2',
        content: 'I felt more focused today after getting enough sleep. The 25-minute sessions work well for math problems.',
        type: 'reflection',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        sessionType: 'WORK',
        subject: { name: 'Mathematics', color: '#3b82f6', icon: '📐' }
      },
      {
        id: '3',
        sessionId: 'session3',
        content: 'Realized that breaking down complex problems into smaller steps makes them much more manageable.',
        type: 'insight',
        timestamp: new Date(Date.now() - 10800000), // 3 hours ago
        sessionType: 'WORK',
        subject: { name: 'Physics', color: '#10b981', icon: '⚛️' }
      }
    ]
    
    setNotes(mockNotes)
  }, [])

  const addNote = () => {
    if (!currentNote.trim()) return

    const newNote: SessionNote = {
      id: Date.now().toString(),
      sessionId: 'current-session', // This would come from the actual session
      content: currentNote,
      type: noteType,
      timestamp: new Date(),
      sessionType: 'WORK',
      subject: { name: 'Mathematics', color: '#3b82f6', icon: '📐' }
    }

    setNotes(prev => [newNote, ...prev])
    setCurrentNote('')
  }

  const addReflection = () => {
    if (!reflectionResponse.trim() || !selectedPrompt) return

    const reflection: SessionNote = {
      id: Date.now().toString(),
      sessionId: 'current-session',
      content: `${selectedPrompt.question}\n\n${reflectionResponse}`,
      type: 'reflection',
      timestamp: new Date(),
      sessionType: 'WORK',
      subject: { name: 'General', color: '#6b7280', icon: '📝' }
    }

    setNotes(prev => [reflection, ...prev])
    setReflectionResponse('')
    setShowReflectionDialog(false)
  }

  const getNoteIcon = (type: string) => {
    switch (type) {
      case 'reflection': return <Lightbulb className="h-4 w-4 text-yellow-500" />
      case 'insight': return <Target className="h-4 w-4 text-purple-500" />
      default: return <StickyNote className="h-4 w-4 text-blue-500" />
    }
  }

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'reflection': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'insight': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
    }
  }

  const getPromptCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return 'bg-green-500'
      case 'focus': return 'bg-blue-500'
      case 'improvement': return 'bg-orange-500'
      case 'goals': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="h-5 w-5" />
            Session Notes
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Capture thoughts, insights, and reflections during your study sessions
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Note Input */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant={noteType === 'quick' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNoteType('quick')}
              >
                Quick Note
              </Button>
              <Button
                variant={noteType === 'insight' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNoteType('insight')}
              >
                Insight
              </Button>
              <Dialog open={showReflectionDialog} onOpenChange={setShowReflectionDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Reflection
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Guided Reflection</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Choose a reflection prompt:</h4>
                      <div className="grid gap-2">
                        {reflectionPrompts.map((prompt) => (
                          <Button
                            key={prompt.id}
                            variant={selectedPrompt?.id === prompt.id ? 'default' : 'outline'}
                            className="justify-start text-left h-auto p-3"
                            onClick={() => setSelectedPrompt(prompt)}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="secondary" 
                                  className={`text-white ${getPromptCategoryColor(prompt.category)}`}
                                >
                                  {prompt.category}
                                </Badge>
                              </div>
                              <p className="text-sm">{prompt.question}</p>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {selectedPrompt && (
                      <div className="space-y-3">
                        <Separator />
                        <div className="space-y-2">
                          <h4 className="font-medium">Your reflection:</h4>
                          <Textarea
                            placeholder="Take a moment to reflect..."
                            value={reflectionResponse}
                            onChange={(e) => setReflectionResponse(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowReflectionDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addReflection} disabled={!reflectionResponse.trim()}>
                            Save Reflection
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a note about this session..."
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                rows={3}
                className="flex-1"
              />
              <Button onClick={addNote} disabled={!currentNote.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Recent Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {notes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notes yet</p>
                <p className="text-sm">Start taking notes during your study sessions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <Card key={note.id} className="border-l-4" style={{ borderLeftColor: note.subject?.color }}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getNoteIcon(note.type)}
                            <Badge variant="secondary" className={getNoteTypeColor(note.type)}>
                              {note.type}
                            </Badge>
                            {note.subject && (
                              <Badge variant="outline">
                                {note.subject.icon} {note.subject.name}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(note.timestamp, 'MMM d, h:mm a')}
                          </div>
                        </div>
                        
                        <div className="text-sm whitespace-pre-wrap">
                          {note.content}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}