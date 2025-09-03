'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Trophy, 
  Star, 
  Target, 
  Clock, 
  Flame,
  Calendar,
  BookOpen,
  Zap,
  Award,
  Medal,
  Crown,
  Shield,
  CheckCircle,
  Lock,
  Gift
} from 'lucide-react'
import { format } from 'date-fns'

interface Achievement {
  id: string
  name: string
  description: string
  category: 'time' | 'consistency' | 'milestones' | 'special'
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
  requirement: {
    type: string
    value: number
    description: string
  }
  unlockedAt?: Date
  isUnlocked: boolean
  progress: number
  maxProgress: number
}

interface UserStats {
  totalStudyTime: number
  sessionsCompleted: number
  currentStreak: number
  longestStreak: number
  subjectsStudied: number
  goalsCompleted: number
  perfectDays: number
  lateNightSessions: number
  earlyMorningSessions: number
}

const ACHIEVEMENTS: Achievement[] = [
  // Time-based achievements
  {
    id: 'first-hour',
    name: 'Getting Started',
    description: 'Complete your first hour of study',
    category: 'time',
    icon: '🎯',
    rarity: 'common',
    points: 10,
    requirement: { type: 'totalTime', value: 60, description: '1 hour total' },
    isUnlocked: false,
    progress: 0,
    maxProgress: 60
  },
  {
    id: 'dedicated-learner',
    name: 'Dedicated Learner',
    description: 'Accumulate 10 hours of study time',
    category: 'time',
    icon: '📚',
    rarity: 'common',
    points: 25,
    requirement: { type: 'totalTime', value: 600, description: '10 hours total' },
    isUnlocked: false,
    progress: 0,
    maxProgress: 600
  },
  {
    id: 'study-champion',
    name: 'Study Champion',
    description: 'Reach 50 hours of total study time',
    category: 'time',
    icon: '🏆',
    rarity: 'rare',
    points: 100,
    requirement: { type: 'totalTime', value: 3000, description: '50 hours total' },
    isUnlocked: false,
    progress: 0,
    maxProgress: 3000
  },
  {
    id: 'knowledge-master',
    name: 'Knowledge Master',
    description: 'Complete 100 hours of study',
    category: 'time',
    icon: '🎓',
    rarity: 'epic',
    points: 250,
    requirement: { type: 'totalTime', value: 6000, description: '100 hours total' },
    isUnlocked: false,
    progress: 0,
    maxProgress: 6000
  },

  // Consistency achievements
  {
    id: 'consistent-start',
    name: 'Consistent Start',
    description: 'Study for 3 consecutive days',
    category: 'consistency',
    icon: '🔥',
    rarity: 'common',
    points: 15,
    requirement: { type: 'streak', value: 3, description: '3 day streak' },
    isUnlocked: false,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'weekly-warrior',
    name: 'Weekly Warrior',
    description: 'Maintain a 7-day study streak',
    category: 'consistency',
    icon: '⚡',
    rarity: 'rare',
    points: 50,
    requirement: { type: 'streak', value: 7, description: '7 day streak' },
    isUnlocked: false,
    progress: 0,
    maxProgress: 7
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Achieve a 30-day study streak',
    category: 'consistency',
    icon: '🚀',
    rarity: 'epic',
    points: 200,
    requirement: { type: 'streak', value: 30, description: '30 day streak' },
    isUnlocked: false,
    progress: 0,
    maxProgress: 30
  },

  // Milestone achievements
  {
    id: 'session-starter',
    name: 'Session Starter',
    description: 'Complete your first study session',
    category: 'milestones',
    icon: '✨',
    rarity: 'common',
    points: 5,
    requirement: { type: 'sessions', value: 1, description: '1 session completed' },
    isUnlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'session-master',
    name: 'Session Master',
    description: 'Complete 50 study sessions',
    category: 'milestones',
    icon: '🎯',
    rarity: 'rare',
    points: 75,
    requirement: { type: 'sessions', value: 50, description: '50 sessions completed' },
    isUnlocked: false,
    progress: 0,
    maxProgress: 50
  },
  {
    id: 'multitasker',
    name: 'Multitasker',
    description: 'Study 5 different subjects',
    category: 'milestones',
    icon: '🌟',
    rarity: 'rare',
    points: 60,
    requirement: { type: 'subjects', value: 5, description: '5 different subjects' },
    isUnlocked: false,
    progress: 0,
    maxProgress: 5
  },

  // Special achievements
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete 10 study sessions before 8 AM',
    category: 'special',
    icon: '🌅',
    rarity: 'rare',
    points: 80,
    requirement: { type: 'earlyMorning', value: 10, description: '10 early morning sessions' },
    isUnlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete 10 study sessions after 10 PM',
    category: 'special',
    icon: '🦉',
    rarity: 'rare',
    points: 80,
    requirement: { type: 'lateNight', value: 10, description: '10 late night sessions' },
    isUnlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete 7 perfect study days (meet daily goal)',
    category: 'special',
    icon: '💎',
    rarity: 'epic',
    points: 150,
    requirement: { type: 'perfectDays', value: 7, description: '7 perfect days' },
    isUnlocked: false,
    progress: 0,
    maxProgress: 7
  },
  {
    id: 'legend',
    name: 'Study Legend',
    description: 'Unlock all other achievements',
    category: 'special',
    icon: '👑',
    rarity: 'legendary',
    points: 500,
    requirement: { type: 'allAchievements', value: 11, description: 'All other achievements' },
    isUnlocked: false,
    progress: 0,
    maxProgress: 11
  }
]

