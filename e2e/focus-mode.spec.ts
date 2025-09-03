import { test, expect } from '@playwright/test'

test.describe('Focus Mode E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('tab', { name: 'Focus Mode' }).click()
  })

  test('should display focus mode interface', async ({ page }) => {
    await expect(page.getByText('Pre-configured Focus Sessions')).toBeVisible()
    await expect(page.getByText('Start a focus session to block distracting websites')).toBeVisible()
  })

  test('should display pre-configured focus sessions', async ({ page }) => {
    const sessions = ['Deep Work', 'Light Focus', 'Exam Prep']
    
    for (const session of sessions) {
      await expect(page.getByText(session)).toBeVisible()
    }
  })

  test('should start a focus session', async ({ page }) => {
    // Find the first "Start Session" button
    const startButton = page.getByRole('button', { name: 'Start Session' }).first()
    await startButton.click()

    // Should show active focus session
    await expect(page.getByText('Focus Mode Active')).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('button', { name: 'End Session' })).toBeVisible()
  })

  test('should end a focus session', async ({ page }) => {
    // Start a session first
    const startButton = page.getByRole('button', { name: 'Start Session' }).first()
    await startButton.click()

    // Wait for active session to show
    await expect(page.getByText('Focus Mode Active')).toBeVisible()

    // End the session
    await page.getByRole('button', { name: 'End Session' }).click()

    // Focus mode should no longer be active
    await expect(page.getByText('Focus Mode Active')).not.toBeVisible({ timeout: 5000 })
  })

  test('should navigate between focus mode tabs', async ({ page }) => {
    const tabs = ['Focus Sessions', 'Website Blocking', 'Create Session']

    for (const tab of tabs) {
      await page.getByRole('tab', { name: tab }).click()
      // Each tab should be visible when clicked
      await expect(page.getByRole('tabpanel')).toBeVisible()
    }
  })

  test('should display website blocking suggestions', async ({ page }) => {
    await page.getByRole('tab', { name: 'Website Blocking' }).click()
    
    await expect(page.getByText('Website Blocking Suggestions')).toBeVisible()
    await expect(page.getByText('Common distracting websites')).toBeVisible()
    
    // Should show common sites like facebook, twitter, etc.
    await expect(page.getByText('facebook.com')).toBeVisible()
    await expect(page.getByText('twitter.com')).toBeVisible()
  })

  test('should allow custom site blocking', async ({ page }) => {
    await page.getByRole('tab', { name: 'Website Blocking' }).click()
    
    await expect(page.getByText('Custom Blocked Sites')).toBeVisible()
    await expect(page.getByPlaceholder('Enter website URL')).toBeVisible()
  })

  test('should create custom focus session', async ({ page }) => {
    await page.getByRole('tab', { name: 'Create Session' }).click()
    
    // Fill in session name
    await page.getByPlaceholder('Enter session name').fill('Test Session')
    
    // Select some sites to block
    const switches = page.locator('button[role="switch"]').first()
    await switches.click()
    
    // Should show session preview
    await expect(page.getByText('Session Preview')).toBeVisible()
    
    // Create the session
    await page.getByRole('button', { name: 'Create Focus Session' }).click()
    
    // Should navigate back to sessions tab and show new session
    await expect(page.getByText('Test Session')).toBeVisible()
  })

  test('should show browser extension notice', async ({ page }) => {
    await expect(page.getByText('Browser Extension Required')).toBeVisible()
    await expect(page.getByText('To actively block websites, you\'ll need to install our browser extension')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Download Extension' })).toBeVisible()
  })
})

test.describe('Distraction Tracker E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('tab', { name: 'Distractions' }).click()
  })

  test('should display distraction tracking interface', async ({ page }) => {
    await expect(page.getByText('Quick Distraction Logging')).toBeVisible()
    await expect(page.getByText('Tap to quickly log common distractions')).toBeVisible()
  })

  test('should show distraction stats', async ({ page }) => {
    await expect(page.getByText('Today')).toBeVisible()
    await expect(page.getByText('Daily Average')).toBeVisible()
    await expect(page.getByText('Focus Score')).toBeVisible()
  })

  test('should allow quick distraction logging', async ({ page }) => {
    // Click on a quick distraction button
    const socialMediaButton = page.getByRole('button', { name: /social media/i }).first()
    await socialMediaButton.click()
    
    // Should update the distraction count (this would be visible in stats)
    // The exact verification depends on how the UI updates
  })

  test('should allow custom distraction logging', async ({ page }) => {
    // Open custom distraction form
    await page.getByRole('button', { name: 'Custom' }).click()
    
    // Should show the custom distraction form
    await expect(page.getByText('Type')).toBeVisible()
    await expect(page.getByText('Description')).toBeVisible()
    await expect(page.getByText('Severity')).toBeVisible()
  })
})