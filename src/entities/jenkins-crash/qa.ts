import type { QAItem } from '@/entities/topic'

export const jenkinsCrashQAFundamentals: QAItem[] = [
  [
    "Why should the Jenkins Controller (Master) never run heavy build jobs directly?",
    "The Controller is responsible for UI serving, webhook handling, queue scheduling, and pipeline orchestration. Running CPU-heavy compilations or Docker builds on the controller exhausts heap memory and disk I/O, crashing the entire Jenkins instance. In production, controller executors should be set to 0 and all jobs offloaded to worker agents."
  ],
  [
    "What is the difference between Declarative Pipeline and Scripted Pipeline?",
    "• Declarative: Modern, strict, structured syntax starting with pipeline {}. Easy to read, lint, and enforce organization-wide standards.\n• Scripted: Older, Groovy-based procedural syntax starting with node {}. Provides unrestricted programming logic but is harder to maintain and prone to errors."
  ],
  [
    "How do you safely inject secret API tokens or passwords into a Jenkinsfile?",
    "Use the withCredentials block or the environment { SECRET = credentials(\"credential-id\") } directive. Jenkins automatically masks these values in build logs with **** to prevent accidental credential leakage."
  ]
]

export const jenkinsCrashQAAdvanced: QAItem[] = [
  [
    "What is the purpose of the post {} block in a Jenkinsfile?",
    "The post block executes actions depending on the build outcome (always, success, failure, unstable, cleanup). It is used for archiving artifacts, publishing test reports, cleaning workspaces, and sending Slack/Email notifications."
  ],
  [
    "How do ephemeral Docker agents benefit CI pipelines?",
    "Using agent { docker { image \"maven:3.9-eclipse-temurin-17\" } } spins up a pristine container for the job. You do not need to install Maven, Node, or Python on the host VM, eliminating tool version conflicts between different teams."
  ]
]
