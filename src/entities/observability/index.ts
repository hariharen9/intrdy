import type { CourseData } from '@/entities/topic'
import { OBSERVABILITY_METADATA } from './meta'
import { OBSERVABILITY_QA_ADV, OBSERVABILITY_QA_FUND } from './qa'
import { OBSERVABILITY_GROUPS, OBSERVABILITY_TOPICS } from './topics'
import { OBSERVABILITY_WIZARD_TREE } from './wizard'

export * from './types'
export * from './meta'
export * from './qa'
export * from './topics'
export * from './wizard'

export const observabilityCourse: CourseData = {
  meta: OBSERVABILITY_METADATA,
  groups: OBSERVABILITY_GROUPS,
  topics: OBSERVABILITY_TOPICS,
  qaFundamentals: OBSERVABILITY_QA_FUND,
  qaAdvanced: OBSERVABILITY_QA_ADV,
  wizardTree: OBSERVABILITY_WIZARD_TREE,
}
