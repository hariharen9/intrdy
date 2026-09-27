import type { Topic, TopicGroup } from '@/entities/topic'

export const GIT_CRASH_GROUPS: TopicGroup[] = [
  {
    "id": "part-1",
    "name": "Part 1: The 3 Trees & Core Mechanics"
  },
  {
    "id": "part-2",
    "name": "Part 2: Branching, Merge & Rebase"
  },
  {
    "id": "part-3",
    "name": "Part 3: Undoing & Remote Collaboration"
  },
  {
    "id": "part-4",
    "name": "Part 4: Disaster Recovery & Cheatsheet"
  }
]

export const GIT_CRASH_TOPICS: Topic[] = [
  {
    "id": "git-3trees",
    "title": "1. The Mental Model: The 3 Trees of Git",
    "group": "part-1",
    "level": "Basics",
    "sectionNo": "01",
    "category": "Architecture",
    "body": [
      {
        "t": "html",
        "html": "<div class=\"callout callout-info\"><div class=\"callout-title\">Git is a Snapshot Engine</div><p>Every commit in Git is a complete snapshot of all files at that instant, linked to parent commits as a Directed Acyclic Graph (DAG). It does not store line deltas.</p></div><div class=\"grid grid-cols-1 md:grid-cols-3 gap-3 my-4\"><div class=\"p-3 rounded-xl border border-[var(--border)] bg-[var(--panel2)]\"><h4 class=\"font-bold text-amber-400 text-sm\">1. Working Tree</h4><p class=\"text-xs text-[var(--muted)] mt-1\">Your sandbox on disk. Where you edit, create, and delete code files.</p></div><div class=\"p-3 rounded-xl border border-[var(--border)] bg-[var(--panel2)]\"><h4 class=\"font-bold text-sky-400 text-sm\">2. Staging (Index)</h4><p class=\"text-xs text-[var(--muted)] mt-1\">The draft table. Holds files staged with <code>git add</code> ready for snapshot.</p></div><div class=\"p-3 rounded-xl border border-[var(--border)] bg-[var(--panel2)]\"><h4 class=\"font-bold text-emerald-400 text-sm\">3. Commit History</h4><p class=\"text-xs text-[var(--muted)] mt-1\">The permanent vault. Immutable snapshots recorded with <code>git commit</code>.</p></div></div>"
      }
    ]
  },
  {
    "id": "git-daily-ops",
    "title": "2. Daily Essentials: Status, Diff & Atomic Commits",
    "group": "part-1",
    "level": "Basics",
    "sectionNo": "02",
    "category": "Workflow",
    "body": [
      {
        "t": "code",
        "lang": "bash",
        "c": "# Check current tree state\ngit status -s\n\n# View unstaged changes vs staging\ngit diff\n\n# Stage specific files\ngit add src/index.ts\n\n# PRO TIP: Interactively stage specific lines/hunks only!\ngit add -p\n\n# Commit with concise, descriptive message\ngit commit -m \"feat(auth): implement JWT token validation\"\n\n# Beautiful single-line visual branch graph\ngit log --oneline --graph --decorate --all -n 10"
      }
    ]
  },
  {
    "id": "git-branching",
    "title": "3. Branching Mechanics: Pointers & HEAD",
    "group": "part-2",
    "level": "Basics",
    "sectionNo": "03",
    "category": "Branching",
    "body": [
      {
        "t": "p",
        "c": "A branch in Git is simply a lightweight moveable pointer to a specific commit. HEAD is a special pointer that tells Git which branch or commit you are currently looking at."
      },
      {
        "t": "code",
        "lang": "bash",
        "c": "# Modern way to create & switch to a new branch (Git 2.23+)\ngit switch -c feature/payment-gateway\n\n# List all local and remote branches\ngit branch -a\n\n# Rename current branch\ngit branch -m feature/payments\n\n# Delete a merged branch safely\ngit branch -d feature/payments\n\n# Switch back to main\ngit switch main"
      }
    ]
  },
  {
    "id": "git-merge-rebase",
    "title": "4. Merging vs Rebasing: When to Use Which",
    "group": "part-2",
    "level": "Intermediate",
    "sectionNo": "04",
    "category": "Branching",
    "body": [
      {
        "t": "html",
        "html": "<div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 my-3\"><div class=\"p-3.5 rounded-xl border border-[var(--border)] bg-[var(--panel2)]\"><h4 class=\"font-bold text-[var(--accent)] mb-1\">🔀 git merge</h4><p class=\"text-xs text-[var(--muted)]\">Creates a <strong>Merge Commit</strong> with 2 parents. Preserves complete historical context and chronological order.</p><div class=\"mt-2 text-xs mono text-[var(--text)]\">Use for: Merging feature branches into main or release branches.</div></div><div class=\"p-3.5 rounded-xl border border-[var(--border)] bg-[var(--panel2)]\"><h4 class=\"font-bold text-sky-400 mb-1\">📏 git rebase</h4><p class=\"text-xs text-[var(--muted)]\">Replays your local commits on top of the latest target branch. Produces a completely linear history.</p><div class=\"mt-2 text-xs mono text-[var(--text)]\">Use for: Updating your personal feature branch with latest main before PR.</div></div></div>"
      },
      {
        "t": "code",
        "lang": "bash",
        "c": "# While on feature branch:\ngit fetch origin\ngit rebase origin/main\n\n# If conflicts occur: resolve them, stage files (git add .), then:\ngit rebase --continue\n\n# If it gets messy, abort back to safety:\ngit rebase --abort"
      }
    ]
  },
  {
    "id": "git-conflicts",
    "title": "5. Calming Conflict Resolution",
    "group": "part-2",
    "level": "Intermediate",
    "sectionNo": "05",
    "category": "Collaboration",
    "body": [
      {
        "t": "p",
        "c": "Conflicts occur when two branches modify the exact same lines of a file. Git pauses and writes conflict markers for you to choose the correct resolution."
      },
      {
        "t": "code",
        "lang": "diff",
        "c": "<<<<<<< HEAD (Current branch code)\nconst API_URL = \"https://api.production.internal\";\n=======\nconst API_URL = process.env.API_ENDPOINT || \"https://api.staging.internal\";\n>>>>>>> feature/env-config (Incoming code)"
      },
      {
        "t": "code",
        "lang": "bash",
        "c": "# 1. Edit the file to keep desired code and delete markers\n# 2. Stage the resolved file\ngit add src/config.ts\n\n# 3. Complete the merge (or continue rebase)\ngit commit -m \"chore: resolve merge conflict in config.ts\""
      }
    ]
  },
  {
    "id": "git-undo-restore",
    "title": "6. Undoing Anything: Restore, Reset & Revert",
    "group": "part-3",
    "level": "Intermediate",
    "sectionNo": "06",
    "category": "Undoing Changes",
    "body": [
      {
        "t": "html",
        "html": "<div class=\"p-3.5 rounded-xl border border-[var(--border)] bg-[var(--panel2)] text-xs space-y-2\"><div><strong>• Discard local unstaged edits:</strong> <code>git restore &lt;file&gt;</code></div><div><strong>• Unstage a file (keep local edits):</strong> <code>git restore --staged &lt;file&gt;</code></div><div><strong>• Undo last commit locally:</strong> <code>git reset --soft HEAD~1</code></div><div><strong>• Undo already-pushed public commit:</strong> <code>git revert &lt;commit-hash&gt;</code> (creates a new inverse commit)</div></div>"
      }
    ]
  },
  {
    "id": "git-stashing",
    "title": "7. Stashing: Pausing Work in Progress",
    "group": "part-3",
    "level": "Basics",
    "sectionNo": "07",
    "category": "Workflow",
    "body": [
      {
        "t": "code",
        "lang": "bash",
        "c": "# Save uncommitted work with a clear label\ngit stash save \"WIP: halfway through oauth integration\"\n\n# List all saved stashes\ngit stash list\n\n# Re-apply the latest stash and remove from stash list\ngit stash pop\n\n# Preview what is inside the stash without applying\ngit stash show -p stash@{0}"
      }
    ]
  },
  {
    "id": "git-remotes-push",
    "title": "8. Remote Mastery & Safe Force Pushes",
    "group": "part-3",
    "level": "Intermediate",
    "sectionNo": "08",
    "category": "Collaboration",
    "body": [
      {
        "t": "code",
        "lang": "bash",
        "c": "# Download remote commits without modifying working tree\ngit fetch origin\n\n# Fast-forward pull only (prevents accidental merge commits)\ngit pull --ff-only\n\n# SAFE FORCE PUSH (Never use raw --force!)\ngit push --force-with-lease origin feature/my-branch"
      }
    ]
  },
  {
    "id": "git-rebase-i",
    "title": "9. Interactive Rebase: Polishing History",
    "group": "part-4",
    "level": "Advanced",
    "sectionNo": "09",
    "category": "History Cleaning",
    "body": [
      {
        "t": "code",
        "lang": "bash",
        "c": "# Start interactive rebase for last 3 commits\ngit rebase -i HEAD~3\n\n# In the editor that opens:\n# pick  a1b2c3d feat(cart): implement checkout button\n# squash e4f5g6h fix typo in cart handler\n# squash 7h8i9j0 format css\n#\n# Save and close: Git will combine all 3 into 1 clean commit!"
      }
    ]
  },
  {
    "id": "git-wizard-topic",
    "title": "10. Interactive Git Disaster Recovery Wizard",
    "group": "part-4",
    "level": "Advanced",
    "sectionNo": "10",
    "category": "Troubleshooting",
    "body": [
      {
        "t": "p",
        "c": "Select the exact Git problem you are facing below for instant step-by-step rescue instructions."
      },
      {
        "t": "wizard"
      }
    ]
  },
  {
    "id": "git-quiz-cheat",
    "title": "11. Knowledge Check & Essential Git Cheat Sheet",
    "group": "part-4",
    "level": "Advanced",
    "sectionNo": "11",
    "category": "Reference",
    "body": [
      {
        "t": "quiz",
        "questions": [
          {
            "q": "What is the safest way to undo a commit that has ALREADY been pushed to a shared remote main branch?",
            "options": [
              "git reset --hard HEAD~1 followed by git push --force",
              "git revert <commit-hash> followed by git push",
              "git restore --staged .",
              "git branch -D main"
            ],
            "correct": 1,
            "explain": "git revert creates a new commit that records the exact inverse of the bad commit. This is non-destructive and does not rewrite shared history for other developers."
          }
        ]
      },
      {
        "t": "cheatsheet",
        "items": [
          {
            "term": "git status -s",
            "def": "Concise short-format status"
          },
          {
            "term": "git log --oneline --graph -n 10",
            "def": "Compact single-line branch visual graph"
          },
          {
            "term": "git diff --cached",
            "def": "Show diff of staged changes vs HEAD"
          },
          {
            "term": "git reflog",
            "def": "View local movement history to rescue lost commits"
          },
          {
            "term": "git switch -c <name>",
            "def": "Create and switch to new branch"
          },
          {
            "term": "git rebase origin/main",
            "def": "Replay local branch on top of main"
          },
          {
            "term": "git push --force-with-lease",
            "def": "Safely push rebased branch without overwriting teammate work"
          },
          {
            "term": "git stash pop",
            "def": "Restore and remove latest stashed changes"
          }
        ]
      }
    ]
  }
]
