export interface FlowStepItem {
  label: string
  sub?: string
  tone?: 'good' | 'bad' | 'default'
  group?: FlowStepItem[]
}

export interface StackLayerItem {
  label: string
  sub?: string
  tone?: 'writable' | 'default'
}

export type TopicBlock =
  | { t: 'p'; c: string }
  | { t: 'ul'; c: string[] }
  | { t: 'ol'; c: string[] }
  | { t: 'code'; lang: string; c: string }
  | { t: 'note'; kind: 'tip' | 'warn'; c: string }
  | { t: 'analogy'; c: string }
  | { t: 'bars'; title?: string; data: { label: string; value: number; unit?: string }[] }
  | { t: 'cards'; title?: string; items: { h: string; c: string; chips?: string[] }[] }
  | {
      t: 'flow'
      steps: FlowStepItem[]
      edges?: string[]
      heading?: string
      tone?: 'good' | 'bad' | 'default'
      note?: string
    }
  | { t: 'stack'; title?: string; layers: StackLayerItem[] }
  | {
      t: 'stackCompare'
      left: { title: string; layers: StackLayerItem[] }
      right: { title: string; layers: StackLayerItem[] }
    }
  | {
      t: 'timeline'
      events: { time: string; label: string; status: 'info' | 'fail' | 'ok' }[]
    }
  | { t: 'wizard' }

export interface TopicGroup {
  id: string
  name: string
}

export interface Topic {
  id: string
  group: string
  level: string
  title: string
  body: TopicBlock[]
  sectionNo?: string
  category?: string
}

export type QAItem = [question: string, answer: string]

export interface WizardOption {
  label: string
  next: string
}

export interface WizardNode {
  q?: string
  options?: WizardOption[]
  result?: boolean
  title?: string
  body?: string
  cmds?: string[]
}

export interface CoursePart {
  partNo: string
  title: string
  subtitle: string
}

export interface CourseMetadata {
  id: string
  title: string
  slug: string
  icon: string
  badgeText: string
  tagline: string
  description: string
  quote: string
  quoteContext: string
  footerText: string
  storageKey: string
  parts?: CoursePart[]
}

export interface CourseData {
  meta: CourseMetadata
  groups: TopicGroup[]
  topics: Topic[]
  qaFundamentals: QAItem[]
  qaAdvanced: QAItem[]
  wizardTree: Record<string, WizardNode>
}
