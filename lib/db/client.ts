import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { auth } from '@clerk/nextjs/server'
import * as schema from './schema'
import { setOrgContext } from './rls'

// Create the database connection
const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

// Get authenticated database client with RLS context
export async function getDb() {
  const { userId, orgId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized: No user ID found')
  }

  if (!orgId) {
    throw new Error('Unauthorized: No organization ID found')
  }

  // Set RLS context for multi-tenant isolation
  await setOrgContext(orgId)
  
  return db
}

// Helper function to get current user and organization
export async function getCurrentUserAndOrg() {
  const { userId, orgId } = await auth()
  
  if (!userId || !orgId) {
    throw new Error('Unauthorized')
  }

  return { userId, orgId }
}