import { Widget as OldWidget } from '@/types'
import { Widget as NewWidget, WidgetLayout } from '@/lib/store/builder-store'

/**
 * Convert old Widget format (with position) to new Widget format (with layout)
 */
export function convertToNewWidget(oldWidget: OldWidget): NewWidget {
  return {
    id: oldWidget.id,
    type: oldWidget.type,
    name: oldWidget.name,
    layout: {
      i: oldWidget.id,
      x: oldWidget.position.x,
      y: oldWidget.position.y,
      w: oldWidget.position.w,
      h: oldWidget.position.h
    },
    config: oldWidget.config,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

/**
 * Convert new Widget format (with layout) to old Widget format (with position)
 */
export function convertToOldWidget(newWidget: NewWidget): OldWidget {
  return {
    id: newWidget.id,
    type: newWidget.type,
    name: newWidget.name,
    position: {
      x: newWidget.layout.x,
      y: newWidget.layout.y,
      w: newWidget.layout.w,
      h: newWidget.layout.h
    },
    config: newWidget.config
  }
}

/**
 * Convert array of old widgets to new widgets
 */
export function convertWidgetsToNew(oldWidgets: OldWidget[]): NewWidget[] {
  return oldWidgets.map(convertToNewWidget)
}

/**
 * Convert array of new widgets to old widgets
 */
export function convertWidgetsToOld(newWidgets: NewWidget[]): OldWidget[] {
  return newWidgets.map(convertToOldWidget)
}
