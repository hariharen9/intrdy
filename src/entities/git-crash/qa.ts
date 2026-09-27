import type { QAItem } from '@/entities/topic'

export const gitCrashQAFundamentals: QAItem[] = [
  [
    "What are the \"Three Trees\" of Git and why does understanding them matter?",
    "1. Working Directory: Actual files on your local disk.\n2. Staging Area (Index): The prepared snapshot ready for the next commit.\n3. Repository (Commit History / HEAD): Permanently stored snapshots (immutable DAG).\nUnderstanding these three areas makes commands like status, diff, add, commit, and restore immediately intuitive."
  ],
  [
    "What is the core difference between \"git merge\" and \"git rebase\"?",
    "• git merge: Combines histories and creates a new \"Merge Commit\" with two parents, preserving the exact chronological sequence of both branches.\n• git rebase: Replays your branch commits one by one on top of the target branch, creating a clean, linear history without merge bubbles."
  ],
  [
    "Why is \"git push --force-with-lease\" safer than \"git push --force\"?",
    "\"--force\" blindly overwrites the remote branch even if a teammate pushed new commits while you were rebasing. \"--force-with-lease\" checks that your local ref matches the remote before overwriting, refusing to push if someone else pushed changes."
  ]
]

export const gitCrashQAAdvanced: QAItem[] = [
  [
    "What is the difference between \"git reset --soft\", \"--mixed\", and \"--hard\"?",
    "• --soft: Moves HEAD pointer back, leaving changes in the Staging Area.\n• --mixed (default): Moves HEAD back and un-stages changes (leaves them in Working Directory).\n• --hard: Moves HEAD back, un-stages changes, AND deletes all uncommitted working directory edits (destructive)."
  ],
  [
    "How can you recover a deleted branch or accidental hard reset?",
    "Use \"git reflog\". Git keeps a local log of every time HEAD moved for 30-90 days. Find the commit SHA from before the reset and run \"git reset --hard <SHA>\" or \"git checkout -b recovered-branch <SHA>\"."
  ]
]
