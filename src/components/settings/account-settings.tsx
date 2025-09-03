"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  Key,
  Database,
  Globe,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Settings,
  Palette
} from 'lucide-react'

interface UserProfile {
  displayName: string
  email: string
  avatar?: string
  bio?: string
  timezone: string
  language: string
  dateFormat: string
}

interface NotificationSettings {
  studyReminders: boolean
  breakReminders: boolean
  goalAchievements: boolean
  weeklyReports: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  soundEnabled: boolean
  vibrationEnabled: boolean
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends'
  showStudyStats: boolean
  showAchievements: boolean
  allowDataCollection: boolean
  allowAnalytics: boolean
}

interface StudyPreferences {
  defaultSessionLength: number
  shortBreakLength: number
  longBreakLength: number
  longBreakInterval: number
  autoStartBreaks: boolean
  autoStartSessions: boolean
  theme: 'light' | 'dark' | 'system'
  soundTheme: 'minimal' | 'nature' | 'classic'
  dailyGoal: number
  weeklyGoal: number
}

export function AccountSettings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // State for all settings
  const [profile, setProfile] = useState<UserProfile>({
    displayName: '',
    email: '',
    bio: '',
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/DD/YYYY'
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    studyReminders: true,
    breakReminders: true,
    goalAchievements: true,
    weeklyReports: false,
    emailNotifications: false,
    pushNotifications: false,
    soundEnabled: true,
    vibrationEnabled: false
  })

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'private',
    showStudyStats: false,
    showAchievements: false,
    allowDataCollection: false,
    allowAnalytics: false
  })

  const [studyPrefs, setStudyPrefs] = useState<StudyPreferences>({
    defaultSessionLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartSessions: false,
    theme: 'system',
    soundTheme: 'minimal',
    dailyGoal: 0,
    weeklyGoal: 0
  })

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // API call to save profile
      console.log('Saving profile:', profile)
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match')
      return
    }
    
    setIsLoading(true)
    try {
      // API call to change password
      console.log('Changing password')
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPasswords({ current: '', new: '', confirm: '' })
      setShowPasswordDialog(false)
    } catch (error) {
      console.error('Failed to change password:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      alert('Please type DELETE to confirm')
      return
    }

    setIsLoading(true)
    try {
      // API call to delete account
      console.log('Deleting account')
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Redirect to farewell page or sign out
    } catch (error) {
      console.error('Failed to delete account:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async () => {
    setIsLoading(true)
    try {
      // API call to export user data
      console.log('Exporting user data')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create and download file
      const data = {
        profile,
        studyStats: { totalMinutes: 0, sessions: 0 },
        subjects: [],
        goals: [],
        achievements: []
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `study-timer-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account, preferences, and privacy settings.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="study" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Study
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Your display name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  value={profile.bio || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us a bit about yourself..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={profile.language} onValueChange={(value) => setProfile(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={profile.dateFormat} onValueChange={(value) => setProfile(prev => ({ ...prev, dateFormat: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Preferences */}
        <TabsContent value="study" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Timer Settings</CardTitle>
                <CardDescription>Configure your Pomodoro timer preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Focus Session Length: {studyPrefs.defaultSessionLength} minutes</Label>
                    <input
                      type="range"
                      min="15"
                      max="90"
                      step="5"
                      value={studyPrefs.defaultSessionLength}
                      onChange={(e) => setStudyPrefs(prev => ({ ...prev, defaultSessionLength: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Short Break Length: {studyPrefs.shortBreakLength} minutes</Label>
                    <input
                      type="range"
                      min="3"
                      max="15"
                      step="1"
                      value={studyPrefs.shortBreakLength}
                      onChange={(e) => setStudyPrefs(prev => ({ ...prev, shortBreakLength: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Long Break Length: {studyPrefs.longBreakLength} minutes</Label>
                    <input
                      type="range"
                      min="15"
                      max="45"
                      step="5"
                      value={studyPrefs.longBreakLength}
                      onChange={(e) => setStudyPrefs(prev => ({ ...prev, longBreakLength: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Long Break Interval: Every {studyPrefs.longBreakInterval} sessions</Label>
                    <input
                      type="range"
                      min="2"
                      max="8"
                      step="1"
                      value={studyPrefs.longBreakInterval}
                      onChange={(e) => setStudyPrefs(prev => ({ ...prev, longBreakInterval: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goals & Automation</CardTitle>
                <CardDescription>Set your study goals and automation preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Daily Study Goal: {studyPrefs.dailyGoal} minutes</Label>
                    <input
                      type="range"
                      min="0"
                      max="480"
                      step="30"
                      value={studyPrefs.dailyGoal}
                      onChange={(e) => setStudyPrefs(prev => ({ ...prev, dailyGoal: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">
                      {studyPrefs.dailyGoal === 0 ? 'No daily goal set' : `${Math.floor(studyPrefs.dailyGoal / 60)}h ${studyPrefs.dailyGoal % 60}m per day`}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Weekly Study Goal: {studyPrefs.weeklyGoal} minutes</Label>
                    <input
                      type="range"
                      min="0"
                      max="2100"
                      step="120"
                      value={studyPrefs.weeklyGoal}
                      onChange={(e) => setStudyPrefs(prev => ({ ...prev, weeklyGoal: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">
                      {studyPrefs.weeklyGoal === 0 ? 'No weekly goal set' : `${Math.floor(studyPrefs.weeklyGoal / 60)}h ${studyPrefs.weeklyGoal % 60}m per week`}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Auto-start breaks</Label>
                      <Switch
                        checked={studyPrefs.autoStartBreaks}
                        onCheckedChange={(checked) => setStudyPrefs(prev => ({ ...prev, autoStartBreaks: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Auto-start next session</Label>
                      <Switch
                        checked={studyPrefs.autoStartSessions}
                        onCheckedChange={(checked) => setStudyPrefs(prev => ({ ...prev, autoStartSessions: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Appearance & Sound</CardTitle>
              <CardDescription>Customize your visual and audio experience.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={studyPrefs.theme} onValueChange={(value: any) => setStudyPrefs(prev => ({ ...prev, theme: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sound Theme</Label>
                  <Select value={studyPrefs.soundTheme} onValueChange={(value: any) => setStudyPrefs(prev => ({ ...prev, soundTheme: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="nature">Nature</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive and how.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Study Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminded to start your study sessions</p>
                  </div>
                  <Switch
                    checked={notifications.studyReminders}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, studyReminders: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Break Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminded to take breaks</p>
                  </div>
                  <Switch
                    checked={notifications.breakReminders}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, breakReminders: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Goal Achievements</Label>
                    <p className="text-sm text-muted-foreground">Celebrate when you reach your goals</p>
                  </div>
                  <Switch
                    checked={notifications.goalAchievements}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, goalAchievements: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Get weekly study progress summaries</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReports: checked }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Delivery Methods</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">Play sounds for timer events</p>
                  </div>
                  <Switch
                    checked={notifications.soundEnabled}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, soundEnabled: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Vibration</Label>
                    <p className="text-sm text-muted-foreground">Vibrate for notifications (mobile)</p>
                  </div>
                  <Switch
                    checked={notifications.vibrationEnabled}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, vibrationEnabled: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your privacy and what information is shared.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select value={privacy.profileVisibility} onValueChange={(value: any) => setPrivacy(prev => ({ ...prev, profileVisibility: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private - Only me</SelectItem>
                      <SelectItem value="friends">Friends only</SelectItem>
                      <SelectItem value="public">Public - Anyone can view</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Study Statistics</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your study time and progress</p>
                    </div>
                    <Switch
                      checked={privacy.showStudyStats}
                      onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showStudyStats: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Achievements</Label>
                      <p className="text-sm text-muted-foreground">Display your badges and achievements</p>
                    </div>
                    <Switch
                      checked={privacy.showAchievements}
                      onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showAchievements: checked }))}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Data Usage</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow Data Collection</Label>
                      <p className="text-sm text-muted-foreground">Help improve the app with anonymous usage data</p>
                    </div>
                    <Switch
                      checked={privacy.allowDataCollection}
                      onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, allowDataCollection: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow Analytics</Label>
                      <p className="text-sm text-muted-foreground">Enable analytics to help us understand app usage</p>
                    </div>
                    <Switch
                      checked={privacy.allowAnalytics}
                      onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, allowAnalytics: checked }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export, backup, or delete your data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Export Your Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Download all your study data, subjects, goals, and achievements
                    </p>
                  </div>
                  <Button onClick={handleExportData} disabled={isLoading}>
                    <Download className="h-4 w-4 mr-2" />
                    {isLoading ? 'Exporting...' : 'Export Data'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Data Summary</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Study sessions: 0</p>
                      <p>• Subjects: 0</p>
                      <p>• Goals: 0</p>
                      <p>• Achievements: 0</p>
                      <p>• Total study time: 0 hours</p>
                    </div>
                  </div>
                  <Badge variant="outline">All data fresh</Badge>
                </div>

                <Alert>
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    Your data is automatically backed up and can be restored if needed. 
                    All data is encrypted and stored securely.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and account security.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Change Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Update your account password for better security
                    </p>
                  </div>
                  <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Enter your current password and choose a new one.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Current Password</Label>
                          <div className="relative">
                            <Input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwords.current}
                              onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>New Password</Label>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwords.new}
                              onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Confirm New Password</Label>
                          <Input
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleChangePassword} disabled={isLoading}>
                          {isLoading ? 'Changing...' : 'Change Password'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your account is secured with industry-standard encryption. 
                    Last password change: Never
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-400">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-700 dark:text-red-400">Delete Account</h4>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    Permanently delete your account and all data. This cannot be undone.
                  </p>
                </div>
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Account
                      </DialogTitle>
                      <DialogDescription className="text-red-600">
                        This action is permanent and cannot be undone. All your data will be deleted.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          You will lose all your:
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Study sessions and history</li>
                            <li>Subjects and goals</li>
                            <li>Achievements and progress</li>
                            <li>Settings and preferences</li>
                          </ul>
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-2">
                        <Label>Type "DELETE" to confirm:</Label>
                        <Input
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          placeholder="DELETE"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setShowDeleteDialog(false)
                        setDeleteConfirmText('')
                      }}>
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        disabled={isLoading || deleteConfirmText !== 'DELETE'}
                      >
                        {isLoading ? 'Deleting...' : 'Delete Account'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}