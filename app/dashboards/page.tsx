import { Suspense } from 'react'
import { getDashboards } from '@/app/actions/dashboard-demo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DashboardFilter } from '@/components/dashboard/DashboardFilter'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CreateDashboardForm } from '@/components/dashboard/CreateDashboardForm'

// Server Component - fetches data directly
async function DashboardsList() {
  const dashboards = await getDashboards()
  
  return <DashboardFilter initialDashboards={dashboards as any} />
}

export default function DashboardsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboards</h1>
          <p className="text-gray-600 mt-2">Create and manage your dashboards</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Dashboard</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Dashboard</DialogTitle>
              <DialogDescription>
                Give your dashboard a name and optional description
              </DialogDescription>
            </DialogHeader>
            <CreateDashboardForm />
          </DialogContent>
        </Dialog>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
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