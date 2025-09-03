"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileJson, 
  CalendarIcon,
  Database,
  BarChart3,
  Target,
  BookOpen,
  Clock
} from 'lucide-react'
import { format, subDays, subMonths, subYears } from 'date-fns'
import { exportService, ExportFormat, ExportType } from '@/lib/export/export-service'

interface ExportOption {
  id: ExportType
  name: string
  description: string
  icon: React.ReactNode
  estimatedSize: string
  formats: ExportFormat[]
}

const exportOptions: ExportOption[] = [
  {
    id: 'sessions',
    name: 'Study Sessions',
    description: 'All your study session data including duration, subjects, and notes',
    icon: <Clock className="h-5 w-5" />,
    estimatedSize: '~2-5 MB',
    formats: ['json', 'csv']
  },
  {
    id: 'subjects',
    name: 'Subjects',
    description: 'Subject information, statistics, and performance data',
    icon: <BookOpen className="h-5 w-5" />,
    estimatedSize: '~100 KB',
    formats: ['json', 'csv']
  },
  {
    id: 'goals',
    name: 'Goals & Progress',
    description: 'Your study goals, targets, and achievement history',
    icon: <Target className="h-5 w-5" />,
    estimatedSize: '~200 KB',
    formats: ['json', 'csv']
  },
  {
    id: 'analytics',
    name: 'Analytics Data',
    description: 'Detailed analytics, trends, and performance metrics',
    icon: <BarChart3 className="h-5 w-5" />,
    estimatedSize: '~1-2 MB',
    formats: ['json']
  },
  {
    id: 'complete',
    name: 'Complete Backup',
    description: 'Everything - all data, settings, and preferences',
    icon: <Database className="h-5 w-5" />,
    estimatedSize: '~5-10 MB',
    formats: ['json', 'pdf']
  }
]

const formatIcons: Record<ExportFormat, React.ReactNode> = {
  json: <FileJson className="h-4 w-4" />,
  csv: <FileSpreadsheet className="h-4 w-4" />,
  pdf: <FileText className="h-4 w-4" />
}

const formatDescriptions: Record<ExportFormat, string> = {
  json: 'Machine-readable format with full data structure',
  csv: 'Spreadsheet format, great for Excel or Google Sheets',
  pdf: 'Printable report format with charts and summaries'
}

const dateRangePresets = [
  { name: 'Last 7 days', days: 7 },
  { name: 'Last 30 days', days: 30 },
  { name: 'Last 3 months', days: 90 },
  { name: 'Last 6 months', days: 180 },
  { name: 'Last year', days: 365 },
  { name: 'All time', days: null }
]

