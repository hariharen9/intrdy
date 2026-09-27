import type { WizardNode } from '@/entities/topic'

export const GIT_WIZARD_TREE: Record<string, WizardNode> = {
  start: {
    q: "What Git emergency or dilemma are you trying to resolve right now?",
    options: [
      { label: "I committed changes to the wrong branch (e.g. main/master instead of a feature branch)", next: "wrong_branch" },
      { label: "I ran 'git reset --hard' or deleted a branch and lost my work!", next: "lost_commits" },
      { label: "I am stuck in a merge, rebase, or cherry-pick conflict", next: "stuck_conflict" },
      { label: "I accidentally committed a secret, password, or huge binary file", next: "committed_secret" },
      { label: "I am in 'detached HEAD' state and don't know how to save my changes", next: "detached_head" },
      { label: "I need to modify my latest commit (message, author, or forgot a file)", next: "modify_latest" },
      { label: "Git push was rejected ('Updates were rejected because the remote contains work...')", next: "push_rejected" },
    ],
  },

  wrong_branch: {
    q: "Have you already pushed these commits to the remote server?",
    options: [
      { label: "No, the commits are only on my local branch", next: "wrong_branch_local" },
      { label: "Yes, I pushed the commits to the shared remote branch", next: "wrong_branch_pushed" },
    ],
  },

  wrong_branch_local: {
    result: true,
    title: "Move Local Commits to a New Feature Branch",
    body: "Since you haven't pushed yet, you can create a new branch pointing to the current commit, switch to it, and reset your main branch back without losing any work.",
    cmds: [
      "# 1. Create and switch to your new intended feature branch (keeps your commits)",
      "git switch -c feature/my-new-feature",
      "",
      "# 2. Switch back to your main branch",
      "git switch main",
      "",
      "# 3. Reset main back by N commits (e.g., 1 commit back to match origin)",
      "git reset --hard HEAD~1",
      "# Or precisely match the remote state: git reset --hard origin/main",
      "",
      "# 4. Return to your feature branch to continue working",
      "git switch feature/my-new-feature",
    ],
  },

  wrong_branch_pushed: {
    result: true,
    title: "Safely Revert Pushed Commits on Main",
    body: "Because other developers may have already pulled main, rewriting history with force-push is dangerous in shared branches. Use non-destructive 'git revert' on main, and cherry-pick the commits to your feature branch.",
    cmds: [
      "# 1. Create your feature branch containing the work",
      "git switch -c feature/my-new-feature",
      "",
      "# 2. Switch back to main",
      "git switch main",
      "",
      "# 3. Create a revert commit that undoes the changes on main without breaking history",
      "git revert HEAD --no-edit",
      "git push origin main",
      "",
      "# 4. Continue work safely on your feature branch",
      "git switch feature/my-new-feature",
    ],
  },

  lost_commits: {
    result: true,
    title: "Recover Lost Commits via Git Reflog",
    body: "Git almost never deletes committed objects immediately! Git maintains a reference log (`reflog`) of every HEAD movement for 30–90 days. You can find your lost commit SHA and restore it instantly.",
    cmds: [
      "# 1. Inspect the reflog history of HEAD movements",
      "git reflog",
      "",
      "# 2. Find the entry before the reset (e.g., HEAD@{1} or commit SHA abc1234)",
      "# Output example: abc1234 HEAD@{1}: commit: Add cool feature",
      "",
      "# 3. Create a branch at that exact lost commit state",
      "git switch -c recovered-work abc1234",
      "",
      "# Your lost files and commit history are completely recovered!",
    ],
  },

  stuck_conflict: {
    q: "Do you want to abort the operation or finish resolving the conflicts?",
    options: [
      { label: "I want to abort completely and return to safety", next: "conflict_abort" },
      { label: "I want to resolve the conflict and continue", next: "conflict_resolve" },
    ],
  },

  conflict_abort: {
    result: true,
    title: "Abort In-Flight Operation Cleanly",
    body: "Git allows you to cancel any ongoing rebase, merge, or cherry-pick in a single command, restoring your working tree to its exact pre-operation state.",
    cmds: [
      "# If in the middle of a rebase:",
      "git rebase --abort",
      "",
      "# If in the middle of a merge:",
      "git merge --abort",
      "",
      "# If in the middle of a cherry-pick:",
      "git cherry-pick --abort",
    ],
  },

  conflict_resolve: {
    result: true,
    title: "Step-by-Step Conflict Resolution",
    body: "Open conflicting files, look for conflict markers (<<<<<<<, =======, >>>>>>>), resolve the desired code, stage the files, and proceed with the operation.",
    cmds: [
      "# 1. Check which files are in conflict",
      "git status",
      "",
      "# 2. After editing conflicting files and removing conflict markers, stage them:",
      "git add path/to/resolved-file.ts",
      "",
      "# 3. Continue the operation (DO NOT run 'git commit' during a rebase!):",
      "# If rebasing:",
      "git rebase --continue",
      "",
      "# If merging:",
      "git commit -m 'Merge branch X and resolve conflicts'",
    ],
  },

  committed_secret: {
    q: "Has this commit already been pushed to a remote repository?",
    options: [
      { label: "No, it is only in my local commit history", next: "secret_local" },
      { label: "Yes, it has been pushed to GitHub / GitLab", next: "secret_remote" },
    ],
  },

  secret_local: {
    result: true,
    title: "Eradicate Secret from Local Commit",
    body: "If it was the very last commit, remove the secret file and amend. If it is further back in history, use interactive rebase.",
    cmds: [
      "# If it is the latest commit:",
      "# 1. Remove the file or remove the secret from the file",
      "echo 'API_KEY_PLACEHOLDER' > .env",
      "# 2. Stage the fix and amend the commit without changing the message",
      "git add .env",
      "git commit --amend --no-edit",
      "",
      "# If the secret is several commits back, use interactive rebase to 'edit' that commit:",
      "git rebase -i HEAD~5",
    ],
  },

  secret_remote: {
    result: true,
    title: "EMERGENCY: Secret Leaked Remotely",
    body: "CRITICAL: Once a secret touches a public or shared remote, consider it compromised immediately! First revoke the secret key at the provider (AWS, Stripe, OpenAI). Then scrub the git repository history with git-filter-repo.",
    cmds: [
      "# STEP 1: REVOKE & ROTATE THE SECRET IMMEDIATELY AT THE PROVIDER DASHBOARD!",
      "",
      "# STEP 2: Install git-filter-repo (modern replacement for deprecated filter-branch)",
      "pip install git-filter-repo",
      "",
      "# STEP 3: Remove the secret file from entire repository history:",
      "git filter-repo --path .env --invert-paths --force",
      "",
      "# STEP 4: Force push all branches and tags to overwrite remote history:",
      "git push origin --force --all",
      "git push origin --force --tags",
    ],
  },

  detached_head: {
    result: true,
    title: "Saving Work from Detached HEAD State",
    body: "'Detached HEAD' simply means HEAD is pointing directly to a commit SHA rather than a named branch reference. Any new commits made here will become dangling if you switch away without creating a branch.",
    cmds: [
      "# 1. Inspect your current commits",
      "git log -n 3 --oneline",
      "",
      "# 2. Create and switch to a new branch right at this commit to keep all changes",
      "git switch -c my-saved-branch",
      "",
      "# You are now safely back on a named branch with all your work preserved!",
    ],
  },

  modify_latest: {
    result: true,
    title: "Amending the Most Recent Commit",
    body: "You can update the latest commit's message or add forgotten staged files without creating an ugly 'fix typo' commit.",
    cmds: [
      "# To add forgotten files to the last commit:",
      "git add missed-file.ts",
      "git commit --amend --no-edit",
      "",
      "# To simply edit the last commit message:",
      "git commit --amend -m 'feat(auth): new updated descriptive commit message'",
      "",
      "# Note: If already pushed to a feature branch, you will need to push with:",
      "git push --force-with-lease origin feature-branch",
    ],
  },

  push_rejected: {
    result: true,
    title: "Resolving Push Rejected (Diverged Branch)",
    body: "Your local branch is behind the remote tracking branch because a teammate pushed new commits or remote CI updated the branch.",
    cmds: [
      "# 1. Pull the remote changes and rebase your local commits cleanly on top:",
      "git pull --rebase origin <branch-name>",
      "",
      "# 2. If conflicts arise, resolve them, stage with 'git add', and run:",
      "# git rebase --continue",
      "",
      "# 3. Push your cleanly rebased branch:",
      "git push origin <branch-name>",
    ],
  },
}
