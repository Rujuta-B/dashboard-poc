import { pgTable, uuid, text, timestamp, jsonb, boolean, pgEnum } from 'drizzle-orm/pg-core'

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'editor', 'viewer'])
export const widgetTypeEnum = pgEnum('widget_type', ['table', 'chart', 'form', 'metric', 'text'])

// Organizations table
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  role: userRoleEnum('role').notNull().default('viewer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Dashboards table
export const dashboards = pgTable('dashboards', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  layout: jsonb('layout').$type<Widget[]>().notNull().default([]),
  isPublic: boolean('is_public').default(false).notNull(),
  isFavorite: boolean('is_favorite').default(false).notNull(),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Widgets table
export const widgets = pgTable('widgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  dashboardId: uuid('dashboard_id').references(() => dashboards.id).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  type: widgetTypeEnum('type').notNull(),
  name: text('name').notNull(),
  config: jsonb('config').$type<Record<string, any>>().notNull().default({}),
  position: jsonb('position').$type<{ x: number; y: number; w: number; h: number }>().notNull(),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Data sources table
export const dataSources = pgTable('data_sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'postgresql', 'mysql', 'api', etc.
  config: jsonb('config').$type<Record<string, any>>().notNull().default({}),
  isActive: boolean('is_active').default(true).notNull(),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Type definitions
export type Organization = typeof organizations.$inferSelect
export type NewOrganization = typeof organizations.$inferInsert

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Dashboard = typeof dashboards.$inferSelect
export type NewDashboard = typeof dashboards.$inferInsert

export type Widget = {
  id: string
  type: 'table' | 'chart' | 'form' | 'metric' | 'text'
  position: { x: number; y: number; w: number; h: number }
  config: Record<string, any>
  name: string
}

export type DataSource = typeof dataSources.$inferSelect
export type NewDataSource = typeof dataSources.$inferInsert