-- ============================================
-- KWOOKA GRANTS AGGREGATION SCHEMA
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- ============================================
-- GRANTS TABLE - Core grants data
-- ============================================
CREATE TABLE IF NOT EXISTS grants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- External identifiers
  external_id VARCHAR(100), -- GO ID from GrantConnect (e.g., "GO8190")
  source VARCHAR(50) NOT NULL, -- 'grantconnect', 'business_gov_au', 'nsw', 'vic', etc.
  source_url TEXT,
  
  -- Basic info
  title VARCHAR(500) NOT NULL,
  description TEXT,
  full_description TEXT,
  provider VARCHAR(255), -- Agency/department name
  provider_type VARCHAR(50), -- 'federal', 'state', 'local', 'private'
  
  -- Funding details
  funding_amount_min DECIMAL(15,2),
  funding_amount_max DECIMAL(15,2),
  funding_type VARCHAR(50), -- 'grant', 'rebate', 'tax_incentive', 'loan'
  co_contribution_required BOOLEAN DEFAULT false,
  co_contribution_percentage INTEGER,
  
  -- Dates
  open_date DATE,
  close_date DATE,
  outcome_date DATE,
  
  -- Status
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'closed', 'coming_soon', 'ongoing'
  is_ongoing BOOLEAN DEFAULT false,
  
  -- Categorization
  category VARCHAR(100),
  subcategory VARCHAR(100),
  industries TEXT[], -- Array of applicable industries
  business_types TEXT[], -- 'sole_trader', 'company', 'partnership', 'nonprofit'
  states TEXT[], -- Which states eligible: 'NSW', 'VIC', 'QLD', etc. or 'national'
  
  -- Eligibility
  eligibility_criteria JSONB, -- Structured eligibility data
  eligibility_summary TEXT,
  min_employees INTEGER,
  max_employees INTEGER,
  min_turnover DECIMAL(15,2),
  max_turnover DECIMAL(15,2),
  abn_required BOOLEAN DEFAULT true,
  years_in_business INTEGER,
  
  -- Documents
  documents_required TEXT[],
  application_form_url TEXT,
  guidelines_url TEXT,
  
  -- Contact
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  
  -- AI/Search
  keywords TEXT[], -- For search
  embedding VECTOR(1536), -- For semantic search (if using pgvector)
  
  -- Metadata
  last_scraped_at TIMESTAMPTZ,
  data_hash VARCHAR(64), -- To detect changes
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_grants_status ON grants(status);
CREATE INDEX IF NOT EXISTS idx_grants_close_date ON grants(close_date);
CREATE INDEX IF NOT EXISTS idx_grants_source ON grants(source);
CREATE INDEX IF NOT EXISTS idx_grants_external_id ON grants(external_id);
CREATE INDEX IF NOT EXISTS idx_grants_category ON grants(category);
CREATE INDEX IF NOT EXISTS idx_grants_states ON grants USING GIN(states);
CREATE INDEX IF NOT EXISTS idx_grants_industries ON grants USING GIN(industries);
CREATE INDEX IF NOT EXISTS idx_grants_title_trgm ON grants USING GIN(title gin_trgm_ops);

-- ============================================
-- GRANT SOURCES - Track data sources
-- ============================================
CREATE TABLE IF NOT EXISTS grant_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(255),
  base_url TEXT,
  scrape_frequency VARCHAR(50) DEFAULT 'daily', -- 'hourly', 'daily', 'weekly'
  last_successful_scrape TIMESTAMPTZ,
  last_scrape_error TEXT,
  grants_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  config JSONB, -- Source-specific configuration
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default sources
INSERT INTO grant_sources (name, display_name, base_url, scrape_frequency) VALUES
  ('grantconnect', 'GrantConnect (Federal)', 'https://www.grants.gov.au', 'daily'),
  ('business_gov_au', 'business.gov.au', 'https://business.gov.au/grants-and-programs', 'daily'),
  ('nsw_grants', 'NSW Government Grants', 'https://www.nsw.gov.au/grants-and-funding', 'daily'),
  ('vic_grants', 'Victoria Grants', 'https://www.vic.gov.au/grants', 'daily'),
  ('qld_grants', 'Queensland Grants', 'https://www.business.qld.gov.au/running-business/support-assistance/grants', 'daily'),
  ('sa_grants', 'South Australia Grants', 'https://www.sa.gov.au/topics/business-and-trade/business/grants-and-funding', 'daily'),
  ('wa_grants', 'Western Australia Grants', 'https://www.wa.gov.au/service/business-support', 'daily')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- SCRAPE LOGS - Track scraping history
-- ============================================
CREATE TABLE IF NOT EXISTS scrape_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES grant_sources(id),
  source_name VARCHAR(100),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status VARCHAR(50), -- 'running', 'success', 'partial', 'failed'
  grants_found INTEGER DEFAULT 0,
  grants_added INTEGER DEFAULT 0,
  grants_updated INTEGER DEFAULT 0,
  grants_closed INTEGER DEFAULT 0,
  error_message TEXT,
  details JSONB
);

CREATE INDEX IF NOT EXISTS idx_scrape_logs_source ON scrape_logs(source_name);
CREATE INDEX IF NOT EXISTS idx_scrape_logs_started ON scrape_logs(started_at DESC);

-- ============================================
-- USER SAVED GRANTS
-- ============================================
CREATE TABLE IF NOT EXISTS saved_grants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  grant_id UUID REFERENCES grants(id) ON DELETE CASCADE,
  notes TEXT,
  reminder_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, grant_id)
);

