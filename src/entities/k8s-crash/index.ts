import type { CourseData } from '@/entities/topic'
import { K8S_CRASH_METADATA } from './meta'
import { K8S_CRASH_GROUPS, K8S_CRASH_TOPICS } from './topics'
import { k8sCrashQAFundamentals, k8sCrashQAAdvanced } from './qa'
import { K8S_CRASH_WIZARD_TREE } from './wizard'

export * from './meta'
export * from './topics'
export * from './qa'
export * from './wizard'

export const k8sCrashCourse: CourseData = {
  meta: K8S_CRASH_METADATA,
  groups: K8S_CRASH_GROUPS,
  topics: K8S_CRASH_TOPICS,
  qaFundamentals: k8sCrashQAFundamentals,
  qaAdvanced: k8sCrashQAAdvanced,
  wizardTree: K8S_CRASH_WIZARD_TREE,
}
