/**
 * AI Configuration
 * Uses consolidated sector configuration
 */

import { SECTORS, type SectorId } from '@/config/sectors';

export const AI_CONFIG = {
  model: 'claude-sonnet-4-20250514',
  maxTokens: 4096,
  temperature: 0.3,
} as const;

/**
 * Build system prompt for compliance copilot
 */
export function buildSystemPrompt(sector?: string): string {
  const basePrompt = `You are the Kwooka Compliance Copilot, an expert AI assistant specialising in Australian regulatory compliance. You work for Kwooka Health Services Ltd, an Aboriginal-owned enterprise (Supply Nation certified) based in Western Australia.

CORE PRINCIPLES:
1. **Accuracy First**: Only provide information you're confident about. If uncertain, say so and recommend consulting the relevant authority.
2. **Australian Focus**: All advice relates to Australian (particularly WA) legislation and regulations.
3. **Practical Guidance**: Provide actionable, step-by-step guidance that compliance officers can implement immediately.
4. **Citation**: Always reference specific legislation, regulations, or standards when making compliance statements.
5. **Risk-Based**: Categorise issues by risk level (Critical, High, Medium, Low) to help prioritise.

RESPONSE FORMAT:
- Use clear headings and bullet points for readability
- Include relevant regulation references (e.g., "HVNL Section 26C")
- Provide specific deadlines where applicable
- Suggest next steps or actions
- When discussing findings, include severity ratings

EXPERTISE AREAS:
- NDIS Provider Compliance & Practice Standards
- Heavy Vehicle National Law (HVNL) & Chain of Responsibility
- Workplace Health & Safety (WHS)
- Healthcare & Clinical Governance
- Aged Care Quality Standards
- Fair Work & Employment Compliance`;

  if (sector && sector in SECTORS) {
    const sectorConfig = SECTORS[sector as SectorId];
    return `${basePrompt}

CURRENT FOCUS: ${sectorConfig.name}

KEY REGULATIONS:
${sectorConfig.regulations.map(r => `- ${r}`).join('\n')}

REGULATORY AUTHORITIES:
${sectorConfig.authorities.map(a => `- ${a}`).join('\n')}

KEY COMPLIANCE REQUIREMENTS:
${sectorConfig.keyRequirements.map(r => `- ${r}`).join('\n')}`;
  }

  return basePrompt;
}

/**
 * Suggested prompts by sector
 */
export const SUGGESTED_PROMPTS: Record<string, string[]> = {
  general: [
    "What compliance obligations apply to my business?",
    "Help me understand Chain of Responsibility",
    "What are the NDIS Practice Standards?",
    "How do I report a workplace incident?",
  ],
  transport: [
    "Explain driver fatigue management requirements",
    "What are my CoR obligations as a consignor?",
    "How do I maintain NHVAS accreditation?",
    "What records must I keep for work diaries?",
  ],
  healthcare: [
    "What clinical governance requirements apply?",
    "How do I manage medication compliance?",
    "Explain infection control standards",
    "What patient safety incidents must be reported?",
  ],
  ndis: [
    "What are the NDIS Practice Standards?",
    "Explain worker screening requirements",
    "What are reportable incidents under NDIS?",
    "How do I manage restrictive practices?",
  ],
  aged_care: [
    "Explain the 8 Aged Care Quality Standards",
    "What incidents must be reported to SIRS?",
    "What are the care minute requirements?",
    "How do I manage restraint compliance?",
  ],
  workplace: [
    "What are PCBU duties under WHS?",
    "How do I conduct a risk assessment?",
    "What incidents must be notified to WorkSafe?",
    "Explain psychosocial hazard requirements",
  ],
  construction: [
    "When do I need a SWMS?",
    "What are principal contractor obligations?",
    "Explain high risk work licensing",
    "What asbestos requirements apply?",
  ],
};

/**
 * Quick actions for the copilot
 */
export const QUICK_ACTIONS = [
  { 
    id: 'risk-assessment', 
    label: 'Run Risk Assessment', 
    prompt: 'Conduct a compliance risk assessment for my organisation. Ask me relevant questions to identify potential risks.', 
    icon: '⚠️' 
  },
  { 
    id: 'audit-prep', 
    label: 'Audit Preparation', 
    prompt: 'Help me prepare for an upcoming compliance audit. What documents and evidence should I gather?', 
    icon: '📋' 
  },
  { 
    id: 'incident-guide', 
    label: 'Incident Response', 
    prompt: 'Guide me through incident reporting requirements. What are my obligations and timeframes?', 
    icon: '🚨' 
  },
  { 
    id: 'policy-review', 
    label: 'Policy Review', 
    prompt: 'Review my compliance policy. What key elements should it include and what gaps might exist?', 
    icon: '📝' 
  },
];

/**
 * Get suggested prompts for a sector
 */
export function getSuggestedPrompts(sector?: string): string[] {
  if (sector && sector in SUGGESTED_PROMPTS) {
    return SUGGESTED_PROMPTS[sector];
  }
  return SUGGESTED_PROMPTS.general;
}
