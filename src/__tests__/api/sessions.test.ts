import { createMocks } from 'node-mocks-http'
import { GET, POST } from '@/app/api/sessions/route'

// Mock Prisma
jest.mock('@/lib/db', () => ({
  session: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
}))

// Mock NextAuth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}))

describe('/api/sessions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/sessions', () => {
    it('returns sessions for authenticated user', async () => {
      // Mock authenticated session
      const { getServerSession } = require('next-auth/next')
      getServerSession.mockResolvedValue({
        user: { id: '1', email: 'test@example.com' }
      })

      // Mock database response
      const { session } = require('@/lib/db')
      const mockSessions = [
        {
          id: '1',
          userId: '1',
          subjectId: '1',
          duration: 1500,
          startTime: new Date(),
          endTime: new Date(),
          type: 'WORK',
          completed: true,
          createdAt: new Date(),
          subject: {
            id: '1',
            name: 'Mathematics',
            color: '#3B82F6'
          }
        }
      ]
      session.findMany.mockResolvedValue(mockSessions)

      const { req } = createMocks({
        method: 'GET',
        url: '/api/sessions',
      })

      const response = await GET(req as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.sessions).toEqual(mockSessions)
    })

    it('returns 401 for unauthenticated requests', async () => {
      // Mock unauthenticated session
      const { getServerSession } = require('next-auth/next')
      getServerSession.mockResolvedValue(null)

      const { req } = createMocks({
        method: 'GET',
        url: '/api/sessions',
      })

      const response = await GET(req as any)

      expect(response.status).toBe(401)
    })

    it('handles pagination correctly', async () => {
      const { getServerSession } = require('next-auth/next')
      getServerSession.mockResolvedValue({
        user: { id: '1', email: 'test@example.com' }
      })

      const { session } = require('@/lib/db')
      session.findMany.mockResolvedValue([])

      const { req } = createMocks({
        method: 'GET',
        url: '/api/sessions?page=2&limit=10',
        query: { page: '2', limit: '10' }
      })

      await GET(req as any)

      expect(session.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      )
    })
  })

  describe('POST /api/sessions', () => {
    it('creates a new session for authenticated user', async () => {
      const { getServerSession } = require('next-auth/next')
      getServerSession.mockResolvedValue({
        user: { id: '1', email: 'test@example.com' }
      })

      const { session } = require('@/lib/db')
      const mockSession = {
        id: '1',
        userId: '1',
        subjectId: '1',
        duration: 1500,
        startTime: new Date(),
        endTime: new Date(),
        type: 'WORK',
        completed: true,
        createdAt: new Date(),
      }
      session.create.mockResolvedValue(mockSession)

      const { req } = createMocks({
        method: 'POST',
        url: '/api/sessions',
        body: {
          subjectId: '1',
          duration: 1500,
          type: 'WORK',
          completed: true,
        },
      })

      const response = await POST(req as any)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.session).toEqual(mockSession)
      expect(session.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: '1',
            subjectId: '1',
            duration: 1500,
            type: 'WORK',
            completed: true,
          })
        })
      )
    })

    it('validates required fields', async () => {
      const { getServerSession } = require('next-auth/next')
      getServerSession.mockResolvedValue({
        user: { id: '1', email: 'test@example.com' }
      })

      const { req } = createMocks({
        method: 'POST',
        url: '/api/sessions',
        body: {
          // Missing required fields
        },
      })

      const response = await POST(req as any)

      expect(response.status).toBe(400)
    })

    it('returns 401 for unauthenticated requests', async () => {
      const { getServerSession } = require('next-auth/next')
      getServerSession.mockResolvedValue(null)

      const { req } = createMocks({
        method: 'POST',
        url: '/api/sessions',
        body: {
          subjectId: '1',
          duration: 1500,
          type: 'WORK',
        },
      })

      const response = await POST(req as any)

      expect(response.status).toBe(401)
    })
  })
})