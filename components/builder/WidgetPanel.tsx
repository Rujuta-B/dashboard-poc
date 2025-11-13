'use client'

import { useDraggable } from '@dnd-kit/core'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const WIDGET_TYPES = [
  {
    type: 'table',
    label: 'Table',
    icon: '📊',
    description: 'Display data in rows and columns'
  },
  {
    type: 'chart',
    label: 'Chart',
    icon: '📈',
    description: 'Visualize data with various chart types'
  },
  {
    type: 'form',
    label: 'Form',
    icon: '📝',
    description: 'Collect user input with forms'
  },
  {
    type: 'metric',
    label: 'Metric',
    icon: '🔢',
    description: 'Show key performance indicators'
  },
  {
    type: 'text',
    label: 'Text',
    icon: '📄',
    description: 'Add formatted text content'
  }
]

interface DraggableWidgetTypeProps {
  type: string
  label: string
  icon: string
  description: string
}

function DraggableWidgetType({ type, label, icon, description }: DraggableWidgetTypeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `widget-type-${type}`,
    data: { type }
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow border-2",
        isDragging && "opacity-50 rotate-3 scale-105"
      )}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{label}</h3>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </Card>
  )
}

export function WidgetPanel() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Widgets</h2>
        <p className="text-sm text-gray-600">Drag widgets to the canvas</p>
      </div>
      
      <div className="space-y-3">
        {WIDGET_TYPES.map(widget => (
          <DraggableWidgetType
            key={widget.type}
            type={widget.type}
            label={widget.label}
            icon={widget.icon}
            description={widget.description}
          />
        ))}
      </div>
      
      <div className="mt-8 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
            🤖 Generate with AI
          </button>
          <button className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
            📋 Templates
          </button>
          <button className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
            🔗 Data Sources
          </button>
        </div>
      </div>
    </div>
  )
}