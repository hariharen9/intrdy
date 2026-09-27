import type { CourseData } from '@/entities/topic'
import { ARTIFACTORY_CRASH_METADATA } from './meta'
import { ARTIFACTORY_CRASH_GROUPS, ARTIFACTORY_CRASH_TOPICS } from './topics'
import { artifactoryCrashQAFundamentals, artifactoryCrashQAAdvanced } from './qa'
import { ARTIFACTORY_CRASH_WIZARD_TREE } from './wizard'

export * from './meta'
export * from './topics'
export * from './qa'
export * from './wizard'

export const artifactoryCrashCourse: CourseData = {
  meta: ARTIFACTORY_CRASH_METADATA,
  groups: ARTIFACTORY_CRASH_GROUPS,
  topics: ARTIFACTORY_CRASH_TOPICS,
  qaFundamentals: artifactoryCrashQAFundamentals,
  qaAdvanced: artifactoryCrashQAAdvanced,
  wizardTree: ARTIFACTORY_CRASH_WIZARD_TREE,
}
