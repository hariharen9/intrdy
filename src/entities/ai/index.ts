import type { CourseData } from '@/entities/topic'
import { AI_METADATA } from './meta'
import { AI_GROUPS, AI_TOPICS } from './topics'
import { AI_QA_FUNDAMENTALS, AI_QA_ADVANCED } from './qa'
import { AI_WIZARD_TREE } from './wizard'

export * from './meta'
export * from './topics'
export * from './qa'
export * from './wizard'

export const aiCourse: CourseData = {
  meta: AI_METADATA,
  groups: AI_GROUPS,
  topics: AI_TOPICS,
  qaFundamentals: AI_QA_FUNDAMENTALS,
  qaAdvanced: AI_QA_ADVANCED,
  wizardTree: AI_WIZARD_TREE,
}
