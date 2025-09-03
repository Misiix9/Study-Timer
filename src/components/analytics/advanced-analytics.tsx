"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductivityTrendChart } from '@/components/charts/productivity-trend-chart'
import { SubjectDistributionChart } from '@/components/charts/subject-distribution-chart'
import { StudyHeatmap } from '@/components/charts/study-heatmap'
import { BarChart3, TrendingUp, Calendar, Clock, Target, Award } from 'lucide-react'

export function AdvancedAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedView, setSelectedView] = useState('overview')

  // Mock summary data
  const summaryStats = {
    totalHours: 32.5,
    averageSession: 28,
    completionRate: 87,
    focusScore: 92,
    streak: 7,
    goalProgress: 78,
    bestSubject: 'Computer Science',
    peakHour: 10
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
            <div className="text-xs text-green-600">+12% from last {selectedPeriod}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Focus Score</span>
            </div>
            <div className="text-2xl font-bold">{summaryStats.focusScore}%</div>
            <Badge variant="secondary" className="text-xs">Excellent</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Streak</span>
            </div>
            <div className="text-2xl font-bold">{summaryStats.streak}</div>
            <div className="text-xs text-muted-foreground">days</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Completion</span>
            </div>
            <div className="text-2xl font-bold">{summaryStats.completionRate}%</div>
            <div className="text-xs text-muted-foreground">avg session length</div>
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
            <ProductivityTrendChart period={selectedPeriod as any} />
            <SubjectDistributionChart />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Peak Performance Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Peak Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">10:00 AM</span>
                    <div className="flex-1 mx-2 bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '90%'}} />
                    </div>
                    <span className="text-sm text-muted-foreground">90%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">2:00 PM</span>
                    <div className="flex-1 mx-2 bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}} />
                    </div>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">8:00 PM</span>
                    <div className="flex-1 mx-2 bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '60%'}} />
                    </div>
                    <span className="text-sm text-muted-foreground">60%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Your most productive time is {summaryStats.peakHour}:00 AM
                </p>
              </CardContent>
            </Card>

            {/* Weekly Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Weekly Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Study Time</span>
                      <span>32/40 hours</span>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '80%'}} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sessions</span>
                      <span>28/35</span>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '80%'}} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Focus Score</span>
                      <span>92/90%</span>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '100%'}} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                      🏆
                    </div>
                    <div>
                      <p className="text-sm font-medium">Week Warrior</p>
                      <p className="text-xs text-muted-foreground">7-day streak</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      🎯
                    </div>
                    <div>
                      <p className="text-sm font-medium">Focus Master</p>
                      <p className="text-xs text-muted-foreground">90%+ focus score</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      📚
                    </div>
                    <div>
                      <p className="text-sm font-medium">Subject Explorer</p>
                      <p className="text-xs text-muted-foreground">Studied 5 subjects</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <ProductivityTrendChart period={selectedPeriod as any} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Pattern Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Best Day of Week</h4>
                    <p className="text-2xl font-bold">Tuesday</p>
                    <p className="text-sm text-muted-foreground">Average 4.2 hours</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Optimal Session Length</h4>
                    <p className="text-2xl font-bold">28 minutes</p>
                    <p className="text-sm text-muted-foreground">Best focus score</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Break Efficiency</h4>
                    <p className="text-2xl font-bold">85%</p>
                    <p className="text-sm text-muted-foreground">Break-to-work ratio</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Peak Performance
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Schedule important subjects around 10 AM when you're most focused
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Session Optimization
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Your 25-minute sessions have 95% completion rate - keep it up!
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                      Weekend Boost
                    </p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      Consider light study on weekends to maintain consistency
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-6">
          <SubjectDistributionChart showLegend={false} />
          
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
          <StudyHeatmap />
        </TabsContent>
      </Tabs>
    </div>
  )
}