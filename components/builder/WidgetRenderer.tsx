'use client'

import { Widget as OldWidget } from '@/types'
import { Widget as NewWidget } from '@/lib/store/builder-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableWidget } from './widgets/TableWidget'
import { ChartWidget } from './widgets/ChartWidget'
import { FormWidget } from './widgets/FormWidget'
import { MetricWidget } from './widgets/MetricWidget'
import { TextWidget } from './widgets/TextWidget'

interface WidgetRendererProps {
  widget: OldWidget | NewWidget
}

export function WidgetRenderer({ widget }: WidgetRendererProps) {
  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'table':
        return <TableWidget config={widget.config as any} />
      case 'chart':
        return <ChartWidget config={widget.config as any} />
      case 'form':
        return <FormWidget config={widget.config as any} />
      case 'metric':
        return <MetricWidget config={widget.config as any} />
      case 'text':
        return <TextWidget config={widget.config as any} />
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Unknown widget type
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