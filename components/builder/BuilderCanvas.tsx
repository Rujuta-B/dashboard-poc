'use client'

import { useOptimistic, useState, useTransition } from 'react'
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, useDroppable } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { Widget } from '@/types'
import { WidgetRenderer } from './WidgetRenderer'
import { DraggableWidget } from './DraggableWidget'
import { saveDashboardLayout } from '@/app/actions/dashboard-demo'
import { cn } from '@/lib/utils'

interface BuilderCanvasProps {
  initialLayout: Widget[]
  dashboardId: string
  isReadOnly?: boolean
}

type WidgetType = 'table' | 'chart' | 'form' | 'metric' | 'text'

export function BuilderCanvas({ 
  initialLayout, 
  dashboardId, 
  isReadOnly = false 
}: BuilderCanvasProps) {
  const [draggedWidget, setDraggedWidget] = useState<Widget | null>(null)
  const [isPending, startTransition] = useTransition()
  
  // Use React 19's useOptimistic for instant UI updates
  const [optimisticLayout, setOptimisticLayout] = useOptimistic(
    initialLayout,
    (state, newWidget: Widget) => [...state, newWidget]
  )

  // Make the canvas a droppable area
  const { setNodeRef: setCanvasRef, isOver } = useDroppable({
    id: 'canvas-droppable'
  })

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    
    if (active.data.current?.type) {
      // Creating new widget from panel
      const newWidget: Widget = {
        id: `temp-${Date.now()}`,
        type: active.data.current.type as WidgetType,
        name: `New ${active.data.current.type}`,
        position: { x: 0, y: 0, w: 4, h: 3 },
        config: getDefaultConfig(active.data.current.type)
      }
      setDraggedWidget(newWidget)
    } else {
      // Moving existing widget
      const widget = optimisticLayout.find(w => w.id === active.id as string)
      if (widget) {
        setDraggedWidget(widget)
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over, delta } = event
    
    if (!over || isReadOnly) {
      setDraggedWidget(null)
      return
    }

    if (active.data.current?.type) {
      // Adding new widget from panel
      // Use over.rect to get drop position relative to canvas
      const canvasRect = over.rect
      // Default widget size in px
      const widgetW = 320, widgetH = 240
      // Place widget at drop position (top-left corner)
      const x = Math.max(0, Math.floor((canvasRect.left - over.rect.left) / widgetW))
      const y = Math.max(0, Math.floor((canvasRect.top - over.rect.top) / widgetH))
      const newWidget: Widget = {
        id: crypto.randomUUID(),
        type: active.data.current.type as WidgetType,
        name: `New ${active.data.current.type}`,
        position: { x, y, w: 4, h: 3 },
        config: getDefaultConfig(active.data.current.type)
      }
      setOptimisticLayout(newWidget)
      startTransition(async () => {
        await saveDashboardLayout(dashboardId, [...optimisticLayout, newWidget])
      })
    } else {
      // Moving existing widget
      const updatedLayout = optimisticLayout.map(widget => {
        if (widget.id === active.id) {
          return {
            ...widget,
            position: {
              ...widget.position,
              x: Math.max(0, widget.position.x + Math.floor((delta?.x ?? 0) / 80)),
              y: Math.max(0, widget.position.y + Math.floor((delta?.y ?? 0) / 80))
            }
          }
        }
        return widget
      })
      startTransition(async () => {
        await saveDashboardLayout(dashboardId, updatedLayout)
      })
    }
    setDraggedWidget(null)
  }

  function getDefaultConfig(type: string): Record<string, any> {
    switch (type) {
      case 'table':
        return {
          dataSource: '',
          columns: [],
          pagination: { enabled: true, pageSize: 10 }
        }
      case 'chart':
        return {
          chartType: 'line',
          dataSource: '',
          xAxis: '',
          yAxis: []
        }
      case 'form':
        return {
          fields: [],
          submitAction: 'api'
        }
      case 'metric':
        return {
          dataSource: '',
          valueField: '',
          label: 'Metric'
        }
      case 'text':
        return {
          content: 'Add your text here...',
          fontSize: 'medium'
        }
      default:
        return {}
    }
  }

  return (
    <DndContext 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <div 
        ref={setCanvasRef}
        className={cn(
          "canvas relative w-full h-full bg-gray-50 border-2 rounded-lg overflow-auto",
          "border-dashed border-gray-200",
          isOver && "border-blue-400 bg-blue-50",
          isPending && "opacity-50 pointer-events-none"
        )}
      >
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{
               backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }} 
        />
        
        {optimisticLayout.length === 0 ? (
          <div className="flex items-center justify-center h-full relative z-10">
            <div className="text-center text-gray-500">
              <h3 className="text-lg font-medium mb-2">Your canvas is empty</h3>
              <p className="text-sm">Drag widgets from the panel to get started</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full p-4 z-10">
            {optimisticLayout.map(widget => (
              <DraggableWidget
                key={widget.id}
                widget={widget}
                isReadOnly={isReadOnly}
                isPending={widget.id.startsWith('temp-')}
              >
                <WidgetRenderer widget={widget} />
              </DraggableWidget>
            ))}
          </div>
        )}
      </div>
      
      <DragOverlay>
        {draggedWidget && (
          <div className="opacity-80 transform rotate-2">
            <WidgetRenderer widget={draggedWidget} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}