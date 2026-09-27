import type { CourseMetadata } from '@/entities/topic'

export const GIT_METADATA: CourseMetadata = {
  id: 'git',
  title: 'Git: Internals, Workflows & Production CI/CD',
  slug: 'git',
  icon: '🌿',
  badgeText: 'Zero → Hero',
  tagline: 'Master Git from the Directed Acyclic Graph (DAG) object model to advanced enterprise workflows',
  description:
    'Built for software engineers, DevOps practitioners, and SREs. Deeply understand content-addressable storage, commit hashing, branching mechanics, merge vs rebase, interactive history surgery, bisect forensics, submodules, monorepos, and GitHub enterprise trunk-based workflows.',
  quote:
    '"Git doesn\'t store diffs or deltas. Git stores a Directed Acyclic Graph of complete filesystem snapshots, indexed cryptographically by SHA content hashes."',
  quoteContext:
    'Linus Torvalds, Git design principles — fast, distributed, and cryptographically verified.',
  footerText:
    'built for software engineers & devops — 24 topics · internals & forensics · trunk-based workflows · complete interview prep',
  storageKey: 'git_progress',
  parts: [
    { partNo: 'PART 1', title: 'Architecture & Internals', subtitle: 'Object model, DAG & Three Trees' },
    { partNo: 'PART 2', title: 'Daily Operations & Safety', subtitle: 'Inspection, diffing, undos & worktrees' },
    { partNo: 'PART 3', title: 'Branching, Merges & Rebasing', subtitle: 'Pointers, 3-way merges, interactive rebase & remotes' },
    { partNo: 'PART 4', title: 'Forensics & Extensibility', subtitle: 'Reflog surgery, bisect, submodules & hooks' },
    { partNo: 'PART 5', title: 'Branching Models & GitHub CI/CD', subtitle: 'Trunk-based, PRs, SemVer & Git security' },
    { partNo: 'PART 6', title: 'Interview & Emergency Tools', subtitle: 'Decision wizard, quiz, cheatsheet & senior Q&As' },
  ],
}
