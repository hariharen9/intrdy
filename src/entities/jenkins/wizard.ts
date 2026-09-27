import type { WizardNode } from '@/entities/topic'

export const JENKINS_WIZARD_TREE: Record<string, WizardNode> = {
  start: {
    q: 'What symptom is your Jenkins pipeline or controller experiencing?',
    options: [
      { label: 'Build stuck in queue ("Waiting for next available executor")', next: 'queue_stuck' },
      { label: 'Pipeline fails with "Scripts not permitted to use method ... Script Approval"', next: 'script_approval' },
      { label: 'Pipeline fails with "credentials not found" for a valid ID', next: 'creds_not_found' },
      { label: 'Secret appears in plaintext in console output', next: 'secret_leaked' },
      { label: 'Build SUCCESS but deployed artifact is stale/wrong version', next: 'stale_artifact' },
      { label: 'Webhook-triggered builds stopped firing automatically', next: 'webhook_failed' },
      { label: 'Docker step fails with permission or /var/run/docker.sock error', next: 'docker_socket' },
      { label: 'Multibranch build behaves differently across branches', next: 'branch_diverge' },
    ],
  },
  queue_stuck: {
    result: true,
    title: 'Cause: No Free Executors Matching Label Expression',
    body: 'All executors matching this job\'s required label (or all executors globally) are busy, or no agent currently online has the required label at all.',
    cmds: [
      '# 1. Check Manage Jenkins → Nodes to verify online agents & executor counts',
      '# 2. Check label expression in agent { label "..." } matches online tags',
      '# 3. For Kubernetes agents: check kubectl get pods -n jenkins-agents to see if pod provisioning failed',
    ],
  },
  script_approval: {
    result: true,
    title: 'Cause: Groovy Sandbox Blocked Non-Whitelisted Method',
    body: 'The Jenkinsfile called an arbitrary Java/Groovy method that the sandbox doesn\'t recognize as safe by default.',
    cmds: [
      '# Option A: Go to Manage Jenkins → In-process Script Approval and approve the signature',
      '# Option B (Best): Rewrite the step using native pipeline steps (sh, readFile, writeJSON) instead of raw Groovy methods',
      '# Option C: Move complex logic into a trusted Shared Library in vars/ or src/',
    ],
  },
  creds_not_found: {
    result: true,
    title: 'Cause: Credential Scope Mismatch or ID Typo',
    body: 'The credential is stored at a folder or job scope that the current pipeline cannot access, or the credentialsId has a typo.',
    cmds: [
      '# 1. Check Manage Jenkins → Credentials for exact ID spelling',
      '# 2. Check credential scope (Global vs Folder-scoped) — folder-scoped secrets are invisible to parent/sibling jobs',
      '# 3. Move or recreate the credential in a scope accessible to the target pipeline',
    ],
  },
  secret_leaked: {
    result: true,
    title: 'Cause: Groovy String Interpolation Bypassed Secret Masking',
    body: 'The secret was interpolated via Groovy double quotes ("${SECRET}") rather than passed through as a native shell environment variable, causing Jenkins log masking to fail.',
    cmds: [
      '# ❌ WRONG (leaks secret):',
      '# sh "docker login -u user -p ${DOCKER_PASS}"',
      '',
      '# ✅ CORRECT (uses single-quoted shell env variable):',
      '# withCredentials([string(credentialsId: "token", variable: "MY_TOKEN")]) {',
      '#     sh \'echo $MY_TOKEN | docker login -u user --password-stdin\'',
      '# }',
    ],
  },
  stale_artifact: {
    result: true,
    title: 'Cause: Dirty Workspace or Stash/Unstash Mismatch',
    body: 'By default, Jenkins reuses workspace directories on persistent agents. Older build artifacts or caches can leak into subsequent runs.',
    cmds: [
      '# 1. Always clean workspace at the end of every pipeline run:',
      '# post { always { cleanWs() } }',
      '# 2. Ensure checkout scm runs before any compilation or packing steps',
      '# 3. Verify stash names and unstash names match identically across stages',
    ],
  },
  webhook_failed: {
    result: true,
    title: 'Cause: Network Firewall, Expired Token, or Changed Webhook Secret',
    body: 'The Git provider (GitHub/GitLab/Bitbucket) failed to deliver the HTTP push payload to the Jenkins webhook endpoint.',
    cmds: [
      '# 1. Check GitHub/GitLab Repo Settings → Webhooks → Recent Deliveries for HTTP status codes (403/500/timeout)',
      '# 2. Verify Jenkins CSRF crumb or webhook token configured on the Git host',
      '# 3. Confirm firewall/ingress allows ingress traffic from Git provider IPs to http://<jenkins-url>/github-webhook/',
    ],
  },
  docker_socket: {
    result: true,
    title: 'Cause: Jenkins User Lacks Docker Group Access or Socket Unmounted',
    body: 'The Jenkins agent process user lacks write permissions to /var/run/docker.sock, or the socket was not mounted into the agent container.',
    cmds: [
      '# For VM agent: add jenkins user to docker group:',
      'sudo usermod -aG docker jenkins && sudo systemctl restart jenkins',
      '# For containerized agent (DooD): mount the host socket:',
      'docker run -v /var/run/docker.sock:/var/run/docker.sock ...',
    ],
  },
  branch_diverge: {
    result: true,
    title: 'Cause: Branch Stale or Has Branch-Specific Jenkinsfile',
    body: 'In a Multibranch Pipeline, each branch executes its own committed Jenkinsfile. An older feature branch may contain outdated pipeline instructions.',
    cmds: [
      '# 1. Diff the branch Jenkinsfile against main:',
      'git diff main..feature-branch -- Jenkinsfile',
      '# 2. Rebase or merge main into the feature branch to sync the latest pipeline definition',
      '# 3. Check for when { branch "main" } conditional blocks inside the Jenkinsfile',
    ],
  },
}
