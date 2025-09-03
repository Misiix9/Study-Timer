import { test, expect } from '@playwright/test'

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication or use stored auth state
    // await page.goto('/auth/signin')
    // await page.fill('[name="email"]', 'test@example.com')
    // await page.fill('[name="password"]', 'testpassword')
    // await page.click('[type="submit"]')
    
    // For now, we'll navigate directly to dashboard
    await page.goto('/dashboard')
  })

  test('should display dashboard welcome message', async ({ page }) => {
    await expect(page.getByText('Welcome back')).toBeVisible()
    await expect(page.getByText('Ready for another productive session?')).toBeVisible()
  })

  test('should display all dashboard tabs', async ({ page }) => {
    const tabs = [
      'Overview',
      'Analytics', 
      'Subjects',
      'Goals',
      'Focus Mode',
      'Distractions',
      'Achievements',
      'Settings'
    ]

    for (const tab of tabs) {
      await expect(page.getByRole('tab', { name: tab })).toBeVisible()
    }
  })

  test('should navigate between tabs', async ({ page }) => {
    // Click on Analytics tab
    await page.getByRole('tab', { name: 'Analytics' }).click()
    await expect(page.getByText('Study Analytics')).toBeVisible()

    // Click on Goals tab
    await page.getByRole('tab', { name: 'Goals' }).click()
    await expect(page.getByText('Goal Management')).toBeVisible()

    // Click on Settings tab
    await page.getByRole('tab', { name: 'Settings' }).click()
    await expect(page.getByText('Timer')).toBeVisible()
  })

  test('should display timer component', async ({ page }) => {
    await expect(page.getByText('25:00')).toBeVisible()
    await expect(page.getByRole('button', { name: /start/i })).toBeVisible()
  })

  test('should display subject selector', async ({ page }) => {
    await expect(page.getByText('Current Subject')).toBeVisible()
  })

  test('should display quick stats', async ({ page }) => {
    await expect(page.getByText('Quick Stats')).toBeVisible()
    await expect(page.getByText('This Week')).toBeVisible()
    await expect(page.getByText('Best Day')).toBeVisible()
    await expect(page.getByText('Streak')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      // Test mobile-specific behavior
      await expect(page.getByText('Welcome back')).toBeVisible()
      
      // On mobile, tabs might be in a different layout
      const tabsList = page.getByRole('tablist')
      await expect(tabsList).toBeVisible()
    }
  })
})

test.describe('Timer Functionality E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
  })

  test('should start and pause timer', async ({ page }) => {
    // Start timer
    const startButton = page.getByRole('button', { name: /start/i })
    await startButton.click()

    // Wait for timer to start (button should change to pause)
    await expect(page.getByRole('button', { name: /pause/i })).toBeVisible({ timeout: 2000 })

    // Pause timer
    const pauseButton = page.getByRole('button', { name: /pause/i })
    await pauseButton.click()

    // Wait for resume button to appear
    await expect(page.getByRole('button', { name: /resume/i })).toBeVisible()
  })

  test('should reset timer', async ({ page }) => {
    // Start timer first
    await page.getByRole('button', { name: /start/i }).click()
    await expect(page.getByRole('button', { name: /pause/i })).toBeVisible()

    // Reset timer
    await page.getByRole('button', { name: /reset/i }).click()

    // Timer should be back to initial state
    await expect(page.getByText('25:00')).toBeVisible()
    await expect(page.getByRole('button', { name: /start/i })).toBeVisible()
  })

  test('should respond to keyboard shortcuts', async ({ page }) => {
    // Focus the page
    await page.click('body')

    // Press spacebar to start timer
    await page.keyboard.press('Space')
    await expect(page.getByRole('button', { name: /pause/i })).toBeVisible({ timeout: 2000 })

    // Press escape to reset
    await page.keyboard.press('Escape')
    await expect(page.getByText('25:00')).toBeVisible()
    await expect(page.getByRole('button', { name: /start/i })).toBeVisible()
  })
})

test.describe('Settings Page E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('tab', { name: 'Settings' }).click()
  })

  test('should display all settings categories', async ({ page }) => {
    const categories = [
      'Timer',
      'Notifications',
      'Appearance', 
      'Productivity',
      'Data & Privacy',
      'Account'
    ]

    for (const category of categories) {
      await expect(page.getByRole('tab', { name: category })).toBeVisible()
    }
  })

  test('should allow timer configuration changes', async ({ page }) => {
    // Navigate to timer settings
    await page.getByRole('tab', { name: 'Timer' }).click()

    // Check if Pomodoro length slider exists
    await expect(page.getByText('Pomodoro Length:')).toBeVisible()
    
    // Check if auto-start options are available
    await expect(page.getByText('Auto-start Breaks')).toBeVisible()
    await expect(page.getByText('Auto-start Sessions')).toBeVisible()
  })

  test('should allow theme switching', async ({ page }) => {
    // Navigate to appearance settings
    await page.getByRole('tab', { name: 'Appearance' }).click()

    // Check theme options
    await expect(page.getByText('Theme')).toBeVisible()
    await expect(page.getByRole('button', { name: /light/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /dark/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /system/i })).toBeVisible()
  })
})