export function DataExport() {
  const [selectedOptions, setSelectedOptions] = useState<Set<ExportType>>(new Set(['sessions']))
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json')
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: subDays(new Date(), 30),
    to: new Date()
  })
  const [showCustomDate, setShowCustomDate] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleOptionToggle = (optionId: ExportType) => {
    const newSelected = new Set(selectedOptions)
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId)
    } else {
      newSelected.add(optionId)
    }
    setSelectedOptions(newSelected)
  }

  const handleDateRangePreset = (days: number | null) => {
    if (days === null) {
      setDateRange({ from: undefined, to: new Date() })
    } else {
      setDateRange({
        from: subDays(new Date(), days),
        to: new Date()
      })
    }
  }

  const handleExport = async () => {
    if (selectedOptions.size === 0) return

    setExporting(true)
    try {
      // Mock export - in reality, this would call the export service
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (selectedOptions.has('complete')) {
        await exportService.exportAllData(selectedFormat)
      } else {
        // Export individual data types
        for (const option of selectedOptions) {
          // Mock data for demonstration
          const mockData = { 
            type: option, 
            dateRange,
            exportedAt: new Date().toISOString()
          }
          
          switch (selectedFormat) {
            case 'json':
              exportService.exportToJSON(mockData, option)
              break
            case 'csv':
              if (option === 'sessions') {
                exportService.exportSessionsToCSV([])
              } else if (option === 'subjects') {
                exportService.exportSubjectsToCSV([])
              } else if (option === 'goals') {
                exportService.exportGoalsToCSV([])
              }
              break
          }
        }
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
  }

  const availableFormats = selectedOptions.size === 1 
    ? exportOptions.find(opt => selectedOptions.has(opt.id))?.formats || []
    : ['json'] // Only JSON supports multiple data types

  const estimatedSize = Array.from(selectedOptions)
    .map(id => exportOptions.find(opt => opt.id === id)?.estimatedSize)
    .join(', ')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Export Your Data</h2>
        <p className="text-muted-foreground">
          Download your study data for backup, analysis, or migration
        </p>
      </div>

      {/* Data Selection */}
      <Card>
        <CardHeader>
          <CardTitle>What to Export</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select the data you want to include in your export
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {exportOptions.map((option) => (
            <div
              key={option.id}
              className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedOptions.has(option.id) 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:bg-muted/50'
              }`}
              onClick={() => handleOptionToggle(option.id)}
            >
              <Checkbox 
                checked={selectedOptions.has(option.id)}
                onChange={() => handleOptionToggle(option.id)}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  {option.icon}
                  <h3 className="font-medium">{option.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {option.estimatedSize}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
                <div className="flex gap-1">
                  {option.formats.map((format) => (
                    <Badge key={format} variant="secondary" className="text-xs">
                      {format.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Format Selection */}
      {selectedOptions.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Export Format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedFormat}
              onValueChange={(value: ExportFormat) => setSelectedFormat(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableFormats.map((format) => (
                  <SelectItem key={format} value={format}>
                    <div className="flex items-center gap-2">
                      {formatIcons[format]}
                      <span>{format.toUpperCase()}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="text-sm text-muted-foreground">
              {formatDescriptions[selectedFormat]}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Date Range Selection */}
      {selectedOptions.size > 0 && !selectedOptions.has('complete') && (
        <Card>
          <CardHeader>
            <CardTitle>Date Range</CardTitle>
            <p className="text-sm text-muted-foreground">
              Filter data by date range
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {dateRangePresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => handleDateRangePreset(preset.days)}
                >
                  {preset.name}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomDate(!showCustomDate)}
              >
                Custom Range
              </Button>
            </div>
            
            {showCustomDate && (
              <div className="flex gap-4 items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, 'MMM d, yyyy') : 'Start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <span>to</span>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, 'MMM d, yyyy') : 'End date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              {dateRange.from && dateRange.to && (
                <>
                  Exporting data from {format(dateRange.from, 'MMM d, yyyy')} to {format(dateRange.to, 'MMM d, yyyy')}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Summary & Actions */}
      {selectedOptions.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Export Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Data Types:</strong>
                <div className="mt-1">
                  {Array.from(selectedOptions).map(id => (
                    <Badge key={id} variant="secondary" className="mr-1 mb-1">
                      {exportOptions.find(opt => opt.id === id)?.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <strong>Format:</strong>
                <div className="mt-1 flex items-center gap-1">
                  {formatIcons[selectedFormat]}
                  <span>{selectedFormat.toUpperCase()}</span>
                </div>
              </div>
              
              <div>
                <strong>Estimated Size:</strong>
                <div className="mt-1">{estimatedSize}</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Your data will be downloaded to your device. No data is sent to external servers.
              </div>
              
              <Button
                onClick={handleExport}
                disabled={selectedOptions.size === 0 || exporting}
                size="lg"
              >
                {exporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy Notice */}
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
            <div className="text-sm">
              <strong className="text-green-800 dark:text-green-200">Privacy Protected</strong>
              <p className="text-green-700 dark:text-green-300 mt-1">
                All exports happen locally in your browser. Your data never leaves your device during the export process.
                Exported files are saved directly to your Downloads folder.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}