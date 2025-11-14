'use client'

import { ReactNode } from 'react'
import { Widget } from '@/lib/store/builder-store'
import { cn } from '@/lib/utils'
import { GripVertical, Trash2, Copy, Settings } from 'lucide-react'
import { useBuilderStore } from '@/lib/store/builder-store'

interface WidgetCardProps {
  widget: Widget
  isSelected: boolean
  isReadOnly: boolean
  onSelect: () => void
  onDelete: () => void
  children: ReactNode
}

export function WidgetCard({
  widget,
  isSelected,
  isReadOnly,
  onSelect,
  onDelete,
  children
}: WidgetCardProps) {
  const duplicateWidget = useBuilderStore((state) => state.duplicateWidget)

  const handleClick = (e: React.MouseEvent) => {
    // Don't select widget if clicking on interactive elements
    const target = e.target as HTMLElement
    const isInteractive = target.closest('input, select, textarea, button, a, [role="button"]')
    
    if (!isInteractive) {
      onSelect()
    }
  }

  return (
    <div
      className={cn(
        "group relative h-full w-full",
        "bg-white rounded-lg shadow-sm border border-gray-200",
        "hover:shadow-md transition-all duration-200",
        isSelected && "ring-2 ring-blue-500 shadow-lg"
      )}
      onClick={handleClick}
    >
      {/* Toolbar - Only visible on hover or when selected */}
      {!isReadOnly && (
        <div
          className={cn(
            "absolute -top-10 left-0 right-0 z-20",
            "flex items-center justify-between gap-2",
            "px-3 py-1.5 bg-white rounded-t-lg border border-gray-200 shadow-sm",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            isSelected && "opacity-100"
          )}
        >
          {/* Left side - Drag handle and name */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              className="drag-handle cursor-move p-1 hover:bg-gray-100 rounded"
              title="Drag to move"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </button>
            <span className="text-xs font-medium text-gray-700 truncate">
              {widget.name}
            </span>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                duplicateWidget(widget.id)
              }}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Duplicate widget"
            >
              <Copy className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                // TODO: Open settings modal
              }}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Widget settings"
            >
              <Settings className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="p-1.5 hover:bg-red-100 rounded transition-colors"
              title="Delete widget"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
            </button>
          </div>
        </div>
      )}

      {/* Widget Type Badge */}
      <div className="absolute top-2 right-2 z-10">
        <span className={cn(
          "px-2 py-0.5 text-xs font-medium rounded-full",
          "bg-gray-100 text-gray-700 border border-gray-200",
          "opacity-0 group-hover:opacity-100 transition-opacity"
        )}>
          {widget.type}
        </span>
      </div>

      {/* Widget Content */}
      <div className="h-full w-full overflow-hidden rounded-lg p-4">
        {children}
      </div>

      {/* Resize Handle Indicator */}
      {!isReadOnly && (
        <div className="absolute bottom-0 right-0 w-4 h-4 opacity-0 group-hover:opacity-100">
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400" />
        </div>
      )}
    </div>
  )
}
