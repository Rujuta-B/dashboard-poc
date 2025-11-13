'use client'

import { Widget } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableWidget } from './widgets/TableWidget'
import { ChartWidget } from './widgets/ChartWidget'
import { FormWidget } from './widgets/FormWidget'
import { MetricWidget } from './widgets/MetricWidget'
import { TextWidget } from './widgets/TextWidget'

interface WidgetRendererProps {
  widget: Widget
}

export function WidgetRenderer({ widget }: WidgetRendererProps) {
  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'table':
        return <TableWidget config={widget.config} />
      case 'chart':
        return <ChartWidget config={widget.config} />
      case 'form':
        return <FormWidget config={widget.config} />
      case 'metric':
        return <MetricWidget config={widget.config} />
      case 'text':
        return <TextWidget config={widget.config} />
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Unknown widget type: {widget.type}
          </div>
        )
    }
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium truncate">
          {widget.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 h-[calc(100%-60px)]">
        {renderWidgetContent()}
      </CardContent>
    </Card>
  )
}