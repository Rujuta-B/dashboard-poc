# RLS Setup and Usage Guide

Quick start guide for using Row Level Security in your dashboard builder.

## ✅ Quick Setup

### 1. Apply the Migration

```bash
# Using Drizzle
npm run db:migrate

# Or manually with psql
psql $DATABASE_URL < db/migrations/003_enable_rls.sql
```

### 2. Verify RLS is Enabled

```typescript
import { verifyRLS } from '@/lib/db/rls'

const status = await verifyRLS()
console.log(status)
```

Expected output:
```json
{
  "current_org_id": "org_xxx",
  "rls_enabled": {
    "organizations": true,
    "users": true,
    "dashboards": true,
    "widgets": true,
    "data_sources": true
  }
}
```

## 🎯 Usage Patterns

### Pattern 1: Server Actions (Recommended)

Use `getDb()` which automatically sets RLS context from Clerk:

```typescript
'use server'

import { getDb } from '@/lib/db/client'
import { dashboards } from '@/lib/db/schema'

export async function createDashboard(name: string) {
  const db = await getDb() // Auto-sets RLS context
  
  const [dashboard] = await db
    .insert(dashboards)
    .values({ name })
    .returning()
  
  return dashboard
}
```

### Pattern 2: API Routes

Set RLS context at the start of the route:

```typescript
import { auth } from '@clerk/nextjs/server'
import { setOrgContext } from '@/lib/db/rls'
import { db } from '@/lib/db/client'

export async function GET() {
  const { orgId } = await auth()
  
  if (!orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  await setOrgContext(orgId)
  
  const dashboards = await db.query.dashboards.findMany()
  
  return Response.json(dashboards)
}
```

### Pattern 3: Scoped Execution

Execute operations with specific organization context:

```typescript
import { withOrgContext } from '@/lib/db/rls'
import { db } from '@/lib/db/client'

// Query dashboards for specific organization
const dashboards = await withOrgContext('org_123', async () => {
  return await db.query.dashboards.findMany()
})
```

### Pattern 4: Server Components

Use `getDb()` in Server Components:

```tsx
import { getDb } from '@/lib/db/client'

export default async function DashboardsPage() {
  const db = await getDb()
  const dashboards = await db.query.dashboards.findMany()
  
  return (
    <div>
      {dashboards.map(d => (
        <div key={d.id}>{d.name}</div>
      ))}
    </div>
  )
}
```

## 🔍 Common Scenarios

### Scenario 1: Creating Data

```typescript
'use server'

import { getDb } from '@/lib/db/client'
import { dashboards } from '@/lib/db/schema'

export async function createDashboard(data: { name: string }) {
  const db = await getDb() // Sets org context automatically
  
  // organization_id is automatically set by RLS
  const [dashboard] = await db
    .insert(dashboards)
    .values(data)
    .returning()
  
  return dashboard
}
```

### Scenario 2: Querying Data

```typescript
'use server'

import { getDb } from '@/lib/db/client'

export async function getDashboards() {
  const db = await getDb() // Sets org context automatically
  
  // Only returns dashboards for the current organization
  const dashboards = await db.query.dashboards.findMany({
    with: {
      widgets: true
    }
  })
  
  return dashboards
}
```

### Scenario 3: Updating Data

```typescript
'use server'

import { getDb } from '@/lib/db/client'
import { dashboards } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function updateDashboard(
  id: string, 
  data: { name: string }
) {
  const db = await getDb() // Sets org context automatically
  
  // Can only update dashboards in the current organization
  const [updated] = await db
    .update(dashboards)
    .set(data)
    .where(eq(dashboards.id, id))
    .returning()
  
  return updated
}
```

### Scenario 4: Deleting Data

```typescript
'use server'

import { getDb } from '@/lib/db/client'
import { dashboards } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function deleteDashboard(id: string) {
  const db = await getDb() // Sets org context automatically
  
  // Can only delete dashboards in the current organization
  await db
    .delete(dashboards)
    .where(eq(dashboards.id, id))
  
  return { success: true }
}
```

