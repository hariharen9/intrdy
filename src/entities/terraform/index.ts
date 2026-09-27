import type { CourseData } from '@/entities/topic'
import { TERRAFORM_METADATA } from './meta'
import { TERRAFORM_GROUPS, TERRAFORM_TOPICS } from './topics'
import { terraformQAFundamentals, terraformQAAdvanced } from './qa'
import { TERRAFORM_WIZARD_TREE } from './wizard'

export * from './meta'
export * from './topics'
export * from './qa'
export * from './wizard'

export const terraformCourse: CourseData = {
  meta: TERRAFORM_METADATA,
  groups: TERRAFORM_GROUPS,
  topics: TERRAFORM_TOPICS,
  qaFundamentals: terraformQAFundamentals,
  qaAdvanced: terraformQAAdvanced,
  wizardTree: TERRAFORM_WIZARD_TREE,
}
