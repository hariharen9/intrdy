import type { CourseMetadata } from './types'

export const K8S_METADATA: CourseMetadata = {
  id: 'kubernetes',
  title: 'Kubernetes: Zero to Hero',
  slug: 'kubernetes',
  icon: '☸️',
  badgeText: 'App Dev → DevOps Interview Ready',
  tagline: 'From first pod to production-grade clusters.',
  description:
    'A complete visual field guide to Kubernetes. Built for software engineers crossing into DevOps — covering control plane internals, pod lifecycles, networking, storage, RBAC, autoscaling, Helm, GitOps, and full interview scenario prep. No hand-waving, no magic.',
  quote:
    '"Kubernetes is a platform for building platforms. It\'s a better place to start — not an end state."',
  quoteContext: 'Kelsey Hightower · Google Developer Advocate',
  footerText:
    'built to take you from app dev to devops interview ready — 20 modules · cluster internals · live troubleshooting wizard · full Q&A bank',
  storageKey: 'k8s_progress',
  parts: [
    { partNo: 'PART 1', title: 'Foundations', subtitle: 'Architecture & core objects' },
    { partNo: 'PART 2', title: 'Workloads & Config', subtitle: 'Pods, deployments & data' },
    { partNo: 'PART 3', title: 'Networking & Storage', subtitle: 'Services, ingress & volumes' },
    { partNo: 'PART 4', title: 'Production', subtitle: 'Security, scaling & operations' },
  ],
}
