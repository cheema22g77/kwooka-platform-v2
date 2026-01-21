import { searchLegislation as bm25Search } from '@/lib/enhanced-rag-search'

export interface RAGResponse {
  answer: string
  citations: Citation[]
  confidence: 'high' | 'medium' | 'low'
}

export interface Citation {
  content: string
  source: string
  section?: string
  similarity: number
}

// Generate answer with RAG using BM25 search
export async function generateRAGResponse(
  question: string,
  sector?: string
): Promise<RAGResponse> {
  // Use BM25 search with query expansion
  let results = await bm25Search(question, {
    topK: 10,
    expandQuery: true,
    searchMethod: 'bm25',
    minScore: 0.1,
    sector,
  })

  // If low results, try hybrid search
  if (results.length < 3) {
    console.log('Trying hybrid search for better coverage')
    const hybridResults = await bm25Search(question, {
      topK: 10,
      expandQuery: true,
      searchMethod: 'hybrid',
      minScore: 0.05,
      sector,
    })
    if (hybridResults.length > results.length) {
      results = hybridResults
    }
  }

  if (results.length === 0) {
    return {
      answer: "I couldn't find specific legislation or standards related to your question in the database. This might be because:\n\n1. The specific topic hasn't been ingested yet\n2. Try using different keywords\n3. The legislation for this sector may not be available\n\nYou can check the RAG Admin page to see what legislation sources are available.",
      citations: [],
      confidence: 'low',
    }
  }

  // Build citations from results
  const citations: Citation[] = results.slice(0, 5).map(result => ({
    content: result.content.length > 300 ? result.content.slice(0, 300) + '...' : result.content,
    source: result.source.title,
    section: result.sectionNumber || result.sectionTitle,
    similarity: Math.min(result.score / 15, 1),
  }))

  // Return results without AI summary (AI integration coming soon)
  const answer = `Based on the relevant standards, here are the matching sections:\n\n${results.slice(0, 3).map(r => `• ${r.sectionTitle || 'Section'}: ${r.content.slice(0, 200)}...`).join('\n\n')}\n\n*AI-powered summaries coming soon.*`

  return {
    answer,
    citations,
    confidence: results.length > 3 ? 'high' : 'medium',
  }
}

// Build context string from search results
function buildContext(results: Array<{
  content: string
  source: { title: string; type: string; sector?: string }
  sectionTitle?: string
  sectionNumber?: string
  score: number
  matchedTerms: string[]
}>): string {
  return results.map((result, index) => {
    const header = result.sectionNumber 
      ? `[${result.source.title} - Section ${result.sectionNumber}]`
      : `[${result.source.title}${result.sectionTitle ? ' - ' + result.sectionTitle : ''}]`
    
    return `${index + 1}. ${header} (relevance: ${result.score.toFixed(2)}, matched: ${result.matchedTerms.join(', ')})
${result.content}
`
  }).join('\n---\n')
}

// Analyze a document against legislation
export async function analyzeDocumentCompliance(
  documentText: string,
  sector: string
): Promise<{
  gaps: Array<{ requirement: string; source: string; severity: string }>
  recommendations: string[]
  relevantStandards: Array<{
    content: string
    source: { title: string; type: string }
    sectionTitle?: string
    sectionNumber?: string
    score: number
  }>
}> {
  // Search for relevant standards using BM25
  const relevantStandards = await bm25Search(
    'compliance requirements ' + sector,
    { topK: 20, expandQuery: true, searchMethod: 'hybrid', minScore: 0.05, sector }
  )

  // Placeholder response - AI integration coming soon
  return {
    gaps: [],
    recommendations: ['AI-powered compliance analysis coming soon. Please contact support for manual compliance review.'],
    relevantStandards,
  }
}
