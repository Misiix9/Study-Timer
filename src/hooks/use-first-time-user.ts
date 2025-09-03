"use client"

import { useState, useEffect } from 'react'

const ONBOARDING_KEY = 'study-timer-onboarding-completed'
const USER_DATA_KEY = 'study-timer-user-data'

interface UserData {
  hasCompletedOnboarding: boolean
  hasCreatedSubjects: boolean
  hasStartedFirstSession: boolean
  hasSetGoals: boolean
  firstLoginDate: string
  lastActiveDate: string
}

export function useFirstTimeUser() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkFirstTimeUser = () => {
      try {
        // Check if onboarding was completed
        const onboardingCompleted = localStorage.getItem(ONBOARDING_KEY) === 'true'
        
        // Get existing user data
        const storedUserData = localStorage.getItem(USER_DATA_KEY)
        let currentUserData: UserData
        
        if (storedUserData) {
          currentUserData = JSON.parse(storedUserData)
          // Update last active date
          currentUserData.lastActiveDate = new Date().toISOString()
        } else {
          // New user - create initial data
          currentUserData = {
            hasCompletedOnboarding: onboardingCompleted,
            hasCreatedSubjects: false,
            hasStartedFirstSession: false,
            hasSetGoals: false,
            firstLoginDate: new Date().toISOString(),
            lastActiveDate: new Date().toISOString()
          }
        }
        
        // Check for any existing data to determine if truly first time
        const hasAnyData = checkForExistingData()
        
        // User is first time if:
        // 1. No onboarding completed AND
        // 2. Either no existing user data OR user data shows not completed onboarding AND  
        // 3. No other app data exists
        const isReallyFirstTime = !onboardingCompleted && 
                                 (!storedUserData || !currentUserData.hasCompletedOnboarding) && 
                                 !hasAnyData
        
        setIsFirstTime(isReallyFirstTime)
        setUserData(currentUserData)
        
        // Save updated user data
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(currentUserData))
        
      } catch (error) {
        console.error('Error checking first time user:', error)
        setIsFirstTime(true) // Default to first time on error
      } finally {
        setIsLoading(false)
      }
    }

    checkFirstTimeUser()
  }, [])

  const checkForExistingData = (): boolean => {
    try {
      // Check for any existing application data
      const timerStore = localStorage.getItem('timer-store')
      const subjects = localStorage.getItem('study-subjects') 
      const sessions = localStorage.getItem('study-sessions')
      const goals = localStorage.getItem('study-goals')
      const achievements = localStorage.getItem('study-achievements')
      
      return !!(timerStore || subjects || sessions || goals || achievements)
    } catch {
      return false
    }
  }

  const completeOnboarding = (onboardingData?: {
    subjects?: any[]
    dailyGoal?: number
    sessionLength?: number
  }) => {
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true')
      
      if (userData) {
        const updatedData: UserData = {
          ...userData,
          hasCompletedOnboarding: true,
          hasCreatedSubjects: onboardingData?.subjects && onboardingData.subjects.length > 0,
          hasSetGoals: onboardingData?.dailyGoal ? onboardingData.dailyGoal > 0 : false
        }
        
        setUserData(updatedData)
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedData))
      }
      
      setIsFirstTime(false)
      
      // Store onboarding data if provided
      if (onboardingData) {
        if (onboardingData.subjects) {
          localStorage.setItem('study-subjects', JSON.stringify(onboardingData.subjects))
        }
        if (onboardingData.dailyGoal) {
          localStorage.setItem('study-daily-goal', JSON.stringify(onboardingData.dailyGoal))
        }
        if (onboardingData.sessionLength) {
          localStorage.setItem('study-session-length', JSON.stringify(onboardingData.sessionLength))
        }
      }
      
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }
  }

  const markFirstSessionStarted = () => {
    if (userData) {
      const updatedData = { ...userData, hasStartedFirstSession: true }
      setUserData(updatedData)
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedData))
    }
  }

  const markSubjectsCreated = () => {
    if (userData) {
      const updatedData = { ...userData, hasCreatedSubjects: true }
      setUserData(updatedData)
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedData))
    }
  }

  const markGoalsSet = () => {
    if (userData) {
      const updatedData = { ...userData, hasSetGoals: true }
      setUserData(updatedData)
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedData))
    }
  }

  const resetOnboarding = () => {
    try {
      localStorage.removeItem(ONBOARDING_KEY)
      localStorage.removeItem(USER_DATA_KEY)
      setIsFirstTime(true)
      setUserData(null)
    } catch (error) {
      console.error('Error resetting onboarding:', error)
    }
  }

  return {
    isFirstTime,
    isLoading,
    userData,
    completeOnboarding,
    markFirstSessionStarted,
    markSubjectsCreated,
    markGoalsSet,
    resetOnboarding
  }
}