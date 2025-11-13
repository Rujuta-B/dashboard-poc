'use client'

import { useDraggable } from '@dnd-kit/core'
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

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: 'absolute',
        left: widget.position.x * 100,
        top: widget.position.y * 100,
        width: widget.position.w * 100,
        height: widget.position.h * 100,
        zIndex: isDragging ? 1000 : 1,
      }}
      className={cn(
        "widget-container border-2 border-transparent rounded-lg bg-white shadow-sm hover:border-blue-300 transition-colors",
        isDragging && "opacity-50",
        isPending && "animate-pulse border-dashed border-blue-400",
        !isReadOnly && "cursor-move"
      )}
      {...listeners}
      {...attributes}
    >
      <div className="w-full h-full p-2">
        {children}
      </div>
      
      {!isReadOnly && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="w-6 h-6 bg-white border border-gray-300 rounded flex items-center justify-center text-xs hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation()
              // Handle edit
            }}
          >
            ✏️
          </button>
          <button 
            className="w-6 h-6 bg-white border border-gray-300 rounded flex items-center justify-center text-xs hover:bg-gray-50"
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