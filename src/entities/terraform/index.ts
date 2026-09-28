import type { CourseData } from '@/entities/topic'
import { TERRAFORM_METADATA } from './meta'
import { TERRAFORM_GROUPS, TERRAFORM_TOPICS } from './topics'
import { TERRAFORM_QA_FUND, TERRAFORM_QA_ADV } from './qa'
import { TERRAFORM_WIZARD_TREE } from './wizard'

export * from './meta'
export * from './topics'
export * from './qa'
export * from './wizard'

export const terraformCourse: CourseData = {
  meta: TERRAFORM_METADATA,
  groups: TERRAFORM_GROUPS,
  topics: TERRAFORM_TOPICS,
  qaFundamentals: TERRAFORM_QA_FUND,
  qaAdvanced: TERRAFORM_QA_ADV,
  wizardTree: TERRAFORM_WIZARD_TREE,
}
