'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  Bell, 
  Palette, 
  Clock, 
  Volume2,
  Shield,
  Download,
  User,
  Key,
  Globe,
  Smartphone,
  Sun,
  Moon,
  Monitor,
  Zap,
  Database,
  Trash2,
  RefreshCw,
  Save,
  AlertTriangle
} from 'lucide-react'
import { useTheme } from 'next-themes'

interface UserSettings {
  // Timer Settings
  pomodoroLength: number
  shortBreakLength: number
  longBreakLength: number
  longBreakInterval: number
  autoStartBreaks: boolean
  autoStartSessions: boolean
  
  // Notifications
  enableNotifications: boolean
  soundEnabled: boolean
  soundVolume: number
  notificationSound: string
  desktopNotifications: boolean
  
  // Appearance
  theme: 'light' | 'dark' | 'system'
  accentColor: string
  compactMode: boolean
  showSeconds: boolean
  
  // Focus & Productivity
  enableFocusMode: boolean
  strictMode: boolean
  breakReminders: boolean
  distractionTracking: boolean
  
  // Data & Privacy
  dataSync: boolean
  analytics: boolean
  shareUsageData: boolean
  
  // Account
  email: string
  displayName: string
  timezone: string
  language: string
}

const DEFAULT_SETTINGS: UserSettings = {
  // Timer Settings
  pomodoroLength: 25,
  shortBreakLength: 5,
  longBreakLength: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartSessions: false,
  
  // Notifications
  enableNotifications: true,
  soundEnabled: true,
  soundVolume: 50,
  notificationSound: 'bell',
  desktopNotifications: true,
  
  // Appearance
  theme: 'system',
  accentColor: 'blue',
  compactMode: false,
  showSeconds: true,
  
  // Focus & Productivity
  enableFocusMode: true,
  strictMode: false,
  breakReminders: true,
  distractionTracking: true,
  
  // Data & Privacy
  dataSync: true,
  analytics: true,
  shareUsageData: false,
  
  // Account
  email: 'user@example.com',
  displayName: 'Study User',
  timezone: 'UTC',
  language: 'en'
}

