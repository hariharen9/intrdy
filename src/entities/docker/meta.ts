import type { CourseMetadata } from './types'

export const DOCKER_METADATA: CourseMetadata = {
  id: 'docker',
  title: 'Docker: Zero to Hero',
  slug: 'docker',
  icon: '🐳',
  badgeText: 'Container Curious → Interview Ready',
  tagline: 'From first principles to mastery.',
  description:
    'A single-pass visual manual. Built to bridge the gap between "it works on my machine" and deep production architectural readiness with custom flow diagrams, resource blueprints, an interactive troubleshooting wizard, and technical interview scenarios.',
  quote:
    '"A container is a normal Linux process, isolated by namespaces and throttled by cgroups."',
  quoteContext:
    'No guest hypervisors, no magical boot sequence. Same host kernel, restricted visibility.',
  footerText:
    'built for going from container-curious to interview-ready — 17 modules · custom visuals · interactive debug wizard · full interview bank',
  storageKey: 'docker_progress',
  parts: [
    { partNo: 'PART 1', title: 'Fundamentals', subtitle: 'Architecture & lifecycle' },
    { partNo: 'PART 2', title: 'Images & Build', subtitle: 'Layers, cache & multi-stage' },
    { partNo: 'PART 3', title: 'Run & Compose', subtitle: 'Networks, volumes & stacks' },
    { partNo: 'PART 4', title: 'Production', subtitle: 'Security, triage & interview' },
  ],
}
