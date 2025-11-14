'use client'

import { useEffect, useCallback, useTransition, useRef } from 'react'
import GridLayout, { Layout } from 'react-grid-layout'
import { useBuilderStore, Widget } from '@/lib/store/builder-store'
import { WidgetRenderer } from './WidgetRenderer'
import { WidgetCard } from '@/components/builder/WidgetCard'
import { saveDashboardLayout } from '@/app/actions/dashboard-demo'
import { cn } from '@/lib/utils'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

interface GridBuilderCanvasProps {
  initialLayout: Widget[]
  dashboardId: string
  isReadOnly?: boolean
}

export function GridBuilderCanvas({ 
  initialLayout, 
  dashboardId, 
  isReadOnly = false 
}: GridBuilderCanvasProps) {
  const [isPending, startTransition] = useTransition()
  const initializedRef = useRef(false)
  
  const {
    widgets,
    selectedWidgetId,
    setDashboardId,
    setWidgets,
    updateLayout,
    selectWidget,
    setIsDragging,
    setIsResizing,
    removeWidget
  } = useBuilderStore()

  // Initialize store with dashboard data (only once per dashboard)
  useEffect(() => {
    if (!initializedRef.current || dashboardId !== useBuilderStore.getState().dashboardId) {
      setDashboardId(dashboardId)
      setWidgets(initialLayout)
      initializedRef.current = true
    }
  }, [dashboardId, initialLayout, setDashboardId, setWidgets])

  // Convert widgets to react-grid-layout format
  const layout: Layout[] = widgets.map((widget) => ({
    i: widget.id,
    x: widget.layout.x,
    y: widget.layout.y,
    w: widget.layout.w,
    h: widget.layout.h,
    minW: widget.layout.minW,
    minH: widget.layout.minH,
    maxW: widget.layout.maxW,
    maxH: widget.layout.maxH
  }))

  // Handle layout changes (drag/resize)
  const handleLayoutChange = useCallback((newLayout: Layout[]) => {
    // Update local state
    updateLayout(newLayout.map(l => ({
      i: l.i,
      x: l.x,
      y: l.y,
      w: l.w,
      h: l.h,
      minW: l.minW,
      minH: l.minH,
      maxW: l.maxW,
      maxH: l.maxH
    })))

    // Save to server (optimistically)
    if (!isReadOnly) {
      startTransition(async () => {
        // Get fresh widgets from store after update
        const currentWidgets = useBuilderStore.getState().widgets
        await saveDashboardLayout(dashboardId, currentWidgets)
      })
    }
  }, [dashboardId, isReadOnly, updateLayout])

  // Handle widget deletion
  const handleDeleteWidget = useCallback((id: string) => {
    removeWidget(id)
    
    // Save to server
    if (!isReadOnly) {
      startTransition(async () => {
        // Get updated widgets from store
        const currentWidgets = useBuilderStore.getState().widgets
        await saveDashboardLayout(dashboardId, currentWidgets)
      })
    }
  }, [dashboardId, isReadOnly, removeWidget])

  return (
    <div 
      className={cn(
        "relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100",
        "rounded-lg border border-gray-200 overflow-auto",
        isPending && "opacity-50 pointer-events-none"
      )}
    >
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none bg-grid-pattern"
      />

      {widgets.length === 0 ? (
        <div className="flex items-center justify-center h-full relative z-10">
          <div className="text-center text-gray-500 space-y-4">
            <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Your canvas is empty</h3>
              <p className="text-sm">Drag widgets from the panel on the left to start building</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full min-h-full p-4 pt-12">
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={60}
            width={1200}
            isDraggable={!isReadOnly}
            isResizable={!isReadOnly}
            onLayoutChange={handleLayoutChange}
            onDragStart={() => setIsDragging(true)}
            onDragStop={() => setIsDragging(false)}
            onResizeStart={() => setIsResizing(true)}
            onResizeStop={() => setIsResizing(false)}
            draggableHandle=".drag-handle"
            compactType="vertical"
            preventCollision={false}
            margin={[16, 16]}
            containerPadding={[0, 40]}
          >
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className={cn(
                  "transition-shadow",
                  selectedWidgetId === widget.id && "ring-2 ring-blue-500"
                )}
              >
                <WidgetCard
                  widget={widget}
                  isSelected={selectedWidgetId === widget.id}
                  isReadOnly={isReadOnly}
                  onSelect={() => selectWidget(widget.id)}
                  onDelete={() => handleDeleteWidget(widget.id)}
                >
                  <WidgetRenderer widget={widget} />
                </WidgetCard>
              </div>
            ))}
          </GridLayout>
        </div>
      )}
    </div>
  )
}