const ACCENT_COLORS = [
  { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
  { value: 'green', label: 'Green', color: 'bg-green-500' },
  { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
  { value: 'red', label: 'Red', color: 'bg-red-500' },
  { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
  { value: 'pink', label: 'Pink', color: 'bg-pink-500' }
]

const NOTIFICATION_SOUNDS = [
  { value: 'bell', label: 'Bell' },
  { value: 'chime', label: 'Chime' },
  { value: 'ding', label: 'Ding' },
  { value: 'pop', label: 'Pop' },
  { value: 'whistle', label: 'Whistle' }
]

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' }
]

export function SettingsPanel() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    // In a real app, this would load from localStorage or API
    const savedSettings = localStorage.getItem('study-timer-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
  }

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasUnsavedChanges(true)
    
    // Apply theme changes immediately
    if (key === 'theme') {
      setTheme(value as string)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      // In a real app, this would save to API
      localStorage.setItem('study-timer-settings', JSON.stringify(settings))
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      
      // Show success message
      console.log('Settings saved successfully')
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings(DEFAULT_SETTINGS)
      setHasUnsavedChanges(true)
    }
  }

  const exportSettings = () => {
    const data = JSON.stringify(settings, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'study-timer-settings.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string)
          setSettings({ ...DEFAULT_SETTINGS, ...imported })
          setHasUnsavedChanges(true)
        } catch (error) {
          alert('Invalid settings file')
        }
      }
      reader.readAsText(file)
    }
  }

  const clearAllData = () => {
    if (confirm('This will delete ALL your study data and cannot be undone. Are you sure?')) {
      localStorage.clear()
      alert('All data has been cleared. Please refresh the page.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Save Banner */}
      {hasUnsavedChanges && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-yellow-800">You have unsaved changes</span>
              </div>
              <Button onClick={saveSettings} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="timer" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="data">Data & Privacy</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* Timer Settings */}
        <TabsContent value="timer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Timer Configuration</span>
              </CardTitle>
              <CardDescription>
                Customize your Pomodoro timer intervals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Pomodoro Length: {settings.pomodoroLength} minutes</Label>
                  <Slider
                    value={[settings.pomodoroLength]}
                    onValueChange={([value]) => updateSetting('pomodoroLength', value)}
                    min={10}
                    max={60}
                    step={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Short Break: {settings.shortBreakLength} minutes</Label>
                  <Slider
                    value={[settings.shortBreakLength]}
                    onValueChange={([value]) => updateSetting('shortBreakLength', value)}
                    min={1}
                    max={15}
                    step={1}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Long Break: {settings.longBreakLength} minutes</Label>
                  <Slider
                    value={[settings.longBreakLength]}
                    onValueChange={([value]) => updateSetting('longBreakLength', value)}
                    min={10}
                    max={45}
                    step={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Long Break Interval: {settings.longBreakInterval} sessions</Label>
                  <Slider
                    value={[settings.longBreakInterval]}
                    onValueChange={([value]) => updateSetting('longBreakInterval', value)}
                    min={2}
                    max={8}
                    step={1}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-start Breaks</Label>
                    <p className="text-sm text-gray-600">Automatically start break timers</p>
                  </div>
                  <Switch
                    checked={settings.autoStartBreaks}
                    onCheckedChange={(checked) => updateSetting('autoStartBreaks', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-start Sessions</Label>
                    <p className="text-sm text-gray-600">Automatically start work sessions after breaks</p>
                  </div>
                  <Switch
                    checked={settings.autoStartSessions}
                    onCheckedChange={(checked) => updateSetting('autoStartSessions', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Notifications</Label>
                    <p className="text-sm text-gray-600">Receive timer completion alerts</p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => updateSetting('enableNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Desktop Notifications</Label>
                    <p className="text-sm text-gray-600">Show browser notifications</p>
                  </div>
                  <Switch
                    checked={settings.desktopNotifications}
                    onCheckedChange={(checked) => updateSetting('desktopNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sound Notifications</Label>
                    <p className="text-sm text-gray-600">Play sound when timer completes</p>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                  />
                </div>
              </div>
              
              {settings.soundEnabled && (
                <>
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Volume: {settings.soundVolume}%</Label>
                      <Slider
                        value={[settings.soundVolume]}
                        onValueChange={([value]) => updateSetting('soundVolume', value)}
                        min={0}
                        max={100}
                        step={10}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Notification Sound</Label>
                      <Select
                        value={settings.notificationSound}
                        onValueChange={(value) => updateSetting('notificationSound', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {NOTIFICATION_SOUNDS.map(sound => (
                            <SelectItem key={sound.value} value={sound.value}>
                              {sound.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Appearance & Theme</span>
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex space-x-2">
                    <Button
                      variant={settings.theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSetting('theme', 'light')}
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </Button>
                    <Button
                      variant={settings.theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSetting('theme', 'dark')}
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </Button>
                    <Button
                      variant={settings.theme === 'system' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSetting('theme', 'system')}
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      System
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {ACCENT_COLORS.map(color => (
                      <Button
                        key={color.value}
                        variant={settings.accentColor === color.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateSetting('accentColor', color.value)}
                        className="flex items-center space-x-2"
                      >
                        <div className={`w-3 h-3 rounded-full ${color.color}`} />
                        <span>{color.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-gray-600">Reduce spacing and use smaller components</p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => updateSetting('compactMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Seconds</Label>
                    <p className="text-sm text-gray-600">Display seconds on the timer</p>
                  </div>
                  <Switch
                    checked={settings.showSeconds}
                    onCheckedChange={(checked) => updateSetting('showSeconds', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Productivity */}
        <TabsContent value="productivity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Productivity Features</span>
              </CardTitle>
              <CardDescription>
                Configure focus and productivity enhancements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Focus Mode</Label>
                  <p className="text-sm text-gray-600">Allow website blocking during sessions</p>
                </div>
                <Switch
                  checked={settings.enableFocusMode}
                  onCheckedChange={(checked) => updateSetting('enableFocusMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Strict Mode</Label>
                  <p className="text-sm text-gray-600">Prevent timer from being paused or stopped early</p>
                </div>
                <Switch
                  checked={settings.strictMode}
                  onCheckedChange={(checked) => updateSetting('strictMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Break Reminders</Label>
                  <p className="text-sm text-gray-600">Get reminded to take breaks during long sessions</p>
                </div>
                <Switch
                  checked={settings.breakReminders}
                  onCheckedChange={(checked) => updateSetting('breakReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Distraction Tracking</Label>
                  <p className="text-sm text-gray-600">Track and analyze distractions during study sessions</p>
                </div>
                <Switch
                  checked={settings.distractionTracking}
                  onCheckedChange={(checked) => updateSetting('distractionTracking', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Privacy */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Data & Privacy</span>
              </CardTitle>
              <CardDescription>
                Manage your data and privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Synchronization</Label>
                    <p className="text-sm text-gray-600">Sync your data across devices</p>
                  </div>
                  <Switch
                    checked={settings.dataSync}
                    onCheckedChange={(checked) => updateSetting('dataSync', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics</Label>
                    <p className="text-sm text-gray-600">Allow collection of usage analytics</p>
                  </div>
                  <Switch
                    checked={settings.analytics}
                    onCheckedChange={(checked) => updateSetting('analytics', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Share Usage Data</Label>
                    <p className="text-sm text-gray-600">Help improve the app by sharing anonymous usage data</p>
                  </div>
                  <Switch
                    checked={settings.shareUsageData}
                    onCheckedChange={(checked) => updateSetting('shareUsageData', checked)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Data Management</h4>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={exportSettings}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Settings
                  </Button>
                  
                  <Button variant="outline" asChild>
                    <label>
                      <input
                        type="file"
                        accept=".json"
                        onChange={importSettings}
                        className="hidden"
                      />
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Import Settings
                    </label>
                  </Button>
                  
                  <Button variant="outline" onClick={resetSettings}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  
                  <Button variant="destructive" onClick={clearAllData}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Account Settings</span>
              </CardTitle>
              <CardDescription>
                Manage your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input
                    value={settings.displayName}
                    onChange={(e) => updateSetting('displayName', e.target.value)}
                    placeholder="Your display name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={settings.email}
                    onChange={(e) => updateSetting('email', e.target.value)}
                    placeholder="your.email@example.com"
                    type="email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => updateSetting('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Input
                    value={settings.timezone}
                    onChange={(e) => updateSetting('timezone', e.target.value)}
                    placeholder="UTC"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Settings v1.0</span>
              {lastSaved && (
                <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {hasUnsavedChanges && (
                <Badge variant="outline" className="text-orange-600">
                  Unsaved changes
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}