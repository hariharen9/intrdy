import type { CourseMetadata }
from '@/entities/topic'

export const K8S_CRASH_METADATA: CourseMetadata = {
  "id": "k8s-crash",
  "title": "Kubernetes: Fast-Track Crash Course",
  "slug": "k8s-crash",
  "icon": "☸️",
  "badgeText": "⚡ Fast-Track · ~40 min",
  "tagline": "Container orchestration simplified: Pods, Deployments, Services, Ingress, Config, and Probes",
  "description": "A high-yield, visual crash course designed to take you from zero to confident container orchestrator in 40 minutes. Master control planes, Pods, declarative Deployments, Service networking, ConfigMaps/Secrets, Persistent Volumes, and practical debugging with kubectl.",
  "quote": "\"Kubernetes is the Linux of the cloud — a unified distributed kernel managing compute, networking, and storage across clusters.\"",
  "quoteContext": "Kelsey Hightower — Kubernetes Up & Running",
  "footerText": "fast-track crash course — 11 focused topics · core architecture · zero-downtime rollouts · kubectl cheatsheet",
  "storageKey": "k8s_crash_progress",
  "parts": [
    {
      "partNo": "PART 1",
      "title": "Architecture & The Core Primitive",
      "subtitle": "Control Plane vs Nodes, Pods, and Declarative manifests"
    },
    {
      "partNo": "PART 2",
      "title": "Workloads & Cluster Networking",
      "subtitle": "Deployments, ReplicaSets, Services (ClusterIP/NodePort), and Ingress"
    },
    {
      "partNo": "PART 3",
      "title": "Config, Storage & Health Probes",
      "subtitle": "ConfigMaps, Secrets, PVCs, Liveness/Readiness probes, and Resource Limits"
    },
    {
      "partNo": "PART 4",
      "title": "Troubleshooting, Drills & Cheatsheet",
      "subtitle": "Interactive Pod triage wizard, quiz, and production kubectl cheat sheet"
    }
  ]
}
