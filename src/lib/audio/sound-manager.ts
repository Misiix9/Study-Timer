export type SoundType = 
  | 'work-complete'
  | 'break-complete'
  | 'timer-tick'
  | 'ambient-rain'
  | 'ambient-forest'
  | 'ambient-ocean'
  | 'ambient-coffee'
  | 'ambient-whitenoise'
  | 'ambient-pinknoise'
  | 'ambient-brownnoise'

export interface SoundSettings {
  volume: number // 0-1
  enabled: boolean
}

export interface NotificationSound {
  id: SoundType
  name: string
  category: 'notification' | 'ambient'
  url?: string // For custom sounds
  generated?: boolean // For programmatically generated sounds
}

class SoundManager {
  private audioContext: AudioContext | null = null
  private sounds: Map<SoundType, HTMLAudioElement> = new Map()
  private ambientSounds: Map<SoundType, HTMLAudioElement> = new Map()
  private currentAmbient: HTMLAudioElement | null = null
  private settings: Record<SoundType, SoundSettings> = {} as any
  private initialized = false

  // Default sound settings
  private defaultSettings: Record<SoundType, SoundSettings> = {
    'work-complete': { volume: 0.7, enabled: true },
    'break-complete': { volume: 0.7, enabled: true },
    'timer-tick': { volume: 0.3, enabled: false },
    'ambient-rain': { volume: 0.5, enabled: false },
    'ambient-forest': { volume: 0.5, enabled: false },
    'ambient-ocean': { volume: 0.5, enabled: false },
    'ambient-coffee': { volume: 0.5, enabled: false },
    'ambient-whitenoise': { volume: 0.4, enabled: false },
    'ambient-pinknoise': { volume: 0.4, enabled: false },
    'ambient-brownnoise': { volume: 0.4, enabled: false },
  }

  // Available sounds
  private soundLibrary: NotificationSound[] = [
    // Notification sounds
    { id: 'work-complete', name: 'Work Session Complete', category: 'notification', generated: true },
    { id: 'break-complete', name: 'Break Complete', category: 'notification', generated: true },
    { id: 'timer-tick', name: 'Timer Tick', category: 'notification', generated: true },
    
    // Ambient sounds
    { id: 'ambient-rain', name: 'Rain', category: 'ambient', generated: true },
    { id: 'ambient-forest', name: 'Forest', category: 'ambient', generated: true },
    { id: 'ambient-ocean', name: 'Ocean Waves', category: 'ambient', generated: true },
    { id: 'ambient-coffee', name: 'Coffee Shop', category: 'ambient', generated: true },
    { id: 'ambient-whitenoise', name: 'White Noise', category: 'ambient', generated: true },
    { id: 'ambient-pinknoise', name: 'Pink Noise', category: 'ambient', generated: true },
    { id: 'ambient-brownnoise', name: 'Brown Noise', category: 'ambient', generated: true },
  ]

  async initialize() {
    if (this.initialized) return

    try {
      // Initialize Web Audio API
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Load settings from localStorage
      this.loadSettings()
      
      // Generate notification sounds
      await this.generateNotificationSounds()
      
      // Generate ambient sounds
      await this.generateAmbientSounds()
      
      this.initialized = true
      console.log('SoundManager initialized successfully')
    } catch (error) {
      console.error('Failed to initialize SoundManager:', error)
    }
  }

  private loadSettings() {
    const saved = localStorage.getItem('study-timer-sound-settings')
    if (saved) {
      try {
        this.settings = { ...this.defaultSettings, ...JSON.parse(saved) }
      } catch {
        this.settings = this.defaultSettings
      }
    } else {
      this.settings = this.defaultSettings
    }
  }

  private saveSettings() {
    localStorage.setItem('study-timer-sound-settings', JSON.stringify(this.settings))
  }

  // Generate notification sounds using Web Audio API
  private async generateNotificationSounds() {
    if (!this.audioContext) return

    // Work complete - pleasant bell sound
    this.sounds.set('work-complete', this.generateBellSound(800, 0.3))
    
    // Break complete - gentle chime
    this.sounds.set('break-complete', this.generateChimeSound([400, 600, 800], 0.4))
    
    // Timer tick - subtle click
    this.sounds.set('timer-tick', this.generateTickSound(1000, 0.1))
  }

  // Generate ambient sounds
  private async generateAmbientSounds() {
    if (!this.audioContext) return

    // White noise
    this.ambientSounds.set('ambient-whitenoise', this.generateWhiteNoise())
    
    // Pink noise
    this.ambientSounds.set('ambient-pinknoise', this.generatePinkNoise())
    
    // Brown noise
    this.ambientSounds.set('ambient-brownnoise', this.generateBrownNoise())
    
    // Rain sound (filtered noise)
    this.ambientSounds.set('ambient-rain', this.generateRainSound())
    
    // Ocean waves (low frequency oscillation)
    this.ambientSounds.set('ambient-ocean', this.generateOceanSound())
    
    // Forest (mixed frequencies)
    this.ambientSounds.set('ambient-forest', this.generateForestSound())
    
    // Coffee shop (brownian noise with occasional sounds)
    this.ambientSounds.set('ambient-coffee', this.generateCoffeeShopSound())
  }

  private generateBellSound(frequency: number, duration: number): HTMLAudioElement {
    if (!this.audioContext) return new Audio()

    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.audioContext.sampleRate
      const envelope = Math.exp(-t * 3) // Exponential decay
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3
    }
    
