"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Target, 
  Timer, 
  Palette, 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Plus,
  X
} from 'lucide-react'

interface Subject {
  id: string
  name: string
  color: string
  icon: string
}

interface WelcomeScreenProps {
  onComplete: (data: {
    subjects: Subject[]
    dailyGoal: number
    preferredSessionLength: number
  }) => void
}

const PRESET_SUBJECTS = [
  { name: 'Mathematics', color: '#3b82f6', icon: '📐' },
  { name: 'Physics', color: '#10b981', icon: '⚛️' },
  { name: 'Chemistry', color: '#ef4444', icon: '🧪' },
  { name: 'Computer Science', color: '#8b5cf6', icon: '💻' },
  { name: 'Literature', color: '#f59e0b', icon: '📚' },
  { name: 'History', color: '#84cc16', icon: '🏛️' },
  { name: 'Biology', color: '#06b6d4', icon: '🧬' },
  { name: 'Art', color: '#ec4899', icon: '🎨' },
  { name: 'Music', color: '#f97316', icon: '🎵' },
  { name: 'Language', color: '#6366f1', icon: '🗣️' },
]

const COLOR_OPTIONS = [
  '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b',
  '#84cc16', '#06b6d4', '#ec4899', '#f97316', '#6366f1'
]

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [newSubjectName, setNewSubjectName] = useState('')
  const [newSubjectColor, setNewSubjectColor] = useState(COLOR_OPTIONS[0])
  const [newSubjectIcon, setNewSubjectIcon] = useState('📖')
  const [dailyGoal, setDailyGoal] = useState(2) // hours
  const [preferredSessionLength, setPreferredSessionLength] = useState(25) // minutes

  const steps = [
    { title: 'Welcome', icon: <Timer className="h-5 w-5" /> },
    { title: 'Add Subjects', icon: <BookOpen className="h-5 w-5" /> },
    { title: 'Set Goals', icon: <Target className="h-5 w-5" /> },
    { title: 'Ready!', icon: <CheckCircle className="h-5 w-5" /> }
  ]

  const addPresetSubject = (preset: typeof PRESET_SUBJECTS[0]) => {
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name: preset.name,
      color: preset.color,
      icon: preset.icon
    }
    setSubjects([...subjects, newSubject])
  }

  const addCustomSubject = () => {
    if (!newSubjectName.trim()) return

    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name: newSubjectName.trim(),
      color: newSubjectColor,
      icon: newSubjectIcon
    }
    setSubjects([...subjects, newSubject])
    setNewSubjectName('')
    setNewSubjectIcon('📖')
    setNewSubjectColor(COLOR_OPTIONS[0])
  }

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    onComplete({
      subjects,
      dailyGoal: dailyGoal * 60, // Convert to minutes
      preferredSessionLength
    })
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true
      case 1: return subjects.length > 0
      case 2: return dailyGoal > 0 && preferredSessionLength > 0
      case 3: return true
      default: return false
    }
  }

  const StepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-6">🎯</div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Welcome to Study Timer!</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Let's set up your personalized study environment. We'll help you add subjects, 
                set goals, and configure your ideal study sessions.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-sm">
              <div className="space-y-2">
                <BookOpen className="h-6 w-6 mx-auto text-blue-500" />
                <p className="font-medium">Add Subjects</p>
                <p className="text-muted-foreground">Organize your studies</p>
              </div>
              <div className="space-y-2">
                <Target className="h-6 w-6 mx-auto text-green-500" />
                <p className="font-medium">Set Goals</p>
                <p className="text-muted-foreground">Stay motivated</p>
              </div>
              <div className="space-y-2">
                <Timer className="h-6 w-6 mx-auto text-purple-500" />
                <p className="font-medium">Start Studying</p>
                <p className="text-muted-foreground">Focus & achieve</p>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Add Your Subjects</h2>
              <p className="text-muted-foreground">
                Choose from presets or create custom subjects for your studies.
              </p>
            </div>

            {/* Current Subjects */}
            {subjects.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Your Subjects ({subjects.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <Badge
                      key={subject.id}
                      variant="outline"
                      style={{ borderColor: subject.color, color: subject.color }}
                      className="flex items-center gap-2 py-1 px-3"
                    >
                      <span>{subject.icon}</span>
                      <span>{subject.name}</span>
                      <button
                        onClick={() => removeSubject(subject.id)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Preset Subjects */}
            <div className="space-y-3">
              <h3 className="font-medium">Popular Subjects</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PRESET_SUBJECTS.filter(preset => 
                  !subjects.some(s => s.name === preset.name)
                ).map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    className="justify-start"
                    onClick={() => addPresetSubject(preset)}
                  >
                    <span className="mr-2">{preset.icon}</span>
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Subject */}
            <div className="space-y-3 border-t pt-4">
              <h3 className="font-medium">Create Custom Subject</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <Label htmlFor="subject-name">Subject Name</Label>
                  <Input
                    id="subject-name"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    placeholder="e.g., Advanced Calculus"
                    onKeyDown={(e) => e.key === 'Enter' && addCustomSubject()}
                  />
                </div>
                <div>
                  <Label htmlFor="subject-icon">Icon</Label>
                  <Input
                    id="subject-icon"
                    value={newSubjectIcon}
                    onChange={(e) => setNewSubjectIcon(e.target.value)}
                    placeholder="📖"
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <div className="flex gap-1">
                    {COLOR_OPTIONS.slice(0, 5).map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded border-2 ${
                          newSubjectColor === color ? 'border-gray-400' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewSubjectColor(color)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={addCustomSubject} disabled={!newSubjectName.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Set Your Study Goals</h2>
              <p className="text-muted-foreground">
                Configure your daily targets and preferred session length.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Daily Study Goal
                  </CardTitle>
                  <CardDescription>
                    How many hours do you want to study each day?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Hours per day: {dailyGoal}</Label>
                    <input
                      type="range"
                      min="0.5"
                      max="12"
                      step="0.5"
                      value={dailyGoal}
                      onChange={(e) => setDailyGoal(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0.5h</span>
                      <span>12h</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {dailyGoal < 2 ? 'Light studying' : 
                     dailyGoal < 4 ? 'Moderate pace' : 
                     dailyGoal < 6 ? 'Intensive study' : 'Very ambitious!'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    Session Length
                  </CardTitle>
                  <CardDescription>
                    How long should each focus session be?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Minutes per session: {preferredSessionLength}</Label>
                    <input
                      type="range"
                      min="15"
                      max="90"
                      step="5"
                      value={preferredSessionLength}
                      onChange={(e) => setPreferredSessionLength(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>15min</span>
                      <span>90min</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {preferredSessionLength <= 25 ? 'Pomodoro style (great for focus)' : 
                     preferredSessionLength <= 45 ? 'Medium sessions (balanced)' : 
                     'Long sessions (deep work)'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-medium mb-2">Your Study Plan Preview</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Daily goal: <strong>{dailyGoal} hours</strong></p>
                <p>• Session length: <strong>{preferredSessionLength} minutes</strong></p>
                <p>• Sessions per day: <strong>~{Math.ceil((dailyGoal * 60) / preferredSessionLength)}</strong></p>
                <p>• Subjects: <strong>{subjects.length}</strong></p>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-6">🎉</div>
            <div>
              <h2 className="text-3xl font-bold mb-4">You're All Set!</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your study environment is ready. You can always adjust your subjects and goals 
                later in the settings.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold mb-4">Setup Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subjects:</span>
                  <span className="font-medium">{subjects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Goal:</span>
                  <span className="font-medium">{dailyGoal} hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Session Length:</span>
                  <span className="font-medium">{preferredSessionLength} min</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Quick Tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 max-w-md mx-auto">
                <li>• Start your first timer to begin tracking</li>
                <li>• Check your progress in the analytics tab</li>
                <li>• Set specific goals to stay motivated</li>
                <li>• Use the focus mode to minimize distractions</li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="border-2">
          <CardHeader className="text-center">
            {/* Progress Bar */}
            <div className="space-y-4">
              <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
              <div className="flex justify-between text-sm">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-2 ${
                      index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {step.icon}
                    <span className="hidden sm:inline">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="py-8">
            <StepContent />
          </CardContent>

          {/* Navigation */}
          <div className="flex justify-between items-center p-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>

            {currentStep === steps.length - 1 ? (
              <Button onClick={handleComplete} size="lg">
                Start Studying!
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}