import type { Topic, TopicGroup } from '@/entities/topic'

export const GIT_GROUPS: TopicGroup[] = [
  {
    "id": "foundations",
    "name": "Foundations & DAG Internals"
  },
  {
    "id": "operations",
    "name": "Daily Operations & Safe Undos"
  },
  {
    "id": "branching",
    "name": "Branching, Merging & Rebasing"
  },
  {
    "id": "advanced",
    "name": "Advanced Forensics & Extensibility"
  },
  {
    "id": "workflows",
    "name": "Branching Strategies & GitHub CI/CD"
  },
  {
    "id": "interview",
    "name": "Interview Prep & Troubleshooting"
  }
]

export const GIT_TOPICS: Topic[] = [
  {
    "id": "git-philosophy-architecture",
    "group": "foundations",
    "level": "Basics",
    "title": "What is Git & Version Control Architecture",
    "sectionNo": "01",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Before Git was created in 2005 by Linus Torvalds to manage the Linux kernel codebase, the industry relied heavily on <strong>Centralized Version Control Systems (CVCS)</strong> such as Subversion (SVN), CVS, and Perforce. Understanding how Git breaks fundamentally from CVCS is the key to understanding all of its power.</p>\n        \n        <h3>Centralized (CVCS) vs Distributed (DVCS)</h3>\n        <p>In a centralized system, there is a single central server hosting the repository database. Developers check out a single revision into their local workspace. Every log query, commit, diff, or branch creation requires a network roundtrip to the central server. If the server goes down or your VPN drops on an airplane, work stops.</p>\n        <p>In Git's <strong>Distributed Version Control System (DVCS)</strong>, every clone is a full-fledged mirror of the entire repository &mdash; including all branches, tags, full commit history, and cryptographic objects. Network access is only needed when explicitly syncing (fetching, pulling, or pushing) with remotes.</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">comparison</span></div><pre><code class=\"language-plaintext\">Centralized (SVN / CVS):\n  [Central Server: Full Repo History]\n        ▲            ▲            ▲\n        │ checkout   │ commit     │ diff\n     [Dev A]      [Dev B]      [Dev C]\n     (Only 1 file rev)\n\nDistributed (Git):\n  [Remote Hub: GitHub/GitLab]\n        ▲            ▲            ▲\n        │ push/pull  │ push/pull  │ push/pull\n  [Dev A: Full Repo] [Dev B: Full Repo] [Dev C: Full Repo]</code></pre></div>\n\n        <h3>Snapshots, Not Deltas</h3>\n        <p>The biggest conceptual difference: traditional VCS models history as a set of base files and a list of delta diffs over time. <strong>Git does not store diffs. Git stores a stream of complete filesystem snapshots over time.</strong></p>\n        <p>Every time you commit, Git creates a snapshot of all your tracked files at that exact moment. To maintain incredible speed and compact disk usage, if a file has not changed, Git does not duplicate it &mdash; it simply stores a lightweight cryptographic link (pointer) to the previous identical snapshot.</p>\n\n        <div class=\"callout\"><p><strong>Mental Model:</strong> Git is not a file tracking tool that records diffs. Git is a high-performance <em>content-addressable filesystem</em> with a Directed Acyclic Graph (DAG) commit history layer built on top.</p></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Git is distributed: Every developer machine holds the complete project database and full historical timeline.</li>\n          <li>Git stores complete filesystem snapshots, not incremental line diffs.</li>\n          <li>Identical files across commits share the exact same cryptographic SHA hash, deduplicating storage automatically.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "git-object-model",
    "group": "foundations",
    "level": "Intermediate",
    "title": "Git Object Model & The .git Directory Anatomy",
    "sectionNo": "02",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>At the core of Git is the <code>.git/</code> directory located at the root of every repository. Inside this folder lives the entire database and configuration. There are 4 fundamental immutable object types stored in <code>.git/objects/</code>:</p>\n\n        <div class=\"cards-grid\">\n          <div class=\"card\">\n            <h4>1. Blob (Binary Large Object)</h4>\n            <p>Stores raw uncompressed file contents. A blob holds only the file data &mdash; it has <em>no</em> filename, no directory path, and no permissions.</p>\n          </div>\n          <div class=\"card\">\n            <h4>2. Tree</h4>\n            <p>Represents a directory. Maps filenames and permissions (e.g. <code>100644</code> for standard file, <code>100755</code> for executable) to child blob or sub-tree SHA hashes.</p>\n          </div>\n          <div class=\"card\">\n            <h4>3. Commit</h4>\n            <p>Points to a top-level root Tree object, parent commit SHA(s), author &amp; committer info (name, email, timestamp), and the commit message.</p>\n          </div>\n          <div class=\"card\">\n            <h4>4. Annotated Tag</h4>\n            <p>An immutable named reference pointing to a specific commit SHA, with a dedicated message, tagger identity, and optional GPG signature.</p>\n          </div>\n        </div>\n\n        <h3>Content-Addressable Hashing (SHA-1 / SHA-256)</h3>\n        <p>Every object is named by the 40-character SHA-1 (or 64-character SHA-256 in modern Git) hash of its header plus payload:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Format: &lt;type&gt; &lt;size-in-bytes&gt;\\0&lt;content&gt;\n# The hash is calculated as:\nsha1(\"blob 14\\0Hello, World!\\n\")\n# =&gt; d670460b4b4aece5915caf5c68d12f560a9fe3e4</code></pre></div>\n        <p>Git takes the first 2 characters (<code>d6</code>) for the folder name under <code>.git/objects/d6/</code> and the remaining 38 characters (<code>70460b...</code>) for the file name. The file is zlib-compressed.</p>\n\n        <h3>The .git Directory Structure</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">plaintext</span></div><pre><code class=\"language-plaintext\">.git/\n├── HEAD            # Reference to currently checked out branch (e.g. ref: refs/heads/main)\n├── config          # Repository-specific configuration settings\n├── description     # Used by GitWeb\n├── hooks/          # Client and server-side automation scripts\n├── info/           # Additional info (e.g. info/exclude for private ignores)\n├── index           # Binary staging area cache (the next commit in waiting)\n├── objects/        # Immutable object database (blobs, trees, commits, tags, packfiles)\n│   ├── info/\n│   └── pack/       # Compressed packfiles (.pack) and index lookup tables (.idx)\n└── refs/           # Pointers to commits\n    ├── heads/      # Local branch pointers (e.g. refs/heads/main)\n    ├── remotes/    # Remote tracking branch pointers (e.g. refs/remotes/origin/main)\n    └── tags/       # Tag pointers</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Everything in Git is immutable and content-addressable by its SHA hash.</li>\n          <li>Blobs contain file content; Trees provide the directory structure and filenames; Commits bind trees to parent history.</li>\n          <li>Branches and tags are merely 41-byte text files holding a commit SHA inside <code>.git/refs/</code>.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "three-trees-staging",
    "group": "foundations",
    "level": "Intermediate",
    "title": "The Three Trees: Working Tree, Index & HEAD",
    "sectionNo": "03",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>To truly master Git commands without trial-and-error, you must visualize Git's internal <strong>Three Tree Architecture</strong>:</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">diagram</span></div><pre><code class=\"language-plaintext\">┌───────────────────────┐      git add       ┌───────────────────────┐     git commit     ┌───────────────────────┐\n│     Working Tree      │ ─────────────────► │  Staging Area (Index) │ ─────────────────► │      HEAD / Repo      │\n│ (Your actual files on │                    │ (Prepared next commit │                    │ (Last committed       │\n│  disk / editor)       │ ◄───────────────── │  in .git/index)       │ ◄───────────────── │  snapshot in history) │\n└───────────────────────┘    git restore     └───────────────────────┘    git reset/revert└───────────────────────┘</code></pre></div>\n\n        <h3>1. The Working Tree (Sandbox)</h3>\n        <p>This is the actual directory on your filesystem where you open files in VS Code, write code, create files, and run tests. Changes here are untracked or modified until staged.</p>\n\n        <h3>2. The Index / Staging Area (The Proposed Next Commit)</h3>\n        <p>The Index is stored in binary format at <code>.git/index</code>. It contains a list of filenames, file modes, and the corresponding blob SHAs that will form the exact tree of the <em>next</em> commit when you run <code>git commit</code>. This enables precision commits &mdash; you can stage specific files or even specific lines (<code>git add -p</code>) while keeping other local edits unstaged.</p>\n\n        <h3>3. HEAD (Last Committed Snapshot)</h3>\n        <p><code>HEAD</code> is a pointer (stored in <code>.git/HEAD</code>) to the currently active branch tip or commit. It represents the starting point for your next commit and the reference against which your working directory is compared.</p>\n\n        <h3>Plumbing vs. Porcelain Commands</h3>\n        <p>High-level user commands are called <strong>Porcelain</strong> (<code>git add</code>, <code>git commit</code>, <code>git checkout</code>). Under the hood, Git executes low-level <strong>Plumbing</strong> commands that manipulate the object database directly:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># 1. Hash a file and write the blob directly to .git/objects\necho \"production config\" | git hash-object -w --stdin\n# Output: 4c3111f18e9742617...\n\n# 2. Inspect the type and content of any object SHA\ngit cat-file -t 4c3111f18e9742617...   # Outputs: blob\ngit cat-file -p 4c3111f18e9742617...   # Outputs: production config\n\n# 3. Write index to a tree object and commit it manually\ngit write-tree\ngit commit-tree &lt;tree-sha&gt; -m \"Manual low-level plumbing commit\"</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Working tree = your filesystem; Index = staging cache of next commit; HEAD = last recorded commit snapshot.</li>\n          <li>The Index decouples disk modifications from commit creation, giving you surgical control over commit history.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "configuration-attributes",
    "group": "foundations",
    "level": "Basics",
    "title": "Configuration, .gitignore & .gitattributes",
    "sectionNo": "04",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>A properly configured Git environment prevents syntax line-ending disasters, accidental secret commits, and merge conflicts before they happen.</p>\n\n        <h3>Configuration Hierarchy (System vs Global vs Local vs Worktree)</h3>\n        <p>Git loads configurations in four cascading layers (later scopes override earlier ones):</p>\n        <ul>\n          <li><strong>System</strong> (<code>/etc/gitconfig</code>): Machine-wide settings applied to all users.</li>\n          <li><strong>Global</strong> (<code>~/.gitconfig</code> or <code>~/.config/git/config</code>): User-wide settings across all repositories.</li>\n          <li><strong>Local</strong> (<code>.git/config</code>): Specific to the current repository.</li>\n          <li><strong>Worktree</strong> (<code>.git/config.worktree</code>): Specific to an active Git worktree when enabled.</li>\n        </ul>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Essential identity configuration\ngit config --global user.name \"Alex Developer\"\ngit config --global user.email \"alex@company.com\"\n\n# Essential quality of life & modern defaults\ngit config --global init.defaultBranch main\ngit config --global pull.rebase true\ngit config --global push.autoSetupRemote true\ngit config --global core.editor \"code --wait\"\ngit config --global rerere.enabled true\n\n# Inspect all effective configs with their source file origin\ngit config --list --show-origin</code></pre></div>\n\n        <h3>.gitignore Best Practices</h3>\n        <p>Tells Git which files to never track. Rules can include globbing, directory negation, and comments:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">gitignore</span></div><pre><code class=\"language-plaintext\"># Dependencies & Build outputs\nnode_modules/\ndist/\nbuild/\n*.pyc\n__pycache__/\n\n# Environment & Secrets (NEVER COMMIT)\n.env\n.env.*.local\n*.pem\n*.key\n\n# IDE & OS noise\n.DS_Store\nThumbs.db\n.vscode/*\n!.vscode/settings.json\n!.vscode/extensions.json</code></pre></div>\n\n        <div class=\"callout danger\"><p><strong>Gotcha:</strong> If a file is <em>already</em> tracked in Git, adding it to <code>.gitignore</code> will NOT stop Git from tracking changes to it. You must untrack it first: <code>git rm --cached path/to/file</code>.</p></div>\n\n        <h3>.gitattributes &amp; End-of-Line (CRLF vs LF) Normalization</h3>\n        <p>Windows uses Carriage Return + Line Feed (<code>CRLF / \\r\\n</code>), while Linux and macOS use Line Feed (<code>LF / \\n</code>). Without configuration, Windows developers checking out a repo will see every single line in every file flagged as \"modified\".</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">gitattributes</span></div><pre><code class=\"language-plaintext\"># Set default behavior to auto normalize line endings to LF on commit\n* text=auto eol=lf\n\n# Force specific files to LF\n*.sh text eol=lf\n*.ts text eol=lf\n*.json text eol=lf\n\n# Explicit binary files (disable text conversion and diffs)\n*.png binary\n*.jpg binary\n*.pdf binary\n*.jar binary</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Use <code>git config --global pull.rebase true</code> and <code>rerere.enabled true</code> for seamless enterprise workflows.</li>\n          <li>Always establish a root <code>.gitattributes</code> with <code>* text=auto eol=lf</code> to eradicate cross-OS line ending churn.</li>\n          <li>Untrack cached files with <code>git rm --cached</code> if added to <code>.gitignore</code> post-commit.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "basic-workflow-state",
    "group": "operations",
    "level": "Basics",
    "title": "Daily Workflow & Precision State Inspection",
    "sectionNo": "05",
    "category": "Operations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>High-performing developers don't blindly run <code>git add . &amp;&amp; git commit -m \"update\"</code>. They craft clean, atomic commits using precision staging and state inspection tools.</p>\n\n        <h3>Precision Status Inspection (<code>git status -s</code>)</h3>\n        <p>The standard status output is verbose. The short format (<code>-s</code> or <code>--short</code>) gives a compact 2-column matrix of the Index (col 1) and Working Tree (col 2):</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\">git status -s\n# Output examples:\n# M  src/app.ts      (Staged modified, ready for commit)\n#  M src/config.ts   (Modified in working tree, NOT staged)\n# MM src/utils.ts    (Modified, staged, and then modified AGAIN in workspace)\n# A  src/auth.ts     (New file staged for addition)\n# ?? test/temp.txt   (Untracked file)\n# D  old-file.ts     (Staged deletion)</code></pre></div>\n\n        <h3>Precision Staging: <code>git add -p</code> (Patch Mode)</h3>\n        <p>Interactive patch staging lets you review every changed chunk (\"hunk\") in a file and choose whether to stage it (<code>y</code>), skip it (<code>n</code>), split it into smaller sub-hunks (<code>s</code>), or manually edit the diff (<code>e</code>). This ensures unrelated debug statements or experimental tweaks are never accidentally committed.</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Interactively stage hunks across all modified files\ngit add -p\n\n# Stage hunks in a specific file\ngit add -p src/server.ts</code></pre></div>\n\n        <h3>Diffing: Comparing the Three Trees</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># 1. Compare Working Tree vs Staging Area (what you haven't staged yet)\ngit diff\n\n# 2. Compare Staging Area vs HEAD (what you ARE about to commit)\ngit diff --staged\n# or: git diff --cached\n\n# 3. Compare Working Tree vs HEAD (all local changes, staged or unstaged)\ngit diff HEAD\n\n# 4. Compare between two branches or commit SHAs\ngit diff main..feature-branch\n\n# 5. Summarize file changes without printing full diff text\ngit diff --stat</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Use <code>git status -s</code> for lightning-fast 2-column state inspection.</li>\n          <li>Use <code>git add -p</code> to break large multi-feature edits into clean, atomic commits.</li>\n          <li><code>git diff</code> checks unstaged workspace edits; <code>git diff --staged</code> checks what will actually enter the commit.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "inspecting-history-logs",
    "group": "operations",
    "level": "Intermediate",
    "title": "History Exploration, Log Filtering & Blame",
    "sectionNo": "06",
    "category": "Operations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Git's commit history graph can be queried and filtered with immense precision. Mastering log filters lets you debug production regressions and audit changes effortlessly.</p>\n\n        <h3>Visual Graph Logging</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># The ultimate visual log command (create an alias for this!)\ngit log --graph --oneline --decorate --all\n\n# Output preview:\n# * a1b2c3d (HEAD -> main, origin/main) feat: add OAuth2 login flow\n# *   f9e8d7c Merge pull request #42 from team/payments\n# |# | * 55aa44b feat(billing): add stripe webhook handler\n# | * 33bb22a fix(billing): prevent duplicate charge callback\n# |/\n# * 11cc22b chore: initial production release</code></pre></div>\n\n        <h3>Advanced Log Filtering &amp; Forensics</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># 1. Pickaxe Search (-S): Find commits where a specific string was added or removed\ngit log -S \"PAYMENT_GATEWAY_SECRET\" --source --all\n\n# 2. Regex Search (-G): Find commits where modified diff hunks match a regex\ngit log -G \"function connectDatabase\\(\" -p\n\n# 3. Filter by Author, Date, or Commit Message\ngit log --author=\"Alex\" --since=\"2 weeks ago\" --grep=\"fix(auth)\"\n\n# 4. Range Queries (Double-dot vs Triple-dot)\n# A..B : Commits in branch B that are NOT in branch A (what will B merge into A)\ngit log main..feature\n\n# A...B : Commits in A OR B, but NOT in both (symmetric difference)\ngit log --left-right --boundary main...feature</code></pre></div>\n\n        <h3>Line-by-Line Investigation: <code>git blame</code> &amp; Log Follow</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Blame specific lines with author, commit SHA, and date\ngit blame -L 40,65 src/auth/jwt.ts\n\n# Ignore whitespace-only churn or format commits during blame\ngit blame -w -L 40,65 src/auth/jwt.ts\n\n# Track file history across renames and file moves\ngit log --follow -p src/controllers/userController.ts</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li><code>git log -S \"term\"</code> (pickaxe) searches the commit history for when code or variables were introduced/deleted.</li>\n          <li><code>main..feature</code> shows what commits the feature branch has that main is currently missing.</li>\n          <li>Use <code>git blame -w</code> to ignore formatting churn and find the original author of functional code.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "undoing-changes-safely",
    "group": "operations",
    "level": "Intermediate",
    "title": "Undoing Changes Safely: Restore, Reset, Revert & Clean",
    "sectionNo": "07",
    "category": "Operations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>One of the biggest friction points for developers is knowing exactly which undo tool to reach for. Git 2.23+ introduced <code>git restore</code> and <code>git switch</code> to untangle the overloaded legacy <code>git checkout</code> command.</p>\n\n        <h3>1. Discarding Workspace or Staged Edits (<code>git restore</code>)</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Discard uncommitted changes in working tree (revert file to HEAD)\ngit restore src/app.ts\n\n# Unstage a file (remove from index back to working tree, like git reset HEAD file)\ngit restore --staged src/app.ts\n\n# Restore a file to how it looked 3 commits ago\ngit restore --source=HEAD~3 src/app.ts</code></pre></div>\n\n        <h3>2. Commit Pointer Movement: <code>git reset</code> (--soft, --mixed, --hard)</h3>\n        <p><code>git reset &lt;target&gt;</code> moves the current branch pointer backwards in history. What happens to your Index and Working Tree depends on the flag:</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">comparison</span></div><pre><code class=\"language-plaintext\">Command                      HEAD Pointer      Staging Area (Index)   Working Tree (Files)\n──────────────────────────────────────────────────────────────────────────────────────────\ngit reset --soft HEAD~1      MOVES BACK        UNTOUCHED (staged)     UNTOUCHED\ngit reset --mixed HEAD~1     MOVES BACK        RESET (unstaged)       UNTOUCHED\ngit reset --hard HEAD~1      MOVES BACK        RESET                  OVERWRITTEN / LOST</code></pre></div>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Scenario 1: You committed too early, want to combine it with new edits\ngit reset --soft HEAD~1\n# Now modify more files, then commit everything cleanly.\n\n# Scenario 2: You want to completely wipe all local uncommitted changes and match remote main\ngit reset --hard origin/main</code></pre></div>\n\n        <h3>3. Safe Public Undos: <code>git revert</code></h3>\n        <p>If commits have <strong>already been pushed to a shared public branch</strong> (like <code>main</code> or <code>staging</code>), you must NEVER run <code>git reset</code> and force-push. Instead, run <code>git revert &lt;commit-sha&gt;</code>.</p>\n        <p><code>git revert</code> creates a brand-new commit that applies the exact inverse diff of the target commit, preserving chronological history and avoiding merge disasters for teammates.</p>\n\n        <h3>4. Cleaning Untracked Files: <code>git clean</code></h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Dry run: see what untracked files would be removed without deleting\ngit clean -n -d\n\n# Force delete all untracked files and directories\ngit clean -f -d\n\n# Also delete ignored files (e.g. node_modules, build artifacts)\ngit clean -f -d -x</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Use <code>git restore</code> for files, <code>git reset</code> for local private branches, and <code>git revert</code> for public pushed commits.</li>\n          <li><code>git reset --soft</code> keeps your work staged; <code>--mixed</code> keeps it in the workspace; <code>--hard</code> wipes workspace edits.</li>\n          <li>Always test <code>git clean -n -d</code> dry-run before running destructive <code>git clean -fd</code>.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "stashing-and-worktrees",
    "group": "operations",
    "level": "Advanced",
    "title": "Context Switching: Stashing vs Git Worktrees",
    "sectionNo": "08",
    "category": "Operations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>You are in the middle of a massive refactoring on <code>feature-billing</code> with 15 modified files when a high-priority production bug occurs. How do you switch contexts cleanly without creating messy \"wip\" commits?</p>\n\n        <h3>Method 1: Git Stash (The Temporary Stack)</h3>\n        <p><code>git stash</code> snapshots your current uncommitted changes (both staged and unstaged) and stores them in a local stack (<code>refs/stash</code>), giving you a pristine working tree.</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># 1. Stash with a descriptive name and include untracked files (-u)\ngit stash push -u -m \"WIP: Stripe webhook refactoring\"\n\n# 2. View all stashes in your local repository\ngit stash list\n# Output: stash@{0}: On feature-billing: WIP: Stripe webhook refactoring\n\n# 3. Apply changes and delete from stash stack\ngit stash pop\n\n# 4. Apply changes while retaining the stash entry (safer for testing)\ngit stash apply stash@{0}\n\n# 5. Create a new branch directly out of a stash\ngit stash branch new-feature-branch stash@{0}</code></pre></div>\n\n        <h3>Method 2: Git Worktrees (Concurrent Multi-Branch Development)</h3>\n        <p>While stashing is great for 5-minute interruptions, <strong>Git Worktrees</strong> are the enterprise gold standard for running multiple branches simultaneously. A worktree creates a new filesystem directory linked to the same underlying <code>.git</code> repository &mdash; sharing all objects, refs, and branches without cloning or duplicating disk space!</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Create a separate folder running the hotfix branch alongside your main work\ngit worktree add ../project-hotfix hotfix/login-bug\n\n# Now open ../project-hotfix in a second editor window, run the app, test and push!\n# Your original directory ../project remains 100% untouched with all your running builds!\n\n# List all active worktrees\ngit worktree list\n\n# Once hotfix is merged and deleted, remove the worktree\ngit worktree remove ../project-hotfix\ngit worktree prune</code></pre></div>\n\n        <div class=\"cards-grid\">\n          <div class=\"card\">\n            <h4>Git Stash</h4>\n            <p><strong>Pros:</strong> Instant, lightweight, stays in the same folder.<br/><strong>Cons:</strong> Cannot run tests or dev servers concurrently on two branches; conflicts can happen on pop.</p>\n          </div>\n          <div class=\"card\">\n            <h4>Git Worktree</h4>\n            <p><strong>Pros:</strong> True concurrent builds, zero context switching overhead, shares single .git storage.<br/><strong>Cons:</strong> Requires separate folder paths on disk.</p>\n          </div>\n        </div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Always stash with <code>git stash push -u -m \"message\"</code> so untracked files are captured.</li>\n          <li>Use <code>git worktree add &lt;path&gt; &lt;branch&gt;</code> to investigate production bugs without tearing down long-running local development builds.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "branching-mechanics-head",
    "group": "branching",
    "level": "Intermediate",
    "title": "Branching Mechanics & Detached HEAD State",
    "sectionNo": "09",
    "category": "Branching",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>In SVN or CVS, creating a branch meant copying an entire folder tree on the server &mdash; slow, heavyweight, and disk-intensive. In Git, creating a branch is instantaneous and costs exactly 41 bytes on disk.</p>\n\n        <h3>How Branches Really Work (Pointers in <code>.git/refs/heads/</code>)</h3>\n        <p>A branch in Git is simply a movable pointer to a commit SHA. If you look inside <code>.git/refs/heads/main</code>, you will find a plain text file containing a single 40-character SHA string like <code>e4d8a1...</code>.</p>\n        <p>When you commit on <code>main</code>, Git creates the new commit object with its parent set to <code>e4d8a1...</code>, and automatically updates the text file in <code>.git/refs/heads/main</code> to point to the new commit SHA.</p>\n\n        <h3>Modern Branch Management (<code>git switch</code> vs <code>git branch</code>)</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Create and switch to a new branch in one step\ngit switch -c feature/auth-v2\n\n# Switch back to main\ngit switch main\n\n# List branches with their upstream tracking and latest commit\ngit branch -vv\n\n# Safely delete a merged branch\ngit branch -d feature/auth-v2\n\n# Force delete an unmerged branch\ngit branch -D feature/abandoned-experiment</code></pre></div>\n\n        <h3>Understanding &amp; Recovering from \"Detached HEAD\"</h3>\n        <p>Normally, <code>HEAD</code> points to a branch name (symbolic ref): <code>ref: refs/heads/main</code>. When you check out a specific commit hash, a remote tracking branch, or a tag (e.g. <code>git checkout v1.0.0</code> or <code>git switch --detach a1b2c3d</code>), <code>HEAD</code> points directly to the commit SHA itself.</p>\n\n        <div class=\"callout warn\"><p><strong>The Detached HEAD Danger:</strong> You can edit files and make commits in detached HEAD state. However, because no branch pointer points to those new commits, if you switch back to <code>main</code>, those new commits become <strong>orphaned / dangling</strong> and will eventually be permanently deleted by Git's garbage collector (<code>git gc</code>)!</p></div>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># How to safely rescue commits made in Detached HEAD:\n# Simply create a new branch at your current detached commit before switching away!\ngit switch -c rescue-my-work</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Branches are just 41-byte text files holding a commit SHA. Creating a branch is $O(1)$ instantaneous.</li>\n          <li>HEAD is the pointer to \"where you are right now\".</li>\n          <li>If in detached HEAD, run <code>git switch -c &lt;branch-name&gt;</code> to anchor your new commits to a named reference.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "merging-conflict-resolution",
    "group": "branching",
    "level": "Intermediate",
    "title": "Merge Strategies, Fast-Forward & Conflict Resolution",
    "sectionNo": "10",
    "category": "Branching",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Merging combines two or more commit histories into a unified snapshot. Understanding merge strategies prevents phantom regressions and messy commit spaghetti.</p>\n\n        <h3>1. Fast-Forward Merge</h3>\n        <p>If the target branch (<code>main</code>) has not received any new commits since the feature branch was created, Git simply moves the <code>main</code> pointer forward to the tip of <code>feature</code>. No new commit object is created.</p>\n\n        <h3>2. Three-Way Merge (ORT / Recursive)</h3>\n        <p>If both <code>main</code> and <code>feature</code> have diverged with independent commits, a fast-forward is impossible. Git identifies the <strong>Merge Base</strong> (the most recent common ancestor commit) and performs a 3-way diff between Base, Main, and Feature, generating a new <strong>Merge Commit</strong> with two parent pointers.</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">diagram</span></div><pre><code class=\"language-plaintext\">Fast-Forward:\n  A ─── B (main) ─── C ─── D (feature)\n  Result: main simply slides forward to D.\n\n3-Way Merge (Diverged):\n          C ─── D (feature)\n         /         A ─── B (Base)                    ▼\n          E ────── M (Merge Commit with 2 parents: D and E)</code></pre></div>\n\n        <h3>Merge Options: <code>--ff</code>, <code>--no-ff</code>, and <code>--squash</code></h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># 1. Standard merge (fast-forwards if possible)\ngit merge feature\n\n# 2. Force a merge commit even if fast-forward is possible (preserves branch context)\ngit merge --no-ff feature\n\n# 3. Squash merge: Condenses all feature commits into a single staged change without merge parents\ngit merge --squash feature\ngit commit -m \"feat: implement complete billing subsystem (#102)\"</code></pre></div>\n\n        <h3>Anatomy of a Merge Conflict &amp; Resolution</h3>\n        <p>When both branches modify the same lines in a file, Git halts the merge and inserts conflict markers:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">plaintext</span></div><pre><code class=\"language-plaintext\">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (Current branch / main)\nconst API_URL = \"https://api.production.internal\";\n=======\nconst API_URL = \"https://api.edge.staging.internal\";\n&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/edge-routing (Incoming branch)</code></pre></div>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># 1. Identify conflicting files\ngit status\n\n# 2. View 3-way diff comparison\ngit diff\n\n# 3. Open in configured merge tool (VS Code, KDiff3, etc.)\ngit mergetool\n\n# 4. After fixing markers, stage the resolved file\ngit add src/config.ts\n\n# 5. Complete the merge commit\ngit commit\n\n# Or abort completely if you made a mistake:\ngit merge --abort</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Fast-Forward moves the pointer forward; 3-way merge calculates diffs against the common ancestor.</li>\n          <li>Squash merges condense messy work-in-progress feature commits into one clean entry on trunk.</li>\n          <li>Always use <code>git merge --abort</code> to reset safely if conflict resolution goes awry.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "rebasing-interactive-surgery",
    "group": "branching",
    "level": "Advanced",
    "title": "Rebase Deep Dive & Interactive History Surgery",
    "sectionNo": "11",
    "category": "Branching",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>While <code>git merge</code> preserves non-linear history with merge commits, <code>git rebase</code> replays your commits one by one on top of another base tip, producing a clean, perfectly linear project history.</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">diagram</span></div><pre><code class=\"language-plaintext\">Before Rebase:\n          C ─── D (feature)\n         /\n  A ─── B ─── E ─── F (main)\n\nAfter 'git switch feature &amp;&amp; git rebase main':\n  A ─── B ─── E ─── F (main) ─── C' ─── D' (feature)\n  (Note: C' and D' are BRAND NEW commit objects with new SHA hashes!)</code></pre></div>\n\n        <div class=\"callout danger\"><p><strong>The Golden Rule of Rebasing:</strong> NEVER rebase commits that have been pushed to a public/shared branch where other developers are actively basing their work. Rebasing rewrites commit SHA hashes, causing massive divergence for your team.</p></div>\n\n        <h3>Interactive Rebase (<code>git rebase -i</code>)</h3>\n        <p>Interactive rebase is the Swiss Army knife for cleaning up local commit history before opening a Pull Request:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Rebase the last 4 commits interactively\ngit rebase -i HEAD~4</code></pre></div>\n\n        <p>Git opens your editor with a list of commands for each commit:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">plaintext</span></div><pre><code class=\"language-plaintext\">pick a1b2c3d feat: add database migration for users table\nreword f4e5d6c wip user endpoints  # reword = change commit message\nsquash 99aa88b fix typo in schema  # squash = combine into previous commit\nfixup 77bb66c add missing semicolon # fixup = combine like squash, discard message\ndrop 33cc22a console.log testing   # drop = completely remove commit\n\n# Commands:\n# p, pick &lt;commit&gt; = use commit\n# r, reword &lt;commit&gt; = use commit, but edit commit message\n# e, edit &lt;commit&gt; = use commit, but stop for amending\n# s, squash &lt;commit&gt; = meld into previous commit, combine log messages\n# f, fixup &lt;commit&gt; = like \"squash\", but discard this commit's log message\n# d, drop &lt;commit&gt; = remove commit entirely</code></pre></div>\n\n        <h3>Automating Conflict Memory with <code>git rerere</code></h3>\n        <p><code>rerere</code> stands for <strong>Reuse Recorded Resolution</strong>. When rebasing a long-running branch multiple times against main, you might resolve the exact same merge conflict repeatedly. Enabling <code>rerere</code> tells Git to memorize how you resolved a hunk and apply it automatically next time!</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Enable rerere globally\ngit config --global rerere.enabled true\ngit config --global rerere.autoupdate true</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Rebase creates brand-new commit SHAs by replaying changes on top of the target branch.</li>\n          <li>Use <code>git rebase -i</code> to squash \"wip/fix typo\" commits into polished, atomic semantic commits.</li>\n          <li>Enable <code>rerere</code> to let Git resolve recurring rebase conflicts automatically.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "remotes-tracking-refspecs",
    "group": "branching",
    "level": "Intermediate",
    "title": "Remotes, Tracking Branches & Refspecs",
    "sectionNo": "12",
    "category": "Branching",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Remote repositories (GitHub, GitLab, self-hosted Bitbucket) allow distributed teams to synchronize commit graphs. Mastering remote-tracking branches and push safety is essential for DevOps pipelines.</p>\n\n        <h3>Remote Tracking Branches</h3>\n        <p>When you clone or fetch, Git creates read-only remote-tracking references under <code>.git/refs/remotes/origin/</code> (e.g. <code>origin/main</code>). These represent the state of the remote repository the last time you communicated with it.</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># 1. Fetch all new objects and update origin/* pointers without touching local workspace\ngit fetch origin --prune\n\n# 2. View local and remote-tracking branches\ngit branch -a -vv\n\n# 3. Pull with Rebase (Modern standard: prevents unnecessary merge bubble commits)\ngit pull --rebase origin main\n\n# 4. Push and set upstream tracking (-u)\ngit push -u origin feature/new-auth</code></pre></div>\n\n        <h3>Why <code>--force-with-lease</code> is Mandatory in CI/CD</h3>\n        <p>After rebasing or amending a feature branch, you must force push to update the remote branch. Never use naked <code>git push --force</code>!</p>\n        <div class=\"callout danger\"><p><strong>The Force Push Disaster:</strong> <code>git push --force</code> blindly overwrites the remote branch. If a teammate or CI bot pushed a new commit to that branch 2 minutes ago, <code>--force</code> will permanently destroy their work. <code>git push --force-with-lease</code> checks that the remote branch ref matches your local remote-tracking ref. If someone else pushed, the command safely aborts.</p></div>\n\n        <h3>Understanding Refspecs</h3>\n        <p>In <code>.git/config</code>, you will find refspec rules mapping remote refs to local refs:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">ini</span></div><pre><code class=\"language-ini\">[remote \"origin\"]\n    url = git@github.com:company/app.git\n    fetch = +refs/heads/*:refs/remotes/origin/*</code></pre></div>\n        <p>The <code>+</code> sign forces non-fast-forward updates to local tracking refs. The wildcard maps every branch on <code>origin</code> into <code>refs/remotes/origin/</code>.</p>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li><code>git fetch</code> downloads objects safely; <code>git pull</code> combines fetch + merge/rebase.</li>\n          <li>Always use <code>git push --force-with-lease</code> instead of <code>git push --force</code>.</li>\n          <li>Use <code>git fetch --prune</code> to clean up local references to deleted remote branches.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "reflog-disaster-recovery",
    "group": "advanced",
    "level": "Advanced",
    "title": "Git Reflog & Catastrophic Disaster Recovery",
    "sectionNo": "13",
    "category": "Advanced",
    "body": [
      {
        "t": "html",
        "html": "\n        <p><strong>\"There are almost no permanent mistakes in Git, only unreferenced objects.\"</strong> Git rarely deletes commits immediately. When you run a destructive command like <code>git reset --hard</code> or delete a branch with <code>git branch -D</code>, Git simply moves or deletes the pointer &mdash; the commit objects remain intact in <code>.git/objects/</code> for 30 to 90 days.</p>\n\n        <h3>The Magic of <code>git reflog</code></h3>\n        <p>Git maintains a local log (stored in <code>.git/logs/HEAD</code>) recording every time <code>HEAD</code> or a branch pointer moved (checkouts, commits, rebases, resets, merges).</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># View HEAD movement history\ngit reflog\n\n# Output example:\n# f9a8b7c HEAD@{0}: reset: moving to HEAD~2\n# a1b2c3d HEAD@{1}: commit: add production payment gateway\n# 88ee77d HEAD@{2}: commit: implement stripe webhook listener\n# 44cc55a HEAD@{3}: checkout: moving from main to feature-billing</code></pre></div>\n\n        <h3>Disaster Recovery Scenario: Restoring a Hard Reset</h3>\n        <p>You accidentally executed <code>git reset --hard HEAD~2</code> and lost 2 days of work:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># 1. Find the commit SHA from before the reset in reflog:\n# It was at HEAD@{1} (SHA: a1b2c3d)\n\n# 2. Point a new branch at that lost commit state:\ngit switch -c recovered-work a1b2c3d\n\n# Everything is 100% restored!</code></pre></div>\n\n        <h3>Recovering Dangling Objects via <code>git fsck</code></h3>\n        <p>If a commit was made in detached HEAD or stashes were dropped, you can search for unreferenced objects using the filesystem check tool:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Find all dangling (orphaned) commits in the repository\ngit fsck --lost-found\n\n# Inspect what a dangling commit contains\ngit show &lt;dangling-commit-sha&gt;\n\n# Re-attach it to a branch\ngit branch rescued-work &lt;dangling-commit-sha&gt;</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li><code>git reflog</code> is your local black box flight recorder for all HEAD pointer movements.</li>\n          <li>Commits are not deleted during resets; they simply become unreferenced \"dangling\" objects.</li>\n          <li>Use <code>git fsck --lost-found</code> to find dropped stashes or detached HEAD commits.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "git-bisect-debugging",
    "group": "advanced",
    "level": "Advanced",
    "title": "Binary Bug Hunting with git bisect",
    "sectionNo": "14",
    "category": "Advanced",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Suppose a regression bug was introduced somewhere across 500 commits in the last 2 months. Manually checking out and testing commits one by one is agonizing. <strong><code>git bisect</code> uses binary search ($O(\\log N)$) to find the exact commit that introduced the bug in fewer than 9 steps.</strong></p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">diagram</span></div><pre><code class=\"language-plaintext\">500 commits:\n  [Good: v1.0.0] ──────────────────────────────────────────► [Bad: HEAD (Regression)]\n                         Step 1: Check Commit 250 (Good)\n                                       │\n                                       ▼\n                         [Commit 250] ─────────────► [HEAD]\n                                Step 2: Check Commit 375 (Bad)\n                                       │\n                                       ▼\n                         [Commit 250] ────► [Commit 375]\n                         (Locates culprit in ~9 checks instead of 500!)</code></pre></div>\n\n        <h3>Manual Bisect Walkthrough</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># 1. Start the bisect session\ngit bisect start\n\n# 2. Tell Git the current commit has the bug\ngit bisect bad\n\n# 3. Tell Git a known good commit or release tag where the bug was absent\ngit bisect good v1.0.0\n\n# Git checks out the midpoint commit automatically:\n# Bisecting: 249 revisions left to test after this (roughly 8 steps)\n\n# 4. Run your tests. If it passes:\ngit bisect good\n# If it fails:\ngit bisect bad\n\n# 5. Repeat until Git prints the exact culprit commit author, date, and diff!\n# 6. Clean up and return to your original branch:\ngit bisect reset</code></pre></div>\n\n        <h3>Automating Bisect with <code>git bisect run</code></h3>\n        <p>If you have an automated test script or unit test that exits with code <code>0</code> (success / good) and non-zero (failure / bad), Git can find the culprit completely autonomously in 5 seconds:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\">git bisect start HEAD v1.0.0\n# Let Git run the test automatically across the binary tree:\ngit bisect run npm test -- test/auth.spec.ts\n\n# Output:\n# 3a1f9e8 is the first bad commit\n# commit 3a1f9e89d98...\n# Author: Alex <alex@company.com>\n# Date:   Wed Jun 12 14:22:00 2026\n#     refactor(auth): migrate token validation logic</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li><code>git bisect</code> searches 1,000 commits in ~10 iterations via binary search.</li>\n          <li><code>git bisect run &lt;script&gt;</code> fully automates regression hunting using exit codes (0 = good, 1-127 = bad).</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "submodules-and-subtrees",
    "group": "advanced",
    "level": "Advanced",
    "title": "Managing Nested Code: Submodules vs Subtrees",
    "sectionNo": "15",
    "category": "Advanced",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>When sharing shared libraries, schemas, or design systems across multiple projects, you need to decide how to structure repository boundaries. Git provides two built-in mechanisms: <strong>Submodules</strong> and <strong>Subtrees</strong>.</p>\n\n        <h3>1. Git Submodules (Pointer Reference Model)</h3>\n        <p>A submodule keeps an external Git repository inside a subdirectory of your main repository. The parent repository does <em>not</em> store the submodule's files or commit history &mdash; it only records the remote URL in <code>.gitmodules</code> and pins a specific <strong>commit SHA</strong>.</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># 1. Add a submodule to your project\ngit submodule add git@github.com:company/shared-proto.git libs/proto\n\n# 2. Cloning a repository that contains submodules\ngit clone --recurse-submodules git@github.com:company/backend.git\n# Or in an existing clone:\ngit submodule update --init --recursive\n\n# 3. Pull latest upstream commits into the submodule\ngit submodule update --remote --merge</code></pre></div>\n\n        <h3>2. Git Subtrees (Nested Commit Tree Model)</h3>\n        <p><code>git subtree</code> merges the external repository's content directly into the parent repository's tree. To team members, the directory looks like regular files &mdash; no <code>.gitmodules</code>, no <code>submodule init</code> commands required.</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Add external repo as a subtree prefix\ngit subtree add --prefix=libs/proto git@github.com:company/shared-proto.git main --squash\n\n# Pull updates from external repo into subtree\ngit subtree pull --prefix=libs/proto git@github.com:company/shared-proto.git main --squash\n\n# Push local edits in libs/proto back to the external repo\ngit subtree push --prefix=libs/proto git@github.com:company/shared-proto.git main</code></pre></div>\n\n        <div class=\"cards-grid\">\n          <div class=\"card\">\n            <h4>Submodules</h4>\n            <p><strong>Pros:</strong> Clear separation, explicit commit pinning, lightweight parent repo.<br/><strong>Cons:</strong> Complex developer ergonomics (detached heads, forgets to init/update).</p>\n          </div>\n          <div class=\"card\">\n            <h4>Subtrees</h4>\n            <p><strong>Pros:</strong> Zero setup for contributors (just git clone), works like normal code.<br/><strong>Cons:</strong> Larger repo size, complex subtree push commands for library maintainers.</p>\n          </div>\n        </div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Submodules pin a single commit SHA in <code>.gitmodules</code>; Subtrees merge full content directly into the tree.</li>\n          <li>Always clone with <code>git clone --recurse-submodules</code> when working on submodule-based repositories.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "git-hooks-automation",
    "group": "advanced",
    "level": "Advanced",
    "title": "Git Hooks & Client/Server Automation",
    "sectionNo": "16",
    "category": "Advanced",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Git hooks are custom shell scripts triggered at key points in the Git lifecycle (pre-commit, commit-msg, pre-push, post-receive). They enforce code quality, secret scanning, and commit formatting before code reaches CI/CD.</p>\n\n        <h3>Client-Side vs Server-Side Hooks</h3>\n        <ul>\n          <li><strong>Client-Side:</strong> Run locally on the developer's machine (<code>pre-commit</code>, <code>commit-msg</code>, <code>prepare-commit-msg</code>, <code>pre-push</code>). Can be bypassed with <code>--no-verify</code>.</li>\n          <li><strong>Server-Side:</strong> Run on GitHub Enterprise / GitLab server (<code>pre-receive</code>, <code>update</code>, <code>post-receive</code>). Cannot be bypassed by clients; used to enforce compliance and branch protection.</li>\n        </ul>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">diagram</span></div><pre><code class=\"language-plaintext\">Developer Action:\n  git commit ───► [pre-commit hook] ───► [commit-msg hook] ───► Commit Created\n                      (Linter/Typecheck)      (Conventional Commit Lint)\n\n  git push   ───► [pre-push hook]   ───► Remote Network Transfer\n                      (Run Unit Tests)              │\n                                                    ▼\n                                         [Server: pre-receive hook]\n                                         (Scans secrets, verifies GPG signature)</code></pre></div>\n\n        <h3>Modern Hook Management: Husky &amp; lint-staged</h3>\n        <p>By default, <code>.git/hooks/</code> is not tracked in version control. <strong>Husky</strong> configures Git's <code>core.hooksPath</code> to point to a committed directory (<code>.husky/</code>), ensuring all team members execute identical quality checks.</p>\n        <p><strong>lint-staged</strong> ensures linters only run against files currently in the staging area (Index), taking 200ms instead of 30 seconds on large codebases.</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">json</span></div><pre><code class=\"language-json\">// package.json configuration for lint-staged\n{\n  \"lint-staged\": {\n    \"*.{ts,tsx}\": [\n      \"eslint --fix\",\n      \"prettier --write\"\n    ],\n    \"*.json\": [\n      \"prettier --write\"\n    ]\n  }\n}</code></pre></div>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># .husky/commit-msg hook enforcing conventional commits via commitlint\nnpx --no -- commitlint --edit \"$1\"</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Client hooks prevent bad commits locally; Server hooks enforce compliance that clients cannot bypass.</li>\n          <li>Pair Husky with <code>lint-staged</code> for sub-second pre-commit linting.</li>\n          <li>Use <code>commit-msg</code> hooks with <code>commitlint</code> to enforce semantic commit messages.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "branching-strategies",
    "group": "workflows",
    "level": "Advanced",
    "title": "Branching Strategies Compared: GitFlow vs GitHub Flow vs Trunk-Based",
    "sectionNo": "17",
    "category": "Workflows",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Selecting the correct branching strategy is one of the most critical architectural decisions for an engineering organization. It directly governs deployment frequency, lead time for changes, and merge conflict overhead.</p>\n\n        <div class=\"cards-grid\">\n          <div class=\"card\">\n            <h4>1. GitFlow</h4>\n            <p><strong>Structure:</strong> Two perpetual branches (<code>main</code> and <code>develop</code>) plus <code>feature/*</code>, <code>release/*</code>, and <code>hotfix/*</code> branches.<br/>\n            <strong>Best For:</strong> Legacy scheduled releases (mobile app stores, packaged desktop software, embedded systems).<br/>\n            <strong>Drawback:</strong> High merge overhead, long lead times, poor fit for modern CI/CD.</p>\n          </div>\n          <div class=\"card\">\n            <h4>2. GitHub Flow</h4>\n            <p><strong>Structure:</strong> Single long-lived <code>main</code> branch. Short-lived feature branches created for each task, merged into <code>main</code> via Pull Request and immediately deployed.<br/>\n            <strong>Best For:</strong> Web applications, SaaS products with continuous delivery pipelines.<br/>\n            <strong>Drawback:</strong> Requires strong automated test coverage on PRs.</p>\n          </div>\n          <div class=\"card\">\n            <h4>3. Trunk-Based Development (TBD)</h4>\n            <p><strong>Structure:</strong> All developers merge small, frequent commits into the single <code>main</code> (trunk) branch multiple times per day. Feature branches live &lt; 1-2 days.<br/>\n            <strong>Best For:</strong> High-performing engineering teams (DORA elite performers), microservices.<br/>\n            <strong>Requirement:</strong> Feature Flags / Toggles for in-progress work, comprehensive CI automation.</p>\n          </div>\n        </div>\n\n        <h3>Architectural Comparison Matrix</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">comparison</span></div><pre><code class=\"language-plaintext\">Dimension                GitFlow                 GitHub Flow             Trunk-Based Development\n───────────────────────────────────────────────────────────────────────────────────────────────\nRelease Cadence          Bi-weekly / Monthly     Daily                   Multiple times per day\nBranch Lifespan          Weeks to Months         2 - 5 days              &lt; 24 hours\nMerge Conflict Risk      Extreme (Merge Hell)    Moderate                Near Zero\nCI/CD Compatibility      Poor                    Good                    Elite / Native\nIn-Progress Code         Hidden on branch        Hidden on branch        Feature Flags / Dark Launch\nMain Branch State        Tagged releases only    Deployable production   Always deployable trunk</code></pre></div>\n\n        <h3>The Trunk-Based Workflow in Practice</h3>\n        <ol>\n          <li>Developer branches from latest <code>origin/main</code>: <code>git switch -c feat/user-bio</code>.</li>\n          <li>Builds small incremental changes protected by a feature toggle.</li>\n          <li>Opens small PR (under 200 lines of code). CI tests run in 3 minutes.</li>\n          <li>Teammate reviews within 2 hours. PR is rebased/squashed and merged into <code>main</code>.</li>\n          <li>Automated CD pipeline deploys <code>main</code> to staging and production automatically.</li>\n        </ol>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Trunk-Based Development is the proven standard for high-velocity CI/CD engineering teams.</li>\n          <li>Feature flags decouple code deployment from feature release, eliminating long-lived feature branches.</li>\n          <li>Keep PR sizes under 200-300 lines of code for fast, rigorous reviews.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "github-workflows-prs",
    "group": "workflows",
    "level": "Intermediate",
    "title": "GitHub Enterprise Workflows, PRs & Code Review",
    "sectionNo": "18",
    "category": "Workflows",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Enterprise source control governance ensures that code merged into production is peer-reviewed, cryptographically signed, compliant, and passes all security guardrails.</p>\n\n        <h3>Forking Model vs Shared Repository Model</h3>\n        <ul>\n          <li><strong>Shared Repository Model:</strong> Engineers push feature branches directly to the central repo (<code>origin/feature-auth</code>) with branch protection rules on <code>main</code>. Standard for internal enterprise teams.</li>\n          <li><strong>Forking Model:</strong> Engineers fork the repository into their personal account namespace, push there, and open cross-repository Pull Requests. Standard for open-source and untrusted contractors.</li>\n        </ul>\n\n        <h3>Branch Protection Rules &amp; Rulesets</h3>\n        <p>GitHub Branch Protection rules enforce non-negotiable safety policies on trunk branches:</p>\n        <ul>\n          <li><strong>Require pull request reviews before merging:</strong> Require at least 1-2 approvals, dismiss stale reviews when new commits are pushed.</li>\n          <li><strong>Require status checks to pass before merging:</strong> Block merge until CI tests, linters, and security scans succeed.</li>\n          <li><strong>Require branches to be up to date before merging:</strong> Enforces testing against the latest trunk state.</li>\n          <li><strong>Require linear history:</strong> Disallow merge bubble commits; require squash or rebase merges.</li>\n          <li><strong>Require signed commits:</strong> Reject unsigned commits.</li>\n        </ul>\n\n        <h3>Automating Code Ownership: <code>CODEOWNERS</code></h3>\n        <p>Place a <code>.github/CODEOWNERS</code> file in your repository root to automatically assign specific teams or individuals as required PR reviewers based on modified file paths:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">plaintext</span></div><pre><code class=\"language-plaintext\"># Global default fallback owner\n* @org/core-engineering\n\n# Security and authentication files require SecOps approval\n/src/auth/          @org/security-team\n/.github/workflows/ @org/devops-leads\n\n# Database migrations require DBA review\n/migrations/        @org/data-platform\n*.sql               @org/data-platform</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Use <code>.github/CODEOWNERS</code> to automate review routing based on changed file paths.</li>\n          <li>Enable branch protection with required linear history and required CI status checks on <code>main</code>.</li>\n          <li>Squash or Rebase merges keep trunk history clean and easy to audit.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "conventional-commits-semver",
    "group": "workflows",
    "level": "Intermediate",
    "title": "Conventional Commits, SemVer & Release Automation",
    "sectionNo": "19",
    "category": "Workflows",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>When commit messages follow a standardized machine-readable schema, tools can automatically determine the next Semantic Version, generate release notes, and deploy packages to npm, Docker Hub, or Kubernetes.</p>\n\n        <h3>Conventional Commits Specification</h3>\n        <p>The message format is structured as: <code>&lt;type&gt;[optional scope]: &lt;description&gt;</code></p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">plaintext</span></div><pre><code class=\"language-plaintext\">feat(auth): add OAuth2 PKCE login support\nfix(billing): prevent double billing on stripe webhook timeout\ndocs(readme): update Kubernetes deployment instructions\nchore(deps): bump typescript from 5.4 to 5.5\nrefactor(router): simplify route registration middleware\nperf(db): add composite index to users table\n\n# Breaking Changes (triggers MAJOR version bump):\nfeat(api)!: remove deprecated v1 user endpoints\n# or in footer:\nBREAKING CHANGE: The v1 authentication header format is no longer accepted.</code></pre></div>\n\n        <h3>Semantic Versioning (SemVer) Mapping</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">comparison</span></div><pre><code class=\"language-plaintext\">Commit Type                     SemVer Increment    Example\n─────────────────────────────────────────────────────────────────────────────\nfix(...)                        PATCH (x.y.Z)       1.2.3 -&gt; 1.2.4\nfeat(...)                       MINOR (x.Y.0)       1.2.3 -&gt; 1.3.0\nBREAKING CHANGE or feat(...!)   MAJOR (X.0.0)       1.2.3 -&gt; 2.0.0</code></pre></div>\n\n        <h3>Automated Release Pipelines: semantic-release &amp; Changesets</h3>\n        <p>In modern automated pipelines, developers never manually edit <code>package.json</code> version or write <code>CHANGELOG.md</code>. When a PR merges to <code>main</code>:</p>\n        <ol>\n          <li><code>semantic-release</code> analyzes commits since the last Git tag.</li>\n          <li>Calculates the new version (e.g. <code>2.4.0</code>).</li>\n          <li>Generates updated <code>CHANGELOG.md</code> entries automatically categorized by feature/fix.</li>\n          <li>Creates a Git tag (<code>v2.4.0</code>) and publishes GitHub Release assets.</li>\n        </ol>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Conventional Commits turn your commit history into machine-readable changelog feeds.</li>\n          <li><code>feat!</code> or <code>BREAKING CHANGE</code> triggers major SemVer bumps; <code>feat</code> triggers minor; <code>fix</code> triggers patch.</li>\n          <li>Tools like <code>semantic-release</code> and Changesets eliminate manual release errors completely.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "security-signing-lfs",
    "group": "workflows",
    "level": "Advanced",
    "title": "Git Security: Commit Signing, Secrets Scrubbing & Git LFS",
    "sectionNo": "20",
    "category": "Workflows",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>In production and compliance-regulated environments (SOC2, ISO27001), repository security is paramount. Anyone can spoof author names in Git commits without cryptographic verification.</p>\n\n        <h3>1. Cryptographic Commit Signing (SSH &amp; GPG)</h3>\n        <p>Anyone can run <code>git config user.name \"Linus Torvalds\"</code> and make a commit. Commit signing cryptographically proves that the commit author is truly who they claim to be, granting the green \"Verified\" badge on GitHub.</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Modern approach: Sign commits using your existing SSH Key!\ngit config --global gpg.format ssh\ngit config --global user.signingkey ~/.ssh/id_ed25519.pub\ngit config --global commit.gpgsign true\n\n# Now every commit is signed automatically:\ngit commit -m \"feat: verified secure commit\"</code></pre></div>\n\n        <h3>2. Secrets Scrubbing: <code>git-filter-repo</code></h3>\n        <div class=\"callout danger\"><p><strong>Warning:</strong> The legacy tool <code>git filter-branch</code> is officially deprecated and dangerously slow. Use <code>git-filter-repo</code> to sanitize repositories.</p></div>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># 1. Install git-filter-repo\npip install git-filter-repo\n\n# 2. Completely remove a sensitive file (.env or credentials.json) from all history\ngit filter-repo --path .env --invert-paths --force\n\n# 3. Replace all occurrences of an API key string across entire history\necho \"SUPER_SECRET_KEY_12345==>REDACTED_KEY\" > expressions.txt\ngit filter-repo --replace-text expressions.txt --force\n\n# 4. Force push sanitized history across all branches and tags\ngit push origin --force --all\ngit push origin --force --tags</code></pre></div>\n\n        <h3>3. Git LFS (Large File Storage)</h3>\n        <p>Git stores whole snapshots of files. If you commit a 200MB video, ML model weights, or game asset, every single clone forever will download 200MB per modified version, bloating the repo to gigabytes. <strong>Git LFS</strong> replaces large files with tiny 100-byte text pointer files in Git, storing the actual binary payloads in a dedicated S3/Blob store.</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Install and track binary extensions\ngit lfs install\ngit lfs track \"*.psd\"\ngit lfs track \"*.onnx\"\ngit lfs track \"*.mp4\"\n\n# Ensure .gitattributes is staged\ngit add .gitattributes\ngit commit -m \"chore: configure Git LFS tracking for media and ML models\"</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Configure SSH commit signing with <code>commit.gpgsign true</code> for instant verified cryptographic signatures.</li>\n          <li>Always use <code>git-filter-repo</code> (not <code>filter-branch</code>) to scrub leaked credentials from history.</li>\n          <li>Use Git LFS to keep repositories fast and lightweight when dealing with large assets or ML models.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "git-troubleshoot-wizard",
    "group": "interview",
    "level": "Advanced",
    "title": "Interactive Git Emergency & Troubleshoot Wizard",
    "sectionNo": "21",
    "category": "Interview",
    "body": [
      {
        "t": "p",
        "c": "Hit an unexpected Git emergency? Stuck in a conflict, lost commits after a hard reset, or accidentally committed secrets? Use our interactive diagnostic decision tree to get the exact safe commands to recover right now."
      },
      {
        "t": "wizard"
      }
    ]
  },
  {
    "id": "git-quiz",
    "group": "interview",
    "level": "Intermediate",
    "title": "Git Comprehensive Knowledge Quiz",
    "sectionNo": "22",
    "category": "Interview",
    "body": [
      {
        "t": "quiz",
        "questions": [
          {
            "q": "What does Git actually store in its object database for each commit?",
            "options": [
              "A base file plus a chain of forward delta diffs for modified lines",
              "A complete snapshot of all tracked files in the project tree via the DAG",
              "A compressed patch file sent to the central remote server",
              "A list of file checksums without the file contents"
            ],
            "correct": 1,
            "explain": "Git stores complete filesystem snapshots using its Directed Acyclic Graph (DAG) object model (Blobs, Trees, and Commits). Unchanged files are deduplicated by pointing to identical existing blob SHAs."
          },
          {
            "q": "Which command moves the branch pointer back 1 commit while leaving your modified files staged in the Index ready to re-commit?",
            "options": [
              "git reset --hard HEAD~1",
              "git reset --mixed HEAD~1",
              "git reset --soft HEAD~1",
              "git revert HEAD"
            ],
            "correct": 2,
            "explain": "git reset --soft moves only the HEAD branch pointer backwards; your staging area and working tree are untouched, leaving all changes staged."
          },
          {
            "q": "What is the primary danger of running 'git push --force' compared to 'git push --force-with-lease'?",
            "options": [
              "git push --force is slower because it invalidates Git packfiles",
              "git push --force will blindly overwrite and destroy commits pushed by teammates that you have not fetched locally",
              "git push --force triggers automated CI rollback webhooks",
              "git push --force cannot be used with SSH keys"
            ],
            "correct": 1,
            "explain": "git push --force blindly overwrites the remote reference. --force-with-lease verifies that the remote ref still matches your local remote tracking ref, safely aborting if a teammate pushed new work."
          },
          {
            "q": "What happens when you enter 'Detached HEAD' state in Git?",
            "options": [
              "The local repository is corrupted and must be re-cloned",
              "HEAD points directly to an explicit commit hash instead of a named branch reference",
              "All staged files are automatically deleted",
              "Git enters read-only mode and refuses to stage any changes"
            ],
            "correct": 1,
            "explain": "Detached HEAD means HEAD is pointing directly to a commit SHA. Any new commits will be orphaned if you switch branches without creating a new named branch (e.g. git switch -c <name>)."
          },
          {
            "q": "In Trunk-Based Development, how do developers prevent uncompleted long-term features from breaking the main production trunk?",
            "options": [
              "By keeping long-lived feature branches for several weeks until everything is complete",
              "By disabling automated deployments to staging",
              "By using Feature Flags (Feature Toggles) to hide unfinished code paths in production",
              "By only committing once per sprint"
            ],
            "correct": 2,
            "explain": "Trunk-Based Development relies on Feature Flags/Toggles so small, daily incremental commits can be safely merged into trunk and deployed continuously without exposing unfinished features to users."
          }
        ]
      }
    ]
  },
  {
    "id": "git-cheatsheet",
    "group": "interview",
    "level": "Basics",
    "title": "Git Command & Scenario Reference Sheet",
    "sectionNo": "23",
    "category": "Interview",
    "body": [
      {
        "t": "cheatsheet",
        "items": [
          {
            "term": "git status -s",
            "def": "2-column short status view showing Index (staged) and Workspace (unstaged) state."
          },
          {
            "term": "git add -p",
            "def": "Interactive patch staging. Review, stage, split, or skip individual change hunks."
          },
          {
            "term": "git diff --staged",
            "def": "Compares the staging area (Index) against HEAD to preview the exact upcoming commit."
          },
          {
            "term": "git switch -c <name>",
            "def": "Modern command to create and switch to a new branch in a single atomic step."
          },
          {
            "term": "git reset --soft HEAD~1",
            "def": "Undoes the last commit but keeps all modified changes staged in the Index."
          },
          {
            "term": "git reset --hard HEAD~1",
            "def": "Destructively rolls back 1 commit, wiping staging area and working tree changes."
          },
          {
            "term": "git revert <commit-sha>",
            "def": "Creates a new inverse commit that safely undos a public pushed commit without history rewriting."
          },
          {
            "term": "git stash push -u -m 'msg'",
            "def": "Saves uncommitted modifications including untracked files into the stash stack."
          },
          {
            "term": "git worktree add <path> <branch>",
            "def": "Creates a separate working folder sharing the same repository database for true concurrent development."
          },
          {
            "term": "git rebase -i HEAD~N",
            "def": "Interactive rebase to squash, edit, reword, or drop the last N commits."
          },
          {
            "term": "git push --force-with-lease",
            "def": "Safely force-pushes rebased branches only if no teammate pushed new commits remotely."
          },
          {
            "term": "git reflog",
            "def": "Displays the log of all HEAD pointer movements for disaster recovery of lost commits."
          },
          {
            "term": "git bisect run <script>",
            "def": "Automated binary search through commit history to find the exact regression culprit."
          },
          {
            "term": "git filter-repo",
            "def": "High-performance modern tool to permanently purge secrets or large binary files from history."
          }
        ]
      }
    ]
  },
  {
    "id": "git-interview-qa",
    "group": "interview",
    "level": "Advanced",
    "title": "Senior & Staff DevOps Git Interview Bank",
    "sectionNo": "24",
    "category": "Interview",
    "body": [
      {
        "t": "troubleshoot",
        "items": [
          {
            "scenario": "Senior Interview: 'How does Git handle file renames and why is there no explicit rename object?'",
            "diagnosis": "Unlike SVN or TFS which track explicit rename metadata events, Git does not store rename objects. Blobs only hold content.",
            "fix": "Git calculates renames dynamically at diff/merge time by comparing object content similarity hashes (default 50% similarity threshold). If a file is deleted at path A and created at path B with similar content, Git detects it as a rename (R100 or R95) with zero extra metadata storage."
          },
          {
            "scenario": "Production Emergency: 'A junior engineer merged a broken PR and pushed 5 subsequent commits on main. How do you roll back the bad merge safely?'",
            "diagnosis": "Running git reset on public shared main will break everyone's local clones. Reverting a merge commit requires specifying the parent number.",
            "fix": "Run `git revert -m 1 <merge-commit-sha>`. The `-m 1` flag tells Git to keep the mainline parent (parent 1) and revert the changes introduced by the merged feature branch (parent 2) in a safe, non-destructive commit."
          },
          {
            "scenario": "Staff SRE: 'A 50GB Git repository takes 20 minutes to clone in CI. How do you optimize Git CI/CD checkout performance?'",
            "diagnosis": "CI runners do not need the complete 10-year history or all remote branches to run tests on a single commit.",
            "fix": "1. Use shallow clones: `git clone --depth=1 --no-single-branch`\n2. Use Blobless / Treeless sparse clones: `git clone --filter=blob:none <url>`\n3. Use sparse checkouts (`git sparse-checkout set /src/app`) for monorepos\n4. Migrate large binary files to Git LFS."
          }
        ]
      }
    ]
  }
]
