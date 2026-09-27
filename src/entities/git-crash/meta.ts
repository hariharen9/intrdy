import type { CourseMetadata }
from '@/entities/topic'

export const GIT_CRASH_METADATA: CourseMetadata = {
  "id": "git-crash",
  "title": "Git: Fast-Track Crash Course",
  "slug": "git-crash",
  "icon": "🌱",
  "badgeText": "⚡ Fast-Track · ~35 min",
  "tagline": "Version control mastered: The 3 trees, safe branching, rebase vs merge, undoing mistakes & reflog rescue",
  "description": "A crystal-clear, hands-on crash course designed to eliminate Git confusion in 35 minutes. Understand the 3-tree model, stage with precision, master rebase vs merge, resolve conflicts calmly, undo anything with restore/reset/revert, and recover \"lost\" commits with reflog.",
  "quote": "\"Git doesn't store diffs; it stores snapshots of your entire directory tree as a directed acyclic graph.\"",
  "quoteContext": "Linus Torvalds — Creator of Git & Linux",
  "footerText": "fast-track crash course — 11 focused topics · visual DAG mental models · rebase vs merge · reflog rescue",
  "storageKey": "git_crash_progress",
  "parts": [
    {
      "partNo": "PART 1",
      "title": "Mental Models & The 3 Trees",
      "subtitle": "Working directory, staging index, commit graph, and HEAD"
    },
    {
      "partNo": "PART 2",
      "title": "Everyday Workflows & Branching",
      "subtitle": "Status, patch staging, commit etiquette, fast-forward vs 3-way merge, and rebasing"
    },
    {
      "partNo": "PART 3",
      "title": "Undoing Mistakes & Remote Mastery",
      "subtitle": "Restore vs reset vs revert, stashing, and safe force pushing with lease"
    },
    {
      "partNo": "PART 4",
      "title": "Disaster Recovery, Drills & Cheatsheet",
      "subtitle": "Interactive reflog rescue wizard, quiz, and production Git cheat sheet"
    }
  ]
}
