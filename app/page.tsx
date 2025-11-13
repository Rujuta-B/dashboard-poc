import { BuilderCanvas } from '@/components/builder/BuilderCanvas'
import { WidgetPanel } from '@/components/builder/WidgetPanel'
import { Button } from '@/components/ui/button'

// Mock dashboard data for demo
const mockDashboard = {
  id: 'demo-dashboard',
  name: 'Demo Dashboard',
  description: 'A sample dashboard to showcase the builder',
  layout: []
}

export default function DemoPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold">{mockDashboard.name}</h1>
              <p className="text-sm text-gray-600">{mockDashboard.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Preview</Button>
            <Button variant="outline" size="sm">Share</Button>
            <Button size="sm">Save</Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 pt-20">
        {/* Widget Panel */}
        <WidgetPanel />
        
        {/* Canvas */}
        <div className="flex-1 p-6">
          <BuilderCanvas 
            initialLayout={mockDashboard.layout}
            dashboardId={mockDashboard.id}
          />
        </div>
        
        {/* Properties Panel */}
        <div className="w-80 bg-white border-l border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4">Properties</h2>
          <div className="text-sm text-gray-500">
            Select a widget to edit its properties
          </div>
        </div>
      </div>
    </div>
  )
}