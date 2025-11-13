'use server'

import { Widget } from '@/types'
import { revalidatePath } from 'next/cache'

// Mock storage - in production this would be in a database
let mockLayout: Widget[] = []

export async function saveDashboardLayout(
  dashboardId: string,
  layout: Widget[]
) {
  try {
    // Simulate server delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Store in mock storage
    mockLayout = layout
    
    revalidatePath(`/dashboard/${dashboardId}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to save dashboard layout:', error)
    return { success: false, error: 'Failed to save dashboard layout' }
  }
}

export async function getDashboardLayout(dashboardId: string): Promise<Widget[]> {
  try {
    // Simulate server delay
    await new Promise(resolve => setTimeout(resolve, 50))
    
    return mockLayout
  } catch (error) {
    console.error('Failed to get dashboard layout:', error)
    return []
  }
}