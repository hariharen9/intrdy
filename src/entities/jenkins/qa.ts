import type { QAItem } from '@/entities/topic'

export const jenkinsQAFundamentals: QAItem[] = [
  [
    'What is the core difference between the Jenkins Controller and Jenkins Agents?',
    'The Controller is the orchestration brain of the system: it hosts the web UI, stores configurations, job definitions, credentials, and build history in $JENKINS_HOME, and manages the build queue.\n\nAgents (formerly slaves) are worker nodes that actually execute the build steps. In production, controller executors should always be set to 0 so the controller only coordinates and never runs untrusted or heavy build workloads directly.',
  ],
  [
    'What are the mandatory top-level blocks in a Declarative Pipeline?',
    'Every Declarative Pipeline requires two blocks:\n1. `agent`: specifies where the pipeline (or stage) runs (e.g. `any`, `{ label "linux" }`, `{ docker { ... } }`, `{ kubernetes { ... } }`).\n2. `stages`: contains one or more `stage("Name") { steps { ... } }` blocks defining the actual workflow actions.\n\nAll other blocks (`options`, `environment`, `parameters`, `triggers`, `post`) are optional.',
  ],
  [
    'What is the difference between build statuses: SUCCESS, UNSTABLE, and FAILURE?',
    '• SUCCESS: All stages and steps finished with exit code 0 without issues.\n• UNSTABLE: The build completed all stages, but a non-fatal check failed — most commonly unit test failures reported via the `junit` step. The pipeline continues through `post` blocks.\n• FAILURE: A step errored out (e.g. non-zero exit code, compilation crash, syntax error).\n• ABORTED: Manually stopped by a user or cancelled by a timeout.',
  ],
  [
    'Why is Declarative Pipeline preferred over Scripted Pipeline for modern teams?',
    'Declarative Pipeline provides a clean, opinionated structure with built-in syntax validation and automatic visualization in the Blue Ocean / stage view UI. It makes pipelines readable and standardized across hundreds of repos.\n\nScripted Pipeline is raw Groovy executed in a `node {}` block. While more flexible, it easily becomes unmaintainable. Modern best practice is to default to Declarative and use the `script {}` block only for isolated Groovy logic (loops, complex maps) where strictly needed.',
  ],
  [
    'How do Multibranch Pipelines work and why are they standard for Git workflows?',
    'A Multibranch Pipeline job automatically scans an entire git repository (or whole GitHub/GitLab Organization), discovers every branch and pull request containing a `Jenkinsfile`, and automatically provisions a sub-job for each.\n\nWhen a new branch is pushed, a build starts immediately. When a branch is deleted, the sub-job is pruned. Each branch runs its own committed `Jenkinsfile`, allowing feature branches to safely test pipeline modifications without altering `main`.',
  ],
  [
    'How does withCredentials() securely inject secrets without leaking to console logs?',
    '`withCredentials()` binds stored, encrypted credentials from Jenkins\'s credential store to scoped environment variables for the duration of the enclosed block only.\n\nJenkins automatically masks known credential values in console output (replacing them with `****`). However, secrets must always be referenced as shell environment variables in single quotes (`sh \'echo $PASSWORD\'`), not Groovy double-quoted string interpolation (`"${PASSWORD}"`), which bypasses masking.',
  ],
  [
    'What is the difference between stash/unstash and archiveArtifacts?',
    '• `stash / unstash`: Short-lived, temporary file transfer between stages that may run on completely different agents within a single build run. Automatically discarded when the build finishes.\n• `archiveArtifacts`: Long-term persistence of build output (e.g. jars, tarballs, test logs) stored directly on the Jenkins controller and downloadable from the build history UI.',
  ],
  [
    'Why should you prefer webhooks over SCM polling for build triggers?',
    'Webhooks are push-based and near-instant: when a developer runs `git push`, the Git host sends an HTTP POST request to Jenkins, triggering a build in milliseconds with minimal resource overhead.\n\nSCM polling (`pollSCM`) periodically checks the repository on a cron schedule, creating unnecessary network/API traffic and introducing latency between commit and build execution.',
  ],
  [
    'What is the meaning of the "H" token in Jenkins cron triggers?',
    '`H` stands for "Hash". Instead of thousands of scheduled jobs firing simultaneously at `00:00` (which would overwhelm the controller with a thundering herd problem), `H(0-7) * * * *` computes a stable, pseudo-random minute offset based on the job name, spreading execution evenly across the hour.',
  ],
  [
    'How does post { changed { ... } } help prevent notification fatigue?',
    '`post { changed { ... } }` fires only when the current build result differs from the immediately preceding build. This sends alerts exclusively when a build breaks ("green to red") or when a broken build is fixed ("back to green"), completely eliminating repetitive success notifications on every commit.',
  ],
]

