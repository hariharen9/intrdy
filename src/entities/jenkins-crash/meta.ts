import type { CourseMetadata }
from '@/entities/topic'

export const JENKINS_CRASH_METADATA: CourseMetadata = {
  "id": "jenkins-crash",
  "title": "Jenkins: Fast-Track Crash Course",
  "slug": "jenkins-crash",
  "icon": "👨‍✈️",
  "badgeText": "⚡ Fast-Track · ~35 min",
  "tagline": "Declarative pipelines made clear: Jenkinsfile syntax, credentials, docker agents, parallel stages & post-actions",
  "description": "A high-yield, direct crash course to master Jenkins Declarative Pipelines in 35 minutes. Learn Controller-Agent architecture, clean Jenkinsfile syntax, credentials masking, parallel builds, Docker execution agents, artifact archiving, and automated triage.",
  "quote": "\"Continuous Integration is not a tool; it is a discipline of building and testing every change automatically.\"",
  "quoteContext": "Martin Fowler — Continuous Integration",
  "footerText": "fast-track crash course — 11 focused topics · declarative Jenkinsfile · docker agents · pipeline cheatsheet",
  "storageKey": "jenkins_crash_progress",
  "parts": [
    {
      "partNo": "PART 1",
      "title": "Mental Models & Core Architecture",
      "subtitle": "Controller vs Agents, Freestyle vs Pipelines, and the Pipeline Engine"
    },
    {
      "partNo": "PART 2",
      "title": "Declarative Jenkinsfile Anatomy",
      "subtitle": "Pipeline block, stages, steps, sh execution, and credentials masking"
    },
    {
      "partNo": "PART 3",
      "title": "Pipeline Logic & Ephemeral Agents",
      "subtitle": "When conditions, parallel execution, post actions, and Docker containers as build agents"
    },
    {
      "partNo": "PART 4",
      "title": "Troubleshooting, Drills & Cheatsheet",
      "subtitle": "Pipeline triage wizard, quick quiz, and production Jenkinsfile cheat sheet"
    }
  ]
}
