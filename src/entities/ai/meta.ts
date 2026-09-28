import type { CourseMetadata } from '@/entities/topic'

export const AI_METADATA: CourseMetadata = {
  id: 'ai',
  title: 'AI & LLMs: Practical Engineering & Agents',
  slug: 'ai',
  icon: '🤖',
  badgeText: 'Curious → Production & Interview Ready',
  tagline: 'From LLM APIs and function calling to RAG, multi-agent systems, and DevOps automation.',
  description:
    'A comprehensive, visual engineering manual for software developers, backend engineers, and DevOps practitioners. Master practical AI without academic calculus: tokens, context windows, structured JSON outputs, tool calling, vector databases, advanced RAG, autonomous multi-agent loops, CI/CD LLMOps, security guardrails, and senior interview scenarios.',
  quote:
    '"A traditional API is a deterministic function f(x) → y. An AI model is a probabilistic function f(x) → y ± noise. Engineering around that probability is the entire discipline of production AI."',
  quoteContext:
    'Platform & Backend Engineering Principles — Bridging foundational software reliability with probabilistic models.',
  footerText:
    'built for engineers who ship — 20 deep modules · custom visual diagrams · interactive debug wizard · live quiz · full senior interview bank',
  storageKey: 'ai_progress',
  parts: [
    { partNo: 'PART 1', title: 'Foundations & Mental Models', subtitle: 'Probabilistic programming, ML concepts & LLM mechanics' },
    { partNo: 'PART 2', title: 'APIs, Tools & Structured Data', subtitle: 'Streaming SSE, JSON schemas & function calling' },
    { partNo: 'PART 3', title: 'Vector Search & Advanced RAG', subtitle: 'Embeddings, chunking, hybrid search & vector stores' },
    { partNo: 'PART 4', title: 'Agents & DevOps Automation', subtitle: 'ReAct loops, multi-agent teams, CI/CD, evals & security' },
  ],
}