const RARITY_COLORS = {
  common: 'bg-gray-100 text-gray-800 border-gray-200',
  rare: 'bg-blue-100 text-blue-800 border-blue-200',
  epic: 'bg-purple-100 text-purple-800 border-purple-200',
  legendary: 'bg-yellow-100 text-yellow-800 border-yellow-200'
}

const RARITY_ICONS = {
  common: <Shield className="h-4 w-4" />,
  rare: <Star className="h-4 w-4" />,
  epic: <Crown className="h-4 w-4" />,
  legendary: <Trophy className="h-4 w-4" />
}

export function AchievementSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS)
  const [userStats, setUserStats] = useState<UserStats>({
    totalStudyTime: 0, // New users start with 0
    sessionsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    subjectsStudied: 0,
    goalsCompleted: 0,
    perfectDays: 0,
    lateNightSessions: 0,
    earlyMorningSessions: 0
  })
  const [totalPoints, setTotalPoints] = useState(0)
  const [unlockedCount, setUnlockedCount] = useState(0)
  const [recentUnlock, setRecentUnlock] = useState<Achievement | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUserStats = async () => {
      try {
        // Real API call would go here to load user's actual stats
        // For new users, stats will be all zeros as initialized above
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load user stats:', error)
        setIsLoading(false)
      }
    }

    loadUserStats()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      updateAchievements()
    }
  }, [userStats, isLoading])

  const updateAchievements = () => {
    let points = 0
    let unlocked = 0
    const updatedAchievements = achievements.map(achievement => {
      const progress = calculateProgress(achievement, userStats)
      const isUnlocked = progress >= achievement.maxProgress
      
      if (isUnlocked && !achievement.isUnlocked) {
        setRecentUnlock(achievement)
        setTimeout(() => setRecentUnlock(null), 5000)
      }
      
      if (isUnlocked) {
        points += achievement.points
        unlocked++
      }
      
      return {
        ...achievement,
        progress,
        isUnlocked,
        unlockedAt: isUnlocked && !achievement.unlockedAt ? new Date() : achievement.unlockedAt
      }
    })

    // Update legend achievement
    const legendAchievement = updatedAchievements.find(a => a.id === 'legend')
    if (legendAchievement) {
      const otherUnlockedCount = updatedAchievements.filter(a => a.id !== 'legend' && a.isUnlocked).length
      legendAchievement.progress = otherUnlockedCount
      if (otherUnlockedCount >= legendAchievement.maxProgress && !legendAchievement.isUnlocked) {
        legendAchievement.isUnlocked = true
        legendAchievement.unlockedAt = new Date()
        points += legendAchievement.points
        unlocked++
        setRecentUnlock(legendAchievement)
        setTimeout(() => setRecentUnlock(null), 5000)
      }
    }

    setAchievements(updatedAchievements)
    setTotalPoints(points)
    setUnlockedCount(unlocked)
  }

  const calculateProgress = (achievement: Achievement, stats: UserStats): number => {
    switch (achievement.requirement.type) {
      case 'totalTime':
        return Math.min(stats.totalStudyTime, achievement.maxProgress)
      case 'sessions':
        return Math.min(stats.sessionsCompleted, achievement.maxProgress)
      case 'streak':
        return Math.min(stats.currentStreak, achievement.maxProgress)
      case 'subjects':
        return Math.min(stats.subjectsStudied, achievement.maxProgress)
      case 'perfectDays':
        return Math.min(stats.perfectDays, achievement.maxProgress)
      case 'earlyMorning':
        return Math.min(stats.earlyMorningSessions, achievement.maxProgress)
      case 'lateNight':
        return Math.min(stats.lateNightSessions, achievement.maxProgress)
      case 'allAchievements':
        return achievements.filter(a => a.id !== 'legend' && a.isUnlocked).length
      default:
        return 0
    }
  }

  const getProgressPercentage = (achievement: Achievement): number => {
    return Math.min((achievement.progress / achievement.maxProgress) * 100, 100)
  }

  const groupedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) acc[achievement.category] = []
    acc[achievement.category].push(achievement)
    return acc
  }, {} as Record<string, Achievement[]>)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'time': return <Clock className="h-5 w-5" />
      case 'consistency': return <Flame className="h-5 w-5" />
      case 'milestones': return <Target className="h-5 w-5" />
      case 'special': return <Award className="h-5 w-5" />
      default: return <Trophy className="h-5 w-5" />
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'time': return 'Time-based'
      case 'consistency': return 'Consistency'
      case 'milestones': return 'Milestones'
      case 'special': return 'Special'
      default: return category
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Achievement Unlock Notification */}
      {recentUnlock && (
        <Card className="border-yellow-200 bg-yellow-50 animate-pulse">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{recentUnlock.icon}</div>
              <div>
                <h4 className="font-semibold text-yellow-800">Achievement Unlocked!</h4>
                <p className="text-yellow-700">{recentUnlock.name}</p>
                <p className="text-sm text-yellow-600">+{recentUnlock.points} points</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{totalPoints}</p>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Medal className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{unlockedCount}</p>
                <p className="text-sm text-gray-600">Unlocked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{userStats.currentStreak}</p>
                <p className="text-sm text-gray-600">Current Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{Math.round((unlockedCount / achievements.length) * 100)}%</p>
                <p className="text-sm text-gray-600">Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="time">Time</TabsTrigger>
          <TabsTrigger value="consistency">Consistency</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="special">Special</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getCategoryIcon(category)}
                  <span>{getCategoryName(category)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryAchievements.map(achievement => (
                    <Card key={achievement.id} className={achievement.isUnlocked ? '' : 'opacity-75'}>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{achievement.isUnlocked ? achievement.icon : '🔒'}</span>
                              <div>
                                <h4 className="font-semibold">{achievement.name}</h4>
                                <Badge className={RARITY_COLORS[achievement.rarity]} variant="outline">
                                  {RARITY_ICONS[achievement.rarity]}
                                  {achievement.rarity}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{achievement.points} pts</p>
                              {achievement.isUnlocked && achievement.unlockedAt && (
                                <p className="text-xs text-gray-500">
                                  {format(achievement.unlockedAt, 'MMM d')}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>
                                {achievement.progress}/{achievement.maxProgress}
                              </span>
                            </div>
                            <Progress value={getProgressPercentage(achievement)} className="h-2" />
                          </div>
                          
                          <p className="text-xs text-gray-500">
                            {achievement.requirement.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryAchievements.map(achievement => (
                <Card key={achievement.id} className={achievement.isUnlocked ? '' : 'opacity-75'}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{achievement.isUnlocked ? achievement.icon : '🔒'}</span>
                          <div>
                            <h4 className="font-semibold">{achievement.name}</h4>
                            <Badge className={RARITY_COLORS[achievement.rarity]} variant="outline">
                              {RARITY_ICONS[achievement.rarity]}
                              {achievement.rarity}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{achievement.points} pts</p>
                          {achievement.isUnlocked && achievement.unlockedAt && (
                            <p className="text-xs text-gray-500">
                              {format(achievement.unlockedAt, 'MMM d')}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <Progress value={getProgressPercentage(achievement)} className="h-2" />
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        {achievement.requirement.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Debug Controls (for testing) */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="h-5 w-5" />
            <span>Simulate Progress (Debug)</span>
          </CardTitle>
          <CardDescription>
            Test achievement system by simulating progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 md:grid-cols-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUserStats(prev => ({ ...prev, totalStudyTime: prev.totalStudyTime + 60 }))}
            >
              +1 Hour Study
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUserStats(prev => ({ ...prev, sessionsCompleted: prev.sessionsCompleted + 1 }))}
            >
              +1 Session
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUserStats(prev => ({ ...prev, currentStreak: prev.currentStreak + 1 }))}
            >
              +1 Streak
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUserStats(prev => ({ ...prev, subjectsStudied: prev.subjectsStudied + 1 }))}
            >
              +1 Subject
            </Button>
          </div>
          <div className="text-xs text-gray-500">
            Current stats: {userStats.totalStudyTime}min study, {userStats.sessionsCompleted} sessions, {userStats.currentStreak} streak
          </div>
        </CardContent>
      </Card>
    </div>
  )
}