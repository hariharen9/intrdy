import type { WizardNode } from '@/entities/topic'

export const GIT_CRASH_WIZARD_TREE: Record<string, WizardNode> = {
  "start": {
    "q": "What kind of Git mess are you trying to fix right now?",
    "options": [
      {
        "label": "I accidentally did \"git reset --hard\" or deleted a branch with unpushed work",
        "next": "reflog_rescue"
      },
      {
        "label": "I committed to the wrong branch (e.g., straight onto \"main\")",
        "next": "wrong_branch"
      },
      {
        "label": "I made a typo in the last commit message or forgot a file",
        "next": "amend_fix"
      },
      {
        "label": "I am stuck in a merge/rebase conflict and want to start over",
        "next": "conflict_abort"
      }
    ]
  },
  "reflog_rescue": {
    "result": true,
    "title": "Rescue Commits with Git Reflog",
    "body": "Git never deletes commits immediately. Every HEAD movement is logged locally for 30-90 days in the reflog.",
    "cmds": [
      "# 1. View local movement history:",
      "git reflog",
      "",
      "# 2. Locate the SHA before your mistake and recover into a new branch:",
      "git checkout -b rescue-branch <commit_sha>"
    ]
  },
  "wrong_branch": {
    "result": true,
    "title": "Move Commits to Correct Branch",
    "body": "You made commits on main instead of a feature branch without pushing.",
    "cmds": [
      "# 1. Create your feature branch at the current commit:",
      "git branch feature/my-work",
      "",
      "# 2. Reset main back to where it was before your commits:",
      "git reset --hard HEAD~2",
      "",
      "# 3. Switch to your feature branch:",
      "git switch feature/my-work"
    ]
  },
  "amend_fix": {
    "result": true,
    "title": "Amend the Most Recent Commit",
    "body": "Fix a commit message or add a forgotten file into the last commit.",
    "cmds": [
      "# 1. Stage the missing file:",
      "git add src/forgotten-file.ts",
      "",
      "# 2. Merge it into the previous commit without changing the message:",
      "git commit --amend --no-edit",
      "",
      "# 3. Or rewrite the message:",
      "git commit --amend -m \"feat: corrected commit message\""
    ]
  },
  "conflict_abort": {
    "result": true,
    "title": "Safely Abort Merge or Rebase Conflicts",
    "body": "Cancel the current operation and restore your workspace to its exact clean pre-conflict state.",
    "cmds": [
      "# Abort a merge in progress:",
      "git merge --abort",
      "",
      "# Abort a rebase in progress:",
      "git rebase --abort"
    ]
  }
}
