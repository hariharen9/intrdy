import type { CourseMetadata } from '@/entities/topic'

export const JENKINS_METADATA: CourseMetadata = {
  id: 'jenkins',
  title: 'Jenkins: Zero to Hero',
  slug: 'jenkins',
  icon: '⚙️',
  badgeText: 'Zero → Hero',
  tagline: "Learn Jenkins the way you'll actually use it on the job",
  description:
    'Built for a software engineer with a few years of experience moving into DevOps. Every topic explains the why, not just the syntax, with real Jenkinsfile examples you will recognize from production codebases — then a quiz and cheat sheet to lock it in for interviews.',
  quote:
    '"Jenkins is an automation server: it orchestrates the tools that do the work (Maven, npm, Docker, kubectl, Terraform) on a schedule or on every commit."',
  quoteContext:
    'Self-hosted control, maturity, and the deepest plugin ecosystem in DevOps.',
  footerText:
    'built for software engineers moving to devops — 27 topics · declarative & scripted · kubernetes agents · complete interview prep',
  storageKey: 'jenkins_progress',
  parts: [
    { partNo: 'PART 1', title: 'Foundations', subtitle: 'Architecture & lifecycle' },
    { partNo: 'PART 2', title: 'Pipelines', subtitle: 'Declarative & Scripted DSL' },
    { partNo: 'PART 3', title: 'Intermediate', subtitle: 'Agents, credentials & libraries' },
    { partNo: 'PART 4', title: 'Advanced & Interview', subtitle: 'Docker, K8s, JCasC, quiz & scenarios' },
  ],
}
