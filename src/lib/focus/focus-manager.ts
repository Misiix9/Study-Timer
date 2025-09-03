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

interface FocusState {
  activeFocusSession: FocusSession | null
  blockedSites: string[]
  distractionCount: number
  focusScore: number
}

class FocusManager {
  private static instance: FocusManager
  private state: FocusState = {
    activeFocusSession: null,
    blockedSites: [],
    distractionCount: 0,
    focusScore: 100
  }
  private listeners: Array<(state: FocusState) => void> = []

  static getInstance(): FocusManager {
    if (!FocusManager.instance) {
      FocusManager.instance = new FocusManager()
    }
    return FocusManager.instance
  }

  subscribe(listener: (state: FocusState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener({ ...this.state }))
  }

  startFocusSession(session: FocusSession) {
    this.state.activeFocusSession = {
      ...session,
      isActive: true,
      startedAt: new Date()
    }
    this.state.blockedSites = session.blockedSites
    this.notify()
    
    // Simulate website blocking (in real implementation, this would communicate with browser extension)
    this.simulateWebsiteBlocking(session.blockedSites)
  }

  endFocusSession() {
    if (this.state.activeFocusSession) {
      this.state.activeFocusSession = {
        ...this.state.activeFocusSession,
        isActive: false,
        endedAt: new Date()
      }
      
      setTimeout(() => {
        this.state.activeFocusSession = null
        this.state.blockedSites = []
        this.notify()
      }, 1000)
    }
  }

  recordDistraction(type: string, description: string, impact: number = 5) {
    this.state.distractionCount++
    this.state.focusScore = Math.max(0, this.state.focusScore - impact)
    this.notify()
  }

  resetDailyStats() {
    this.state.distractionCount = 0
    this.state.focusScore = 100
    this.notify()
  }

  getState(): FocusState {
    return { ...this.state }
  }

  isWebsiteBlocked(url: string): boolean {
    return this.state.blockedSites.some(blockedSite => 
      url.toLowerCase().includes(blockedSite.toLowerCase())
    )
  }

  private simulateWebsiteBlocking(sites: string[]) {
    // In a real implementation, this would send a message to a browser extension
    // For now, we just log the blocked sites
    console.log('Focus mode activated. Blocking websites:', sites)
    
    // Simulate browser extension communication
    if (typeof window !== 'undefined') {
      try {
        // This would be the actual browser extension API call
        window.postMessage({
          type: 'FOCUS_MODE_START',
          blockedSites: sites
        }, '*')
      } catch (error) {
        console.log('Browser extension not available')
      }
    }
  }

  // Method to check if current page should be blocked (for browser extension)
  shouldBlockCurrentPage(): boolean {
    if (typeof window === 'undefined' || !this.state.activeFocusSession) {
      return false
    }
    
    const currentUrl = window.location.href
    return this.isWebsiteBlocked(currentUrl)
  }

  // Method for browser extension to query focus state
  getFocusState() {
    return {
      isActive: !!this.state.activeFocusSession,
      blockedSites: this.state.blockedSites,
      sessionName: this.state.activeFocusSession?.name,
      remainingTime: this.getRemainingTime()
    }
  }

  private getRemainingTime(): number {
    if (!this.state.activeFocusSession || !this.state.activeFocusSession.startedAt) {
      return 0
    }
    
    const elapsed = Date.now() - this.state.activeFocusSession.startedAt.getTime()
    const totalDuration = this.state.activeFocusSession.duration * 60 * 1000
    return Math.max(0, totalDuration - elapsed)
  }
}

export const focusManager = FocusManager.getInstance()
export type { FocusSession, FocusState }