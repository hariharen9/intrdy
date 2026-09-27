import type { CourseMetadata } from '@/entities/topic'

export const TERRAFORM_METADATA: CourseMetadata = {
  id: 'terraform',
  title: 'Terraform: Foundations & Practical IaC',
  slug: 'terraform',
  icon: '🌍',
  badgeText: 'Basics → Intermediate',
  tagline: 'Learn Infrastructure as Code from scratch: HCL syntax, core workflow, state, variables, and modules',
  description:
    'A focused, beginner-friendly guide to Infrastructure as Code with Terraform. Master HCL syntax, the core init/plan/apply workflow, cloud providers, input variables, outputs, remote state backends (S3 + DynamoDB), dependencies, and building clean reusable modules.',
  quote:
    '"Terraform allows you to define cloud resources in human-readable configuration files that you can version, reuse, and share across teams."',
  quoteContext:
    'HashiCorp — Declarative Infrastructure as Code.',
  footerText:
    'designed for beginners to intermediate engineers — 12 focused topics · core workflow · remote state · practical modules',
  storageKey: 'terraform_progress',
  parts: [
    { partNo: 'PART 1', title: 'Core Fundamentals & Workflow', subtitle: 'IaC mental models, HCL syntax & providers' },
    { partNo: 'PART 2', title: 'Variables, Data & Dependencies', subtitle: 'Inputs, locals, outputs, data sources & count/for_each' },
    { partNo: 'PART 3', title: 'State Management & Modules', subtitle: 'Remote S3/DynamoDB state, locking & building modules' },
    { partNo: 'PART 4', title: 'Drills & Reference', subtitle: 'Troubleshoot wizard, quiz & essential cheat sheet' },
  ],
}
