import type { CourseData } from '@/entities/topic'
import { JENKINS_METADATA } from './meta'
import { JENKINS_GROUPS, JENKINS_TOPICS } from './topics'
import { jenkinsQAFundamentals, jenkinsQAAdvanced } from './qa'
import { JENKINS_WIZARD_TREE } from './wizard'

export * from './meta'
export * from './topics'
export * from './qa'
export * from './wizard'

export const jenkinsCourse: CourseData = {
  meta: JENKINS_METADATA,
  groups: JENKINS_GROUPS,
  topics: JENKINS_TOPICS,
  qaFundamentals: jenkinsQAFundamentals,
  qaAdvanced: jenkinsQAAdvanced,
  wizardTree: JENKINS_WIZARD_TREE,
}

