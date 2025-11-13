# Multi-Tenant SaaS Dashboard Builder

This project is a no-code/low-code dashboard builder using React 19, Next.js 15, and modern full-stack technologies.

## Architecture
- **Frontend**: Next.js 15 (App Router + PPR), React 19 (Server Components + Actions), TypeScript
- **Styling**: Tailwind CSS 4 + Shadcn/ui
- **Database**: PostgreSQL + Drizzle ORM with Row Level Security
- **Auth**: Clerk with multi-tenant RBAC
- **Real-time**: Liveblocks for collaboration
- **Drag & Drop**: dnd-kit
- **AI**: OpenAI/Claude for form generation

## Key Features
- Visual dashboard builder with drag-and-drop
- Multi-tenant architecture with RLS
- AI-powered form generation from database schemas
- Real-time collaborative editing
- Dynamic widget system (tables, charts, forms, metrics)
- Server-side data operations with React 19 Server Actions

## Development Guidelines
- Use Server Components for initial renders, Client Components for interactivity
- Leverage Server Actions for mutations and data operations
- Implement optimistic updates with useOptimistic() hook
- Follow multi-tenant patterns with organization-scoped data
- Use TypeScript strictly with Zod validation
- Test components with Vitest and E2E with Playwright

## File Structure
- `/app` - Next.js 15 App Router pages and API routes
- `/components` - Reusable UI components
- `/lib` - Database, auth, and utility functions
- `/hooks` - Custom React hooks
- `/types` - TypeScript type definitions