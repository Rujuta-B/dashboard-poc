import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getDashboards } from '@/app/actions/dashboard-demo'
import { DataTableWidget } from '@/components/widgets/DataTableWidget'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Server Component - fetches data directly
async function ServerComponentDemo() {
  const dashboards = await getDashboards()
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        This component fetches data directly on the server. No loading state needed!
      </p>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="font-mono text-sm">Found {dashboards.length} dashboards</p>
        <p className="text-xs text-gray-500 mt-2">
          Fetched server-side with zero client JavaScript
        </p>
      </div>
    </div>
  )
}

// Generate sample data for table demo
const generateSampleData = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    category: ['Electronics', 'Clothing', 'Food', 'Books'][i % 4],
    price: `$${(Math.random() * 100).toFixed(2)}`,
    stock: Math.floor(Math.random() * 100),
    status: ['In Stock', 'Low Stock', 'Out of Stock'][i % 3],
  }))
}

export default function React19FeaturesPage() {
  const sampleData = generateSampleData()
  
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <Link 
        href="/dashboards" 
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboards
      </Link>
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">React 19 Features Demo</h1>
        <p className="text-lg text-gray-600">
          Exploring the latest React 19 capabilities in action
        </p>
      </div>

      <Tabs defaultValue="server-components" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="server-components">Server Components</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="hooks">Hooks</TabsTrigger>
          <TabsTrigger value="optimistic">Optimistic UI</TabsTrigger>
        </TabsList>

        <TabsContent value="server-components" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🖥️ Server Components</CardTitle>
              <CardDescription>
                Components that run on the server with direct database access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              }>
                <ServerComponentDemo />
              </Suspense>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Benefits:</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Zero client JavaScript for data fetching</li>
                  <li>Direct database access (no API routes)</li>
                  <li>Better SEO and initial page load</li>
                  <li>Automatic code splitting</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>⚡ Server Actions</CardTitle>
              <CardDescription>
                Form submissions and mutations without API routes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Server Actions are used throughout this app for CRUD operations:
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">createDashboard()</h4>
                    <p className="text-xs text-green-800">
                      Creates dashboards with automatic cache revalidation
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2">updateDashboard()</h4>
                    <p className="text-xs text-purple-800">
                      Updates dashboard settings with type safety
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-2">saveDashboardLayout()</h4>
                    <p className="text-xs text-orange-800">
                      Saves widget positions after drag-and-drop
                    </p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2">deleteDashboard()</h4>
                    <p className="text-xs text-red-800">
                      Removes dashboards with RLS protection
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Benefits:</h4>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>No API routes needed</li>
                    <li>Built-in CSRF protection</li>
                    <li>Type-safe with TypeScript</li>
                    <li>Automatic error handling</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🎯 React 19 Hooks</CardTitle>
              <CardDescription>
                New hooks for better UX and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">useFormStatus</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Used in SubmitButton component for automatic loading states
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                    {'const { pending } = useFormStatus()'}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">useActionState</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Used in CreateDashboardForm for form state management
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                    {'const [state, action, pending] = useActionState(...)'}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">useTransition</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Used in DashboardFilter for non-blocking search
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                    {'startTransition(() => { /* heavy work */ })'}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">useDeferredValue</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Try the table search below - input stays responsive!
                  </p>
                  <DataTableWidget data={sampleData} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimistic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>✨ useOptimistic Hook</CardTitle>
              <CardDescription>
                Instant UI updates with automatic rollback on errors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Used in two key places in this app:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      🎨 Drag & Drop Builder
                    </h4>
                    <p className="text-sm text-blue-800 mb-3">
                      Widgets appear instantly when dropped on the canvas
                    </p>
                    <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                      <li>Immediate visual feedback</li>
                      <li>Server saves in background</li>
                      <li>Auto-rollback if save fails</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-900 mb-2">
                      ⭐ Favorite Dashboards
                    </h4>
                    <p className="text-sm text-yellow-800 mb-3">
                      Star icon updates instantly when clicked
                    </p>
                    <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
                      <li>No waiting for server response</li>
                      <li>Feels like native app</li>
                      <li>Perfect for quick interactions</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Benefits:</h4>
                  <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                    <li>Zero perceived latency</li>
                    <li>Automatic error recovery</li>
                    <li>Better user experience</li>
                    <li>Simple API - no complex state management</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
        <CardHeader>
          <CardTitle>🚀 Try It Yourself</CardTitle>
          <CardDescription>
            Experience these features live in the dashboard builder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Link 
              href="/dashboards" 
              className="block p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold mb-1">Dashboard List</h4>
              <p className="text-sm text-gray-600">
                See Server Components, useTransition filter, and useOptimistic favorites
              </p>
            </Link>
            
            <Link 
              href="/dashboard/sample" 
              className="block p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold mb-1">Builder Canvas</h4>
              <p className="text-sm text-gray-600">
                Experience useOptimistic drag-and-drop with instant feedback
              </p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
