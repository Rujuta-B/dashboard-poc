# Row Level Security (RLS) Implementation

Complete guide to multi-tenant data isolation using PostgreSQL Row Level Security.

## 🔒 Overview

Row Level Security (RLS) is a PostgreSQL feature that restricts which rows can be returned by queries or modified by data manipulation commands. This implementation provides organization-level data isolation for multi-tenant SaaS applications.

### Key Benefits

- **Automatic isolation**: Database enforces data separation at the row level
- **Defense in depth**: Works even if application code has bugs
- **Performance**: Uses database indexes for efficient filtering
- **Simplicity**: No need to add WHERE clauses to every query
- **Security**: Prevents accidental data leaks between organizations

## 📁 Files Structure

```
lib/db/
├── client.ts           # Database connection with RLS context
├── rls.ts             # RLS utility functions
└── schema.ts          # Database schema

db/migrations/
└── 003_enable_rls.sql # RLS policies and helper functions
```

## 🚀 How It Works

### 1. RLS Policies (SQL)

Each table has policies that check the session variable `app.current_org_id`:

```sql
-- Enable RLS on the table
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own organization
CREATE POLICY org_isolation_policy ON organizations
  FOR ALL
  USING (id = current_setting('app.current_org_id', true)::uuid);
```

### 2. Session Variables (PostgreSQL)

Session variables store the current organization context:

```sql
-- Set the organization context
SELECT set_config('app.current_org_id', 'org-uuid-here', true);

-- Get the current organization
SELECT current_setting('app.current_org_id', true);
```

### 3. Application Integration (TypeScript)

TypeScript utilities manage the RLS context:

```typescript
// Automatically set context from Clerk auth
const db = await getDb(); // Sets RLS context automatically

// Or manually set context
await setOrgContext('org_12345');

// Execute with scoped context
await withOrgContext('org_12345', async () => {
  const dashboards = await db.query.dashboards.findMany();
  // Only returns dashboards for org_12345
});
```

## 📝 Database Schema

All multi-tenant tables include an `organization_id` column:

```typescript
// Example: dashboards table
export const dashboards = pgTable('dashboards', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').notNull(), // RLS uses this
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  // ... other columns
});
```

## 🔧 RLS Utility Functions

### `setOrgContext(organizationId: string)`

Set the organization context for the current database session.

```typescript
await setOrgContext('org_12345');
```

### `getCurrentOrgId()`

Get the current organization ID from the session.

```typescript
const currentOrg = await getCurrentOrgId(); // Returns 'org_12345' or null
```

### `clearOrgContext()`

Clear the organization context from the session.

```typescript
await clearOrgContext();
```

### `withOrgContext(orgId, operation)`

Execute an operation with a specific organization context.

```typescript
const dashboards = await withOrgContext('org_12345', async () => {
  return await db.query.dashboards.findMany();
});
```

### `setupRLSFromAuth(auth)`

Automatically set organization context from Clerk auth.

```typescript
import { auth } from '@clerk/nextjs/server';

const authResult = await auth();
await setupRLSFromAuth(authResult);
```

### `verifyRLS()`

Debug helper to check RLS status and current context.

```typescript
const status = await verifyRLS();
console.log('RLS Status:', status);
// {
//   current_org_id: 'org_12345',
//   rls_enabled: {
//     organizations: true,
//     users: true,
//     dashboards: true,
//     widgets: true,
//     data_sources: true
//   }
// }
```

## 📚 Usage Examples

### Example 1: Server Action with RLS

```typescript
'use server'

import { getDb } from '@/lib/db/client'
import { dashboards } from '@/lib/db/schema'

export async function createDashboard(name: string) {
  // getDb() automatically sets RLS context from Clerk auth
  const db = await getDb()
  
  // This insert will automatically use the current org_id
  const [dashboard] = await db.insert(dashboards).values({
    name,
    // organization_id is set automatically by RLS context
  }).returning()
  
  return dashboard
}
```

### Example 2: Manual Organization Context

```typescript
'use server'

import { db } from '@/lib/db/client'
import { withOrgContext } from '@/lib/db/rls'

export async function getDashboardsForOrg(orgId: string) {
  return await withOrgContext(orgId, async () => {
    return await db.query.dashboards.findMany()
  })
}
```

### Example 3: Multiple Organizations (Admin)

```typescript
'use server'

import { db } from '@/lib/db/client'
import { withOrgContext } from '@/lib/db/rls'

export async function getAllOrganizations() {
  // Admins can query multiple organizations
  const orgIds = ['org_1', 'org_2', 'org_3']
  
  const results = await Promise.all(
    orgIds.map(orgId => 
      withOrgContext(orgId, async () => {
        return await db.query.dashboards.findMany()
      })
    )
  )
  
  return results.flat()
}
```

### Example 4: Debugging RLS

```typescript
'use server'

import { verifyRLS, setupRLSFromAuth } from '@/lib/db/rls'
import { auth } from '@clerk/nextjs/server'

export async function debugRLS() {
  const authResult = await auth()
  await setupRLSFromAuth(authResult)
  
  const status = await verifyRLS()
  console.log('Current RLS Status:', status)
  
  return status
}
```

## 🗄️ Database Migration

Apply the RLS migration to enable policies:

```bash
# Using Drizzle migrations
npm run db:migrate

# Or apply SQL manually
psql $DATABASE_URL < db/migrations/003_enable_rls.sql
```

### Migration Contents

The migration creates:

