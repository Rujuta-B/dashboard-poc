'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useBuilderStore, WidgetType, WidgetConfig } from '@/lib/store/builder-store'
import { 
  Table, 
  BarChart3, 
  FileText, 
  Activity, 
  Type,
  Plus
} from 'lucide-react'
import { useTransition } from 'react'
import { saveDashboardLayout } from '@/app/actions/dashboard-demo'

const WIDGET_TYPES = [
  {
    type: 'table' as WidgetType,
    label: 'Table',
    icon: Table,
    description: 'Display data in rows and columns',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    iconColor: 'text-blue-600',
    defaultSize: { w: 6, h: 4 }
  },
  {
    type: 'chart' as WidgetType,
    label: 'Chart',
    icon: BarChart3,
    description: 'Visualize data with various chart types',
    color: 'bg-green-50 border-green-200 hover:border-green-400',
    iconColor: 'text-green-600',
    defaultSize: { w: 6, h: 4 }
  },
  {
    type: 'form' as WidgetType,
    label: 'Form',
    icon: FileText,
    description: 'Collect user input with forms',
    color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    iconColor: 'text-purple-600',
    defaultSize: { w: 4, h: 5 }
  },
  {
    type: 'metric' as WidgetType,
    label: 'Metric',
    icon: Activity,
    description: 'Show key performance indicators',
    color: 'bg-orange-50 border-orange-200 hover:border-orange-400',
    iconColor: 'text-orange-600',
    defaultSize: { w: 3, h: 2 }
  },
  {
    type: 'text' as WidgetType,
    label: 'Text',
    icon: Type,
    description: 'Add formatted text content',
    color: 'bg-gray-50 border-gray-200 hover:border-gray-400',
    iconColor: 'text-gray-600',
    defaultSize: { w: 4, h: 3 }
  }
]

function getDefaultConfig(type: WidgetType): WidgetConfig {
  switch (type) {
    case 'table':
      return {
        dataSource: 'users',
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' }
        ],
        pagination: { enabled: true, pageSize: 10 }
      }
    case 'chart':
      return {
        chartType: 'line',
        dataSource: 'analytics',
        xAxis: 'date',
        yAxis: ['views', 'clicks']
      }
    case 'form':
      return {
        fields: [
          { name: 'name', type: 'text', label: 'Name', required: true },
          { name: 'email', type: 'email', label: 'Email', required: true }
        ],
        submitAction: 'api'
      }
    case 'metric':
      return {
        valueField: 'total',
        label: 'Total Users',
        prefix: '',
        suffix: ''
      }
    case 'text':
      return {
        content: 'Add your text here...',
        fontSize: 'medium',
        alignment: 'left'
      }
    default:
      return {}
  }
}

interface WidgetTypeCardProps {
  type: WidgetType
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  color: string
  iconColor: string
  defaultSize: { w: number; h: number }
  onAdd: () => void
}

function WidgetTypeCard({
  type,
  label,
  icon: Icon,
  description,
  color,
  iconColor,
  onAdd
}: WidgetTypeCardProps) {
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 border-2",
        color,
        "hover:shadow-md active:scale-95"
      )}
      onClick={onAdd}
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg bg-white", iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm text-gray-900">{label}</h3>
            <Plus className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
        </div>
      </div>
    </Card>
  )
}

interface WidgetPanelProps {
  dashboardId: string
}

export function GridWidgetPanel({ dashboardId }: WidgetPanelProps) {
  const [isPending, startTransition] = useTransition()
  const { widgets, addWidget } = useBuilderStore()

  const handleAddWidget = (widgetType: typeof WIDGET_TYPES[0]) => {
    // Find the lowest available Y position
    const maxY = widgets.reduce((max, w) => Math.max(max, w.layout.y + w.layout.h), 0)

    const newWidget = {
      type: widgetType.type,
      name: `New ${widgetType.label}`,
      layout: {
        i: '', // Will be set by store
        x: 0,
        y: maxY,
        w: widgetType.defaultSize.w,
        h: widgetType.defaultSize.h,
        minW: 2,
        minH: 2
      },
      config: getDefaultConfig(widgetType.type)
    }

    // Add to store (this generates ID and updates state immediately)
    addWidget(newWidget)

    // Save to server in background
    // Note: We need to get the updated widgets after addWidget completes
    startTransition(async () => {
      // Wait a tick for the store to update
      await new Promise(resolve => setTimeout(resolve, 0))
      
      // Now get fresh widgets from store which includes the new one
      const currentWidgets = useBuilderStore.getState().widgets
      await saveDashboardLayout(dashboardId, currentWidgets)
    })
  }

  return (
    <div className={cn(
      "w-72 bg-gradient-to-b from-white to-gray-50",
      "border-r border-gray-200 p-4 overflow-y-auto",
      isPending && "opacity-50 pointer-events-none"
    )}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Widget Library</h2>
        <p className="text-sm text-gray-600">
          Click to add widgets to your dashboard
        </p>
      </div>
      
      {/* Widget Categories */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Data Visualization
          </h3>
          <div className="space-y-3">
            {WIDGET_TYPES.filter(w => ['table', 'chart', 'metric'].includes(w.type)).map(widget => (
              <WidgetTypeCard
                key={widget.type}
                {...widget}
                onAdd={() => handleAddWidget(widget)}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Input & Content
          </h3>
          <div className="space-y-3">
            {WIDGET_TYPES.filter(w => ['form', 'text'].includes(w.type)).map(widget => (
              <WidgetTypeCard
                key={widget.type}
                {...widget}
                onAdd={() => handleAddWidget(widget)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Widgets on canvas</span>
          <span className="font-semibold text-gray-900">{widgets.length}</span>
        </div>
      </div>
    </div>
  )
}
