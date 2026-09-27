import type { CourseData } from '@/entities/topic'
import { ARTIFACTORY_METADATA } from './meta'
import { ARTIFACTORY_GROUPS, ARTIFACTORY_TOPICS } from './topics'
import { artifactoryQAFundamentals, artifactoryQAAdvanced } from './qa'
import { ARTIFACTORY_WIZARD_TREE } from './wizard'

export * from './meta'
export * from './topics'
export * from './qa'
export * from './wizard'

export const artifactoryCourse: CourseData = {
  meta: ARTIFACTORY_METADATA,
  groups: ARTIFACTORY_GROUPS,
  topics: ARTIFACTORY_TOPICS,
  qaFundamentals: artifactoryQAFundamentals,
  qaAdvanced: artifactoryQAAdvanced,
  wizardTree: ARTIFACTORY_WIZARD_TREE,
}
