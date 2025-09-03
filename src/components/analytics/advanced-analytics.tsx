"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductivityTrendChart } from '@/components/charts/productivity-trend-chart'
import { SubjectDistributionChart } from '@/components/charts/subject-distribution-chart'
import { StudyHeatmap } from '@/components/charts/study-heatmap'
import { BarChart3, TrendingUp, Calendar, Clock, Target, Award, BookOpen } from 'lucide-react'

interface SummaryStats {
  totalHours: number
  averageSession: number
  completionRate: number
  focusScore: number
  streak: number
  goalProgress: number
  bestSubject: string | null
  peakHour: number | null
}

export function AdvancedAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedView, setSelectedView] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [summaryStats, setSummaryStats] = useState<SummaryStats>({
    totalHours: 0,
    averageSession: 0,
    completionRate: 0,
    focusScore: 0,
    streak: 0,
    goalProgress: 0,
    bestSubject: null,
    peakHour: null
  })

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        // Real API call would go here to load user's analytics
        // For new users, all stats will be 0
        const userStats: SummaryStats = {
          totalHours: 0,
          averageSession: 0,
          completionRate: 0,
          focusScore: 0,
          streak: 0,
          goalProgress: 0,
          bestSubject: null,
          peakHour: null
        }
        
        setSummaryStats(userStats)
      } catch (error) {
        console.error('Failed to load analytics data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAnalyticsData()
  }, [selectedPeriod])

  const hasAnyData = summaryStats.totalHours > 0 || summaryStats.streak > 0

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!hasAnyData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <p className="text-muted-foreground">
              Detailed insights into your study patterns and productivity
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
              <div>
                <h3 className="text-xl font-semibold mb-2">No Analytics Data Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Start completing study sessions to see detailed analytics about your productivity, focus patterns, and progress over time.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Get started by:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Starting your first study session</li>
                  <li>• Setting up subjects to track</li>
                  <li>• Completing a few pomodoro cycles</li>
                  <li>• Setting daily or weekly goals</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Detailed insights into your study patterns and productivity
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            Export Data
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Time</span>
            </div>
            <div className="text-2xl font-bold">{summaryStats.totalHours}h</div>
            <div className="text-xs text-muted-foreground">
              {summaryStats.totalHours === 0 ? 'No sessions yet' : `This ${selectedPeriod}`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Focus Score</span>
            </div>
            <div className="text-2xl font-bold">{summaryStats.focusScore}%</div>
            <Badge variant="secondary" className="text-xs">
              {summaryStats.focusScore === 0 ? 'No data' : summaryStats.focusScore >= 90 ? 'Excellent' : summaryStats.focusScore >= 70 ? 'Good' : 'Needs improvement'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Streak</span>
            </div>
            <div className="text-2xl font-bold">{summaryStats.streak}</div>
            <div className="text-xs text-muted-foreground">
              {summaryStats.streak === 0 ? 'Start studying!' : 'days'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Completion</span>
            </div>
            <div className="text-2xl font-bold">{summaryStats.completionRate}%</div>
            <div className="text-xs text-muted-foreground">
              {summaryStats.completionRate === 0 ? 'No sessions' : 'completion rate'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="consistency">Consistency</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductivityTrendChart data={[]} period={selectedPeriod as any} />
            <SubjectDistributionChart data={[]} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Peak Performance Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Peak Hours</CardTitle>
              </CardHeader>
              <CardContent>
                {summaryStats.peakHour ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">10:00 AM</span>
                      <div className="flex-1 mx-2 bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '90%'}} />
                      </div>
                      <span className="text-sm text-muted-foreground">90%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Your most productive time is {summaryStats.peakHour}:00
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No peak hours data</p>
                    <p className="text-xs">Complete sessions to analyze your patterns</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Weekly Goals</CardTitle>
              </CardHeader>
              <CardContent>
                {summaryStats.goalProgress > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Study Time</span>
                        <span>{summaryStats.totalHours}/40 hours</span>
                      </div>
                      <div className="bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: `${Math.min(summaryStats.goalProgress, 100)}%`}} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No goals set</p>
                    <p className="text-xs">Set weekly goals to track progress</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                {summaryStats.streak > 0 || summaryStats.focusScore > 0 ? (
                  <div className="space-y-3">
                    {summaryStats.streak >= 7 && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                          🏆
                        </div>
                        <div>
                          <p className="text-sm font-medium">Week Warrior</p>
                          <p className="text-xs text-muted-foreground">{summaryStats.streak}-day streak</p>
                        </div>
                      </div>
                    )}
                    {summaryStats.focusScore >= 90 && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          🎯
                        </div>
                        <div>
                          <p className="text-sm font-medium">Focus Master</p>
                          <p className="text-xs text-muted-foreground">{summaryStats.focusScore}% focus score</p>
                        </div>
                      </div>
                    )}
                    {!summaryStats.streak && !summaryStats.focusScore && (
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">No achievements yet</p>
                        <p className="text-xs">Keep studying to unlock badges!</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No achievements yet</p>
                    <p className="text-xs">Complete sessions to unlock badges</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <ProductivityTrendChart data={[]} period={selectedPeriod as any} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Pattern Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {hasAnyData ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Best Day of Week</h4>
                      <p className="text-2xl font-bold">{summaryStats.bestSubject || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground">Most productive</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Optimal Session Length</h4>
                      <p className="text-2xl font-bold">{summaryStats.averageSession || 0} minutes</p>
                      <p className="text-sm text-muted-foreground">Average session</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No pattern data</p>
                    <p className="text-xs">Complete more sessions to see patterns</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                {hasAnyData ? (
                  <div className="space-y-3">
                    {summaryStats.focusScore > 0 && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Focus Improvement
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Your focus score is {summaryStats.focusScore}% - 
                          {summaryStats.focusScore >= 80 ? 'excellent work!' : 'try shorter sessions for better focus'}
                        </p>
                      </div>
                    )}
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Keep Learning
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        You're building great study habits! Maintain consistency for best results.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recommendations yet</p>
                    <p className="text-xs">Study more to get personalized tips</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-6">
          <SubjectDistributionChart data={[]} showLegend={false} />
          
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Subject performance table would go here */}
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Detailed subject analysis</p>
                  <p className="text-sm">Performance metrics by subject coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consistency Tab */}
        <TabsContent value="consistency" className="space-y-6">
          <StudyHeatmap data={[]} />
        </TabsContent>
      </Tabs>
    </div>
  )
}