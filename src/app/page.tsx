"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    // This will be brief as useEffect will redirect
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Study Timer
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A powerful Pomodoro study timer with analytics, subject management, 
            and goal tracking to boost your productivity.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild>
              <a href="/auth/signin">Sign In</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/auth/signup">Get Started</a>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">⏱️ Pomodoro Timer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Boost your focus with scientifically-proven time management techniques.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-center">📊 Advanced Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Track your progress with detailed insights and productivity metrics.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-center">🎯 Goal Setting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Set and achieve your study goals with intelligent tracking.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}