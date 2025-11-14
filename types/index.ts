export interface Widget {
  id: string
  type: 'table' | 'chart' | 'form' | 'metric' | 'text'
  position: { x: number; y: number; w: number; h: number }
  config: Record<string, any>
  name: string
}

export interface DashboardLayout {
  widgets: Widget[]
}

export interface TableConfig {
  dataSource: string
  columns: Array<{
    id: string
    label: string
    type: 'text' | 'number' | 'date' | 'boolean'
    sortable?: boolean
  }>
  pagination?: {
    enabled: boolean
    pageSize: number
  }
  filters?: Array<{
    column: string
    type: 'text' | 'select' | 'date'
    options?: string[]
  }>
}

export interface ChartConfig {
  dataSource: string
  chartType: 'line' | 'bar' | 'pie' | 'area'
  xAxis: string
  yAxis: string[]
  refreshInterval?: number
}

export interface FormConfig {
  fields: Array<{
    name: string
    label: string
    type: 'text' | 'number' | 'email' | 'select' | 'textarea' | 'date' | 'checkbox'
    validation?: {
      required?: boolean
      min?: number
      max?: number
      pattern?: string
    }
    options?: string[] // For select fields
  }>
  submitAction: 'api' | 'database'
  submitEndpoint?: string
}

export interface MetricConfig {
  dataSource: string
  valueField: string
  label: string
  format?: 'number' | 'currency' | 'percentage'
  previousPeriod?: boolean
  refreshInterval?: number
}

export interface BuilderState {
  selectedWidget: string | null
  draggedWidget: Widget | null
  widgets: Widget[]
  isDragging: boolean
}

export interface User {
  id: string
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  organizationId: string
  role: 'admin' | 'editor' | 'viewer'
}

export interface Organization {
  id: string
  name: string
  slug: string
}