import { format } from 'date-fns'

export interface ExportData {
  sessions: any[]
  subjects: any[]
  goals: any[]
  analytics: any[]
  user: {
    id: string
    username?: string
    preferences?: any
  }
}

export type ExportFormat = 'json' | 'csv' | 'pdf'
export type ExportType = 'sessions' | 'subjects' | 'goals' | 'analytics' | 'complete'

class ExportService {
  private downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  private generateTimestamp(): string {
    return format(new Date(), 'yyyy-MM-dd_HH-mm-ss')
  }

  // Export to JSON
  exportToJSON(data: any, type: ExportType): void {
    const timestamp = this.generateTimestamp()
    const filename = `study-timer-${type}-${timestamp}.json`
    
    const exportData = {
      exportedAt: new Date().toISOString(),
      exportType: type,
      version: '1.0',
      data: data
    }
    
    this.downloadFile(
      JSON.stringify(exportData, null, 2),
      filename,
      'application/json'
    )
  }

  // Export sessions to CSV
  exportSessionsToCSV(sessions: any[]): void {
    const timestamp = this.generateTimestamp()
    const filename = `study-timer-sessions-${timestamp}.csv`
    
    // CSV headers
    const headers = [
      'Date',
      'Start Time',
      'End Time',
      'Duration (minutes)',
      'Session Type',
      'Subject',
      'Completed',
      'Notes'
    ]
    
    // Convert sessions to CSV rows
    const rows = sessions.map(session => [
      format(new Date(session.startTime), 'yyyy-MM-dd'),
      format(new Date(session.startTime), 'HH:mm:ss'),
      session.endTime ? format(new Date(session.endTime), 'HH:mm:ss') : '',
      session.duration ? Math.round(session.duration / 60) : '',
      session.type,
      session.subject?.name || 'General',
      session.completed ? 'Yes' : 'No',
      session.notes || ''
    ])
    
    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')
    
    this.downloadFile(csvContent, filename, 'text/csv')
  }

