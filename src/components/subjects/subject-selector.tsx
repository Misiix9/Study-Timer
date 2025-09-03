"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTimerStore } from '@/lib/stores/timer'
import { Plus, BookOpen } from 'lucide-react'

// Mock subjects data - will be replaced with API call
const mockSubjects = [
  { id: '1', name: 'Mathematics', color: '#3b82f6', icon: '📐' },
  { id: '2', name: 'Physics', color: '#10b981', icon: '⚛️' },
  { id: '3', name: 'Computer Science', color: '#8b5cf6', icon: '💻' },
  { id: '4', name: 'Literature', color: '#f59e0b', icon: '📚' },
]

export function SubjectSelector() {
  const { subjectId, setSubject } = useTimerStore()
  const [subjects] = useState(mockSubjects)

  const selectedSubject = subjects.find(s => s.id === subjectId)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Study Subject</span>
      </div>

      <div className="flex items-center gap-2">
        <Select value={subjectId || 'general'} onValueChange={(value) => setSubject(value === 'general' ? null : value)}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a subject to track">
              {selectedSubject && (
                <div className="flex items-center gap-2">
                  <span>{selectedSubject.icon}</span>
                  <span>{selectedSubject.name}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">
              <div className="flex items-center gap-2">
                <span>📝</span>
                <span>General Study</span>
              </div>
            </SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                <div className="flex items-center gap-2">
                  <span>{subject.icon}</span>
                  <span>{subject.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {selectedSubject && (
        <div className="flex items-center gap-2">
          <Badge 
            variant="secondary" 
            style={{ backgroundColor: selectedSubject.color + '20', color: selectedSubject.color }}
          >
            {selectedSubject.icon} {selectedSubject.name}
          </Badge>
        </div>
      )}

      {!subjectId && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            📝 General Study
          </Badge>
        </div>
      )}

      {!subjectId && (
        <p className="text-sm text-muted-foreground">
          Select a subject to track your study time and get detailed analytics.
        </p>
      )}
    </div>
  )
}