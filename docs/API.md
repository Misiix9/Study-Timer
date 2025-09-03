# Study Timer API Documentation

This document provides comprehensive information about the Study Timer REST API endpoints.

## Base URL

```
https://studytimer.app/api
```

## Authentication

The API uses NextAuth.js session-based authentication. Include the session cookie in your requests.

### Headers

```http
Content-Type: application/json
Authorization: Bearer <session-token>
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Endpoints

### Sessions

#### Get All Sessions

```http
GET /api/sessions
```

**Query Parameters:**
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of sessions per page (default: 20)
- `subject` (string, optional): Filter by subject ID
- `startDate` (string, optional): Filter sessions from date (ISO 8601)
- `endDate` (string, optional): Filter sessions to date (ISO 8601)

**Response:**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "userId": "uuid",
      "subjectId": "uuid",
      "duration": 1500,
      "startTime": "2024-01-15T10:00:00Z",
      "endTime": "2024-01-15T10:25:00Z",
      "type": "WORK",
      "completed": true,
      "notes": "Great focus session",
      "createdAt": "2024-01-15T10:00:00Z",
      "subject": {
        "id": "uuid",
        "name": "Mathematics",
        "color": "#3B82F6"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### Create Session

```http
POST /api/sessions
```

**Request Body:**
```json
{
  "subjectId": "uuid",
  "duration": 1500,
  "type": "WORK",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T10:25:00Z",
  "completed": true,
  "notes": "Optional session notes"
}
```

**Response:**
```json
{
  "session": {
    "id": "uuid",
    "userId": "uuid",
    "subjectId": "uuid",
    "duration": 1500,
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T10:25:00Z",
    "type": "WORK",
    "completed": true,
    "notes": "Optional session notes",
    "createdAt": "2024-01-15T10:25:00Z"
  }
}
```

#### Update Session

```http
PUT /api/sessions/[id]
```

**Request Body:**
```json
{
  "notes": "Updated session notes",
  "completed": true
}
```

#### Delete Session

```http
DELETE /api/sessions/[id]
```

### Subjects

#### Get All Subjects

```http
GET /api/subjects
```

**Response:**
```json
{
  "subjects": [
    {
      "id": "uuid",
      "name": "Mathematics",
      "description": "Calculus and algebra studies",
      "color": "#3B82F6",
      "icon": "📚",
      "userId": "uuid",
      "isActive": true,
      "createdAt": "2024-01-10T08:00:00Z",
      "stats": {
        "totalSessions": 25,
        "totalTime": 37500,
        "averageSession": 1500,
        "streak": 5
      }
    }
  ]
}
```

#### Create Subject

```http
POST /api/subjects
```

**Request Body:**
```json
{
  "name": "Physics",
  "description": "Quantum mechanics and thermodynamics",
  "color": "#10B981",
  "icon": "⚛️"
}
```

#### Update Subject

```http
PUT /api/subjects/[id]
```

**Request Body:**
```json
{
  "name": "Advanced Physics",
  "description": "Updated description",
  "color": "#10B981",
  "isActive": false
}
```

#### Delete Subject

```http
DELETE /api/subjects/[id]
```

### Goals

#### Get All Goals

```http
GET /api/goals
```

**Query Parameters:**
- `type` (string, optional): Filter by goal type (`daily`, `weekly`, `monthly`)
- `status` (string, optional): Filter by status (`active`, `completed`, `paused`)

**Response:**
```json
{
  "goals": [
    {
      "id": "uuid",
      "title": "Study 2 hours daily",
      "description": "Maintain consistent daily study habit",
      "type": "DAILY",
      "target": 7200,
      "current": 5400,
      "unit": "seconds",
      "deadline": "2024-01-31T23:59:59Z",
      "status": "ACTIVE",
      "subjectId": "uuid",
      "userId": "uuid",
      "createdAt": "2024-01-01T00:00:00Z",
      "progress": 75
    }
  ]
}
```

#### Create Goal

```http
POST /api/goals
```

**Request Body:**
```json
{
  "title": "Weekly Study Goal",
  "description": "Study 15 hours this week",
  "type": "WEEKLY",
  "target": 54000,
  "unit": "seconds",
  "deadline": "2024-01-21T23:59:59Z",
  "subjectId": "uuid"
}
```

#### Update Goal Progress

```http
PATCH /api/goals/[id]/progress
```

**Request Body:**
```json
{
  "progress": 3600
}
```

### Analytics

#### Get Dashboard Stats

```http
GET /api/analytics/dashboard
```

**Query Parameters:**
- `period` (string, optional): Time period (`day`, `week`, `month`, `year`)

**Response:**
```json
{
  "overview": {
    "totalSessions": 156,
    "totalTime": 234000,
    "averageSession": 1500,
    "currentStreak": 7,
    "longestStreak": 15,
    "productivity": 85
  },
  "trends": {
    "daily": [
      { "date": "2024-01-15", "sessions": 4, "time": 6000 }
    ],
    "weekly": [
      { "week": "2024-W03", "sessions": 28, "time": 42000 }
    ]
  },
  "subjects": [
    {
      "name": "Mathematics",
      "sessions": 45,
      "time": 67500,
      "percentage": 28.8
    }
  ]
}
```

#### Get Productivity Trends

```http
GET /api/analytics/trends
```

**Query Parameters:**
- `period` (string): Time period (`week`, `month`, `year`)
- `metric` (string): Metric to analyze (`time`, `sessions`, `productivity`)

#### Get Study Heatmap

```http
GET /api/analytics/heatmap
```

**Query Parameters:**
- `year` (number): Year for heatmap data

**Response:**
```json
{
  "heatmap": [
    {
      "date": "2024-01-15",
      "value": 3600,
      "level": 3,
      "sessions": 2
    }
  ],
  "stats": {
    "totalDays": 365,
    "activeDays": 245,
    "maxDaily": 7200,
    "averageDaily": 1800
  }
}
```

### User Preferences

#### Get User Settings

```http
GET /api/user/settings
```

**Response:**
```json
{
  "settings": {
    "pomodoroLength": 25,
    "shortBreakLength": 5,
    "longBreakLength": 15,
    "longBreakInterval": 4,
    "autoStartBreaks": false,
    "soundEnabled": true,
    "notificationsEnabled": true,
    "theme": "dark"
  }
}
```

#### Update User Settings

```http
PUT /api/user/settings
```

**Request Body:**
```json
{
  "pomodoroLength": 30,
  "shortBreakLength": 10,
  "theme": "light"
}
```

### Export Data

#### Export Study Data

```http
GET /api/export
```

**Query Parameters:**
- `format` (string): Export format (`json`, `csv`)
- `type` (string): Data type (`sessions`, `subjects`, `goals`, `all`)
- `startDate` (string, optional): Start date for export
- `endDate` (string, optional): End date for export

**Response:**
For JSON format:
```json
{
  "export": {
    "metadata": {
      "exportDate": "2024-01-15T12:00:00Z",
      "format": "json",
      "type": "sessions",
      "totalRecords": 150
    },
    "data": {
      "sessions": [...],
      "subjects": [...],
      "goals": [...]
    }
  }
}
```

For CSV format:
```
Content-Type: text/csv
Content-Disposition: attachment; filename="study-sessions-2024-01-15.csv"

