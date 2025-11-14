import { Suspense } from 'react'
import { getDashboard } from '@/app/actions/dashboard-demo'
import { GridBuilderCanvas } from '@/components/builder/GridBuilderCanvas'
import { GridWidgetPanel } from '@/components/builder/GridWidgetPanel'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { convertWidgetsToNew } from '@/lib/utils/widget-converter'

interface DashboardPageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { id } = await params
  const dashboard = await getDashboard(id)
  
  // Convert old widget format to new format
  const widgets = convertWidgetsToNew(dashboard.layout || [])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboards">
              <Button variant="ghost" size="sm">← Back</Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">{dashboard.name}</h1>
              {dashboard.description && (
                <p className="text-sm text-gray-600">{dashboard.description}</p>
              )}
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
        <GridWidgetPanel dashboardId={id} />
        
        {/* Canvas */}
        <div className="flex-1 p-6">
          <Suspense fallback={
            <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
              <div className="text-gray-500">Loading canvas...</div>
            </div>
          }>
            <GridBuilderCanvas 
              initialLayout={widgets}
              dashboardId={id}
            />
          </Suspense>
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