    return this.bufferToAudio(buffer)
  }

  private generateChimeSound(frequencies: number[], duration: number): HTMLAudioElement {
    if (!this.audioContext) return new Audio()

    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.audioContext.sampleRate
      const envelope = Math.exp(-t * 2)
      let sample = 0
      
      frequencies.forEach(freq => {
        sample += Math.sin(2 * Math.PI * freq * t) * envelope
      })
      
      data[i] = sample * 0.2
    }
    
    return this.bufferToAudio(buffer)
  }

  private generateTickSound(frequency: number, duration: number): HTMLAudioElement {
    if (!this.audioContext) return new Audio()

    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.audioContext.sampleRate
      const envelope = Math.exp(-t * 20) // Quick decay
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.1
    }
    
    return this.bufferToAudio(buffer)
  }

  private generateWhiteNoise(): HTMLAudioElement {
    if (!this.audioContext) return new Audio()

    const duration = 10 // Loop 10 seconds of noise
    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1
    }
    
    const audio = this.bufferToAudio(buffer)
    audio.loop = true
    return audio
  }

  private generatePinkNoise(): HTMLAudioElement {
    if (!this.audioContext) return new Audio()

    const duration = 10
    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05
      b6 = white * 0.115926
    }
    
    const audio = this.bufferToAudio(buffer)
    audio.loop = true
    return audio
  }

  private generateBrownNoise(): HTMLAudioElement {
    if (!this.audioContext) return new Audio()

    const duration = 10
    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    let lastOut = 0
    
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1
      data[i] = (lastOut + (0.02 * white)) / 1.02
      lastOut = data[i]
      data[i] *= 0.1
    }
    
    const audio = this.bufferToAudio(buffer)
    audio.loop = true
    return audio
  }

  private generateRainSound(): HTMLAudioElement {
    // Rain is essentially filtered white noise
    const noise = this.generateWhiteNoise()
    return noise
  }

  private generateOceanSound(): HTMLAudioElement {
    if (!this.audioContext) return new Audio()

    const duration = 15
    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.audioContext.sampleRate
      // Ocean waves - low frequency modulation with noise
      const wave = Math.sin(2 * Math.PI * 0.1 * t) * 0.3
      const noise = (Math.random() * 2 - 1) * 0.05
      data[i] = (wave + noise) * 0.1
    }
    
    const audio = this.bufferToAudio(buffer)
    audio.loop = true
    return audio
  }

  private generateForestSound(): HTMLAudioElement {
    // Forest is a combination of filtered noises
    const noise = this.generateWhiteNoise()
    return noise
  }

  private generateCoffeeShopSound(): HTMLAudioElement {
    // Coffee shop is brown noise with occasional variations
    const brownNoise = this.generateBrownNoise()
    return brownNoise
  }

  private bufferToAudio(buffer: AudioBuffer): HTMLAudioElement {
    if (!this.audioContext) return new Audio()

    const source = this.audioContext.createBufferSource()
    source.buffer = buffer
    
    const destination = this.audioContext.createMediaStreamDestination()
    source.connect(destination)
    
    const audio = new Audio()
    audio.srcObject = destination.stream
    
    return audio
  }

  // Public API methods
  async playNotification(soundType: SoundType) {
    if (!this.initialized) await this.initialize()
    
    const settings = this.settings[soundType]
    if (!settings?.enabled) return

    const audio = this.sounds.get(soundType)
    if (audio) {
      audio.volume = settings.volume
      try {
        await audio.play()
      } catch (error) {
        console.warn('Failed to play notification sound:', error)
      }
    }
  }

  async playAmbient(soundType: SoundType) {
    if (!this.initialized) await this.initialize()
    
    // Stop current ambient sound
    this.stopAmbient()
    
    const settings = this.settings[soundType]
    if (!settings?.enabled) return

    const audio = this.ambientSounds.get(soundType)
    if (audio) {
      audio.volume = settings.volume
      audio.loop = true
      this.currentAmbient = audio
      
      try {
        await audio.play()
      } catch (error) {
        console.warn('Failed to play ambient sound:', error)
      }
    }
  }

  stopAmbient() {
    if (this.currentAmbient) {
      this.currentAmbient.pause()
      this.currentAmbient.currentTime = 0
      this.currentAmbient = null
    }
  }

  updateSoundSettings(soundType: SoundType, settings: Partial<SoundSettings>) {
    this.settings[soundType] = { ...this.settings[soundType], ...settings }
    this.saveSettings()
    
    // Update current ambient volume if playing
    if (this.currentAmbient && soundType.startsWith('ambient-')) {
      this.currentAmbient.volume = this.settings[soundType].volume
    }
  }

  getSoundSettings(soundType: SoundType): SoundSettings {
    return this.settings[soundType] || this.defaultSettings[soundType]
  }

  getAllSounds(): NotificationSound[] {
    return this.soundLibrary
  }

  getNotificationSounds(): NotificationSound[] {
    return this.soundLibrary.filter(s => s.category === 'notification')
  }

  getAmbientSounds(): NotificationSound[] {
    return this.soundLibrary.filter(s => s.category === 'ambient')
  }

  getCurrentAmbient(): SoundType | null {
    if (!this.currentAmbient) return null
    
    for (const [soundType, audio] of this.ambientSounds) {
      if (audio === this.currentAmbient) return soundType
    }
    
    return null
  }

  // Request audio permissions (needed for mobile)
  async requestPermissions(): Promise<boolean> {
    try {
      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume()
      }
      return true
    } catch (error) {
      console.error('Failed to request audio permissions:', error)
      return false
    }
  }
}

export const soundManager = new SoundManager()