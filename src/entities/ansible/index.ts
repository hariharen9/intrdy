import type { CourseData } from '@/entities/topic'
import { ANSIBLE_METADATA } from './meta'
import { ANSIBLE_GROUPS, ANSIBLE_TOPICS } from './topics'
import { ansibleQAFundamentals, ansibleQAAdvanced } from './qa'
import { ANSIBLE_WIZARD_TREE } from './wizard'

export * from './meta'
export * from './topics'
export * from './qa'
export * from './wizard'

export const ansibleCourse: CourseData = {
  meta: ANSIBLE_METADATA,
  groups: ANSIBLE_GROUPS,
  topics: ANSIBLE_TOPICS,
  qaFundamentals: ansibleQAFundamentals,
  qaAdvanced: ansibleQAAdvanced,
  wizardTree: ANSIBLE_WIZARD_TREE,
}