1. **RLS Policies**: For 5 tables (organizations, users, dashboards, widgets, data_sources)
2. **Performance Indexes**: On `organization_id` and related columns
3. **Helper Functions**: `set_org_context()`, `get_current_org_id()`

## 🛡️ Security Features

### Defense in Depth

RLS works at the database level, providing security even if:
- Application code has bugs
- Developer forgets to add WHERE clause
- SQL injection vulnerability exists
- Direct database access occurs

### Performance Optimization

Indexes ensure RLS policies are fast:

```sql
-- Index for organization isolation
CREATE INDEX idx_dashboards_org_id ON dashboards(organization_id);

-- Composite index for common queries
CREATE INDEX idx_widgets_dashboard_org ON widgets(dashboard_id, organization_id);
```

### Automatic Context Management

The `getDb()` function automatically sets RLS context from Clerk:

```typescript
export async function getDb() {
  const { userId, orgId } = await auth()
  
  if (!userId || !orgId) {
    throw new Error('Unauthorized')
  }
  
  // Automatically set RLS context
  await setOrgContext(orgId)
  
  return db
}
```

## 🧪 Testing RLS

### Test 1: Verify Isolation

```typescript
import { setOrgContext } from '@/lib/db/rls'
import { db } from '@/lib/db/client'

// Create data in org1
await setOrgContext('org_1')
await db.insert(dashboards).values({ name: 'Dashboard 1' })

// Switch to org2
await setOrgContext('org_2')
const results = await db.query.dashboards.findMany()

// Should be empty (org2 can't see org1's data)
console.log(results.length) // 0
```

### Test 2: Verify Helper Functions

```typescript
import { 
  setOrgContext, 
  getCurrentOrgId, 
  clearOrgContext 
} from '@/lib/db/rls'

// Set context
await setOrgContext('org_123')

// Verify it's set
const current = await getCurrentOrgId()
console.log(current) // 'org_123'

// Clear context
await clearOrgContext()

// Verify it's cleared
const cleared = await getCurrentOrgId()
console.log(cleared) // null
```

### Test 3: Verify RLS Status

```typescript
import { verifyRLS } from '@/lib/db/rls'

const status = await verifyRLS()
console.log(status)
// {
//   current_org_id: 'org_123',
//   rls_enabled: {
//     organizations: true,
//     users: true,
//     dashboards: true,
//     widgets: true,
//     data_sources: true
//   }
// }
```

## 📊 RLS Policies Overview

### Organizations Table

- **Policy**: Users can only see their own organization
- **Scope**: All operations (SELECT, INSERT, UPDATE, DELETE)

```sql
CREATE POLICY org_isolation_policy ON organizations
  FOR ALL
  USING (id = current_setting('app.current_org_id', true)::uuid);
```

### Users Table

- **Policy**: Users can only see members of their organization
- **Scope**: All operations

```sql
CREATE POLICY org_members_policy ON users
  FOR ALL
  USING (organization_id = current_setting('app.current_org_id', true)::uuid);
```

### Dashboards Table

- **Policy**: Users can only see dashboards in their organization
- **Scope**: All operations

```sql
CREATE POLICY org_dashboards_policy ON dashboards
  FOR ALL
  USING (organization_id = current_setting('app.current_org_id', true)::uuid);
```

### Widgets Table

- **Policy**: Users can only see widgets from their organization's dashboards
- **Scope**: All operations
- **Special**: Joins with dashboards table for validation

```sql
CREATE POLICY org_widgets_policy ON widgets
  FOR ALL
  USING (
    dashboard_id IN (
      SELECT id FROM dashboards 
      WHERE organization_id = current_setting('app.current_org_id', true)::uuid
    )
  );
```

### Data Sources Table

- **Policy**: Users can only see data sources in their organization
- **Scope**: All operations

```sql
CREATE POLICY org_data_sources_policy ON data_sources
  FOR ALL
  USING (organization_id = current_setting('app.current_org_id', true)::uuid);
```

## 🚨 Important Notes

### Session Scope

Session variables are **per-connection**. With serverless databases:
- Each request gets a new connection
- Must set context at the start of each request
- Use `getDb()` which handles this automatically

### Clerk Integration

The system integrates with Clerk for authentication:
- Clerk provides `orgId` in auth context
- `getDb()` extracts orgId and sets RLS context
- Works seamlessly with Clerk's organization features

### Error Handling

If RLS context is not set:
- Queries may return empty results
- Use `verifyRLS()` to debug
- Check that `getDb()` is being called

### Performance

RLS policies use indexes for performance:
- Organization ID columns are indexed
- Composite indexes for common joins
- No significant performance overhead

## 🔗 Related Files

- **SQL Migration**: `db/migrations/003_enable_rls.sql`
- **RLS Utilities**: `lib/db/rls.ts`
- **Database Client**: `lib/db/client.ts`
- **Database Schema**: `lib/db/schema.ts`

## 📖 Additional Resources

- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Neon RLS Guide](https://neon.tech/docs/guides/row-level-security)
- [Clerk Organizations](https://clerk.com/docs/organizations/overview)
- [Drizzle ORM RLS](https://orm.drizzle.team/docs/rls)

---

**Status**: ✅ Fully Implemented  
**Tables Protected**: 5 (organizations, users, dashboards, widgets, data_sources)  
**Helper Functions**: 6 (setOrgContext, getCurrentOrgId, clearOrgContext, withOrgContext, setupRLSFromAuth, verifyRLS)  
**Performance**: Optimized with 6 indexes  
**Integration**: Automatic with Clerk auth via `getDb()`