-- ============================================
-- GRANT APPLICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS grant_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  organisation_id UUID,
  grant_id UUID REFERENCES grants(id),
  
  -- Application status
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'in_progress', 'ready', 'submitted', 'under_review', 'approved', 'rejected'
  progress INTEGER DEFAULT 0, -- 0-100
  
  -- AI-generated content
  ai_responses JSONB, -- Store AI-generated answers
  user_edits JSONB, -- User modifications to AI content
  
  -- Submission details
  submitted_at TIMESTAMPTZ,
  submission_reference VARCHAR(255),
  funding_requested DECIMAL(15,2),
  
  -- Documents
  documents JSONB, -- [{name, url, type, uploaded_at}]
  
  -- Dates
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_edited_at TIMESTAMPTZ DEFAULT NOW(),
  deadline_reminder_sent BOOLEAN DEFAULT false,
  
  -- Outcome
  outcome VARCHAR(50), -- 'pending', 'successful', 'unsuccessful'
  outcome_date DATE,
  outcome_notes TEXT,
  funding_awarded DECIMAL(15,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_user ON grant_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON grant_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_grant ON grant_applications(grant_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trigger_grants_updated_at
  BEFORE UPDATE ON grants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_applications_updated_at
  BEFORE UPDATE ON grant_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to search grants
CREATE OR REPLACE FUNCTION search_grants(
  search_query TEXT DEFAULT NULL,
  filter_status TEXT DEFAULT 'open',
  filter_category TEXT DEFAULT NULL,
  filter_state TEXT DEFAULT NULL,
  filter_min_amount DECIMAL DEFAULT NULL,
  filter_max_amount DECIMAL DEFAULT NULL,
  sort_by TEXT DEFAULT 'close_date',
  sort_order TEXT DEFAULT 'asc',
  page_limit INTEGER DEFAULT 20,
  page_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  description TEXT,
  provider VARCHAR,
  funding_amount_min DECIMAL,
  funding_amount_max DECIMAL,
  close_date DATE,
  status VARCHAR,
  category VARCHAR,
  states TEXT[],
  source VARCHAR,
  source_url TEXT,
  total_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH filtered_grants AS (
    SELECT g.*,
           COUNT(*) OVER() as total
    FROM grants g
    WHERE g.is_active = true
      AND (filter_status IS NULL OR g.status = filter_status)
      AND (filter_category IS NULL OR g.category = filter_category)
      AND (filter_state IS NULL OR filter_state = ANY(g.states) OR 'national' = ANY(g.states))
      AND (filter_min_amount IS NULL OR g.funding_amount_max >= filter_min_amount)
      AND (filter_max_amount IS NULL OR g.funding_amount_min <= filter_max_amount)
      AND (search_query IS NULL OR 
           g.title ILIKE '%' || search_query || '%' OR
           g.description ILIKE '%' || search_query || '%' OR
           g.provider ILIKE '%' || search_query || '%')
  )
  SELECT 
    fg.id,
    fg.title,
    fg.description,
    fg.provider,
    fg.funding_amount_min,
    fg.funding_amount_max,
    fg.close_date,
    fg.status,
    fg.category,
    fg.states,
    fg.source,
    fg.source_url,
    fg.total as total_count
  FROM filtered_grants fg
  ORDER BY 
    CASE WHEN sort_by = 'close_date' AND sort_order = 'asc' THEN fg.close_date END ASC,
    CASE WHEN sort_by = 'close_date' AND sort_order = 'desc' THEN fg.close_date END DESC,
    CASE WHEN sort_by = 'amount' AND sort_order = 'asc' THEN fg.funding_amount_max END ASC,
    CASE WHEN sort_by = 'amount' AND sort_order = 'desc' THEN fg.funding_amount_max END DESC,
    CASE WHEN sort_by = 'title' THEN fg.title END ASC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql;

-- Function to get grant statistics
CREATE OR REPLACE FUNCTION get_grant_stats()
RETURNS TABLE (
  total_grants BIGINT,
  open_grants BIGINT,
  closing_soon BIGINT,
  total_funding_available DECIMAL,
  grants_by_category JSONB,
  grants_by_state JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_grants,
    COUNT(*) FILTER (WHERE status = 'open')::BIGINT as open_grants,
    COUNT(*) FILTER (WHERE status = 'open' AND close_date <= CURRENT_DATE + INTERVAL '14 days')::BIGINT as closing_soon,
    SUM(funding_amount_max) FILTER (WHERE status = 'open') as total_funding_available,
    (SELECT jsonb_object_agg(category, cnt) FROM (
      SELECT category, COUNT(*) as cnt FROM grants WHERE is_active = true GROUP BY category
    ) c) as grants_by_category,
    (SELECT jsonb_object_agg(state, cnt) FROM (
      SELECT unnest(states) as state, COUNT(*) as cnt FROM grants WHERE is_active = true GROUP BY 1
    ) s) as grants_by_state
  FROM grants
  WHERE is_active = true;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE grant_applications ENABLE ROW LEVEL SECURITY;

-- Grants are publicly readable
CREATE POLICY "Grants are viewable by everyone" ON grants
  FOR SELECT USING (is_active = true);

-- Saved grants - users can only see their own
CREATE POLICY "Users can view own saved grants" ON saved_grants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved grants" ON saved_grants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved grants" ON saved_grants
  FOR DELETE USING (auth.uid() = user_id);

-- Applications - users can only see their own
CREATE POLICY "Users can view own applications" ON grant_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON grant_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON grant_applications
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role can do everything (for n8n automation)
CREATE POLICY "Service role full access to grants" ON grants
  FOR ALL USING (auth.role() = 'service_role');