export const jenkinsQAAdvanced: QAItem[] = [
  [
    'How do Jenkins dynamic Kubernetes agents work under the hood?',
    'With the Jenkins Kubernetes plugin, the controller runs as a lightweight pod, and every build provisions a brand-new, ephemeral agent Pod from a YAML pod template. The pod can contain multiple container images (e.g. `maven`, `docker`, `kubectl`).\n\nThe `container(\'name\')` step switches execution between sidecars within the shared pod workspace. Once the pipeline finishes, the entire agent pod is destroyed, eliminating VM patching, idle costs, and state pollution between builds.',
  ],
  [
    'Explain DooD (Docker-outside-of-Docker) vs DinD (Docker-in-Docker) in CI pipelines.',
    '• DooD (Docker-outside-of-Docker): Mounts the host\'s `/var/run/docker.sock` into the containerized agent. Build steps talk directly to the host Docker daemon. It is fast, lightweight, and does not require `--privileged` mode.\n• DinD (Docker-in-Docker): Runs a nested Docker daemon inside the container. It requires `--privileged` permissions, creates storage driver overhead, and introduces security vulnerabilities. In production CI/CD, DooD or rootless build tools (like Kaniko) are preferred.',
  ],
  [
    'What is Jenkins Configuration as Code (JCasC) and why is it essential for DR?',
    'JCasC captures the entire Jenkins controller configuration (security realm, LDAP/SAML auth, clouds, credentials references, global tools, system settings) in a single version-controlled YAML file (`jenkins.yaml`).\n\nCombined with a custom Dockerfile specifying `plugins.txt`, disaster recovery transforms from days of manual UI reconfiguration into rebuilding and deploying a clean container from git in minutes.',
  ],
  [
    'How do Jenkins Shared Libraries scale pipeline governance across large engineering orgs?',
    'A Shared Library is a separate Git repo containing reusable Groovy logic organized into `vars/` (global custom steps like `buildAndPush.groovy`) and `src/` (standard Groovy utility classes).\n\nEngineers load it in their `Jenkinsfile` with `@Library(\'shared-lib@v2.1\') _`. This allows a central Platform/DevOps team to enforce security scans, notifications, container standards, and compliance gates across hundreds of microservices without duplicating code.',
  ],
  [
    'How do you handle production approval gates in Continuous Delivery without holding agent resources?',
    'Use the `input` step wrapped inside a `timeout` block at a stage without an agent allocated (`agent none`):\n```groovy\nstage(\'Approve Prod\') {\n    steps {\n        timeout(time: 24, unit: \'HOURS\') {\n            input message: \'Promote to Production?\', submitter: \'release-managers\'\n        }\n    }\n}\n```\nThis pauses execution until an authorized human signs off, while the `timeout` ensures abandoned builds abort rather than keeping state open forever.',
  ],
  [
    'How does the Groovy Sandbox and Script Approval protect the Jenkins Controller?',
    'Pipeline Groovy scripts execute inside a restricted sandbox that intercepts method calls to prevent arbitrary JVM execution, file manipulation outside the workspace, or reflection exploits.\n\nIf a script uses a method not in the default whitelist, execution pauses until an administrator explicitly reviews and approves the signature under *Manage Jenkins → In-process Script Approval*. Trusted Shared Libraries can be configured to bypass the sandbox safely under admin governance.',
  ],
  [
    'How do you troubleshoot a build stuck with "Waiting for next available executor"?',
    '1. Inspect *Manage Jenkins → Nodes* to verify agent nodes are online and have available executor slots.\n2. Verify the pipeline\'s `agent { label "..." }` matches exact label tags on active agents.\n3. If using dynamic Kubernetes agents, check `kubectl get pods -n jenkins-agents` and `kubectl describe pod` to inspect pod scheduling delays, quota limits, or image pull errors.',
  ],
  [
    'How do you optimize slow pipelines running on large monorepos?',
    '1. Use shallow clones with `depth: 1` (`extensions: [[$class: "CloneOption", shallow: true, depth: 1]]`) to avoid pulling gigabytes of git history.\n2. Parallelize independent testing and linting stages using `parallel { ... }`.\n3. Cache dependency folders (`~/.npm`, `~/.m2`, `~/.cache/go-build`) via volume mounts on agents.\n4. Use Docker layer caching with BuildKit (`DOCKER_BUILDKIT=1`) or remote registry cache backends.',
  ],
  [
    'Why must you back up $JENKINS_HOME/secrets along with configuration data?',
    'All stored credentials in Jenkins (passwords, private SSH keys, tokens) are encrypted at rest using a master key stored in `$JENKINS_HOME/secrets/master.key`.\n\nIf you restore `$JENKINS_HOME` onto a new server or container without the `secrets/` directory, all existing credentials become permanently unrecoverable and undecryptable.',
  ],
  [
    'How does Jenkins compare against hosted CI platforms (GitHub Actions, GitLab CI, CircleCI)?',
    '• Jenkins: Self-hosted, completely free (pay only for your underlying infra), maximum control over data sovereignty/network isolation, and the largest plugin catalog (2000+). Higher operational overhead.\n• GitHub Actions / GitLab CI: Cloud-managed SaaS (with self-hosted runners optional), YAML workflows, seamless integration with pull requests and developer workflows, near-zero ops maintenance, but governed by SaaS usage-minute billing.',
  ],
]
