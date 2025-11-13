import { MetricConfig } from '@/types'

interface MetricWidgetProps {
  config: MetricConfig
}

export function MetricWidget({ config }: MetricWidgetProps) {
  // Mock data for demo
  const value = 12547
  const previousValue = 11230
  const change = ((value - previousValue) / previousValue) * 100

  const formatValue = (val: number) => {
    if (config.format === 'currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
    } else if (config.format === 'percentage') {
      return `${val.toFixed(1)}%`
    } else {
      return new Intl.NumberFormat('en-US').format(val)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          {config.label || 'Metric'}
        </h3>
        
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {formatValue(value)}
        </div>
        
        {config.previousPeriod && (
          <div className={`text-sm flex items-center justify-center gap-1 ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{change >= 0 ? '↗' : '↘'}</span>
            <span>{Math.abs(change).toFixed(1)}%</span>
            <span className="text-gray-500">vs last period</span>
          </div>
        )}
      </div>
    </div>
  )
}