"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Timer } from './timer/timer'
import { SubjectSelector } from './subjects/subject-selector'
import { SessionHistory } from './analytics/session-history'
import { DailyStats } from './analytics/daily-stats'
import { AdvancedAnalytics } from './analytics/advanced-analytics'
import { GoalsManager } from './goals/goals-manager'
import { FocusMode } from './focus/focus-mode'
import { DistractionTracker } from './focus/distraction-tracker'
import { AchievementSystem } from './achievements/achievement-system'
import { SettingsPanel } from './settings/settings-panel'
import { useSession } from 'next-auth/react'

export function Dashboard() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Welcome to Study Timer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please sign in to start tracking your study sessions.
            </p>
            <Button className="w-full" asChild>
              <a href="/auth/signin">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {session.user?.name || 'Student'}!
          </h1>
          <p className="text-muted-foreground">
            Ready for another productive session?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Timer Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subject Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Current Subject</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SubjectSelector />
              </CardContent>
            </Card>

            {/* Timer */}
            <Timer />

            {/* Today's Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyStats />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <Badge variant="secondary">12h 30m</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Best Day</span>
                  <Badge variant="secondary">3h 45m</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Streak</span>
                  <Badge variant="secondary">7 days</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Weekly Goal</span>
                    <span>62%</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <SessionHistory limit={5} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Analytics Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="focus">Focus Mode</TabsTrigger>
              <TabsTrigger value="distractions">Distractions</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your productivity overview will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics">
              <AdvancedAnalytics />
            </TabsContent>
            <TabsContent value="subjects">
              <Card>
                <CardHeader>
                  <CardTitle>Subject Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Manage your subjects and categories here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="goals">
              <GoalsManager />
            </TabsContent>
            <TabsContent value="focus">
              <FocusMode />
            </TabsContent>
            <TabsContent value="distractions">
              <DistractionTracker />
            </TabsContent>
            <TabsContent value="achievements">
              <AchievementSystem />
            </TabsContent>
            <TabsContent value="settings">
              <SettingsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}