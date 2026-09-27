import type { CourseData } from '@/entities/topic'
import { GIT_METADATA } from './meta'
import { GIT_GROUPS, GIT_TOPICS } from './topics'
import { gitQAFundamentals, gitQAAdvanced } from './qa'
import { GIT_WIZARD_TREE } from './wizard'

export * from './meta'
export * from './topics'
export * from './qa'
export * from './wizard'

export const gitCourse: CourseData = {
  meta: GIT_METADATA,
  groups: GIT_GROUPS,
  topics: GIT_TOPICS,
  qaFundamentals: gitQAFundamentals,
  qaAdvanced: gitQAAdvanced,
  wizardTree: GIT_WIZARD_TREE,
}
