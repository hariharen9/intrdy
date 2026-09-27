import type { CourseData } from '@/entities/topic'
import { DOCKER_CRASH_METADATA } from './meta'
import { DOCKER_CRASH_GROUPS, DOCKER_CRASH_TOPICS } from './topics'
import { dockerCrashQAFundamentals, dockerCrashQAAdvanced } from './qa'
import { DOCKER_CRASH_WIZARD_TREE } from './wizard'

export * from './meta'
export * from './topics'
export * from './qa'
export * from './wizard'

export const dockerCrashCourse: CourseData = {
  meta: DOCKER_CRASH_METADATA,
  groups: DOCKER_CRASH_GROUPS,
  topics: DOCKER_CRASH_TOPICS,
  qaFundamentals: dockerCrashQAFundamentals,
  qaAdvanced: dockerCrashQAAdvanced,
  wizardTree: DOCKER_CRASH_WIZARD_TREE,
}
