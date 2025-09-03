"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useTimerStore } from '@/lib/stores/timer'
import { Settings } from 'lucide-react'

export function TimerSettings() {
  const { settings, updateSettings } = useTimerStore()
  const [open, setOpen] = useState(false)
  const [tempSettings, setTempSettings] = useState(settings)

  const handleSave = () => {
    updateSettings(tempSettings)
    setOpen(false)
  }

  const handleCancel = () => {
    setTempSettings(settings)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Duration Settings */}
          <div className="space-y-4">
            <h3 className="font-medium">Session Durations</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workDuration">Work (minutes)</Label>
                <Input
                  id="workDuration"
                  type="number"
                  min="1"
                  max="120"
                  value={tempSettings.workDuration}
                  onChange={(e) => setTempSettings({
                    ...tempSettings,
                    workDuration: parseInt(e.target.value) || 25
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shortBreak">Short Break (minutes)</Label>
                <Input
                  id="shortBreak"
                  type="number"
                  min="1"
                  max="30"
                  value={tempSettings.shortBreakDuration}
                  onChange={(e) => setTempSettings({
                    ...tempSettings,
                    shortBreakDuration: parseInt(e.target.value) || 5
                  })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="longBreak">Long Break (minutes)</Label>
                <Input
                  id="longBreak"
                  type="number"
                  min="1"
                  max="60"
                  value={tempSettings.longBreakDuration}
                  onChange={(e) => setTempSettings({
                    ...tempSettings,
                    longBreakDuration: parseInt(e.target.value) || 15
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sessions">Sessions until Long Break</Label>
                <Input
                  id="sessions"
                  type="number"
                  min="2"
                  max="8"
                  value={tempSettings.sessionsUntilLongBreak}
                  onChange={(e) => setTempSettings({
                    ...tempSettings,
                    sessionsUntilLongBreak: parseInt(e.target.value) || 4
                  })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Auto-start Settings */}
          <div className="space-y-4">
            <h3 className="font-medium">Auto-start Options</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoStartBreaks">Auto-start breaks</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically start break sessions
                </p>
              </div>
              <Switch
                id="autoStartBreaks"
                checked={tempSettings.autoStartBreaks}
                onCheckedChange={(checked) => setTempSettings({
                  ...tempSettings,
                  autoStartBreaks: checked
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoStartSessions">Auto-start work sessions</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically start work sessions after breaks
                </p>
              </div>
              <Switch
                id="autoStartSessions"
                checked={tempSettings.autoStartSessions}
                onCheckedChange={(checked) => setTempSettings({
                  ...tempSettings,
                  autoStartSessions: checked
                })}
              />
            </div>
          </div>

          <Separator />

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="font-medium">Notifications & Sound</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Browser notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Show notifications when sessions complete
                </p>
              </div>
              <Switch
                id="notifications"
                checked={tempSettings.notificationsEnabled}
                onCheckedChange={(checked) => setTempSettings({
                  ...tempSettings,
                  notificationsEnabled: checked
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sound">Sound alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Play sound when sessions complete
                </p>
              </div>
              <Switch
                id="sound"
                checked={tempSettings.soundEnabled}
                onCheckedChange={(checked) => setTempSettings({
                  ...tempSettings,
                  soundEnabled: checked
                })}
              />
            </div>
            
            {tempSettings.soundEnabled && (
              <div className="space-y-2">
                <Label htmlFor="volume">Volume</Label>
                <Input
                  id="volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={tempSettings.soundVolume}
                  onChange={(e) => setTempSettings({
                    ...tempSettings,
                    soundVolume: parseFloat(e.target.value)
                  })}
                />
                <div className="text-sm text-muted-foreground text-center">
                  {Math.round(tempSettings.soundVolume * 100)}%
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}