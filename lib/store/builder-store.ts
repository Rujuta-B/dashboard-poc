import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type WidgetType = 'table' | 'chart' | 'form' | 'metric' | 'text'

export interface WidgetLayout {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
}

export interface WidgetConfig {
  // Table config
  dataSource?: string
  columns?: Array<{ key: string; label: string }>
  pagination?: { enabled: boolean; pageSize: number }
  
  // Chart config
  chartType?: 'line' | 'bar' | 'pie' | 'area'
  xAxis?: string
  yAxis?: string[]
  
  // Form config
  fields?: Array<{ name: string; type: string; label: string; required: boolean }>
  submitAction?: string
  
  // Metric config
  valueField?: string
  label?: string
  prefix?: string
  suffix?: string
  
  // Text config
  content?: string
  fontSize?: 'small' | 'medium' | 'large'
  alignment?: 'left' | 'center' | 'right'
}

export interface Widget {
  id: string
  type: WidgetType
  name: string
  layout: WidgetLayout
  config: WidgetConfig
  createdAt?: Date
  updatedAt?: Date
}

interface BuilderState {
  // State
  widgets: Widget[]
  selectedWidgetId: string | null
  isDragging: boolean
  isResizing: boolean
  dashboardId: string | null
  
  // Actions
  setDashboardId: (id: string) => void
  setWidgets: (widgets: Widget[]) => void
  addWidget: (widget: Omit<Widget, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateWidget: (id: string, updates: Partial<Widget>) => void
  updateWidgetLayout: (id: string, layout: Partial<WidgetLayout>) => void
  removeWidget: (id: string) => void
  selectWidget: (id: string | null) => void
  setIsDragging: (isDragging: boolean) => void
  setIsResizing: (isResizing: boolean) => void
  updateLayout: (layouts: WidgetLayout[]) => void
  duplicateWidget: (id: string) => void
  clearWidgets: () => void
}

export const useBuilderStore = create<BuilderState>()(
  devtools(
    (set, get) => ({
      // Initial state
      widgets: [],
      selectedWidgetId: null,
      isDragging: false,
      isResizing: false,
      dashboardId: null,

      // Set dashboard ID
      setDashboardId: (id) => set({ dashboardId: id }),

      // Set all widgets (used when loading dashboard)
      setWidgets: (widgets) => set({ widgets }),

      // Add a new widget
      addWidget: (widget) =>
        set((state) => {
          const newWidget: Widget = {
            ...widget,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
          return {
            widgets: [...state.widgets, newWidget],
            selectedWidgetId: newWidget.id
          }
        }),

      // Update widget properties
      updateWidget: (id, updates) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id 
              ? { ...w, ...updates, updatedAt: new Date() } 
              : w
          )
        })),

      // Update only widget layout
      updateWidgetLayout: (id, layout) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id
              ? { 
                  ...w, 
                  layout: { ...w.layout, ...layout },
                  updatedAt: new Date()
                }
              : w
          )
        })),

      // Remove widget
      removeWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
          selectedWidgetId: state.selectedWidgetId === id ? null : state.selectedWidgetId
        })),

      // Select widget
      selectWidget: (id) => set({ selectedWidgetId: id }),

      // Set dragging state
      setIsDragging: (isDragging) => set({ isDragging }),

      // Set resizing state
      setIsResizing: (isResizing) => set({ isResizing }),

      // Update layouts from react-grid-layout
      updateLayout: (layouts) =>
        set((state) => ({
          widgets: state.widgets.map((widget) => {
            const layoutItem = layouts.find((l) => l.i === widget.id)
            if (layoutItem) {
              return {
                ...widget,
                layout: {
                  i: layoutItem.i,
                  x: layoutItem.x,
                  y: layoutItem.y,
                  w: layoutItem.w,
                  h: layoutItem.h,
                  minW: layoutItem.minW,
                  minH: layoutItem.minH,
                  maxW: layoutItem.maxW,
                  maxH: layoutItem.maxH
                },
                updatedAt: new Date()
              }
            }
            return widget
          })
        })),

      // Duplicate widget
      duplicateWidget: (id) =>
        set((state) => {
          const widget = state.widgets.find((w) => w.id === id)
          if (!widget) return state

          const newWidget: Widget = {
            ...widget,
            id: crypto.randomUUID(),
            name: `${widget.name} (Copy)`,
            layout: {
              ...widget.layout,
              i: crypto.randomUUID(),
              x: (widget.layout.x + 2) % 12, // Offset position
              y: widget.layout.y + 1
            },
            createdAt: new Date(),
            updatedAt: new Date()
          }

          return {
            widgets: [...state.widgets, newWidget],
            selectedWidgetId: newWidget.id
          }
        }),

      // Clear all widgets
      clearWidgets: () => set({ widgets: [], selectedWidgetId: null })
    }),
    { name: 'BuilderStore' }
  )
)

// Selector hooks for optimized re-renders
export const useWidgets = () => useBuilderStore((state) => state.widgets)
export const useSelectedWidget = () => {
  const selectedId = useBuilderStore((state) => state.selectedWidgetId)
  const widgets = useBuilderStore((state) => state.widgets)
  return widgets.find((w) => w.id === selectedId) || null
}
export const useIsDragging = () => useBuilderStore((state) => state.isDragging)
export const useIsResizing = () => useBuilderStore((state) => state.isResizing)
