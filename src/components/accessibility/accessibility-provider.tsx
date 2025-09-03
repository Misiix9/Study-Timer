"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useKeyboardShortcuts } from './keyboard-shortcuts'

interface AccessibilityContextType {
  announceMessage: (message: string, priority?: 'polite' | 'assertive') => void
  isHighContrastMode: boolean
  toggleHighContrast: () => void
  isReducedMotion: boolean
  focusElement: (selector: string) => void
  setFocusTrap: (element: HTMLElement | null) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

interface AccessibilityProviderProps {
  children: ReactNode
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [isHighContrastMode, setIsHighContrastMode] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const [focusTrappedElement, setFocusTrappedElement] = useState<HTMLElement | null>(null)

  // Detect user preferences
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Load high contrast preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-high-contrast')
    if (saved) {
      setIsHighContrastMode(JSON.parse(saved))
    }
  }, [])

  // Apply high contrast mode
  useEffect(() => {
    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
    localStorage.setItem('accessibility-high-contrast', JSON.stringify(isHighContrastMode))
  }, [isHighContrastMode])

  // Focus trap management
  useEffect(() => {
    if (!focusTrappedElement) return

    const focusableElements = focusTrappedElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    focusTrappedElement.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => {
      focusTrappedElement.removeEventListener('keydown', handleKeyDown)
    }
  }, [focusTrappedElement])

  const announceMessage = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  const toggleHighContrast = () => {
    setIsHighContrastMode(prev => !prev)
  }

  const focusElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement
    element?.focus()
  }

  const setFocusTrap = (element: HTMLElement | null) => {
    setFocusTrappedElement(element)
  }

  // Global keyboard shortcuts for accessibility
  const accessibilityShortcuts = [
    {
      key: 'alt+h',
      description: 'Toggle high contrast mode',
      action: toggleHighContrast,
      scope: 'global' as const,
    },
    {
      key: 'alt+m',
      description: 'Skip to main content',
      action: () => focusElement('main, [role="main"], #main-content'),
      scope: 'navigation' as const,
    },
    {
      key: 'alt+n',
      description: 'Skip to navigation',
      action: () => focusElement('nav, [role="navigation"]'),
      scope: 'navigation' as const,
    },
  ]

  useKeyboardShortcuts(accessibilityShortcuts)

  const value: AccessibilityContextType = {
    announceMessage,
    isHighContrastMode,
    toggleHighContrast,
    isReducedMotion,
    focusElement,
    setFocusTrap,
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      {/* Screen reader only skip links */}
      <div className="sr-only">
        <a 
          href="#main-content"
          className="absolute top-0 left-0 bg-primary text-primary-foreground p-2 -translate-y-full focus:translate-y-0 z-50"
        >
          Skip to main content
        </a>
        <a 
          href="#navigation"
          className="absolute top-0 left-16 bg-primary text-primary-foreground p-2 -translate-y-full focus:translate-y-0 z-50"
        >
          Skip to navigation
        </a>
      </div>
    </AccessibilityContext.Provider>
  )
}

// High contrast CSS custom properties that can be added to globals.css
export const highContrastStyles = `
.high-contrast {
  --background: 0 0% 0%;
  --foreground: 0 0% 100%;
  --muted: 0 0% 15%;
  --muted-foreground: 0 0% 85%;
  --popover: 0 0% 5%;
  --popover-foreground: 0 0% 95%;
  --card: 0 0% 5%;
  --card-foreground: 0 0% 95%;
  --border: 0 0% 30%;
  --input: 0 0% 20%;
  --primary: 0 0% 100%;
  --primary-foreground: 0 0% 0%;
  --secondary: 0 0% 20%;
  --secondary-foreground: 0 0% 90%;
  --accent: 0 0% 25%;
  --accent-foreground: 0 0% 95%;
  --destructive: 0 84% 40%;
  --destructive-foreground: 0 0% 100%;
  --ring: 0 0% 60%;
}

.high-contrast * {
  text-shadow: none !important;
  box-shadow: 0 0 0 1px hsl(var(--border)) !important;
}

.high-contrast button,
.high-contrast input,
.high-contrast select,
.high-contrast textarea {
  border: 2px solid hsl(var(--border)) !important;
}

.high-contrast a {
  text-decoration: underline !important;
}

.high-contrast :focus {
  outline: 3px solid hsl(var(--ring)) !important;
  outline-offset: 2px !important;
}
`