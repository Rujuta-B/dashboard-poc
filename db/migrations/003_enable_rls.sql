-- Row Level Security Migration
-- This migration enables RLS and creates policies for multi-tenant data isolation

-- Enable Row Level Security on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can access their own organization" ON organizations;
DROP POLICY IF EXISTS "Users can access their own user data" ON users;
DROP POLICY IF EXISTS "Users can access their org's dashboards" ON dashboards;
DROP POLICY IF EXISTS "Users can access widgets of their org's dashboards" ON widgets;
DROP POLICY IF EXISTS "Users can access their org's data sources" ON data_sources;

-- Organizations: Users can only access their own organization
CREATE POLICY "Users can access their own organization"
ON organizations FOR ALL
USING (id = current_setting('app.current_org_id', true)::uuid);

-- Users: Users can access users in their organization
CREATE POLICY "Users can access their own user data"
ON users FOR ALL
USING (organization_id = current_setting('app.current_org_id', true)::uuid);

-- Dashboards: Users can access dashboards in their organization
CREATE POLICY "Users can access their org's dashboards"
ON dashboards FOR ALL
USING (organization_id = current_setting('app.current_org_id', true)::uuid);

-- Widgets: Users can access widgets belonging to their org's dashboards
CREATE POLICY "Users can access widgets of their org's dashboards"
ON widgets FOR ALL
USING (
  dashboard_id IN (
    SELECT id FROM dashboards 
    WHERE organization_id = current_setting('app.current_org_id', true)::uuid
  )
);

-- Data Sources: Users can access data sources in their organization
CREATE POLICY "Users can access their org's data sources"
ON data_sources FOR ALL
USING (organization_id = current_setting('app.current_org_id', true)::uuid);

-- Create indexes for better performance with RLS
CREATE INDEX IF NOT EXISTS idx_users_org_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_org_id ON dashboards(organization_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_created_by ON dashboards(created_by);
CREATE INDEX IF NOT EXISTS idx_widgets_dashboard_id ON widgets(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_data_sources_org_id ON data_sources(organization_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create helper function to set organization context
CREATE OR REPLACE FUNCTION set_org_context(org_id uuid)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_org_id', org_id::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to get current organization from session
CREATE OR REPLACE FUNCTION get_current_org_id()
RETURNS uuid AS $$
BEGIN
  RETURN current_setting('app.current_org_id', true)::uuid;
END;
$$ LANGUAGE plpgsql STABLE;
