import { create } from "zustand"
import { persist } from "zustand/middleware"

export type SessionType = "WORK" | "SHORT_BREAK" | "LONG_BREAK"
export type TimerStatus = "IDLE" | "RUNNING" | "PAUSED" | "COMPLETED"

export interface TimerSettings {
  workDuration: number // minutes
  shortBreakDuration: number // minutes
  longBreakDuration: number // minutes
  sessionsUntilLongBreak: number
  autoStartBreaks: boolean
  autoStartSessions: boolean
  soundEnabled: boolean
  soundVolume: number // 0-1
  notificationsEnabled: boolean
}

export interface TimerState {
  // Current session
  currentSessionType: SessionType
  currentSessionId: string | null
  subjectId: string | null
  
  // Timer state
  timeRemaining: number // seconds
  totalTime: number // seconds for current session
  status: TimerStatus
  
  // Pomodoro cycle tracking
  currentRound: number // 1-4 (which pomodoro in the cycle)
  cycleId: string | null
  completedSessions: number
  
  // Settings
  settings: TimerSettings
  
  // Actions
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  completeSession: () => void
  skipSession: () => void
  setSubject: (subjectId: string | null) => void
  updateSettings: (settings: Partial<TimerSettings>) => void
  
  // Internal actions
  tick: () => void
  initializeSession: (type: SessionType, round?: number) => void
  getNextSessionType: () => SessionType
}

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartSessions: false,
  soundEnabled: true,
  soundVolume: 0.7,
  notificationsEnabled: true,
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSessionType: "WORK",
      currentSessionId: null,
      subjectId: null,
      timeRemaining: DEFAULT_SETTINGS.workDuration * 60,
      totalTime: DEFAULT_SETTINGS.workDuration * 60,
      status: "IDLE",
      currentRound: 1,
      cycleId: null,
      completedSessions: 0,
      settings: DEFAULT_SETTINGS,
      
      // Timer controls
      startTimer: () => {
        const state = get()
        if (state.status === "IDLE") {
          // Generate new session ID when starting from idle
          const sessionId = `session_${Date.now()}`
          const cycleId = state.cycleId || `cycle_${Date.now()}`
          
          set({
            status: "RUNNING",
            currentSessionId: sessionId,
            cycleId: cycleId,
          })
        } else if (state.status === "PAUSED") {
          set({ status: "RUNNING" })
        }
      },
      
      pauseTimer: () => {
        const state = get()
        if (state.status === "RUNNING") {
          set({ status: "PAUSED" })
        }
      },
      
      resetTimer: () => {
        const state = get()
        const duration = state.currentSessionType === "WORK" 
          ? state.settings.workDuration 
          : state.currentSessionType === "SHORT_BREAK"
            ? state.settings.shortBreakDuration
            : state.settings.longBreakDuration
            
        set({
          status: "IDLE",
          timeRemaining: duration * 60,
          totalTime: duration * 60,
          currentSessionId: null,
        })
      },
      
      completeSession: () => {
        const state = get()
        set({
          status: "COMPLETED",
          timeRemaining: 0,
          completedSessions: state.completedSessions + 1,
        })
        
        // Automatically move to next session after a brief delay
        setTimeout(() => {
          const nextType = get().getNextSessionType()
          get().initializeSession(nextType)
        }, 2000)
      },
      
      skipSession: () => {
        const nextType = get().getNextSessionType()
        get().initializeSession(nextType)
      },
      
      setSubject: (subjectId: string | null) => {
        set({ subjectId })
      },
      
      updateSettings: (newSettings: Partial<TimerSettings>) => {
        const state = get()
        const updatedSettings = { ...state.settings, ...newSettings }
        
        set({ settings: updatedSettings })
        
        // If timer is idle and duration settings changed, update current timer
        if (state.status === "IDLE") {
          const duration = state.currentSessionType === "WORK" 
            ? updatedSettings.workDuration 
            : state.currentSessionType === "SHORT_BREAK"
              ? updatedSettings.shortBreakDuration
              : updatedSettings.longBreakDuration
              
          set({
            timeRemaining: duration * 60,
            totalTime: duration * 60,
          })
        }
      },
      
      // Internal actions
      tick: () => {
        const state = get()
        if (state.status === "RUNNING" && state.timeRemaining > 0) {
          set({ timeRemaining: state.timeRemaining - 1 })
          
          // Check if session completed
          if (state.timeRemaining - 1 <= 0) {
            get().completeSession()
          }
        }
      },
      
      initializeSession: (type: SessionType, round?: number) => {
        const state = get()
        const duration = type === "WORK" 
          ? state.settings.workDuration 
          : type === "SHORT_BREAK"
            ? state.settings.shortBreakDuration
            : state.settings.longBreakDuration
            
        let newRound = round || state.currentRound
        let newCycleId = state.cycleId
        
        // Update round based on session type
        if (type === "WORK") {
          // Starting a new work session
          if (state.currentSessionType !== "WORK") {
            // Coming from a break, keep the same round
          }
        } else if (type === "SHORT_BREAK") {
          // After work session, increment round
          if (state.currentSessionType === "WORK") {
            newRound = state.currentRound + 1
          }
        } else if (type === "LONG_BREAK") {
          // Reset round after long break
          newRound = 1
          newCycleId = `cycle_${Date.now()}` // New cycle after long break
        }
        
        set({
          currentSessionType: type,
          timeRemaining: duration * 60,
          totalTime: duration * 60,
          status: "IDLE",
          currentSessionId: null,
          currentRound: newRound,
          cycleId: newCycleId,
        })
        
        // Auto-start if enabled
        const shouldAutoStart = type === "WORK" 
          ? state.settings.autoStartSessions 
          : state.settings.autoStartBreaks
          
        if (shouldAutoStart) {
          setTimeout(() => get().startTimer(), 1000)
        }
      },
      
      getNextSessionType: (): SessionType => {
        const state = get()
        
        if (state.currentSessionType === "WORK") {
          // After work: check if it's time for long break
          if (state.currentRound >= state.settings.sessionsUntilLongBreak) {
            return "LONG_BREAK"
          } else {
            return "SHORT_BREAK"
          }
        } else {
          // After any break: back to work
          return "WORK"
        }
      },
    }),
    {
      name: "timer-store",
      partialize: (state) => ({
        settings: state.settings,
        currentRound: state.currentRound,
        cycleId: state.cycleId,
        completedSessions: state.completedSessions,
        subjectId: state.subjectId,
      }),
    }
  )
)