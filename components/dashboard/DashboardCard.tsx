'use client'

import { useOptimistic, useTransition } from 'react'
import { toggleFavorite } from '@/app/actions/dashboard-demo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Star } from 'lucide-react'
import Link from 'next/link'

interface Dashboard {
  id: string
  name: string
  description: string | null
  updatedAt: Date
  layout: any[]
  isFavorite: boolean
}

export function DashboardCard({ dashboard }: { dashboard: Dashboard }) {
  const [isPending, startTransition] = useTransition()
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(
    dashboard.isFavorite,
    (state) => !state
  )

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation()
    
    startTransition(async () => {
      setOptimisticFavorite(!optimisticFavorite)
      await toggleFavorite(dashboard.id)
    })
  }

  return (
    <Link href={`/dashboard/${dashboard.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer relative group">
        <button
          onClick={handleToggleFavorite}
          className="absolute top-4 right-4 z-10 transition-opacity"
          disabled={isPending}
          aria-label={optimisticFavorite ? "Remove from favorites" : "Add to favorites"}
          title={optimisticFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star
            className={`h-5 w-5 transition-all ${
              optimisticFavorite
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 group-hover:text-gray-400'
            } ${isPending ? 'opacity-50' : ''}`}
          />
        </button>
        
        <CardHeader className="pr-12">
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
  )
}
