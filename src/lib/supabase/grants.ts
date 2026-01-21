import { createClient } from './client'

export interface Grant {
  id: string
  external_id: string
  source: string
  source_url: string
  title: string
  description: string
  full_description?: string
  provider: string
  provider_type: string
  funding_amount_min: number | null
  funding_amount_max: number | null
  funding_type: string
  co_contribution_required: boolean
  co_contribution_percentage: number | null
  open_date: string | null
  close_date: string | null
  status: 'open' | 'closed' | 'coming_soon' | 'ongoing'
  is_ongoing: boolean
  category: string
  subcategory: string | null
  industries: string[]
  states: string[]
  eligibility_criteria: Record<string, unknown>
  eligibility_summary: string | null
  documents_required: string[]
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  guidelines_url: string | null
  application_form_url: string | null
  created_at: string
  updated_at: string
}

export interface GrantFilters {
  status?: string
  category?: string
  search?: string
  state?: string
  minAmount?: number
  maxAmount?: number
  sortBy?: 'close_date' | 'amount' | 'title' | 'match'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface GrantStats {
  total_grants: number
  open_grants: number
  closing_soon: number
  total_funding_available: number
  grants_by_category: Record<string, number>
  grants_by_state: Record<string, number>
}

/**
 * Fetch grants with optional filters
 */
export async function getGrants(filters: GrantFilters = {}): Promise<Grant[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('grants')
    .select('*')
    .eq('is_active', true)
  
  // Apply filters
  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  
  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  
  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,provider.ilike.%${filters.search}%`
    )
  }
  
  if (filters.state) {
    // Check if state is in the states array or grant is national
    query = query.or(`states.cs.{${filters.state}},states.cs.{national}`)
  }
  
  if (filters.minAmount) {
    query = query.gte('funding_amount_max', filters.minAmount)
  }
  
  if (filters.maxAmount) {
    query = query.lte('funding_amount_min', filters.maxAmount)
  }
  
  // Apply sorting
  const sortBy = filters.sortBy || 'close_date'
  const sortOrder = filters.sortOrder || 'asc'
  
  if (sortBy === 'close_date') {
    query = query.order('close_date', { ascending: sortOrder === 'asc', nullsFirst: false })
  } else if (sortBy === 'amount') {
    query = query.order('funding_amount_max', { ascending: sortOrder === 'asc', nullsFirst: false })
  } else if (sortBy === 'title') {
    query = query.order('title', { ascending: sortOrder === 'asc' })
  }
  
  // Apply pagination
  const limit = filters.limit || 20
  const offset = filters.offset || 0
  query = query.range(offset, offset + limit - 1)
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching grants:', error)
    throw error
  }
  
  return data || []
}

/**
 * Fetch a single grant by ID
 */
export async function getGrantById(id: string): Promise<Grant | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('grants')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    console.error('Error fetching grant:', error)
    throw error
  }
  
  return data
}

/**
 * Fetch grant statistics
 */
export async function getGrantStats(): Promise<GrantStats | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase.rpc('get_grant_stats')
  
  if (error) {
    console.error('Error fetching grant stats:', error)
    throw error
  }
  
  return data?.[0] || null
}

/**
 * Get unique categories from grants
 */
export async function getCategories(): Promise<string[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('grants')
    .select('category')
    .eq('is_active', true)
    .eq('status', 'open')
  
  if (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
  
  const categories = [...new Set(data?.map(g => g.category).filter(Boolean))]
  return categories.sort()
}

/**
 * Save a grant for the current user
 */
export async function saveGrant(grantId: string, notes?: string): Promise<void> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { error } = await supabase
    .from('saved_grants')
    .upsert({
      user_id: user.id,
      grant_id: grantId,
      notes: notes || null
    })
  
  if (error) {
    console.error('Error saving grant:', error)
    throw error
  }
}

/**
 * Remove a saved grant
 */
export async function unsaveGrant(grantId: string): Promise<void> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { error } = await supabase
    .from('saved_grants')
    .delete()
    .eq('user_id', user.id)
    .eq('grant_id', grantId)
  
  if (error) {
    console.error('Error unsaving grant:', error)
    throw error
  }
}

/**
 * Get user's saved grants
 */
export async function getSavedGrants(): Promise<Grant[]> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('saved_grants')
    .select(`
      grant_id,
      notes,
      created_at,
      grants (*)
    `)
    .eq('user_id', user.id)
  
  if (error) {
    console.error('Error fetching saved grants:', error)
    throw error
  }
  
  // @ts-ignore - Supabase types are complex
  return data?.map(sg => sg.grants).filter(Boolean) || []
}

/**
 * Check if a grant is saved by the current user
 */
export async function isGrantSaved(grantId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  const { data } = await supabase
    .from('saved_grants')
    .select('id')
    .eq('user_id', user.id)
    .eq('grant_id', grantId)
    .single()
  
  return !!data
}

/**
 * Search grants with full-text search (if configured)
 */
export async function searchGrants(query: string, limit = 20): Promise<Grant[]> {
  const supabase = createClient()
  
  // Try to use the search_grants function if available
  const { data, error } = await supabase.rpc('search_grants', {
    search_query: query,
    filter_status: 'open',
    page_limit: limit
  })
  
  if (error) {
    // Fallback to simple search
    console.warn('search_grants function not available, using fallback')
    return getGrants({ search: query, status: 'open', limit })
  }
  
  return data || []
}

/**
 * Get grants closing soon (within specified days)
 */
export async function getGrantsClosingSoon(days = 14): Promise<Grant[]> {
  const supabase = createClient()
  
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + days)
  
  const { data, error } = await supabase
    .from('grants')
    .select('*')
    .eq('is_active', true)
    .eq('status', 'open')
    .lte('close_date', futureDate.toISOString().split('T')[0])
    .gte('close_date', new Date().toISOString().split('T')[0])
    .order('close_date', { ascending: true })
  
  if (error) {
    console.error('Error fetching closing soon grants:', error)
    throw error
  }
  
  return data || []
}