  // Export subjects to CSV
  exportSubjectsToCSV(subjects: any[]): void {
    const timestamp = this.generateTimestamp()
    const filename = `study-timer-subjects-${timestamp}.csv`
    
    const headers = [
      'Subject Name',
      'Color',
      'Icon',
      'Created Date',
      'Total Sessions',
      'Total Minutes',
      'Completion Rate (%)',
      'Archived'
    ]
    
    const rows = subjects.map(subject => [
      subject.name,
      subject.color,
      subject.icon,
      format(new Date(subject.createdAt), 'yyyy-MM-dd'),
      subject.stats?.totalSessions || 0,
      subject.stats?.totalMinutes || 0,
      subject.stats?.completionRate || 0,
      subject.archived ? 'Yes' : 'No'
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')
    
    this.downloadFile(csvContent, filename, 'text/csv')
  }

  // Export goals to CSV
  exportGoalsToCSV(goals: any[]): void {
    const timestamp = this.generateTimestamp()
    const filename = `study-timer-goals-${timestamp}.csv`
    
    const headers = [
      'Goal Title',
      'Type',
      'Subject',
      'Target Minutes',
      'Achieved Minutes',
      'Progress (%)',
      'Start Date',
      'End Date',
      'Completed',
      'Description'
    ]
    
    const rows = goals.map(goal => [
      goal.title,
      goal.type,
      goal.subject?.name || 'All Subjects',
      goal.targetMinutes,
      goal.achievedMinutes || 0,
      goal.progress || 0,
      format(new Date(goal.startDate), 'yyyy-MM-dd'),
      format(new Date(goal.endDate), 'yyyy-MM-dd'),
      goal.completed ? 'Yes' : 'No',
      goal.description || ''
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')
    
    this.downloadFile(csvContent, filename, 'text/csv')
  }

  // Export analytics summary
  exportAnalyticsToJSON(analytics: any): void {
    const timestamp = this.generateTimestamp()
    const filename = `study-timer-analytics-${timestamp}.json`
    
    const exportData = {
      exportedAt: new Date().toISOString(),
      exportType: 'analytics',
      version: '1.0',
      data: {
        summary: analytics.summary,
        subjects: analytics.subjects,
        trends: analytics.trends,
        achievements: analytics.achievements
      }
    }
    
    this.downloadFile(
      JSON.stringify(exportData, null, 2),
      filename,
      'application/json'
    )
  }

  // Generate PDF report (simplified version)
  generatePDFReport(data: ExportData): void {
    // This would typically use a library like jsPDF or Puppeteer
    // For now, we'll create a comprehensive HTML report that can be printed as PDF
    const timestamp = this.generateTimestamp()
    
    const htmlContent = this.generateHTMLReport(data)
    
    // Open in new window for printing
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  private generateHTMLReport(data: ExportData): string {
    const now = new Date()
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Study Timer Report - ${format(now, 'MMMM yyyy')}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 30px; page-break-inside: avoid; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
        .stat-card { border: 1px solid #ddd; padding: 15px; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
        .chart-placeholder { height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; }
        @media print { body { margin: 10px; } .section { page-break-inside: avoid; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>Study Timer Analytics Report</h1>
        <p>Generated on ${format(now, 'MMMM d, yyyy')} at ${format(now, 'h:mm a')}</p>
        <p>User: ${data.user.username || 'Study Timer User'}</p>
    </div>

    <div class="section">
        <h2>Summary Statistics</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Study Time</h3>
                <p>${Math.round(data.sessions?.reduce((total, session) => total + (session.duration || 0), 0) / 60 || 0)} hours</p>
            </div>
            <div class="stat-card">
                <h3>Sessions Completed</h3>
                <p>${data.sessions?.filter(s => s.completed).length || 0}</p>
            </div>
            <div class="stat-card">
                <h3>Active Subjects</h3>
                <p>${data.subjects?.filter(s => !s.archived).length || 0}</p>
            </div>
            <div class="stat-card">
                <h3>Goals Achieved</h3>
                <p>${data.goals?.filter(g => g.completed).length || 0}</p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Subject Performance</h2>
        <table>
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Sessions</th>
                    <th>Total Time</th>
                    <th>Completion Rate</th>
                </tr>
            </thead>
            <tbody>
                ${data.subjects?.map(subject => `
                    <tr>
                        <td>${subject.icon} ${subject.name}</td>
                        <td>${subject.stats?.totalSessions || 0}</td>
                        <td>${Math.round((subject.stats?.totalMinutes || 0) / 60 * 10) / 10}h</td>
                        <td>${subject.stats?.completionRate || 0}%</td>
                    </tr>
                `).join('') || '<tr><td colspan="4">No subjects found</td></tr>'}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Recent Goals</h2>
        <table>
            <thead>
                <tr>
                    <th>Goal</th>
                    <th>Type</th>
                    <th>Progress</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${data.goals?.slice(0, 10).map(goal => `
                    <tr>
                        <td>${goal.title}</td>
                        <td>${goal.type}</td>
                        <td>${goal.progress || 0}%</td>
                        <td>${goal.completed ? 'Completed' : 'In Progress'}</td>
                    </tr>
                `).join('') || '<tr><td colspan="4">No goals found</td></tr>'}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Recent Sessions</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Duration</th>
                    <th>Type</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${data.sessions?.slice(0, 20).map(session => `
                    <tr>
                        <td>${format(new Date(session.startTime), 'MMM d, yyyy')}</td>
                        <td>${session.subject?.name || 'General'}</td>
                        <td>${Math.round((session.duration || 0) / 60)}m</td>
                        <td>${session.type}</td>
                        <td>${session.completed ? 'Completed' : 'Incomplete'}</td>
                    </tr>
                `).join('') || '<tr><td colspan="5">No sessions found</td></tr>'}
            </tbody>
        </table>
    </div>

    <div class="section">
        <p style="text-align: center; color: #666; font-size: 12px;">
            Generated by Study Timer - Focus & Productivity Tracker
        </p>
    </div>
</body>
</html>
    `
  }

  // Complete data export with multiple formats
  async exportAllData(format: ExportFormat = 'json'): Promise<void> {
    try {
      // This would fetch all user data from APIs
      const data: ExportData = {
        sessions: [], // Fetch from /api/sessions
        subjects: [], // Fetch from /api/subjects
        goals: [], // Fetch from /api/goals
        analytics: [], // Fetch from /api/analytics
        user: {
          id: 'user-id',
          username: 'user'
        }
      }

      switch (format) {
        case 'json':
          this.exportToJSON(data, 'complete')
          break
        case 'csv':
          // Export multiple CSV files
          this.exportSessionsToCSV(data.sessions)
          this.exportSubjectsToCSV(data.subjects)
          this.exportGoalsToCSV(data.goals)
          break
        case 'pdf':
          this.generatePDFReport(data)
          break
      }
    } catch (error) {
      console.error('Export failed:', error)
      throw new Error('Failed to export data')
    }
  }
}

export const exportService = new ExportService()