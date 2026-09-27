import type { CourseData } from './types'
import { K8S_METADATA } from './meta'
import { K8S_QA_ADV, K8S_QA_FUND } from './qa'
import { K8S_GROUPS, K8S_TOPICS } from './topics'
import { K8S_WIZARD_TREE } from './wizard'

export * from './types'
export * from './meta'
export * from './qa'
export * from './topics'
export * from './wizard'

export const k8sCourse: CourseData = {
  meta: K8S_METADATA,
  groups: K8S_GROUPS,
  topics: K8S_TOPICS,
  qaFundamentals: K8S_QA_FUND,
  qaAdvanced: K8S_QA_ADV,
  wizardTree: K8S_WIZARD_TREE,
}