[CSV data...]
```

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **General endpoints**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 requests per minute per IP
- **Export endpoints**: 10 requests per hour per user

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

## Webhooks

### Session Completed

Triggered when a study session is completed.

**Payload:**
```json
{
  "event": "session.completed",
  "timestamp": "2024-01-15T10:25:00Z",
  "data": {
    "sessionId": "uuid",
    "userId": "uuid",
    "duration": 1500,
    "subject": "Mathematics",
    "type": "WORK"
  }
}
```

### Goal Achieved

Triggered when a user completes a goal.

**Payload:**
```json
{
  "event": "goal.achieved",
  "timestamp": "2024-01-15T18:00:00Z",
  "data": {
    "goalId": "uuid",
    "userId": "uuid",
    "title": "Study 2 hours daily",
    "target": 7200,
    "achieved": 7200
  }
}
```

## SDKs and Integrations

### JavaScript SDK

```javascript
import { StudyTimerAPI } from '@studytimer/sdk'

const api = new StudyTimerAPI({
  baseURL: 'https://studytimer.app/api',
  apiKey: 'your-api-key'
})

// Get sessions
const sessions = await api.sessions.list()

// Create session
const session = await api.sessions.create({
  subjectId: 'uuid',
  duration: 1500,
  type: 'WORK'
})
```

### Zapier Integration

Connect Study Timer with 2000+ apps through Zapier:
- Trigger: New session completed
- Trigger: Goal achieved
- Action: Create study session
- Action: Update goal progress

## Support

For API support and questions:
- 📧 Email: api@studytimer.app
- 📖 Documentation: [docs.studytimer.app](https://docs.studytimer.app)
- 💬 Discord: [Join our community](https://discord.gg/studytimer)