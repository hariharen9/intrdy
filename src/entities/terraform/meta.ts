import type { CourseMetadata } from '@/entities/topic'

export const TERRAFORM_METADATA: CourseMetadata = {
  id: 'terraform',
  title: 'Terraform & OpenTofu: Enterprise Infrastructure as Code',
  slug: 'terraform',
  icon: '🌍',
  badgeText: 'Deep Dive Track',
  tagline: 'Master declarative IaC from first principles to enterprise production: HCL syntax, state locking, modules, loops, refactoring & CI/CD automation',
  description:
    'The complete zero-to-hero curriculum for Terraform and OpenTofu. Master the 4-command workflow, HCL syntax, resource graphs, loops (count vs for_each), dynamic blocks, S3/DynamoDB remote state locking, zero-downtime refactoring with moved blocks, declarative imports, and interactive CLI plan/apply simulations.',
  quote:
    '"Terraform allows you to define cloud resources in human-readable configuration files that you can version, peer-review, test, and safely replicate across environments."',
  quoteContext: 'HashiCorp & Linux Foundation OpenTofu — Declarative Cloud Infrastructure.',
  footerText:
    'Enterprise Terraform & IaC Curriculum — 21 comprehensive modules · HCL syntax · Remote state locking · Interactive CLI simulation · Incident debug wizard',
  storageKey: 'terraform_progress',
  parts: [
    {
      partNo: 'PART 1',
      title: 'Foundations, HCL & Core Workflow',
      subtitle: 'IaC mental models, HCL syntax, the 4-step lifecycle, providers, variables, and DAG graphs',
    },
    {
      partNo: 'PART 2',
      title: 'Advanced HCL, Loops & Dynamic Blocks',
      subtitle: 'Data sources, count vs for_each, dynamic blocks, built-in functions & lifecycle controls',
    },
    {
      partNo: 'PART 3',
      title: 'State Architecture, Refactoring & Mock UI',
      subtitle: 'S3/DynamoDB remote locking, interactive CLI simulator, moved blocks & declarative imports',
    },
    {
      partNo: 'PART 4',
      title: 'Enterprise Patterns, CI/CD & Interview Drills',
      subtitle: 'Module patterns, multi-region aliases, GitHub Actions OIDC, debug wizard, quiz & Q&A bank',
    },
  ],
}
