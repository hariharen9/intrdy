import type { CourseData } from './types'
import { DOCKER_METADATA } from './meta'
import { DOCKER_QA_ADV, DOCKER_QA_FUND } from './qa'
import { DOCKER_GROUPS, DOCKER_TOPICS } from './topics'
import { DOCKER_WIZARD_TREE } from './wizard'

export * from './types'
export * from './meta'
export * from './qa'
export * from './topics'
export * from './wizard'

export const dockerCourse: CourseData = {
  meta: DOCKER_METADATA,
  groups: DOCKER_GROUPS,
  topics: DOCKER_TOPICS,
  qaFundamentals: DOCKER_QA_FUND,
  qaAdvanced: DOCKER_QA_ADV,
  wizardTree: DOCKER_WIZARD_TREE,
}