## 🐛 Debugging

### Check Current Organization

```typescript
import { getCurrentOrgId } from '@/lib/db/rls'

const orgId = await getCurrentOrgId()
console.log('Current Org:', orgId)
```

### Verify RLS Status

```typescript
import { verifyRLS } from '@/lib/db/rls'

const status = await verifyRLS()
console.log('RLS Status:', status)
```

### Manual Context Setting

```typescript
import { setOrgContext, getCurrentOrgId } from '@/lib/db/rls'

// Set context
await setOrgContext('org_123')

// Verify
const current = await getCurrentOrgId()
console.log('Set to:', current) // 'org_123'
```

## ⚠️ Common Issues

### Issue 1: Empty Query Results

**Problem**: Queries return empty even though data exists.

**Solution**: Ensure RLS context is set before querying.

```typescript
// ❌ Wrong - no context set
const dashboards = await db.query.dashboards.findMany()

// ✅ Correct - use getDb()
const db = await getDb()
const dashboards = await db.query.dashboards.findMany()
```

### Issue 2: Context Not Persisting

**Problem**: RLS context seems to reset between queries.

**Solution**: With serverless, each request is a new connection. Set context at the start of each request.

```typescript
// ✅ Set context once per request
const db = await getDb() // Sets context

// Now all queries use this context
const dashboards = await db.query.dashboards.findMany()
const widgets = await db.query.widgets.findMany()
```

### Issue 3: Multi-Tenant Queries

**Problem**: Need to query data from multiple organizations.

**Solution**: Use `withOrgContext()` for each organization.

```typescript
const orgs = ['org_1', 'org_2', 'org_3']

const results = await Promise.all(
  orgs.map(orgId => 
    withOrgContext(orgId, async () => {
      return await db.query.dashboards.findMany()
    })
  )
)
```

## 🧪 Testing

### Test RLS Isolation

```typescript
import { setOrgContext, clearOrgContext } from '@/lib/db/rls'
import { db } from '@/lib/db/client'
import { dashboards } from '@/lib/db/schema'

// Create data in org1
await setOrgContext('org_1')
await db.insert(dashboards).values({ name: 'Org 1 Dashboard' })

// Switch to org2
await setOrgContext('org_2')
const org2Dashboards = await db.query.dashboards.findMany()

// Should not see org1's data
console.log(org2Dashboards.length) // 0

// Cleanup
await clearOrgContext()
```

### Test Helper Functions

```typescript
import { 
  setOrgContext, 
  getCurrentOrgId, 
  clearOrgContext 
} from '@/lib/db/rls'

// Test set/get
await setOrgContext('org_123')
const current = await getCurrentOrgId()
console.assert(current === 'org_123')

// Test clear
await clearOrgContext()
const cleared = await getCurrentOrgId()
console.assert(cleared === null)
```

## 📝 Best Practices

### ✅ DO

- Use `getDb()` for automatic context management
- Set RLS context at the start of each request
- Use `withOrgContext()` for scoped operations
- Test with multiple organizations
- Use `verifyRLS()` for debugging

### ❌ DON'T

- Don't use raw `db` instance in Server Actions (use `getDb()`)
- Don't assume context persists across requests
- Don't bypass RLS for convenience
- Don't mix organization data in the same query
- Don't forget to apply the migration

## 🔗 Next Steps

1. **Apply Migration**: Run `npm run db:migrate`
2. **Test RLS**: Use `verifyRLS()` to confirm it's working
3. **Update Actions**: Replace `db` with `await getDb()`
4. **Test Isolation**: Create data in different organizations
5. **Monitor**: Use `verifyRLS()` in production for debugging

## 📚 Documentation

- [Full Implementation Guide](./RLS_IMPLEMENTATION.md)
- [Database Schema](../lib/db/schema.ts)
- [RLS Utilities](../lib/db/rls.ts)
- [Migration SQL](../db/migrations/003_enable_rls.sql)

---

**Quick Reference**: Always use `const db = await getDb()` in Server Actions for automatic RLS!
