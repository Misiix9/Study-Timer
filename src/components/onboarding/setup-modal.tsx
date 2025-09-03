"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Plus, X, Target, Clock, BookOpen } from "lucide-react"

interface SetupModalProps {
  open: boolean
  onComplete: (data: SetupData) => void
}

interface SetupData {
  subjects: string[]
  dailyGoal: number
  preferredSessionLength: number
  studyStyle: string
  notifications: boolean
}

export function SetupModal({ open, onComplete }: SetupModalProps) {
  const [step, setStep] = useState(1)
  const [subjects, setSubjects] = useState<string[]>([])
  const [newSubject, setNewSubject] = useState("")
  const [dailyGoal, setDailyGoal] = useState(120) // 2 hours default
  const [sessionLength, setSessionLength] = useState(25) // 25 minutes default (Pomodoro)
  const [studyStyle, setStudyStyle] = useState("")
  const [notifications, setNotifications] = useState(true)

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const addSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()])
      setNewSubject("")
    }
  }

  const removeSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = () => {
    onComplete({
      subjects,
      dailyGoal,
      preferredSessionLength: sessionLength,
      studyStyle,
      notifications
    })
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return subjects.length > 0
      case 2:
        return dailyGoal > 0
      case 3:
        return sessionLength > 0 && studyStyle !== ""
      case 4:
        return true
      default:
        return false
    }
  }

  const presetSubjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
    "History", "Literature", "Psychology", "Economics", "Philosophy"
  ]

  return (
    <Dialog open={open} modal onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to Study Timer! 🎯
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Let's set up your personalized study experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step 1: Subjects */}
          {step === 1 && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                  What subjects do you study?
                </CardTitle>
                <CardDescription>
                  Add the subjects you want to track. You can always add more later.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Quick add popular subjects:</Label>
                  <div className="flex flex-wrap gap-2">
                    {presetSubjects.map((subject) => (
                      <Button
                        key={subject}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!subjects.includes(subject)) {
                            setSubjects([...subjects, subject])
                          }
                        }}
                        disabled={subjects.includes(subject)}
                      >
                        {subjects.includes(subject) ? (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <Plus className="h-4 w-4 mr-1" />
                        )}
                        {subject}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Or add a custom subject:</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Advanced Calculus"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                    />
                    <Button onClick={addSubject} disabled={!newSubject.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {subjects.length > 0 && (
                  <div className="space-y-2">
                    <Label>Your subjects ({subjects.length}):</Label>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="pr-1">
                          {subject}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => removeSubject(subject)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Daily Goal */}
          {step === 2 && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Target className="h-6 w-6 text-green-500" />
                  What's your daily study goal?
                </CardTitle>
                <CardDescription>
                  Set a realistic daily goal to stay motivated and track your progress.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Daily goal (minutes):</Label>
                  <div className="space-y-4">
                    <Input
                      type="number"
                      min="15"
                      max="720"
                      step="15"
                      value={dailyGoal}
                      onChange={(e) => setDailyGoal(parseInt(e.target.value) || 120)}
                    />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {Math.floor(dailyGoal / 60)}h {dailyGoal % 60}m
                      </p>
                      <p className="text-sm text-muted-foreground">
                        That's about {Math.round(dailyGoal / 25)} Pomodoro sessions per day
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Quick presets:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Light study", value: 60 },
                      { label: "Moderate", value: 120 },
                      { label: "Intensive", value: 240 },
                      { label: "Deep focus", value: 360 }
                    ].map((preset) => (
                      <Button
                        key={preset.value}
                        variant={dailyGoal === preset.value ? "default" : "outline"}
                        onClick={() => setDailyGoal(preset.value)}
                      >
                        {preset.label}
                        <br />
                        <span className="text-xs">
                          {Math.floor(preset.value / 60)}h {preset.value % 60}m
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Study Style */}
          {step === 3 && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Clock className="h-6 w-6 text-purple-500" />
                  How do you like to study?
                </CardTitle>
                <CardDescription>
                  Configure your preferred session length and study style.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Preferred session length (minutes):</Label>
                  <Select value={sessionLength.toString()} onValueChange={(value) => setSessionLength(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes (Quick bursts)</SelectItem>
                      <SelectItem value="25">25 minutes (Pomodoro)</SelectItem>
                      <SelectItem value="30">30 minutes (Standard)</SelectItem>
                      <SelectItem value="45">45 minutes (Extended)</SelectItem>
                      <SelectItem value="60">60 minutes (Deep focus)</SelectItem>
                      <SelectItem value="90">90 minutes (Ultra focus)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Study style:</Label>
                  <Select value={studyStyle} onValueChange={setStudyStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your study approach" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pomodoro">Pomodoro Technique (25min work, 5min break)</SelectItem>
                      <SelectItem value="timeblock">Time Blocking (Focused blocks)</SelectItem>
                      <SelectItem value="flow">Flow State (Long uninterrupted sessions)</SelectItem>
                      <SelectItem value="spaced">Spaced Repetition (Regular review sessions)</SelectItem>
                      <SelectItem value="flexible">Flexible (Mix of different approaches)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Final Setup */}
          {step === 4 && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  Almost ready!
                </CardTitle>
                <CardDescription>
                  Review your setup and enable optional features.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Subjects</Label>
                      <p className="font-medium">{subjects.length} subjects added</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Daily Goal</Label>
                      <p className="font-medium">{Math.floor(dailyGoal / 60)}h {dailyGoal % 60}m</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Session Length</Label>
                      <p className="font-medium">{sessionLength} minutes</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Study Style</Label>
                      <p className="font-medium capitalize">{studyStyle.replace(/([A-Z])/g, ' $1')}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="notifications">
                      Enable study reminders and notifications
                    </Label>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">
                    🎉 You're all set!
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    Your personalized study environment is ready. You can always change these settings later in your account preferences.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            
            {step < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed()}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete Setup
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}