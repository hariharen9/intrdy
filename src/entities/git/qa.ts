import type { QAItem } from '@/entities/topic'

export const gitQAFundamentals: QAItem[] = [
  [
    'What is Git and how does its internal data model differ fundamentally from traditional VCS like SVN or Perforce?',
    'Traditional centralized VCS systems (SVN, CVS, TFS) store version history as a base file plus a series of file-by-file delta diffs over time. Git is a distributed content-addressable object database that stores every commit as a complete snapshot of the entire project tree (using the Directed Acyclic Graph, or DAG). Unchanged files are not duplicated; they simply reuse existing immutable blob pointers. Every developer possesses the complete repository history locally.',
  ],
  [
    'Explain the three main areas/states in Git: Working Tree, Staging Area (Index), and Repository (HEAD).',
    '1. Working Tree (Workspace): The active filesystem directory containing the files you edit.\n2. Staging Area (Index): A binary cache file (`.git/index`) that tracks what snapshot will be recorded in the next commit. It allows precision, selective staging (e.g. `git add -p`).\n3. Repository (Object Store / HEAD): The permanent database (`.git/objects`) containing committed snapshots referenced by commit hashes and branch pointers.',
  ],
  [
    'What are the 4 fundamental Git object types stored in `.git/objects`?',
    '1. Blob (Binary Large Object): Stores raw file content bytes, without filename, permissions, or timestamp.\n2. Tree: Acts like a directory, mapping file paths and mode permissions to blob or sub-tree SHAs.\n3. Commit: Points to a root Tree object, parent commit SHA(s), author/committer metadata, timestamps, and commit message.\n4. Annotated Tag: An immutable reference pointing to a specific commit SHA with a dedicated message, tagger signature, and timestamp.',
  ],
  [
    'What is the exact difference between `git fetch` and `git pull`?',
    '`git fetch` communicates with the remote repository and downloads all new objects, commits, and refs into your local `.git` database, updating remote tracking branches (e.g. `origin/main`), without modifying your local working tree or current branch.\n`git pull` is a composite command that performs `git fetch` followed immediately by a merge (`git merge FETCH_HEAD`) or rebase (`git pull --rebase`) into your current working branch.',
  ],
  [
    'What is a "Detached HEAD" state, why does it happen, and how do you recover?',
    'Normally, HEAD points symbolically to a branch name (e.g. `ref: refs/heads/main`). Detached HEAD occurs when HEAD points directly to an explicit commit hash, tag, or remote branch rather than a local branch pointer. Any new commits made in this state are unreferenced by a branch and will be pruned by `git gc` if you navigate away. Recovery: run `git switch -c <new-branch-name>` before switching away to attach your work to a named branch.',
  ],
  [
    'Explain the fundamental difference between `git merge` and `git rebase`.',
    '`git merge` creates a new "merge commit" that ties together two parent commit histories, preserving the exact non-linear chronological history and context of when branches diverged.\n`git rebase` replays your feature commits one by one on top of the target base branch, creating brand-new commit SHAs and producing a perfectly linear history. The golden rule: NEVER rebase public/shared branches.',
  ],
  [
    'What is the difference between `git reset --soft`, `git reset --mixed`, and `git reset --hard`?',
    'Given `git reset HEAD~1`:\n- `--soft`: Moves HEAD/branch pointer back 1 commit. Staging area and Working tree remain untouched (your changes remain staged ready to re-commit).\n- `--mixed` (default): Moves HEAD back 1 commit AND resets the staging area. Working tree files remain untouched (your changes are unstaged in workspace).\n- `--hard`: Moves HEAD back 1 commit, resets staging area, AND overwrites working tree files to match the target commit (any uncommitted changes are discarded).',
  ],
  [
    'What is `git stash` and what is the difference between `git stash pop` and `git stash apply`?',
    '`git stash` takes your uncommitted modifications (staged and unstaged) and saves them on an internal stack (`refs/stash`), reverting your working tree to match HEAD cleanly.\n`git stash apply` restores the stashed changes to your working tree while keeping the stash entry on the stack for reuse.\n`git stash pop` restores the stashed changes AND deletes the top stash entry from the stack (unless a merge conflict occurs during application).',
  ],
  [
    'What is the difference between `.gitignore`, `.gitkeep`, and `.gitattributes`?',
    '- `.gitignore`: Specifies intentionally untracked file patterns (e.g. `node_modules/`, `*.log`, `.env`) that Git should ignore and not prompt to stage.\n- `.gitkeep`: A community convention (not a built-in Git feature) to commit an empty placeholder file so Git tracks an otherwise empty folder.\n- `.gitattributes`: Defines path-specific repository settings such as line ending normalization (CRLF/LF), diff behavior for binary files, and Git LFS tracking rules.',
  ],
  [
    'What is a Fast-Forward merge and when does Git refuse to perform one?',
    'A Fast-Forward merge occurs when the target branch has not diverged from the feature branch (i.e. the base commit of the feature branch is currently the tip of the target branch). Git simply advances the target branch pointer to the tip of the feature branch without creating an extra merge commit.\nGit refuses to fast-forward if the target branch has newer commits of its own (diverged), requiring a 3-way merge, or if `--no-ff` is explicitly passed.',
  ],
]

