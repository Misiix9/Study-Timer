"use client"

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Keyboard } from 'lucide-react'

interface KeyboardShortcut {
  key: string
  description: string
  action: () => void
  scope?: 'global' | 'timer' | 'navigation'
}

interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[]
  showHelp?: boolean
}

export function KeyboardShortcuts({ shortcuts, showHelp = false }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.contentEditable === 'true'
      ) {
        return
      }

      // Find matching shortcut
      const shortcut = shortcuts.find(s => {
        const keys = s.key.split('+').map(k => k.trim().toLowerCase())
        const eventKey = event.key.toLowerCase()
        
        // Handle special keys
        const specialKeys: Record<string, boolean> = {
          ctrl: event.ctrlKey,
          cmd: event.metaKey,
          shift: event.shiftKey,
          alt: event.altKey,
        }

        // Check if all required keys are pressed
        const hasModifiers = keys.slice(0, -1).every(key => specialKeys[key])
        const hasMainKey = keys[keys.length - 1] === eventKey || 
                          (keys[keys.length - 1] === 'space' && eventKey === ' ') ||
                          (keys[keys.length - 1] === 'escape' && eventKey === 'escape')

        return hasModifiers && hasMainKey
      })

      if (shortcut) {
        event.preventDefault()
        shortcut.action()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])

  if (!showHelp) return null

  const formatKey = (key: string): string => {
    return key
      .split('+')
      .map(k => k.trim())
      .map(k => {
        switch (k.toLowerCase()) {
          case 'ctrl': return '⌃'
          case 'cmd': return '⌘'
          case 'shift': return '⇧'
          case 'alt': return '⌥'
          case 'space': return 'Space'
          case 'escape': return 'Esc'
          default: return k.toUpperCase()
        }
      })
      .join(' + ')
  }

  const groupedShortcuts = shortcuts.reduce((groups, shortcut) => {
    const scope = shortcut.scope || 'global'
    if (!groups[scope]) groups[scope] = []
    groups[scope].push(shortcut)
    return groups
  }, {} as Record<string, KeyboardShortcut[]>)

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Keyboard className="h-5 w-5" />
          Keyboard Shortcuts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedShortcuts).map(([scope, scopeShortcuts]) => (
            <div key={scope}>
              <h3 className="text-sm font-semibold mb-3 capitalize text-muted-foreground">
                {scope === 'global' ? 'Global' : scope === 'timer' ? 'Timer Control' : 'Navigation'}
              </h3>
              <div className="grid gap-2">
                {scopeShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <span className="text-sm">{shortcut.description}</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {formatKey(shortcut.key)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tip:</strong> Keyboard shortcuts are disabled when typing in text fields to prevent conflicts.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Hook for easy keyboard shortcut management
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.contentEditable === 'true'
      ) {
        return
      }

      const shortcut = shortcuts.find(s => {
        const keys = s.key.split('+').map(k => k.trim().toLowerCase())
        const eventKey = event.key.toLowerCase()
        
        const specialKeys: Record<string, boolean> = {
          ctrl: event.ctrlKey,
          cmd: event.metaKey,
          shift: event.shiftKey,
          alt: event.altKey,
        }

        const hasModifiers = keys.slice(0, -1).every(key => specialKeys[key])
        const hasMainKey = keys[keys.length - 1] === eventKey || 
                          (keys[keys.length - 1] === 'space' && eventKey === ' ') ||
                          (keys[keys.length - 1] === 'escape' && eventKey === 'escape')

        return hasModifiers && hasMainKey
      })

      if (shortcut) {
        event.preventDefault()
        shortcut.action()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}