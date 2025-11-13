import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { auth } from '@clerk/nextjs/server'
import * as schema from './schema'

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

  // For now, return the regular db instance
  // In production, you would set RLS context here
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