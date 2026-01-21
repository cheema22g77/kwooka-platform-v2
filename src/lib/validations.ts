/**
 * API Validation Schemas using Zod
 */

import { z } from 'zod';
import { SECTOR_IDS } from '@/config/sectors';

// ============================================================================
// Common Schemas
// ============================================================================

export const uuidSchema = z.string().uuid('Invalid UUID format');

export const sectorSchema = z.enum(SECTOR_IDS as [string, ...string[]], {
  errorMap: () => ({ message: `Invalid sector. Must be one of: ${SECTOR_IDS.join(', ')}` }),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ============================================================================
// Analyze API Schemas
// ============================================================================

export const analyzeRequestSchema = z.object({
  documentText: z
    .string()
    .min(10, 'Document text must be at least 10 characters')
    .max(100000, 'Document text must be less than 100,000 characters'),
  sector: sectorSchema,
  documentType: z.string().max(100).optional(),
  documentName: z.string().max(255).optional(),
  userId: uuidSchema.optional(),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

// ============================================================================
// Chat API Schemas
// ============================================================================

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(50000),
});

export const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(10000, 'Message must be less than 10,000 characters'),
  sector: sectorSchema.optional(),
  conversationHistory: z.array(chatMessageSchema).max(50).optional().default([]),
  useRAG: z.boolean().optional().default(true),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

// ============================================================================
// Search API Schemas
// ============================================================================

export const searchRequestSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(500, 'Search query must be less than 500 characters'),
  sector: sectorSchema.optional(),
  topK: z.coerce.number().int().min(1).max(50).optional().default(10),
  searchMethod: z.enum(['bm25', 'tfidf', 'hybrid']).optional().default('bm25'),
});

export type SearchRequest = z.infer<typeof searchRequestSchema>;

// ============================================================================
// RAG Ingest API Schemas
// ============================================================================

export const ragIngestRequestSchema = z.object({
  sourceName: z.string().min(1).max(255),
  sourceType: z.enum(['legislation', 'regulation', 'standard', 'guideline', 'policy']),
  sector: sectorSchema,
  content: z.string().min(10).max(500000),
  url: z.string().url().optional(),
  version: z.string().max(50).optional(),
  effectiveDate: z.string().datetime().optional(),
});

export type RagIngestRequest = z.infer<typeof ragIngestRequestSchema>;

// ============================================================================
// Generate Policy API Schemas
// ============================================================================

export const generatePolicyRequestSchema = z.object({
  sector: sectorSchema,
  policyType: z.string().min(1).max(100),
  companyName: z.string().min(1).max(255),
  customRequirements: z.string().max(5000).optional(),
  includeAppendices: z.boolean().optional().default(true),
});

export type GeneratePolicyRequest = z.infer<typeof generatePolicyRequestSchema>;

// ============================================================================
// Document API Schemas
// ============================================================================

export const createDocumentSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  category: z.string().min(1).max(100),
  fileUrl: z.string().url().optional(),
  fileType: z.string().max(50).optional(),
  fileSize: z.number().int().positive().optional(),
});

export type CreateDocumentRequest = z.infer<typeof createDocumentSchema>;

export const updateDocumentSchema = createDocumentSchema.partial().extend({
  status: z.enum(['pending', 'reviewing', 'approved', 'rejected']).optional(),
});

export type UpdateDocumentRequest = z.infer<typeof updateDocumentSchema>;

// ============================================================================
// Findings API Schemas
// ============================================================================

export const createFindingSchema = z.object({
  documentId: uuidSchema.optional(),
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(5000),
  severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
  category: z.string().min(1).max(100),
  assigneeId: uuidSchema.optional(),
  dueDate: z.string().datetime().optional(),
});

export type CreateFindingRequest = z.infer<typeof createFindingSchema>;

export const updateFindingSchema = createFindingSchema.partial().extend({
  status: z.enum(['open', 'in_progress', 'resolved', 'dismissed']).optional(),
});

export type UpdateFindingRequest = z.infer<typeof updateFindingSchema>;

// ============================================================================
// Admin Legislation API Schemas
// ============================================================================

export const legislationSchema = z.object({
  name: z.string().min(1).max(255),
  sourceType: z.enum(['legislation', 'regulation', 'standard', 'guideline']),
  sector: sectorSchema,
  url: z.string().url().optional(),
  version: z.string().max(50).optional(),
  effectiveDate: z.string().datetime().optional(),
  content: z.string().min(10),
});

export type LegislationRequest = z.infer<typeof legislationSchema>;

// ============================================================================
// Onboarding API Schemas
// ============================================================================

export const onboardingRequestSchema = z.object({
  companyName: z.string().min(1).max(255),
  sectors: z.array(sectorSchema).min(1, 'Select at least one sector'),
  primarySector: sectorSchema,
  employeeCount: z.enum(['1-10', '11-50', '51-200', '201-500', '500+']).optional(),
  currentChallenges: z.array(z.string().max(200)).max(10).optional(),
});

export type OnboardingRequest = z.infer<typeof onboardingRequestSchema>;

// ============================================================================
// Export Report API Schemas
// ============================================================================

export const exportReportRequestSchema = z.object({
  analysisId: uuidSchema.optional(),
  analysis: z.any().optional(), // Full analysis object
  format: z.enum(['pdf', 'docx', 'json']).optional().default('pdf'),
  includeRecommendations: z.boolean().optional().default(true),
  includeActionPlan: z.boolean().optional().default(true),
});

export type ExportReportRequest = z.infer<typeof exportReportRequestSchema>;

// ============================================================================
// Validation Helper
// ============================================================================

export interface ValidationResult<T> {
  success: true;
  data: T;
}

export interface ValidationError {
  success: false;
  error: string;
  details: z.ZodError['flatten'];
}

export type ValidationResponse<T> = ValidationResult<T> | ValidationError;

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResponse<T> {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    error: 'Validation failed',
    details: result.error.flatten(),
  };
}
