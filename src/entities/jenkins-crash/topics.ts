import type { Topic, TopicGroup } from '@/entities/topic'

export const JENKINS_CRASH_GROUPS: TopicGroup[] = [
  {
    "id": "part-1",
    "name": "Part 1: Architecture & Mental Models"
  },
  {
    "id": "part-2",
    "name": "Part 2: Declarative Jenkinsfile Anatomy"
  },
  {
    "id": "part-3",
    "name": "Part 3: Advanced Pipeline Control"
  },
  {
    "id": "part-4",
    "name": "Part 4: Troubleshooting & Cheat Sheet"
  }
]

export const JENKINS_CRASH_TOPICS: Topic[] = [
  {
    "id": "jen-arch",
    "title": "1. Jenkins Architecture & The Controller-Agent Model",
    "group": "part-1",
    "level": "Basics",
    "sectionNo": "01",
    "category": "Architecture",
    "body": [
      {
        "t": "html",
        "html": "<div class=\"callout callout-info\"><div class=\"callout-title\">Golden Rule of Jenkins Scalability</div><p>The <strong>Controller</strong> is the orchestrator (UI, auth, build queue, Jenkinsfile parser). <strong>Agents</strong> are the workhorses (running compilers, unit tests, and docker builds). Never execute heavy build workloads on the Controller!</p></div><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 my-4\"><div class=\"p-4 rounded-xl border border-[var(--border)] bg-[var(--panel2)]\"><h4 class=\"font-bold text-[var(--accent)] mb-1\">🎮 Controller (Master)</h4><p class=\"text-xs text-[var(--muted)]\">Handles webhooks, parses pipeline scripts, logs console output, manages credentials, and dispatches jobs to agents.</p></div><div class=\"p-4 rounded-xl border border-[var(--border)] bg-[var(--panel2)]\"><h4 class=\"font-bold text-emerald-400 mb-1\">⚡ Agents (Nodes / Pods)</h4><p class=\"text-xs text-[var(--muted)]\">Static VMs or ephemeral Kubernetes Pods/Docker containers that execute tasks inside isolated workspaces.</p></div></div>"
      }
    ]
  },
  {
    "id": "jen-pipeline-vs-free",
    "title": "2. Pipeline as Code vs Freestyle Jobs",
    "group": "part-1",
    "level": "Basics",
    "sectionNo": "02",
    "category": "CI/CD Philosophy",
    "body": [
      {
        "t": "p",
        "c": "Freestyle jobs store build configuration directly in the Jenkins web UI. If the server crashes or config changes, there is no audit trail. Pipeline as Code commits the build logic into a Jenkinsfile stored alongside application code in Git."
      },
      {
        "t": "html",
        "html": "<div class=\"p-4 rounded-xl border border-[var(--border)] bg-[var(--panel2)] text-xs space-y-2\"><div class=\"font-bold text-[var(--text)]\">Benefits of Pipeline as Code:</div><ul class=\"list-disc pl-4 space-y-1 text-[var(--muted)]\"><li><strong>Versioned with code:</strong> Changes to build pipelines are reviewed via Pull Requests.</li><li><strong>Branch aware:</strong> Feature branches can modify the pipeline without impacting the main branch.</li><li><strong>Disaster Recovery:</strong> Recreating jobs on a fresh Jenkins server requires zero manual GUI clicks.</li></ul></div>"
      }
    ]
  },
  {
    "id": "jen-anatomy",
    "title": "3. Anatomy of a Declarative Jenkinsfile",
    "group": "part-2",
    "level": "Intermediate",
    "sectionNo": "03",
    "category": "Declarative Syntax",
    "body": [
      {
        "t": "code",
        "lang": "groovy",
        "c": "pipeline {\n    agent any\n\n    options {\n        timeout(time: 30, unit: 'MINUTES')\n        buildDiscarder(logRotator(numToKeepStr: '20'))\n    }\n\n    stages {\n        stage('Checkout') {\n            steps {\n                checkout scm\n            }\n        }\n        stage('Build') {\n            steps {\n                echo 'Building application...'\n                sh 'npm install'\n            }\n        }\n        stage('Test') {\n            steps {\n                echo 'Running unit test suite...'\n                sh 'npm test'\n            }\n        }\n    }\n}"
      }
    ]
  },
  {
    "id": "jen-sh-tools",
    "title": "4. Executing Shell Steps & Tool Auto-Installation",
    "group": "part-2",
    "level": "Intermediate",
    "sectionNo": "04",
    "category": "Execution",
    "body": [
      {
        "t": "code",
        "lang": "groovy",
        "c": "pipeline {\n    agent any\n\n    tools {\n        nodejs 'Node-20'\n        jdk 'JDK-17'\n    }\n\n    stages {\n        stage('Compile & Test') {\n            steps {\n                sh '''\n                    node -v\n                    npm run build\n                    npm run test:coverage\n                '''\n            }\n        }\n    }\n}"
      }
    ]
  },
  {
    "id": "jen-credentials",
    "title": "5. Secure Credentials & Environment Variables",
    "group": "part-2",
    "level": "Intermediate",
    "sectionNo": "05",
    "category": "Security",
    "body": [
      {
        "t": "p",
        "c": "Jenkins integrates with a built-in credentials store. Declarative pipelines automatically mask secrets in console output."
      },
      {
        "t": "code",
        "lang": "groovy",
        "c": "pipeline {\n    agent any\n\n    environment {\n        DOCKER_CREDS = credentials('dockerhub-login') \n        SONAR_TOKEN  = credentials('sonar-api-key')\n    }\n\n    stages {\n        stage('Publish') {\n            steps {\n                sh '''\n                    echo \"Logging in as $DOCKER_CREDS_USR...\"\n                    echo $DOCKER_CREDS_PSW | docker login -u $DOCKER_CREDS_USR --password-stdin\n                '''\n            }\n        }\n    }\n}"
      }
    ]
  },
  {
    "id": "jen-when-post",
    "title": "6. Conditional Execution & Post-Build Actions",
    "group": "part-3",
    "level": "Intermediate",
    "sectionNo": "06",
    "category": "Pipeline Logic",
    "body": [
      {
        "t": "code",
        "lang": "groovy",
        "c": "pipeline {\n    agent any\n\n    stages {\n        stage('Deploy to Prod') {\n            when {\n                branch 'main'\n            }\n            steps {\n                sh './deploy.sh production'\n            }\n        }\n    }\n\n    post {\n        always {\n            cleanWs()\n        }\n        success {\n            echo 'Build succeeded! Notifying team...'\n        }\n        failure {\n            echo 'Build failed! Paging on-call engineer...'\n        }\n    }\n}"
      }
    ]
  },
  {
    "id": "jen-parallel",
    "title": "7. Parallel Stages & Matrix Builds",
    "group": "part-3",
    "level": "Intermediate",
    "sectionNo": "07",
    "category": "Optimization",
    "body": [
      {
        "t": "code",
        "lang": "groovy",
        "c": "stage('Parallel Quality Checks') {\n    parallel {\n        stage('Unit Tests') {\n            steps {\n                sh 'npm run test:unit'\n            }\n        }\n        stage('E2E Tests') {\n            steps {\n                sh 'npm run test:e2e'\n            }\n        }\n        stage('Security Lint') {\n            steps {\n                sh 'npm run audit'\n            }\n        }\n    }\n}"
      }
    ]
  },
  {
    "id": "jen-docker-agents",
    "title": "8. Ephemeral CI with Docker Agents",
    "group": "part-3",
    "level": "Intermediate",
    "sectionNo": "08",
    "category": "Containers",
    "body": [
      {
        "t": "p",
        "c": "Rather than maintaining bloated build agents with 10 different JDK and Node versions, instruct Jenkins to spin up a Docker container on-demand."
      },
      {
        "t": "code",
        "lang": "groovy",
        "c": "pipeline {\n    agent {\n        docker {\n            image 'golang:1.22-alpine'\n            args '-v /tmp/cache:/go/pkg/mod'\n        }\n    }\n\n    stages {\n        stage('Compile') {\n            steps {\n                sh 'go version'\n                sh 'go build -v ./...'\n            }\n        }\n    }\n}"
      }
    ]
  },
  {
    "id": "jen-artifacts",
    "title": "9. Artifact Archiving & Test Result Publishing",
    "group": "part-3",
    "level": "Intermediate",
    "sectionNo": "09",
    "category": "Artifacts",
    "body": [
      {
        "t": "code",
        "lang": "groovy",
        "c": "stages {\n    stage('Test') {\n        steps {\n            sh 'mvn test'\n        }\n        post {\n            always {\n                junit 'target/surefire-reports/*.xml'\n            }\n        }\n    }\n    stage('Package') {\n        steps {\n            sh 'mvn package -DskipTests'\n            archiveArtifacts artifacts: 'target/*.jar', fingerprint: true\n        }\n    }\n}"
      }
    ]
  },
  {
    "id": "jen-wizard-topic",
    "title": "10. Interactive Pipeline Triage & Diagnostic Wizard",
    "group": "part-4",
    "level": "Advanced",
    "sectionNo": "10",
    "category": "Troubleshooting",
    "body": [
      {
        "t": "p",
        "c": "Select the symptoms of your failing Jenkins pipeline below to get an instant diagnosis and resolution path."
      },
      {
        "t": "wizard"
      }
    ]
  },
  {
    "id": "jen-quiz-cheat",
    "title": "11. Knowledge Check & Jenkinsfile Cheat Sheet",
    "group": "part-4",
    "level": "Advanced",
    "sectionNo": "11",
    "category": "Reference",
    "body": [
      {
        "t": "quiz",
        "questions": [
          {
            "q": "Which post {} condition runs ONLY when the previous build failed but the current build succeeded?",
            "options": [
              "success",
              "fixed",
              "changed",
              "regression"
            ],
            "correct": 1,
            "explain": "\"fixed\" triggers specifically when the pipeline was previously in a failed/unstable state and just transitioned back to success."
          }
        ]
      },
      {
        "t": "cheatsheet",
        "items": [
          {
            "term": "agent { label 'linux-node' }",
            "def": "Run build on node with specific label"
          },
          {
            "term": "agent { docker { image 'node:20' } }",
            "def": "Run build inside an ephemeral container"
          },
          {
            "term": "options { timeout(time: 1, unit: 'HOURS') }",
            "def": "Fail build if it runs longer than 1 hour"
          },
          {
            "term": "environment { APP_ENV = 'production' }",
            "def": "Declare global pipeline environment variables"
          },
          {
            "term": "triggers { cron('H 2 * * *') }",
            "def": "Run nightly build every day at 2 AM"
          },
          {
            "term": "triggers { pollSCM('H/15 * * * *') }",
            "def": "Poll Git every 15 minutes for new commits"
          },
          {
            "term": "cleanWs()",
            "def": "Wipe workspace directory to save disk space"
          }
        ]
      }
    ]
  }
]
