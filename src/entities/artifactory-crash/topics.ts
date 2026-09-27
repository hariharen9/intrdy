import type { Topic, TopicGroup } from '@/entities/topic'

export const ARTIFACTORY_CRASH_GROUPS: TopicGroup[] = [
  {
    "id": "part-1",
    "name": "Part 1: Universal Binary Management"
  },
  {
    "id": "part-2",
    "name": "Part 2: Package Ecosystems & Registries"
  },
  {
    "id": "part-3",
    "name": "Part 3: Promotion & JFrog CLI"
  },
  {
    "id": "part-4",
    "name": "Part 4: Security, Cleanup & Cheatsheet"
  }
]

export const ARTIFACTORY_CRASH_TOPICS: Topic[] = [
  {
    "id": "art-why",
    "title": "1. Why Binary Management? Artifactory vs Git/S3",
    "group": "part-1",
    "level": "Basics",
    "sectionNo": "01",
    "category": "Architecture",
    "body": [
      {
        "t": "html",
        "html": "<div class=\"callout callout-info\"><div class=\"callout-title\">The Single Source of Truth for Binaries</div><p>Git is built for text diffs, not 2GB Docker images or compiled binaries. S3 is a dumb key-value bucket lacking package metadata, dependency resolution, versioning, and vulnerability scanning. <strong>Artifactory</strong> is the universal registry for all package types.</p></div>"
      }
    ]
  },
  {
    "id": "art-4repos",
    "title": "2. The 4 Repository Types Explained",
    "group": "part-1",
    "level": "Basics",
    "sectionNo": "02",
    "category": "Repositories",
    "body": [
      {
        "t": "html",
        "html": "<div class=\"grid grid-cols-1 md:grid-cols-2 gap-3 my-3\"><div class=\"p-3.5 rounded-xl border border-[var(--border)] bg-[var(--panel2)]\"><h4 class=\"font-bold text-[var(--accent)] text-sm\">1. Local Repositories</h4><p class=\"text-xs text-[var(--muted)] mt-1\">Physical, internal repositories where your CI builds publish proprietary binaries (e.g. <code>docker-local</code>, <code>npm-local</code>).</p></div><div class=\"p-3.5 rounded-xl border border-[var(--border)] bg-[var(--panel2)]\"><h4 class=\"font-bold text-sky-400 text-sm\">2. Remote Repositories</h4><p class=\"text-xs text-[var(--muted)] mt-1\">Smart caching proxies for public registries (Docker Hub, NPM, PyPI). Caches downloaded packages locally for speed & resilience.</p></div><div class=\"p-3.5 rounded-xl border border-[var(--border)] bg-[var(--panel2)]\"><h4 class=\"font-bold text-emerald-400 text-sm\">3. Virtual Repositories</h4><p class=\"text-xs text-[var(--muted)] mt-1\">A single unified URL that combines Local and Remote repos behind one endpoint, resolving local packages first.</p></div><div class=\"p-3.5 rounded-xl border border-[var(--border)] bg-[var(--panel2)]\"><h4 class=\"font-bold text-purple-400 text-sm\">4. Federated Repositories</h4><p class=\"text-xs text-[var(--muted)] mt-1\">Multi-region bi-directional replication ensuring low-latency artifact access across global offices and clouds.</p></div></div>"
      }
    ]
  },
  {
    "id": "art-docker-helm",
    "title": "3. Docker Registries & Helm Repositories",
    "group": "part-2",
    "level": "Intermediate",
    "sectionNo": "03",
    "category": "Registries",
    "body": [
      {
        "t": "code",
        "lang": "bash",
        "c": "# 1. Authenticate with Artifactory Docker Registry\ndocker login mycompany.jfrog.io -u user@example.com -p <ACCESS_TOKEN>\n\n# 2. Tag local image pointing to Artifactory repo\ndocker tag my-web-app:1.0.0 mycompany.jfrog.io/docker-local/my-web-app:1.0.0\n\n# 3. Push immutable image\ndocker push mycompany.jfrog.io/docker-local/my-web-app:1.0.0\n\n# 4. Pull via virtual repo endpoint in Kubernetes\ndocker pull mycompany.jfrog.io/docker-virtual/my-web-app:1.0.0"
      }
    ]
  },
  {
    "id": "art-auth-tokens",
    "title": "4. Authentication, RBAC & Scoped Access Tokens",
    "group": "part-2",
    "level": "Intermediate",
    "sectionNo": "04",
    "category": "Security",
    "body": [
      {
        "t": "p",
        "c": "Never use personal user passwords in Jenkins, GitHub Actions, or Kubernetes imagePullSecrets. Create dedicated scoped Access Tokens with minimal read/write permissions."
      },
      {
        "t": "code",
        "lang": "bash",
        "c": "# Generate token for CI service account valid for 30 days\njf access token-create --username ci-builder --scope \"applied-permissions/user\" --expiry 2592000"
      }
    ]
  },
  {
    "id": "art-promotion",
    "title": "5. The \"Build Once, Promote Anywhere\" Pipeline",
    "group": "part-3",
    "level": "Intermediate",
    "sectionNo": "05",
    "category": "Pipelines",
    "body": [
      {
        "t": "html",
        "html": "<div class=\"p-3.5 rounded-xl border border-[var(--border)] bg-[var(--panel2)] text-xs space-y-2\"><div class=\"font-bold text-[var(--accent)]\">Standard Enterprise Promotion Path:</div><ol class=\"list-decimal pl-4 space-y-1.5 text-[var(--muted)]\"><li><strong>CI Stage:</strong> Build binary once, run unit tests, publish to <code>app-dev-local</code>.</li><li><strong>QA Stage:</strong> Automated integration tests pass. Promote metadata to <code>app-staging-local</code> (zero rebuild, fast copy).</li><li><strong>Prod Gate:</strong> Security scan passes. Promote immutable binary to <code>app-prod-local</code>.</li></ol></div>"
      }
    ]
  },
  {
    "id": "art-jfrog-cli",
    "title": "6. Automating with JFrog CLI (jf)",
    "group": "part-3",
    "level": "Intermediate",
    "sectionNo": "06",
    "category": "CLI Automation",
    "body": [
      {
        "t": "code",
        "lang": "bash",
        "c": "# Configure server connection\njf c add my-artifactory --url=https://mycompany.jfrog.io --access-token=${JF_TOKEN} --interactive=false\n\n# Upload compiled release package\njf rt upload \"target/*.jar\" \"maven-local/com/mycompany/app/1.0.0/\"\n\n# Download dependencies\njf rt download \"npm-virtual/lodash/*\" ./vendor/\n\n# Publish CI Build Info (tracks exact Git SHA and dependencies used)\njf rt build-publish my-pipeline 42"
      }
    ]
  },
  {
    "id": "art-xray-cleanup",
    "title": "7. JFrog Xray Security & Storage Retention",
    "group": "part-4",
    "level": "Intermediate",
    "sectionNo": "07",
    "category": "Security & Governance",
    "body": [
      {
        "t": "p",
        "c": "JFrog Xray continuously inspects every layer of published container images and package dependencies against known CVE vulnerability databases, automatically failing CI builds if high-severity vulnerabilities or prohibited open-source licenses are detected."
      }
    ]
  },
  {
    "id": "art-wizard-topic",
    "title": "8. Interactive Repository & Access Diagnostic Wizard",
    "group": "part-4",
    "level": "Advanced",
    "sectionNo": "08",
    "category": "Troubleshooting",
    "body": [
      {
        "t": "p",
        "c": "Diagnose common Artifactory and registry issues using the interactive workflow below."
      },
      {
        "t": "wizard"
      }
    ]
  },
  {
    "id": "art-quiz-cheat",
    "title": "9. Knowledge Check & Artifactory Cheat Sheet",
    "group": "part-4",
    "level": "Advanced",
    "sectionNo": "09",
    "category": "Reference",
    "body": [
      {
        "t": "quiz",
        "questions": [
          {
            "q": "Which repository type provides a single unified URL for both internal proprietary packages and cached external dependencies?",
            "options": [
              "Local Repository",
              "Remote Repository",
              "Virtual Repository",
              "Federated Repository"
            ],
            "correct": 2,
            "explain": "Virtual Repositories aggregate multiple local and remote repositories under one single URL endpoint, simplifying client configuration."
          }
        ]
      },
      {
        "t": "cheatsheet",
        "items": [
          {
            "term": "jf rt upload <local-path> <repo-path>",
            "def": "Upload binary artifacts with checksum verification"
          },
          {
            "term": "jf rt download <repo-path> <local-path>",
            "def": "Download artifacts using parallel threads"
          },
          {
            "term": "jf rt search \"docker-local/*\"",
            "def": "Search artifacts in repository"
          },
          {
            "term": "jf rt build-collect-env <build-name> <build-no>",
            "def": "Capture environment variables for build BOM"
          },
          {
            "term": "jf rt build-publish <build-name> <build-no>",
            "def": "Publish full build metadata and dependency graph"
          },
          {
            "term": "jf rt build-promote <build-name> <build-no> <target-repo>",
            "def": "Promote build to staging or production"
          }
        ]
      }
    ]
  }
]
