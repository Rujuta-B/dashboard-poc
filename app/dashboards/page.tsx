import { Suspense } from 'react'
import { getDashboards } from '@/app/actions/dashboard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

async function DashboardsList() {
  const dashboards = await getDashboards()

  if (dashboards.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No dashboards yet</h3>
        <p className="text-gray-500 mb-4">Create your first dashboard to get started</p>
        <Link href="/dashboards/new">
          <Button>Create Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dashboards.map((dashboard) => (
        <Link key={dashboard.id} href={`/dashboard/${dashboard.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">{dashboard.name}</CardTitle>
              {dashboard.description && (
                <CardDescription>{dashboard.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                <p>Updated {new Date(dashboard.updatedAt).toLocaleDateString()}</p>
                <p>{dashboard.layout?.length || 0} widgets</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default function DashboardsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboards</h1>
          <p className="text-gray-600 mt-2">Create and manage your dashboards</p>
        </div>
        <Link href="/dashboards/new">
          <Button>Create Dashboard</Button>
        </Link>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      }>
        <DashboardsList />
      </Suspense>
    </div>
  )
}