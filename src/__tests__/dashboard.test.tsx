import { render, screen } from '@testing-library/react'
import { Dashboard } from '@/components/dashboard'
import { useSession } from 'next-auth/react'

jest.mock('next-auth/react')
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders sign in prompt when user is not authenticated', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    } as any)

    render(<Dashboard />)
    
    expect(screen.getByText('Welcome to Study Timer')).toBeInTheDocument()
    expect(screen.getByText('Please sign in to start tracking your study sessions.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders dashboard when user is authenticated', () => {
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

    render(<Dashboard />)
    
    expect(screen.getByText('Welcome back, Test User!')).toBeInTheDocument()
    expect(screen.getByText('Ready for another productive session?')).toBeInTheDocument()
  })

  it('renders all dashboard tabs', () => {
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

    render(<Dashboard />)
    
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Analytics' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Subjects' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Goals' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Focus Mode' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Distractions' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Achievements' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument()
  })

  it('displays current subject section', () => {
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

    render(<Dashboard />)
    
    expect(screen.getByText('Current Subject')).toBeInTheDocument()
  })

  it('displays today\'s progress section', () => {
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

    render(<Dashboard />)
    
    expect(screen.getByText('Today\'s Progress')).toBeInTheDocument()
  })

  it('displays quick stats sidebar', () => {
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

    render(<Dashboard />)
    
    expect(screen.getByText('Quick Stats')).toBeInTheDocument()
    expect(screen.getByText('Recent Sessions')).toBeInTheDocument()
  })
})