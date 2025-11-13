'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Widget } from '@/types'

// Mock database for demo purposes
const mockDB = {
  dashboards: [
    {
      id: 'demo-1',
      name: 'Sales Dashboard',
      description: 'Track sales metrics and KPIs',
      organizationId: 'demo-org',
      createdBy: 'demo-user',
      layout: [] as Widget[],
      isPublic: true,
      isFavorite: false,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: 'demo-2',
      name: 'Analytics Overview',
      description: 'Website analytics and user behavior',
      organizationId: 'demo-org',
      createdBy: 'demo-user',
      layout: [] as Widget[],
      isPublic: true,
      isFavorite: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
    },
    {
      id: 'demo-3',
      name: 'Marketing Metrics',
      description: 'Campaign performance and ROI',
      organizationId: 'demo-org',
      createdBy: 'demo-user',
      layout: [] as Widget[],
      isPublic: true,
      isFavorite: false,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-15'),
    },
  ]
}

export async function saveDashboardLayout(
  dashboardId: string,
  layout: Widget[]
) {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const dashboard = mockDB.dashboards.find(d => d.id === dashboardId)
    if (dashboard) {
      dashboard.layout = layout
      dashboard.updatedAt = new Date()
    }
    
    revalidatePath(`/dashboard/${dashboardId}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to save dashboard layout:', error)
    return { success: false, error: 'Failed to save dashboard layout' }
  }
}

export async function createDashboard(name: string, description?: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const newDashboard = {
      id: `demo-${Date.now()}`,
      name,
      description: description || null,
      organizationId: 'demo-org',
      createdBy: 'demo-user',
      layout: [],
      isPublic: true,
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    mockDB.dashboards.push(newDashboard as any)
    
    revalidatePath('/dashboards')
    return { success: true, dashboard: newDashboard }
  } catch (error) {
    console.error('Failed to create dashboard:', error)
    return { success: false, error: 'Failed to create dashboard' }
  }
}

export async function getDashboard(dashboardId: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const dashboard = mockDB.dashboards.find(d => d.id === dashboardId)
    
    if (!dashboard) {
      // Return a default demo dashboard
      return {
        id: dashboardId,
        name: 'Demo Dashboard',
        description: 'Drag widgets from the panel to build your dashboard',
        organizationId: 'demo-org',
        createdBy: 'demo-user',
        layout: [],
        isPublic: true,
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
    
    return dashboard
  } catch (error) {
    console.error('Failed to get dashboard:', error)
    throw error
  }
}

export async function getDashboards() {
  try {
    await new Promise(resolve => setTimeout(resolve, 50))
    return mockDB.dashboards
  } catch (error) {
    console.error('Failed to get dashboards:', error)
    return []
  }
}

export async function deleteDashboard(dashboardId: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const index = mockDB.dashboards.findIndex(d => d.id === dashboardId)
    if (index !== -1) {
      mockDB.dashboards.splice(index, 1)
    }
    
    revalidatePath('/dashboards')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete dashboard:', error)
    return { success: false, error: 'Failed to delete dashboard' }
  }
}

export async function updateDashboard(
  dashboardId: string,
  data: { name?: string; description?: string }
) {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const dashboard = mockDB.dashboards.find(d => d.id === dashboardId)
    if (dashboard) {
      if (data.name) dashboard.name = data.name
      if (data.description !== undefined) dashboard.description = data.description
      dashboard.updatedAt = new Date()
    }
    
    revalidatePath(`/dashboard/${dashboardId}`)
    revalidatePath('/dashboards')
    return { success: true }
  } catch (error) {
    console.error('Failed to update dashboard:', error)
    return { success: false, error: 'Failed to update dashboard' }
  }
}

export async function duplicateDashboard(dashboardId: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 150))
    
    const original = mockDB.dashboards.find(d => d.id === dashboardId)
    if (!original) {
      return { success: false, error: 'Dashboard not found' }
    }
    
    const duplicated = {
      ...original,
      id: `demo-${Date.now()}`,
      name: `${original.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    mockDB.dashboards.push(duplicated)
    
    revalidatePath('/dashboards')
    return { success: true, dashboard: duplicated }
  } catch (error) {
    console.error('Failed to duplicate dashboard:', error)
    return { success: false, error: 'Failed to duplicate dashboard' }
  }
}

export async function toggleFavorite(dashboardId: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const dashboard = mockDB.dashboards.find(d => d.id === dashboardId)
    if (!dashboard) {
      return { success: false, error: 'Dashboard not found' }
    }
    
    dashboard.isFavorite = !dashboard.isFavorite
    dashboard.updatedAt = new Date()
    
    revalidatePath('/dashboards')
    return { success: true, isFavorite: dashboard.isFavorite }
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
    return { success: false, error: 'Failed to toggle favorite' }
  }
}

export async function filterDashboards(searchTerm: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    if (!searchTerm) return mockDB.dashboards
    
    return mockDB.dashboards.filter(d => 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  } catch (error) {
    console.error('Failed to filter dashboards:', error)
    return []
  }
}
