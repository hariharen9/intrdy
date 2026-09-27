import type { CourseData } from '@/entities/topic'
import { GIT_CRASH_METADATA } from './meta'
import { GIT_CRASH_GROUPS, GIT_CRASH_TOPICS } from './topics'
import { gitCrashQAFundamentals, gitCrashQAAdvanced } from './qa'
import { GIT_CRASH_WIZARD_TREE } from './wizard'

export * from './meta'
export * from './topics'
export * from './qa'
export * from './wizard'

export const gitCrashCourse: CourseData = {
  meta: GIT_CRASH_METADATA,
  groups: GIT_CRASH_GROUPS,
  topics: GIT_CRASH_TOPICS,
  qaFundamentals: gitCrashQAFundamentals,
  qaAdvanced: gitCrashQAAdvanced,
  wizardTree: GIT_CRASH_WIZARD_TREE,
}
