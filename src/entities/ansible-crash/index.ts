import type { CourseData } from '@/entities/topic'
import { ANSIBLE_CRASH_METADATA } from './meta'
import { ANSIBLE_CRASH_GROUPS, ANSIBLE_CRASH_TOPICS } from './topics'
import { ansibleCrashQAFundamentals, ansibleCrashQAAdvanced } from './qa'
import { ANSIBLE_CRASH_WIZARD_TREE } from './wizard'

export * from './meta'
export * from './topics'
export * from './qa'
export * from './wizard'

export const ansibleCrashCourse: CourseData = {
  meta: ANSIBLE_CRASH_METADATA,
  groups: ANSIBLE_CRASH_GROUPS,
  topics: ANSIBLE_CRASH_TOPICS,
  qaFundamentals: ansibleCrashQAFundamentals,
  qaAdvanced: ansibleCrashQAAdvanced,
  wizardTree: ANSIBLE_CRASH_WIZARD_TREE,
}
