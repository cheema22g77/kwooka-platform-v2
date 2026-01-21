export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      organisations: {
        Row: {
          id: string
          name: string
          abn: string | null
          industry: string | null
          state: string | null
          employee_count: string | null
          annual_revenue: string | null
          signup_source: string | null
          primary_module: string | null
          created_at: string
          updated_at: string
        }
        Insert: { id?: string; name: string; [key: string]: unknown }
        Update: { [key: string]: unknown }
      }
      users: {
        Row: {
          id: string
          organisation_id: string | null
          email: string
          full_name: string | null
          role: string
          created_at: string
        }
        Insert: { id: string; email: string; [key: string]: unknown }
        Update: { [key: string]: unknown }
      }
      plans: {
        Row: {
          id: string
          name: string
          display_name: string
          modules: Json
          price_monthly: number
          price_yearly: number
          is_active: boolean
        }
        Insert: { name: string; display_name: string; modules: Json; [key: string]: unknown }
        Update: { [key: string]: unknown }
      }
      subscriptions: {
        Row: {
          id: string
          organisation_id: string
          plan_id: string
          status: string
          module_overrides: Json
        }
        Insert: { organisation_id: string; plan_id: string; [key: string]: unknown }
        Update: { [key: string]: unknown }
      }
      grants: {
        Row: {
          id: string
          title: string
          description: string | null
          funding_amount_min: number | null
          funding_amount_max: number | null
          close_date: string | null
          status: string
          eligibility: Json
        }
        Insert: { title: string; [key: string]: unknown }
        Update: { [key: string]: unknown }
      }
    }
    Functions: {
      get_compliance_for_eligibility: { Args: { org_id: string }; Returns: Json }
      has_module_access: { Args: { org_id: string; module_name: string }; Returns: boolean }
      get_module_limits: { Args: { org_id: string; module_name: string }; Returns: Json }
    }
    Enums: Record<string, never>
  }
}

export type Organisation = Database['public']['Tables']['organisations']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Plan = Database['public']['Tables']['plans']['Row']
export type Grant = Database['public']['Tables']['grants']['Row']
export type ModuleName = 'grants' | 'compliance' | 'council'
