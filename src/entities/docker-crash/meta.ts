import type { CourseMetadata } from '@/entities/topic'

export const DOCKER_CRASH_METADATA: CourseMetadata = {
  id: 'docker-crash',
  title: 'Docker: Fast-Track Crash Course',
  slug: 'docker-crash',
  icon: '🐳',
  badgeText: '⚡ Fast-Track · ~40 min',
  tagline: 'Containers made simple: images, Dockerfile, networking, volumes, and multi-container Docker Compose',
  description:
    'A concise, practical crash course designed to get you productive with Docker in under an hour. Understand containers vs VMs, essential run/exec/logs commands, lightweight multi-stage Dockerfiles, port mapping, data persistence with volumes, and Docker Compose.',
  quote:
    '"A container is simply an isolated Linux process running on a shared kernel, packaged with everything it needs to execute anywhere."',
  quoteContext:
    'Solomon Hykes, Founder of Docker — Build once, run anywhere.',
  footerText:
    'fast-track crash course — 11 focused topics · practical commands · compose workflows · quick drills',
  storageKey: 'docker_crash_progress',
  parts: [
    { partNo: 'PART 1', title: 'Mental Models & Daily Commands', subtitle: 'Containers vs VMs, core lifecycle & inspection' },
    { partNo: 'PART 2', title: 'Dockerfiles & Multi-Stage Builds', subtitle: 'Writing clean Dockerfiles & shrinking image sizes' },
    { partNo: 'PART 3', title: 'Networking, Volumes & Compose', subtitle: 'Port mapping, persistent storage & multi-container stacks' },
    { partNo: 'PART 4', title: 'Troubleshooting & Quick Drills', subtitle: 'Decision wizard, quiz & essential command cheat sheet' },
  ],
}
