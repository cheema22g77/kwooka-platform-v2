# Kwooka Grants Aggregation Setup Guide

## Overview

This system automatically scrapes Australian grants from multiple sources and stores them in Supabase for the Kwooka platform.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA SOURCES                              │
├─────────────────────────────────────────────────────────────┤
│  • GrantConnect (grants.gov.au) - Federal grants            │
│  • business.gov.au - Federal programs & incentives          │
│  • State portals (NSW, VIC, QLD, SA, WA)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      n8n WORKFLOWS                          │
├─────────────────────────────────────────────────────────────┤
│  • Scheduled scrapers (every 6-24 hours)                   │
│  • HTML parsing & data extraction                           │
│  • Deduplication & upsert logic                            │
│  • Error handling & logging                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     SUPABASE                                │
├─────────────────────────────────────────────────────────────┤
│  • grants table - All scraped grants                        │
│  • grant_sources - Track data sources                       │
│  • scrape_logs - Audit trail                               │
│  • saved_grants - User bookmarks                           │
│  • grant_applications - User applications                   │
└─────────────────────────────────────────────────────────────┘
```

## Setup Steps

### 1. Supabase Setup

#### 1.1 Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project (or use existing Kwooka project)
3. Note your project URL and service role key

#### 1.2 Run Schema Migration
1. Go to SQL Editor in Supabase dashboard
2. Copy contents of `supabase/schema.sql`
3. Run the SQL to create all tables and functions

#### 1.3 Enable pgvector (Optional - for AI search)
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. n8n Setup

#### 2.1 Install n8n
```bash
# Option A: Docker (Recommended)
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Option B: npm
npm install n8n -g
n8n start

# Option C: n8n Cloud
# Sign up at https://n8n.io
```

#### 2.2 Configure Supabase Credentials in n8n
1. Open n8n (http://localhost:5678)
2. Go to Credentials → Add Credential → Supabase
3. Enter:
   - **Host**: your-project.supabase.co
   - **Service Role Key**: (from Supabase dashboard → Settings → API)

#### 2.3 Import Workflows
1. In n8n, go to Workflows → Import from File
2. Import each workflow from `n8n/workflows/`:
   - `grantconnect-scraper.json`
   - `grantconnect-web-scraper.json`
   - `business-gov-au-scraper.json`

3. Update credentials in each workflow:
   - Click on Supabase nodes
   - Select your Supabase credential

#### 2.4 Activate Workflows
1. Open each workflow
2. Toggle "Active" switch in top-right
3. Workflows will now run on schedule

### 3. Test the System

#### 3.1 Manual Test Run
1. Open a workflow in n8n
2. Click "Execute Workflow"
3. Check Supabase → Table Editor → grants

#### 3.2 Verify Data
```sql
-- Check grant counts by source
SELECT source, COUNT(*) 
FROM grants 
GROUP BY source;

-- Check recent scrapes
SELECT * FROM scrape_logs 
ORDER BY started_at DESC 
LIMIT 10;

-- Check open grants
SELECT title, provider, close_date 
FROM grants 
WHERE status = 'open' 
ORDER BY close_date ASC 
LIMIT 20;
```

### 4. Frontend Integration

Update your Next.js app to fetch from Supabase:

```typescript
// src/lib/supabase/grants.ts
import { createClient } from './client'

export async function getGrants(filters?: {
  status?: string
  category?: string
  search?: string
  state?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('grants')
    .select('*')
    .eq('is_active', true)
  
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  
  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }
  
  if (filters?.state) {
    query = query.contains('states', [filters.state])
  }
  
  query = query
    .order('close_date', { ascending: true })
    .limit(filters?.limit || 20)
    .range(filters?.offset || 0, (filters?.offset || 0) + (filters?.limit || 20) - 1)
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

export async function getGrantById(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('grants')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function getGrantStats() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('get_grant_stats')
  
  if (error) throw error
  return data
}
```

### 5. Monitoring & Maintenance

#### 5.1 Check Scrape Status
- View `scrape_logs` table for history
- Set up alerts for failed scrapes

#### 5.2 Handle Closed Grants
```sql
-- Mark grants as closed if past close date
UPDATE grants 
SET status = 'closed' 
WHERE close_date < CURRENT_DATE 
  AND status = 'open';
```

#### 5.3 Data Quality
- Review grants with missing data
- Check for duplicates across sources
- Validate funding amounts

## Troubleshooting

### Common Issues

**n8n can't connect to Supabase**
- Check service role key (not anon key)
- Ensure project URL is correct (without trailing slash)

**No grants being scraped**
- Check if source website structure changed
- Review n8n execution logs
- Test HTTP requests manually

**Duplicate grants**
- The upsert uses `external_id` + `source` as unique key
- Cross-source duplicates need manual merging

## Data Sources Reference

| Source | URL | Update Frequency | Notes |
|--------|-----|------------------|-------|
| GrantConnect | grants.gov.au | Every 6 hours | Federal grants only |
| business.gov.au | business.gov.au | Daily | Programs & incentives |
| NSW | nsw.gov.au | Daily | State-specific |
| VIC | vic.gov.au | Daily | State-specific |
| QLD | qld.gov.au | Daily | State-specific |

## Next Steps

1. ✅ Set up Supabase schema
2. ✅ Configure n8n workflows
3. ⬜ Add state-specific scrapers
4. ⬜ Implement AI-powered grant matching
5. ⬜ Build AI writing assistant
6. ⬜ Add automated submission tracking