export const gitQAAdvanced: QAItem[] = [
  [
    'How does Git calculate object SHA hashes, and how does packfile delta compression work?',
    'Git formats an object as `header = "<type> <size_in_bytes>\\0"` concatenated with the uncompressed content bytes, and computes `SHA-1(header + content)` (or SHA-256 in newer setups). When repos grow, `git gc` packs loose objects into `.pack` files using sliding-window delta compression, storing similar files as deltas against the newest version (directed backwards) with index `.idx` files for binary search lookups.',
  ],
  [
    'Explain `git rerere` (Reuse Recorded Resolution) and how it streamlines long-running rebases.',
    '`git rerere` stands for "Reuse Recorded Resolution". When enabled (`git config --global rerere.enabled true`), Git records the preimage of conflicting chunks and the resolution you commit. If you later rebase, cherry-pick, or merge and hit the exact same conflict in that file, Git automatically applies your previous conflict resolution without prompting you again.',
  ],
  [
    'Why is `git push --force-with-lease` essential compared to `git push --force`?',
    '`git push --force` blindly overwrites the remote branch ref with your local ref, potentially destroying commits pushed by teammates that you have not yet fetched.\n`git push --force-with-lease` checks that the remote ref still matches your local remote-tracking branch (`refs/remotes/origin/...`). If another developer pushed new commits to the branch in the meantime, the push is rejected, preventing accidental data destruction.',
  ],
  [
    'How do Git Worktrees (`git worktree`) work and why are they superior to multiple clones?',
    '`git worktree add <path> <branch>` creates multiple linked working directories attached to the single shared `.git` object store. Unlike cloning multiple repositories (which duplicates the entire history, configs, and remotes), worktrees share all objects, refs, and stashes, consume zero redundant disk space, and allow you to work on multiple branches simultaneously (e.g. running an urgent hotfix build while a long compile runs on a feature branch).',
  ],
  [
    'Compare GitFlow, GitHub Flow, and Trunk-Based Development in a high-velocity CI/CD engineering culture.',
    '- GitFlow: Heavy model with long-lived `main`, `develop`, `feature/*`, `release/*`, and `hotfix/*` branches. High merge overhead, delayed feedback, poor fit for daily continuous deployment.\n- GitHub Flow: Simpler model with `main` and short-lived feature branches merged via PRs. Great for web services with automated deployment.\n- Trunk-Based Development: All engineers merge short-lived branches (under 1-2 days) directly to `main` multiple times per day, relying on robust CI test automation and feature flags. Eliminates merge hell and enables true Continuous Integration.',
  ],
  [
    'How does `git bisect` use binary search to locate regression bugs, and how can it be automated?',
    '`git bisect start`, `git bisect bad HEAD`, and `git bisect good <known-good-commit>` performs a binary search across commit history in $O(\\log N)$ steps. Git automatically checks out the midpoint commit. You test and mark `good` or `bad`. You can fully automate this with `git bisect run <test-script>`, where the script exits 0 for good and non-zero for bad; Git will find the exact culprit commit in seconds.',
  ],
  [
    'Explain how `git reflog` works and how you can recover dangling commits after an accidental hard reset or deleted branch.',
    '`git reflog` tracks every change to HEAD and branch pointers in `.git/logs/`. When you run `git reset --hard` or delete a branch, the commit objects are NOT deleted from `.git/objects` — they just lose their named reference and become "dangling". You run `git reflog`, identify the commit SHA before the operation, and run `git switch -c recovered-branch <SHA>`. Unreferenced objects persist for at least 30 days before `git prune` cleans them.',
  ],
  [
    'What is the architectural difference between Git Submodules and Git Subtrees?',
    '- Submodules: Records an external repository URL in `.gitmodules` and pins a specific commit SHA in the parent tree. Developers must explicitly run `git submodule update --init --recursive`. The external repo history remains separated.\n- Subtrees (`git subtree`): Merges the external repository as a nested directory directly into the parent repository\'s commit tree. No special submodule commands required for collaborators, making clones seamless at the expense of repository size and slightly more complex push-back commands.',
  ],
  [
    'How do you permanently purge leaked credentials from an entire Git repository history?',
    '1. Immediately revoke/rotate the leaked credential at the cloud provider.\n2. Use the modern, high-performance tool `git-filter-repo` (not the slow, deprecated `git filter-branch`):\n   `git filter-repo --path secret.env --invert-paths --force` or `--replace-text expressions.txt`.\n3. Force-push the sanitized history to all remote branches and tags (`git push origin --force --all && git push origin --force --tags`).\n4. Instruct all team members to re-clone the clean repository.',
  ],
  [
    'How do Git Hooks work, and how do Husky and lint-staged enforce code quality in modern pipelines?',
    'Git hooks are executable scripts in `.git/hooks/` triggered at key lifecycle points (e.g. `pre-commit`, `commit-msg`, `pre-push`). Because `.git/hooks` is not committed by default, tools like Husky automate configuring the Git `core.hooksPath` to a tracked directory (e.g. `.husky/`). `lint-staged` optimizes pre-commit hooks by running linters and formatters only on files staged in the index, preventing massive slowdowns across large codebases.',
  ],
]
