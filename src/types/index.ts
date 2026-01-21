/**
 * Core application types
 */

import type { User } from '@supabase/supabase-js';
import type { SectorId } from '@/config/sectors';

// Type alias for backward compatibility
export type ComplianceSector = SectorId;

// ============================================================================
// User & Profile Types
// ============================================================================

export type UserRole = 'admin' | 'manager' | 'user';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  onboarding_completed: boolean;
  sectors: SectorId[];
  primary_sector: SectorId | null;
  created_at: string;
  updated_at: string;
}

export interface AuthUser extends User {
  profile?: Profile;
}

// ============================================================================
// Document Types
// ============================================================================

export type DocumentStatus = 'pending' | 'reviewing' | 'approved' | 'rejected';

export interface Document {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  file_type: string | null;
  file_size: number | null;
  category: string;
  status: DocumentStatus;
  ai_analysis: ComplianceAnalysis | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Findings Types
// ============================================================================

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type FindingStatus = 'open' | 'in_progress' | 'resolved' | 'dismissed';

export interface Finding {
  id: string;
  document_id: string | null;
  user_id: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  status: FindingStatus;
  category: string;
  assignee_id: string | null;
  due_date: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Compliance Analysis Types
// ============================================================================

export type OverallStatus = 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT' | 'CRITICAL';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AnalysisFindingSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type AnalysisFindingStatus = 'COMPLIANT' | 'GAP' | 'PARTIAL' | 'NOT_ADDRESSED';

export interface AnalysisFinding {
  id: number;
  area: string;
  title: string;
  severity: AnalysisFindingSeverity;
  status: AnalysisFindingStatus;
  description: string;
  evidence: string | null;
  regulation: string;
  recommendation: string;
  priority: number;
}

export interface AnalysisStrength {
  area: string;
  description: string;
}

export interface ActionPlanItem {
  priority: number;
  action: string;
  timeframe: 'immediate' | '7 days' | '30 days' | '90 days';
  responsibility: string;
}

export interface ComplianceByArea {
  area: string;
  score: number;
  status: 'COMPLIANT' | 'PARTIAL' | 'GAP';
}

export interface RegulatoryReference {
  reference: string;
  description: string;
}

export interface ComplianceAnalysis {
  sector: SectorId;
  sectorName: string;
  documentType: string;
  overallScore: number;
  overallStatus: OverallStatus;
  riskLevel: RiskLevel;
  summary: string;
  findings: AnalysisFinding[];
  strengths: AnalysisStrength[];
  criticalGaps: string[];
  actionPlan: ActionPlanItem[];
  complianceByArea: ComplianceByArea[];
  regulatoryReferences: RegulatoryReference[];
  nextAuditFocus: string[];
  analyzedAt: string;
  regulatoryAuthority: string;
}

export interface StoredComplianceAnalysis {
  id: string;
  user_id: string;
  sector: SectorId;
  document_type: string;
  document_name: string;
  overall_score: number;
  overall_status: OverallStatus;
  risk_level: RiskLevel;
  summary: string;
  findings: AnalysisFinding[];
  strengths: AnalysisStrength[];
  critical_gaps: string[];
  action_plan: ActionPlanItem[];
  compliance_by_area: ComplianceByArea[];
  raw_analysis: ComplianceAnalysis;
  created_at: string;
}

// ============================================================================
// Chat Types
// ============================================================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: ChatMetadata;
}

export interface ChatMetadata {
  riskLevel?: string;
  regulationRefs?: Array<{
    id: string;
    name: string;
    section: string;
  }>;
  confidence?: number;
  citations?: Array<{
    source: string;
    section?: string;
    score?: number;
  }>;
}

// ============================================================================
// RAG / Search Types
// ============================================================================

export interface SearchResult {
  id: string;
  content: string;
  score: number;
  matchedTerms: string[];
  source: {
    title: string;
    type: string;
    sector?: string;
  };
  sectionTitle?: string;
  sectionNumber?: string;
  chunkIndex?: number;
}

export interface LegislationSource {
  id: string;
  name: string;
  source_type: string;
  sector: SectorId;
  url?: string;
  version?: string;
  effective_date?: string;
  created_at: string;
}

export interface LegislationChunk {
  id: string;
  source_id: string;
  content: string;
  section_title?: string;
  section_number?: string;
  chunk_index: number;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface ApiError {
  error: string;
  details?: string;
  code?: string;
}

export interface ApiSuccess<T> {
  data: T;
  message?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardStats {
  totalDocuments: number;
  openFindings: number;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  complianceScore: number;
  resolvedThisMonth: number;
  totalAnalyses: number;
}

export interface SectorCompliance {
  sector: string;
  sectorId: SectorId;
  score: number;
  hasData: boolean;
}

export interface ComplianceTrendPoint {
  month: string;
  score: number;
}

// ============================================================================
// Notification Types
// ============================================================================

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  link?: string;
  created_at: string;
}

// ============================================================================
// Activity Log Types
// ============================================================================

export interface ActivityLogEntry {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
