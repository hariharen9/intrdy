import type { QAItem } from '@/entities/topic'

export const artifactoryCrashQAFundamentals: QAItem[] = [
  [
    "What is the purpose of a Virtual Repository in Artifactory?",
    "A Virtual Repository is a single unified URL endpoint that aggregates multiple Local and Remote repositories. Developers and CI pipelines configure one endpoint for downloads, while Artifactory transparently checks local builds first and falls back to upstream remote registries."
  ],
  [
    "How do Remote Repositories protect CI/CD pipelines from upstream outages?",
    "When an external registry (like Docker Hub, NPM, or Maven Central) goes down or imposes rate limits, Artifactory serves cached binaries directly from its local storage, ensuring zero pipeline downtime."
  ],
  [
    "What is the \"Build Once, Promote Anywhere\" principle?",
    "Never rebuild binaries between dev, staging, and prod! Rebuilding code introduces subtle environment differences. Instead, build and test a binary once, upload it to a dev repository, and promote the exact identical immutable binary to staging and production repositories as it passes QA gates."
  ]
]

export const artifactoryCrashQAAdvanced: QAItem[] = [
  [
    "How does JFrog Xray differ from basic static code analysis (SAST)?",
    "SAST scans raw source code before compilation. JFrog Xray performs deep recursive binary analysis on compiled packages, container layers, and dependencies, identifying known CVEs, malicious packages, and open-source license compliance violations."
  ],
  [
    "Why are automated Artifact Retention policies critical?",
    "Without automated cleanup, high-frequency CI builds pushing large Docker images and tarballs will rapidly exhaust storage (SAN/S3/EBS). Retention policies automatically prune unpromoted development snapshots older than N days."
  ]
]
