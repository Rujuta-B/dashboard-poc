'use server'

import { getDb, getCurrentUserAndOrg } from '@/lib/db/client'
import { dashboards, widgets as widgetsTable } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { Widget } from '@/types'

export async function saveDashboardLayout(
  dashboardId: string,
  layout: Widget[]
) {
  try {
    const db = await getDb()
    const { orgId } = await getCurrentUserAndOrg()
    
    // Update dashboard layout
    await db
      .update(dashboards)
      .set({ 
        layout,
        updatedAt: new Date() 
      })
      .where(
        and(
          eq(dashboards.id, dashboardId),
          eq(dashboards.organizationId, orgId)
        )
      )
    
    revalidatePath(`/dashboard/${dashboardId}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to save dashboard layout:', error)
    return { success: false, error: 'Failed to save dashboard layout' }
  }
}

export async function createDashboard(name: string, description?: string) {
  try {
    const db = await getDb()
    const { userId, orgId } = await getCurrentUserAndOrg()
    
    const [dashboard] = await db
      .insert(dashboards)
      .values({
        name,
        description,
        organizationId: orgId,
        createdBy: userId,
        layout: []
      })
      .returning()
    
    revalidatePath('/dashboards')
    return { success: true, dashboard }
  } catch (error) {
    console.error('Failed to create dashboard:', error)
    return { success: false, error: 'Failed to create dashboard' }
  }
}

export async function getDashboard(dashboardId: string) {
  try {
    const db = await getDb()
    const { orgId } = await getCurrentUserAndOrg()
    
    const [dashboard] = await db
      .select()
      .from(dashboards)
      .where(
        and(
          eq(dashboards.id, dashboardId),
          eq(dashboards.organizationId, orgId)
        )
      )
      .limit(1)
    
    if (!dashboard) {
      throw new Error('Dashboard not found')
    }
    
    return dashboard
  } catch (error) {
    console.error('Failed to get dashboard:', error)
    throw error
  }
}

export async function getDashboards() {
  try {
    const db = await getDb()
    const { orgId } = await getCurrentUserAndOrg()
    
    const dashboardList = await db
      .select()
      .from(dashboards)
      .where(eq(dashboards.organizationId, orgId))
      .orderBy(dashboards.updatedAt)
    
    return dashboardList
  } catch (error) {
    console.error('Failed to get dashboards:', error)
    return []
  }
}

export async function deleteDashboard(dashboardId: string) {
  try {
    const db = await getDb()
    const { orgId } = await getCurrentUserAndOrg()
    
    await db
      .delete(dashboards)
      .where(
        and(
          eq(dashboards.id, dashboardId),
          eq(dashboards.organizationId, orgId)
        )
      )
    
    revalidatePath('/dashboards')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete dashboard:', error)
    return { success: false, error: 'Failed to delete dashboard' }
  }
}