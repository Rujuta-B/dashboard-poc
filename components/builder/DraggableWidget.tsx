'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Widget } from '@/types'
import { cn } from '@/lib/utils'

interface DraggableWidgetProps {
  widget: Widget
  children: React.ReactNode
  isReadOnly?: boolean
  isPending?: boolean
}

export function DraggableWidget({ 
  widget, 
  children, 
  isReadOnly = false,
  isPending = false 
}: DraggableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: widget.id,
    disabled: isReadOnly,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    position: 'absolute' as const,
    left: widget.position.x * 80, // Reduced from 100 to 80 for better grid
    top: widget.position.y * 80,
    width: widget.position.w * 80,
    height: widget.position.h * 80,
    zIndex: isDragging ? 1000 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "widget-container border-2 border-transparent rounded-lg bg-white shadow-sm hover:border-blue-300 transition-all duration-200 group",
        isDragging && "opacity-50 rotate-1 scale-105",
        isPending && "animate-pulse border-dashed border-blue-400",
        !isReadOnly && "cursor-move hover:shadow-md"
      )}
      {...listeners}
      {...attributes}
    >
      <div className="w-full h-full p-2 overflow-hidden">
        {children}
      </div>
      
      {!isReadOnly && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="w-6 h-6 bg-white border border-gray-300 rounded flex items-center justify-center text-xs hover:bg-gray-50 shadow-sm"
            onClick={(e) => {
              e.stopPropagation()
              // Handle edit
            }}
          >
            ✏️
          </button>
          <button 
            className="w-6 h-6 bg-white border border-gray-300 rounded flex items-center justify-center text-xs hover:bg-gray-50 shadow-sm"
            onClick={(e) => {
              e.stopPropagation()
              // Handle delete
            }}
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  )
}