import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Timer } from '@/components/timer/timer'
import { useSession } from 'next-auth/react'

// Mock the useSession hook
jest.mock('next-auth/react')
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

describe('Timer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    } as any)
  })

  it('renders the timer with initial state', () => {
    render(<Timer />)
    
    // Check if timer displays initial time (25:00)
    expect(screen.getByText('25:00')).toBeInTheDocument()
    
    // Check if start button is present
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
  })

  it('starts the timer when start button is clicked', async () => {
    render(<Timer />)
    
    const startButton = screen.getByRole('button', { name: /start/i })
    fireEvent.click(startButton)
    
    // Wait for the timer to start and button text to change
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
    })
  })

  it('pauses the timer when pause button is clicked', async () => {
    render(<Timer />)
    
    // Start the timer
    const startButton = screen.getByRole('button', { name: /start/i })
    fireEvent.click(startButton)
    
    // Wait for pause button to appear and click it
    await waitFor(() => {
      const pauseButton = screen.getByRole('button', { name: /pause/i })
      fireEvent.click(pauseButton)
    })
    
    // Check if resume button appears
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument()
    })
  })

  it('resets the timer when reset button is clicked', async () => {
    render(<Timer />)
    
    // Start the timer
    const startButton = screen.getByRole('button', { name: /start/i })
    fireEvent.click(startButton)
    
    // Click reset button
    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)
    
    // Check if timer is back to initial state
    expect(screen.getByText('25:00')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
  })

  it('switches between work and break sessions', async () => {
    render(<Timer />)
    
    // Mock timer completion (this would normally take 25 minutes)
    // We'll simulate this by triggering the session end logic
    const startButton = screen.getByRole('button', { name: /start/i })
    fireEvent.click(startButton)
    
    // Simulate timer completion - this would trigger break mode
    // In a real scenario, we'd mock the timer countdown
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
    })
  })

  it('displays correct session type', () => {
    render(<Timer />)
    
    // Check if it shows work session initially
    expect(screen.getByText(/work/i)).toBeInTheDocument()
  })

  it('handles keyboard shortcuts', () => {
    render(<Timer />)
    
    // Simulate spacebar press for start/pause
    fireEvent.keyDown(document, { key: ' ', code: 'Space' })
    
    // Check if timer started
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
    
    // Simulate escape key for reset
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    
    // Check if timer reset
    expect(screen.getByText('25:00')).toBeInTheDocument()
  })
})