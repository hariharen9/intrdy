import type { CourseData } from '@/entities/topic'
import { JENKINS_CRASH_METADATA } from './meta'
import { JENKINS_CRASH_GROUPS, JENKINS_CRASH_TOPICS } from './topics'
import { jenkinsCrashQAFundamentals, jenkinsCrashQAAdvanced } from './qa'
import { JENKINS_CRASH_WIZARD_TREE } from './wizard'

export * from './meta'
export * from './topics'
export * from './qa'
export * from './wizard'

export const jenkinsCrashCourse: CourseData = {
  meta: JENKINS_CRASH_METADATA,
  groups: JENKINS_CRASH_GROUPS,
  topics: JENKINS_CRASH_TOPICS,
  qaFundamentals: jenkinsCrashQAFundamentals,
  qaAdvanced: jenkinsCrashQAAdvanced,
  wizardTree: JENKINS_CRASH_WIZARD_TREE,
}
