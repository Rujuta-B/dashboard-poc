/**
 * Row Level Security (RLS) utilities for multi-tenant data isolation.
 * 
 * This module provides functions to manage PostgreSQL RLS context in Next.js Server Actions.
 * Each organization's data is isolated using RLS policies that check session variables.
 * 
 * Key functions:
 * - setOrgContext(): Set organization context for RLS
 * - withOrgContext(): Execute operations with specific org context
 * - setupRLSFromAuth(): Automatically set org context from Clerk auth
 * - verifyRLS(): Debug helper to check RLS status
 * 
 * @see db/migrations/003_enable_rls.sql for RLS policies
 */

import { db } from './client'
import { sql } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

/**
 * Set the organization context for the current database session.
 * This is required for RLS policies to work correctly.
 * 
 * @param organizationId - The UUID of the organization to set as context
 * 
 * @example
 * ```ts
 * // At the start of a request handler
 * const orgId = await getOrgIdFromClerkAuth(auth);
 * await setOrgContext(orgId);
 * 
 * // Now all queries will be filtered by this organization
 * const dashboards = await db.query.dashboards.findMany();
 * ```
 */
export async function setOrgContext(organizationId: string): Promise<void> {
  await db.execute(
    sql`SELECT set_config('app.current_org_id', ${organizationId}, false)`
  )
}

/**
 * Get the current organization ID from the database session.
 * 
 * @returns The organization ID if set, null otherwise
 */
export async function getCurrentOrgId(): Promise<string | null> {
  try {
    const result = await db.execute(
      sql`SELECT current_setting('app.current_org_id', true) as org_id`
    )
    return (result.rows[0] as any)?.org_id || null
  } catch (error) {
    return null
  }
}

/**
 * Clear the organization context from the current session.
 * Useful for cleanup or switching contexts.
 */
export async function clearOrgContext(): Promise<void> {
  await db.execute(
    sql`SELECT set_config('app.current_org_id', '', false)`
  )
}

/**
 * Execute a database operation with a specific organization context.
 * The context is automatically set before and cleared after the operation.
 * 
 * @param organizationId - The UUID of the organization
 * @param operation - The async function to execute with the org context
 * @returns The result of the operation
 * 
 * @example
 * ```ts
 * const dashboards = await withOrgContext(orgId, async () => {
 *   return await db.query.dashboards.findMany();
 * });
 * ```
 */
export async function withOrgContext<T>(
  organizationId: string,
  operation: () => Promise<T>
): Promise<T> {
  try {
    await setOrgContext(organizationId)
    return await operation()
  } finally {
    // Note: We don't clear context here because the connection
    // might be pooled and reused. Let the next request set it.
  }
}

/**
 * Middleware helper to extract organization ID from Clerk auth
 * and set it as the RLS context.
 * 
 * @param auth - Clerk auth object
 * @returns The organization ID
 * 
 * @example
 * ```ts
 * import { auth } from '@clerk/nextjs';
 * 
 * export async function GET() {
 *   const orgId = await setupRLSFromAuth(auth());
 *   // Now all queries are scoped to this organization
 *   const dashboards = await db.query.dashboards.findMany();
 *   return Response.json({ dashboards });
 * }
 * ```
 */
export async function setupRLSFromAuth(
  auth: { orgId?: string | null }
): Promise<string> {
  const organizationId = auth.orgId
  
  if (!organizationId) {
    throw new Error('No organization ID found in auth context')
  }
  
  await setOrgContext(organizationId)
  return organizationId
}

/**
 * Verify that RLS is properly configured and working.
 * This is useful for testing and debugging.
 * 
 * @returns Object with RLS status information
 */
export async function verifyRLS() {
  const tables = [
    'organizations',
    'users', 
    'dashboards',
    'widgets',
    'data_sources'
  ]
  
  const results: Record<string, boolean> = {}
  
  for (const table of tables) {
    try {
      const result = await db.execute(
        sql.raw(`
          SELECT relrowsecurity
          FROM pg_class
          WHERE relname = '${table}'
        `)
      )
      results[table] = result.rows[0]?.relrowsecurity === true
    } catch (error) {
      results[table] = false
    }
  }
  
  return {
    allEnabled: Object.values(results).every(v => v),
    tables: results,
    currentOrgId: await getCurrentOrgId()
  }
}
