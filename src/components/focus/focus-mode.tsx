'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Eye, 
  EyeOff, 
  Shield, 
  Target, 
  Clock, 
  Globe, 
  Smartphone, 
  Zap,
  Plus,
  X,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface BlockedSite {
  id: string
  url: string
  category: string
  blockDuration: number
  isActive: boolean
}

interface FocusSession {
  id: string
  name: string
  duration: number
  blockedSites: string[]
  distractionLevel: number
  isActive: boolean
  startedAt?: Date
  endedAt?: Date
}

const SUGGESTED_BLOCKS = [
  { url: 'facebook.com', category: 'Social Media', risk: 'high' },
  { url: 'twitter.com', category: 'Social Media', risk: 'high' },
  { url: 'instagram.com', category: 'Social Media', risk: 'high' },
  { url: 'youtube.com', category: 'Entertainment', risk: 'medium' },
  { url: 'netflix.com', category: 'Entertainment', risk: 'high' },
  { url: 'reddit.com', category: 'Social Media', risk: 'medium' },
  { url: 'tiktok.com', category: 'Social Media', risk: 'high' },
  { url: 'twitch.tv', category: 'Entertainment', risk: 'medium' }
]

const DEFAULT_FOCUS_SESSIONS = [
  {
    id: '1',
    name: 'Deep Work',
    duration: 90,
    blockedSites: ['facebook.com', 'twitter.com', 'instagram.com', 'youtube.com'],
    distractionLevel: 95,
    isActive: false
  },
  {
    id: '2',
    name: 'Light Focus',
    duration: 30,
    blockedSites: ['facebook.com', 'twitter.com', 'instagram.com'],
    distractionLevel: 70,
    isActive: false
  },
  {
    id: '3',
    name: 'Exam Prep',
    duration: 120,
    blockedSites: ['facebook.com', 'twitter.com', 'instagram.com', 'youtube.com', 'netflix.com', 'reddit.com'],
    distractionLevel: 100,
    isActive: false
  }
]

