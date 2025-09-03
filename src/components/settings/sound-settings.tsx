"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Volume2, VolumeX, Play, Square } from 'lucide-react'
import { soundManager, SoundType, SoundSettings } from '@/lib/audio/sound-manager'

interface SoundSettingsComponentProps {
  onClose?: () => void
}

export function SoundSettingsComponent({ onClose }: SoundSettingsComponentProps) {
  const [notificationSounds, setNotificationSounds] = useState(soundManager.getNotificationSounds())
  const [ambientSounds, setAmbientSounds] = useState(soundManager.getAmbientSounds())
  const [currentAmbient, setCurrentAmbient] = useState<SoundType | null>(null)
  const [soundSettings, setSoundSettings] = useState<Record<SoundType, SoundSettings>>({} as any)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeSounds = async () => {
      await soundManager.initialize()
      
      // Load all sound settings
      const allSounds = soundManager.getAllSounds()
      const settings: Record<SoundType, SoundSettings> = {} as any
      
      allSounds.forEach(sound => {
        settings[sound.id] = soundManager.getSoundSettings(sound.id)
      })
      
      setSoundSettings(settings)
      setCurrentAmbient(soundManager.getCurrentAmbient())
      setIsInitialized(true)
    }

    initializeSounds()
  }, [])

  const updateSoundSetting = (soundType: SoundType, key: keyof SoundSettings, value: any) => {
    const newSettings = { ...soundSettings }
    newSettings[soundType] = { ...newSettings[soundType], [key]: value }
    setSoundSettings(newSettings)
    soundManager.updateSoundSettings(soundType, { [key]: value })
  }

  const testSound = async (soundType: SoundType) => {
    if (soundType.startsWith('ambient-')) {
      if (currentAmbient === soundType) {
        soundManager.stopAmbient()
        setCurrentAmbient(null)
      } else {
        await soundManager.playAmbient(soundType)
        setCurrentAmbient(soundType)
      }
    } else {
      await soundManager.playNotification(soundType)
    }
  }

  const stopAllAmbient = () => {
    soundManager.stopAmbient()
    setCurrentAmbient(null)
  }

  if (!isInitialized) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading audio system...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Notification Sounds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Notification Sounds
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Sounds that play when timers complete
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationSounds.map((sound) => {
            const settings = soundSettings[sound.id]
            if (!settings) return null

            return (
              <div key={sound.id} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{sound.name}</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {sound.id.replace('-', ' ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testSound(sound.id)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Switch
                      checked={settings.enabled}
                      onCheckedChange={(checked) => 
                        updateSoundSetting(sound.id, 'enabled', checked)
                      }
                    />
                  </div>
                </div>
                
                {settings.enabled && (
                  <div className="space-y-2">
                    <Label className="text-sm">Volume: {Math.round(settings.volume * 100)}%</Label>
                    <Slider
                      value={[settings.volume * 100]}
                      onValueChange={(value) => 
                        updateSoundSetting(sound.id, 'volume', value[0] / 100)
                      }
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Ambient Sounds */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Ambient Sounds
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Background sounds to help you focus
              </p>
            </div>
            {currentAmbient && (
              <Button variant="outline" size="sm" onClick={stopAllAmbient}>
                <Square className="h-4 w-4 mr-2" />
                Stop All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {ambientSounds.map((sound) => {
            const settings = soundSettings[sound.id]
            const isPlaying = currentAmbient === sound.id
            if (!settings) return null

            return (
              <div key={sound.id} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-medium">{sound.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {sound.id.replace('ambient-', '').replace('-', ' ')}
                      </p>
                    </div>
                    {isPlaying && (
                      <Badge variant="secondary" className="text-xs">
                        Playing
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isPlaying ? "default" : "outline"}
                      size="sm"
                      onClick={() => testSound(sound.id)}
                    >
                      {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Switch
                      checked={settings.enabled}
                      onCheckedChange={(checked) => 
                        updateSoundSetting(sound.id, 'enabled', checked)
                      }
                    />
                  </div>
                </div>
                
                {settings.enabled && (
                  <div className="space-y-2">
                    <Label className="text-sm">Volume: {Math.round(settings.volume * 100)}%</Label>
                    <Slider
                      value={[settings.volume * 100]}
                      onValueChange={(value) => 
                        updateSoundSetting(sound.id, 'volume', value[0] / 100)
                      }
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Audio Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Audio Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 text-sm">
            <Volume2 className="h-4 w-4 mt-0.5 text-blue-500" />
            <div>
              <p className="font-medium">Browser Permissions</p>
              <p className="text-muted-foreground">
                Some browsers require user interaction before playing audio. Click any sound button to enable audio.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <VolumeX className="h-4 w-4 mt-0.5 text-orange-500" />
            <div>
              <p className="font-medium">Focus Mode</p>
              <p className="text-muted-foreground">
                Ambient sounds can help mask distracting noises and improve concentration during study sessions.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <Play className="h-4 w-4 mt-0.5 text-green-500" />
            <div>
              <p className="font-medium">Multiple Sounds</p>
              <p className="text-muted-foreground">
                Only one ambient sound can play at a time, but notification sounds will play over ambient audio.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {onClose && (
        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onClose}>Done</Button>
        </div>
      )}
    </div>
  )
}