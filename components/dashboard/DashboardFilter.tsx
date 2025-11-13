'use client'

import { useTransition, useState } from 'react'
import { filterDashboards } from '@/app/actions/dashboard-demo'
import { Input } from '@/components/ui/input'
import { DashboardCard } from './DashboardCard'
import { Search } from 'lucide-react'

interface Dashboard {
  id: string
  name: string
  description: string | null
  updatedAt: Date
  layout: any[]
  isFavorite: boolean
}

export function DashboardFilter({ initialDashboards }: { initialDashboards: Dashboard[] }) {
  const [dashboards, setDashboards] = useState(initialDashboards)
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState('')
  
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    
    // UI stays responsive during filtering
    startTransition(async () => {
      const filtered = await filterDashboards(value)
      setDashboards(filtered as Dashboard[])
    })
  }
  
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search dashboards..."
          className="pl-10"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}
      </div>
      
      <div 
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${
          isPending ? 'opacity-50' : 'opacity-100'
        }`}
      >
        {dashboards.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            {searchTerm ? 'No dashboards found' : 'No dashboards yet'}
          </div>
        ) : (
          dashboards.map((dashboard) => (
            <DashboardCard key={dashboard.id} dashboard={dashboard} />
          ))
        )}
      </div>
    </div>
  )
}
