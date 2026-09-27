import type { CourseMetadata }
from '@/entities/topic'

export const ARTIFACTORY_CRASH_METADATA: CourseMetadata = {
  "id": "artifactory-crash",
  "title": "Artifactory: Fast-Track Crash Course",
  "slug": "artifactory-crash",
  "icon": "📦",
  "badgeText": "⚡ Fast-Track · ~30 min",
  "tagline": "Universal artifact management: Local/remote/virtual repos, Docker registries, promotion pipelines & Xray security",
  "description": "A streamlined, practical crash course to master JFrog Artifactory in 30 minutes. Understand the 4 repository types, upstream caching, Docker/OCI and Helm registries, immutable build promotion, JFrog CLI automation, retention policies, and Xray vulnerability scanning.",
  "quote": "\"Source code is cheap to recreate; immutable binaries and their exact dependency bills of materials are what run production.\"",
  "quoteContext": "JFrog DevOps Engineering Principles",
  "footerText": "fast-track crash course — 11 focused topics · 4 repo types · build promotion · jfrog cli & xray cheatsheet",
  "storageKey": "artifactory_crash_progress",
  "parts": [
    {
      "partNo": "PART 1",
      "title": "Mental Models & The 4 Repo Types",
      "subtitle": "Universal binary management, Local, Remote (caching), Virtual, and Federated repos"
    },
    {
      "partNo": "PART 2",
      "title": "Package Formats & OCI Registries",
      "subtitle": "Docker/OCI, Helm charts, Maven/NPM, and access token authentication"
    },
    {
      "partNo": "PART 3",
      "title": "Build Promotion & JFrog CLI",
      "subtitle": "Build once promote anywhere, Build Info metadata, and jf rt automation"
    },
    {
      "partNo": "PART 4",
      "title": "Security, Retention & Cheatsheet",
      "subtitle": "JFrog Xray scanning, storage cleanup, diagnostic wizard, and cheat sheet"
    }
  ]
}
