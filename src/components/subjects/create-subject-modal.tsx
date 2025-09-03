"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

interface CreateSubjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubjectCreated: (subject: any) => void
}

const subjectPresets = [
  { name: "Mathematics", icon: "🔢", color: "#3B82F6" },
  { name: "Physics", icon: "⚛️", color: "#8B5CF6" },
  { name: "Chemistry", icon: "🧪", color: "#10B981" },
  { name: "Biology", icon: "🧬", color: "#059669" },
  { name: "Computer Science", icon: "💻", color: "#6366F1" },
  { name: "History", icon: "📜", color: "#D97706" },
  { name: "Literature", icon: "📖", color: "#DC2626" },
  { name: "Psychology", icon: "🧠", color: "#7C3AED" },
  { name: "Economics", icon: "📈", color: "#0891B2" },
  { name: "Philosophy", icon: "🤔", color: "#7C2D12" },
  { name: "Art", icon: "🎨", color: "#E11D48" },
  { name: "Music", icon: "🎵", color: "#BE185D" },
  { name: "Language", icon: "🌍", color: "#0F766E" },
  { name: "Engineering", icon: "⚙️", color: "#374151" }
]

const colorOptions = [
  "#3B82F6", "#8B5CF6", "#10B981", "#059669", "#6366F1", 
  "#D97706", "#DC2626", "#7C3AED", "#0891B2", "#7C2D12",
  "#E11D48", "#BE185D", "#0F766E", "#374151"
]

const iconOptions = [
  "📚", "✏️", "🔬", "📐", "🖥️", "📊", "🎯", "💡", "🔍", "📝",
  "🧪", "⚛️", "🔢", "🧬", "💻", "📜", "📖", "🧠", "📈", "🤔",
  "🎨", "🎵", "🌍", "⚙️", "🚀", "💼", "🎪", "🎭"
]

export function CreateSubjectModal({ open, onOpenChange, onSubjectCreated }: CreateSubjectModalProps) {
  const [subjectName, setSubjectName] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("📚")
  const [selectedColor, setSelectedColor] = useState("#3B82F6")
  const [loading, setLoading] = useState(false)

  const handlePresetSelect = (preset: any) => {
    setSubjectName(preset.name)
    setSelectedIcon(preset.icon)
    setSelectedColor(preset.color)
  }

  const handleCreateSubject = async () => {
    if (!subjectName.trim()) return

    setLoading(true)
    try {
      const newSubject = {
        id: Date.now().toString(),
        name: subjectName.trim(),
        icon: selectedIcon,
        color: selectedColor,
        createdAt: new Date().toISOString(),
        totalTime: 0,
        sessionsCount: 0
      }

      // Save to localStorage for now (in real app, this would be an API call)
      const existingSubjects = JSON.parse(localStorage.getItem('study-subjects') || '[]')
      const updatedSubjects = [...existingSubjects, newSubject]
      localStorage.setItem('study-subjects', JSON.stringify(updatedSubjects))

      onSubjectCreated(newSubject)
      onOpenChange(false)
      
      // Reset form
      setSubjectName("")
      setSelectedIcon("📚")
      setSelectedColor("#3B82F6")
    } catch (error) {
      console.error('Failed to create subject:', error)
    } finally {
      setLoading(false)
    }
  }

  const canCreate = subjectName.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Subject</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick Presets */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick presets:</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {subjectPresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto p-2 text-left"
                  onClick={() => handlePresetSelect(preset)}
                >
                  <span className="mr-2">{preset.icon}</span>
                  <span className="text-xs">{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Subject */}
          <div className="border-t pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subjectName">Subject Name</Label>
              <Input
                id="subjectName"
                placeholder="e.g., Advanced Calculus"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                maxLength={50}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <Select value={selectedIcon} onValueChange={setSelectedIcon}>
                  <SelectTrigger>
                    <SelectValue>
                      <span className="text-lg">{selectedIcon}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <div className="grid grid-cols-6 gap-1 p-2">
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon} value={icon} className="p-2 text-center">
                          <span className="text-lg">{icon}</span>
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="grid grid-cols-7 gap-1">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded-full border-2 ${
                        selectedColor === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview:</Label>
              <Badge 
                variant="secondary"
                style={{ backgroundColor: selectedColor + '20', color: selectedColor }}
                className="text-sm"
              >
                {selectedIcon} {subjectName || 'Subject Name'}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSubject}
              disabled={!canCreate || loading}
            >
              {loading ? 'Creating...' : 'Create Subject'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}