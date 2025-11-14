# RLS Quick Reference Card

## 🚀 Quick Start

```bash
# 1. Apply migration
npm run db:migrate

# 2. Use in Server Actions
import { getDb } from '@/lib/db/client'
const db = await getDb() // Auto-sets RLS context
```

## 📝 Common Patterns

### Pattern 1: Query Data
```typescript
'use server'
import { getDb } from '@/lib/db/client'

export async function getDashboards() {
  const db = await getDb()
  return await db.query.dashboards.findMany()
}
```

### Pattern 2: Create Data
```typescript
'use server'
import { getDb } from '@/lib/db/client'
import { dashboards } from '@/lib/db/schema'

export async function createDashboard(name: string) {
  const db = await getDb()
  return await db.insert(dashboards).values({ name }).returning()
}
```

### Pattern 3: Update Data
```typescript
'use server'
import { getDb } from '@/lib/db/client'
import { dashboards } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function updateDashboard(id: string, name: string) {
  const db = await getDb()
  return await db.update(dashboards).set({ name }).where(eq(dashboards.id, id))
}
```

### Pattern 4: Scoped Execution
```typescript
import { withOrgContext } from '@/lib/db/rls'
import { db } from '@/lib/db/client'

const data = await withOrgContext('org_123', async () => {
  return await db.query.dashboards.findMany()
})
```

## 🐛 Debugging

```typescript
import { verifyRLS, getCurrentOrgId } from '@/lib/db/rls'

// Check current org
const orgId = await getCurrentOrgId()
console.log('Current Org:', orgId)

// Verify RLS status
const status = await verifyRLS()
console.log('RLS Status:', status)
```

## 🔧 Utility Functions

| Function | Purpose |
|----------|---------|
| `getDb()` | Get DB with auto RLS context ⭐ Recommended |
| `setOrgContext(orgId)` | Manually set org context |
| `getCurrentOrgId()` | Get current org ID |
| `clearOrgContext()` | Clear org context |
| `withOrgContext(orgId, fn)` | Execute with scoped context |
| `setupRLSFromAuth(auth)` | Setup from Clerk auth |
| `verifyRLS()` | Debug RLS status |

## ✅ Best Practices

### DO ✅
- Use `getDb()` for automatic context
- Set context at start of request
- Use `withOrgContext()` for scoped ops
- Test with multiple orgs

### DON'T ❌
- Don't use raw `db` in Server Actions
- Don't assume context persists
- Don't bypass RLS for convenience
- Don't mix org data

## 📊 Protected Tables

- ✅ `organizations` - Own org only
- ✅ `users` - Org members only
- ✅ `dashboards` - Org dashboards only
- ✅ `widgets` - Org dashboard widgets only
- ✅ `data_sources` - Org data sources only

## 📚 Full Documentation

- [Complete Guide](docs/RLS_IMPLEMENTATION.md)
- [Usage Guide](docs/RLS_USAGE_GUIDE.md)
- [Implementation Summary](RLS_COMPLETE.md)

---

**Remember:** Always use `const db = await getDb()` in Server Actions! 🎯