export function FocusMode() {
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(DEFAULT_FOCUS_SESSIONS)
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([])
  const [activeFocusSession, setActiveFocusSession] = useState<FocusSession | null>(null)
  const [newSiteUrl, setNewSiteUrl] = useState('')
  const [newSessionName, setNewSessionName] = useState('')
  const [newSessionDuration, setNewSessionDuration] = useState([60])
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
  const [focusProgress, setFocusProgress] = useState(0)
  const [remainingTime, setRemainingTime] = useState(0)

  useEffect(() => {
    if (activeFocusSession && activeFocusSession.startedAt) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - (activeFocusSession.startedAt?.getTime() || 0)
        const totalDuration = activeFocusSession.duration * 60 * 1000
        const progress = Math.min((elapsed / totalDuration) * 100, 100)
        const remaining = Math.max(totalDuration - elapsed, 0)
        
        setFocusProgress(progress)
        setRemainingTime(Math.ceil(remaining / 1000))
        
        if (remaining <= 0) {
          endFocusSession()
        }
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [activeFocusSession])

  const startFocusSession = (session: FocusSession) => {
    const activeSession = {
      ...session,
      isActive: true,
      startedAt: new Date()
    }
    setActiveFocusSession(activeSession)
    setFocusSessions(prev => 
      prev.map(s => s.id === session.id ? activeSession : s)
    )
  }

  const endFocusSession = () => {
    if (activeFocusSession) {
      const endedSession = {
        ...activeFocusSession,
        isActive: false,
        endedAt: new Date()
      }
      setActiveFocusSession(null)
      setFocusSessions(prev => 
        prev.map(s => s.id === endedSession.id ? endedSession : s)
      )
      setFocusProgress(0)
      setRemainingTime(0)
    }
  }

  const addCustomSite = () => {
    if (newSiteUrl.trim()) {
      const newSite: BlockedSite = {
        id: Date.now().toString(),
        url: newSiteUrl.trim(),
        category: 'Custom',
        blockDuration: 60,
        isActive: true
      }
      setBlockedSites(prev => [...prev, newSite])
      setNewSiteUrl('')
    }
  }

  const removeSite = (siteId: string) => {
    setBlockedSites(prev => prev.filter(site => site.id !== siteId))
  }

  const createFocusSession = () => {
    if (newSessionName.trim()) {
      const newSession: FocusSession = {
        id: Date.now().toString(),
        name: newSessionName.trim(),
        duration: newSessionDuration[0],
        blockedSites: selectedSuggestions,
        distractionLevel: Math.min(selectedSuggestions.length * 15, 100),
        isActive: false
      }
      setFocusSessions(prev => [...prev, newSession])
      setNewSessionName('')
      setNewSessionDuration([60])
      setSelectedSuggestions([])
    }
  }

  const toggleSuggestion = (url: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(url) 
        ? prev.filter(s => s !== url)
        : [...prev, url]
    )
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-orange-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Active Focus Session */}
      {activeFocusSession && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <CardTitle className="text-green-800">Focus Mode Active</CardTitle>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={endFocusSession}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                End Session
              </Button>
            </div>
            <CardDescription>
              {activeFocusSession.name} - {remainingTime > 0 ? formatTime(remainingTime) : 'Complete!'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{focusProgress.toFixed(1)}%</span>
                </div>
                <Progress value={focusProgress} className="h-2" />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Blocked Sites:</h4>
                <div className="flex flex-wrap gap-1">
                  {activeFocusSession.blockedSites.map(site => (
                    <Badge key={site} variant="secondary" className="text-xs">
                      {site}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessions">Focus Sessions</TabsTrigger>
          <TabsTrigger value="blocking">Website Blocking</TabsTrigger>
          <TabsTrigger value="create">Create Session</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Pre-configured Focus Sessions</span>
              </CardTitle>
              <CardDescription>
                Start a focus session to block distracting websites and enhance concentration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {focusSessions.map(session => (
                    <Card key={session.id} className={session.isActive ? 'border-green-200' : ''}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold">{session.name}</h4>
                              {session.isActive && (
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  Active
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{session.duration} min</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Globe className="h-4 w-4" />
                                <span>{session.blockedSites.length} sites blocked</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Zap className="h-4 w-4" />
                                <span>{session.distractionLevel}% focus level</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {session.blockedSites.slice(0, 3).map(site => (
                                <Badge key={site} variant="outline" className="text-xs">
                                  {site}
                                </Badge>
                              ))}
                              {session.blockedSites.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{session.blockedSites.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => startFocusSession(session)}
                            disabled={session.isActive || !!activeFocusSession}
                            className="flex-shrink-0"
                          >
                            {session.isActive ? 'Running' : 'Start Session'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Website Blocking Suggestions</span>
              </CardTitle>
              <CardDescription>
                Common distracting websites and their impact on productivity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {SUGGESTED_BLOCKS.map(site => (
                  <Card key={site.url} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span className="font-medium">{site.url}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {site.category}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className={`h-3 w-3 ${getRiskColor(site.risk)}`} />
                            <span className={`text-xs ${getRiskColor(site.risk)}`}>
                              {site.risk} risk
                            </span>
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={selectedSuggestions.includes(site.url)}
                        onCheckedChange={() => toggleSuggestion(site.url)}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Blocked Sites</CardTitle>
              <CardDescription>
                Add your own sites to block during focus sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter website URL (e.g., example.com)"
                  value={newSiteUrl}
                  onChange={(e) => setNewSiteUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomSite()}
                />
                <Button onClick={addCustomSite} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {blockedSites.length > 0 && (
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {blockedSites.map(site => (
                      <div key={site.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>{site.url}</span>
                          <Badge variant="outline" className="text-xs">
                            {site.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSite(site.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Create Custom Focus Session</span>
              </CardTitle>
              <CardDescription>
                Design your own focus session with specific settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="session-name">Session Name</Label>
                <Input
                  id="session-name"
                  placeholder="Enter session name"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-duration">Duration: {newSessionDuration[0]} minutes</Label>
                <Slider
                  id="session-duration"
                  min={15}
                  max={180}
                  step={15}
                  value={newSessionDuration}
                  onValueChange={setNewSessionDuration}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>15 min</span>
                  <span>3 hours</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Select Sites to Block</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  {SUGGESTED_BLOCKS.map(site => (
                    <div key={site.url} className="flex items-center space-x-2">
                      <Switch
                        checked={selectedSuggestions.includes(site.url)}
                        onCheckedChange={() => toggleSuggestion(site.url)}
                      />
                      <span className="text-sm">{site.url}</span>
                      <Badge variant="outline" className="text-xs">
                        {site.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {selectedSuggestions.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Session Preview</h4>
                  <div className="space-y-2 text-sm">
                    <p>Duration: {newSessionDuration[0]} minutes</p>
                    <p>Sites to block: {selectedSuggestions.length}</p>
                    <p>Estimated focus level: {Math.min(selectedSuggestions.length * 15, 100)}%</p>
                  </div>
                </div>
              )}

              <Button 
                onClick={createFocusSession} 
                disabled={!newSessionName.trim() || selectedSuggestions.length === 0}
                className="w-full"
              >
                Create Focus Session
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Browser Extension Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 mb-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-blue-800">Browser Extension Required</h4>
          </div>
          <p className="text-sm text-blue-700 mb-3">
            To actively block websites, you'll need to install our browser extension. 
            Currently, this interface provides suggestions and tracking.
          </p>
          <Button variant="outline" className="text-blue-700 border-blue-200 hover:bg-blue-100">
            Download Extension
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}