import type { CourseMetadata } from '@/entities/topic'

export const ARTIFACTORY_METADATA: CourseMetadata = {
  id: 'artifactory',
  title: 'Registries & Artifactory',
  slug: 'artifactory',
  icon: '📦',
  badgeText: 'Zero → Hero',
  tagline: 'Artifactory & Registries: from first push to production operations',
  description:
    'Every piece of software your org ships flows through a registry. Learn to operate artifact repositories and container registries from scratch: repository types (local, remote, virtual, federated), OCI distribution, build info BOM, promotion pipelines, JFrog Xray security, HA clustering, and disaster recovery.',
  quote:
    '"A registry is a versioned, network-addressable storage system that hands out immutable artifacts in exchange for credentials and a coordinate. S3 is object storage; Artifactory is content-addressable, metadata-aware, proxy-capable, and understands each package format natively."',
  quoteContext:
    'Platform engineering foundations — supply chain integrity & binary management.',
  footerText:
    'built for platform & devops engineers — 27 topics · local/remote/virtual/federated · xray scanning · complete interview prep',
  storageKey: 'artifactory_progress',
  parts: [
    { partNo: 'PART 1', title: 'Foundations', subtitle: 'Mental models, repository types & OCI' },
    { partNo: 'PART 2', title: 'Core Practical Skills', subtitle: 'Proxying, auth, Docker, Helm & Maven' },
    { partNo: 'PART 3', title: 'Intermediate Practices', subtitle: 'CI/CD, promotion, Xray & cleanup' },
    { partNo: 'PART 4', title: 'Advanced / Production', subtitle: 'HA, RBAC, SSO, tuning & metrics' },
    { partNo: 'PART 5', title: 'Interview & Drills', subtitle: 'Quiz, cheat sheet, scenarios & comparisons' },
  ],
}
