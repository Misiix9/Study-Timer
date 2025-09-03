import { chromium, FullConfig } from '@playwright/test'
import path from 'path'

async function globalSetup(config: FullConfig) {
  // Create browser instance for authentication setup
  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    // Navigate to the application
    await page.goto('http://localhost:3000')

    // Perform any global authentication setup
    // This could involve creating test users, setting up test data, etc.
    console.log('🚀 Setting up test environment...')

    // Example: Create test user session
    // await page.goto('/auth/signin')
    // await page.fill('[name="email"]', 'test@example.com')
    // await page.fill('[name="password"]', 'testpassword')
    // await page.click('[type="submit"]')
    // await page.waitForURL('/dashboard')

    // Save authentication state for reuse in tests
    // await page.context().storageState({ path: 'auth-state.json' })

    console.log('✅ Test environment setup complete')
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
}

export default globalSetup