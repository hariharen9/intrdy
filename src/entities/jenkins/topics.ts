import type { Topic, TopicGroup } from '@/entities/topic'

export const JENKINS_GROUPS: TopicGroup[] = [
  {
    "id": "foundations",
    "name": "Foundations"
  },
  {
    "id": "pipelines",
    "name": "Pipelines — the core skill"
  },
  {
    "id": "intermediate",
    "name": "Intermediate practices"
  },
  {
    "id": "advanced",
    "name": "Advanced / production-grade"
  },
  {
    "id": "interview",
    "name": "Interview prep"
  }
]

export const JENKINS_TOPICS: Topic[] = [
  {
    "id": "what-is-cicd",
    "group": "foundations",
    "level": "Basics",
    "title": "What is CI/CD & where Jenkins fits",
    "sectionNo": "01",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>You already write code and probably run <code>git push</code> a dozen times a day. <strong>Continuous Integration (CI)</strong> is the practice of automatically building and testing that code every time it changes, so problems surface in minutes, not weeks. <strong>Continuous Delivery/Deployment (CD)</strong> extends that automation to packaging and shipping the app to staging or production.</p>\n        <h3>Where Jenkins sits</h3>\n        <p>Jenkins is an open-source <strong>automation server</strong>. It doesn't compile your code or run your tests itself &mdash; it orchestrates the tools that do (Maven, npm, pytest, Docker, kubectl, Terraform...). Think of it as a very reliable, scriptable robot that watches your repo and runs whatever shell/Groovy instructions you give it, on a schedule or on every commit.</p>\n        <div class=\"callout\"><p><strong>Mental model:</strong> Jenkins = a job scheduler + a pipeline engine + a huge plugin ecosystem that glues your SCM, build tools, test frameworks, artifact stores and deployment targets together.</p></div>\n        <h3>Why it still matters in 2026</h3>\n        <p>Newer hosted tools (GitHub Actions, GitLab CI, CircleCI) have taken a lot of greenfield projects, but Jenkins remains dominant in large enterprises because it's <strong>self-hosted</strong> (full control over data, network, compliance), <strong>free</strong>, and has the deepest plugin ecosystem for legacy and heterogeneous environments. As a DevOps engineer you will very likely meet it at any company more than a few years old.</p>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>CI = automatically build/test on every change. CD = automatically deliver/deploy the result.</li>\n          <li>Jenkins is an orchestrator, not the build tool itself &mdash; it calls out to Maven/Gradle/npm/Docker/etc.</li>\n          <li>Its biggest strengths: self-hosted control, maturity, and an enormous plugin catalog (2000+ plugins).</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "architecture",
    "group": "foundations",
    "level": "Basics",
    "title": "Architecture: Controller & Agents",
    "sectionNo": "02",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Jenkins runs as a Java process called the <strong>controller</strong> (older docs/plugins still say \"master\"). The controller hosts the web UI, stores configuration, schedules builds and holds the plugin ecosystem. It should almost never run your actual build steps &mdash; that's what <strong>agents</strong> (formerly \"slaves\") are for.</p>\n        <h3>Controller vs. Agent</h3>\n        <ul>\n          <li><strong>Controller</strong>: brain of the system. Keeps job definitions, credentials, build history, and the scheduling queue in <code>$JENKINS_HOME</code>.</li>\n          <li><strong>Agent</strong>: a separate machine/container/pod that actually executes build steps. Connects to the controller over SSH, JNLP/WebSocket, or is spun up on-demand (Docker, Kubernetes).</li>\n          <li><strong>Executor</strong>: a slot on an agent (or controller) that can run one build at a time. An agent with 4 executors can run 4 builds concurrently.</li>\n        </ul>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">diagram</span></div><pre><code class=\"language-plaintext\">Browser/webhook\n      │\n      ▼\n ┌─────────────┐   schedules jobs, stores config,\n │  Controller │   serves UI, holds the build queue\n └─────┬───────┘\n       │ SSH / JNLP / WebSocket\n   ┌───┼─────────┬─────────────┐\n   ▼   ▼         ▼             ▼\n Agent1(linux) Agent2(docker) Agent3(k8s pod, ephemeral)\n [2 executors] [4 executors]  [spun up per build, then destroyed]</code></pre></div>\n        <h3>Why distribute builds at all?</h3>\n        <p>Running everything on the controller doesn't scale and is a security risk (build scripts get controller-level filesystem access). Production setups keep the controller lightweight and push all real work to a fleet of agents &mdash; static VMs, a Docker host, or a Kubernetes cluster that creates a fresh pod per build and throws it away afterward.</p>\n        <div class=\"callout danger\"><p><strong>Common interview trap:</strong> \"master/slave\" is the old terminology; current Jenkins and its docs use <strong>controller/agent</strong>. Know both, but use controller/agent.</p></div>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Controller = orchestration brain. Agent = where builds actually execute.</li>\n          <li>Executors are concurrency slots on a node (controller or agent).</li>\n          <li>Never run heavy or untrusted builds directly on the controller.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "install-first-run",
    "group": "foundations",
    "level": "Basics",
    "title": "Installing Jenkins & first login",
    "sectionNo": "03",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>You can run Jenkins as a WAR file with a bundled Java, as a native package (apt/yum), or &mdash; by far the most common way today &mdash; as a Docker container.</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-bash\">docker run -d --name jenkins \\\n  -p 8080:8080 -p 50000:50000 \\\n  -v jenkins_home:/var/jenkins_home \\\n  jenkins/jenkins:lts-jdk17</code></pre></div>\n        <p>Port <strong>8080</strong> serves the web UI. Port <strong>50000</strong> is used for legacy JNLP agent connections. The named volume <code>jenkins_home</code> is critical &mdash; it holds every job, plugin, credential and build record; lose it and you lose everything.</p>\n        <h3>First-run unlock & setup wizard</h3>\n        <p>On first boot Jenkins prints an initial admin password to the container logs (also saved at <code>/var/jenkins_home/secrets/initialAdminPassword</code>). You paste that into the browser, then choose \"Install suggested plugins\" (fine for learning; in production you curate the plugin list), then create your first admin user.</p>\n        <div class=\"callout\"><p><strong>Tip:</strong> in real environments, Jenkins is almost never installed manually more than once &mdash; teams use <strong>Configuration as Code (JCasC)</strong> and a custom Docker image so a fresh controller can be rebuilt identically in minutes. We cover that in the Advanced module.</p></div>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Docker is the fastest, most common way to run Jenkins for learning and increasingly for production too.</li>\n          <li><code>JENKINS_HOME</code> is the single most important directory &mdash; back it up.</li>\n          <li>Port 8080 = UI, 50000 = legacy inbound agent connections.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "dashboard-concepts",
    "group": "foundations",
    "level": "Basics",
    "title": "Dashboard & core concepts",
    "sectionNo": "04",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Before touching pipelines, get the vocabulary solid &mdash; interviewers love checking this.</p>\n        <ul>\n          <li><strong>Job / Project</strong>: a configured unit of work (a Freestyle job, a Pipeline, a Multibranch Pipeline...).</li>\n          <li><strong>Build</strong>: one execution of a job, numbered sequentially (#42, #43...).</li>\n          <li><strong>Workspace</strong>: the directory on the agent where a job's files (checked-out source, build output) live during a build. By default reused between builds of the same job on the same agent.</li>\n          <li><strong>Build queue</strong>: builds waiting for a free executor.</li>\n          <li><strong>Console output</strong>: the full log of a specific build &mdash; your first stop when debugging a failure.</li>\n          <li><strong>Views / Folders</strong>: ways to organize many jobs in the UI.</li>\n        </ul>\n        <h3>Build lifecycle at a glance</h3>\n        <p>Trigger fires (webhook/cron/manual) &rarr; job enters the <strong>queue</strong> &rarr; Jenkins finds a matching, free <strong>executor</strong> &rarr; workspace is prepared &rarr; steps run &rarr; result is recorded as <strong>SUCCESS</strong>, <strong>UNSTABLE</strong>, <strong>FAILURE</strong>, or <strong>ABORTED</strong>.</p>\n        <div class=\"callout\"><p><strong>SUCCESS vs UNSTABLE vs FAILURE:</strong> a build is <strong>UNSTABLE</strong> when it completed but something non-fatal failed, most commonly test failures reported via the <code>junit</code> step. <strong>FAILURE</strong> means a step errored out (e.g. compile error, non-zero exit code). This distinction is a favorite interview question.</p></div>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Workspace = per-job working directory on an agent; can go stale, which is why <code>cleanWs()</code> exists.</li>\n          <li>Know the four build results and what causes each.</li>\n          <li>Console output is your primary debugging tool &mdash; always read it top to bottom, don't just look at the last line.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "freestyle-jobs",
    "group": "foundations",
    "level": "Basics",
    "title": "Freestyle jobs",
    "sectionNo": "05",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Before Pipeline existed, every job was a <strong>Freestyle project</strong>: a form-based UI where you configure source control, a trigger, a sequence of build steps (\"Execute shell\", \"Invoke Maven\"...) and post-build actions, all through clicking, not code.</p>\n        <div class=\"callout danger\"><p><strong>Reality check:</strong> almost no modern team builds new work as Freestyle jobs &mdash; the industry standard is <strong>Pipeline as Code</strong> (next module). But Freestyle still shows up in older Jenkins instances, and understanding it makes Pipeline's design choices click into place, so don't skip it.</p></div>\n        <h3>Why teams moved away from it</h3>\n        <ul>\n          <li><strong>Not version-controlled</strong> &mdash; job config lives only inside Jenkins's database (XML on disk), invisible to code review.</li>\n          <li><strong>Hard to reuse</strong> &mdash; copying steps between jobs means manual re-clicking or the \"Copy job\" hack.</li>\n          <li><strong>No real branching logic</strong> &mdash; conditional steps need plugin workarounds instead of an <code>if</code> statement.</li>\n        </ul>\n        <p>Pipeline fixed all three by describing the whole job as code (a <strong>Jenkinsfile</strong>) that lives in your repository, gets code-reviewed, and can use real programming constructs.</p>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Freestyle = point-and-click job config; Pipeline = job config as code.</li>\n          <li>You'll still recognize Freestyle screens in legacy Jenkins instances &mdash; know what you're looking at.</li>\n          <li>The motivation for Pipeline (versioning, reuse, logic) is a common \"why\" interview question.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "why-pipeline-as-code",
    "group": "pipelines",
    "level": "Core",
    "title": "Why Pipeline as Code",
    "sectionNo": "06",
    "category": "Pipelines — the core skill",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>A <strong>Jenkinsfile</strong> is a text file, usually committed at the root of your repository, that describes your entire CI/CD process using Jenkins's Pipeline DSL (built on Groovy). Because it's just a file in git, you get: code review on your CI process, full history/blame, identical pipelines across branches, and the ability to reuse logic via Shared Libraries.</p>\n        <h3>Two flavors</h3>\n        <ul>\n          <li><strong>Declarative Pipeline</strong>: a structured, opinionated syntax (<code>pipeline { agent {} stages {} }</code>). Easier to read, has built-in validation, and is what ~90% of teams use today. Start here.</li>\n          <li><strong>Scripted Pipeline</strong>: raw Groovy wrapped in a <code>node {}</code> block. More powerful/flexible, but easier to write unmaintainable code. Mostly seen now inside Shared Library implementations or for edge cases Declarative can't express directly.</li>\n        </ul>\n        <div class=\"callout\"><p><strong>Rule of thumb for interviews and for real work:</strong> default to Declarative. Drop into Scripted (via the <code>script {}</code> step, which is legal <em>inside</em> Declarative) only for logic Declarative genuinely can't express.</p></div>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Jenkinsfile = your pipeline defined as code, checked into the repo it builds.</li>\n          <li>Declarative is the default choice; Scripted is the escape hatch, accessible via <code>script {}</code>.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "declarative-anatomy",
    "group": "pipelines",
    "level": "Core",
    "title": "Declarative pipeline anatomy",
    "sectionNo": "07",
    "category": "Pipelines — the core skill",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Every Declarative Jenkinsfile has the same skeleton. Learn this shape cold &mdash; it's the single most interview-relevant piece of syntax in all of Jenkins.</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Jenkinsfile · groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">pipeline {\n    agent any                       // where the whole pipeline runs by default\n\n    options {\n        timeout(time: 30, unit: 'MINUTES')\n        disableConcurrentBuilds()\n    }\n\n    environment {\n        NODE_ENV = 'production'\n    }\n\n    parameters {\n        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip test stage')\n    }\n\n    stages {\n        stage('Checkout') {\n            steps { checkout scm }\n        }\n        stage('Build') {\n            steps { sh 'npm ci && npm run build' }\n        }\n        stage('Test') {\n            when { expression { return !params.SKIP_TESTS } }\n            steps { sh 'npm test' }\n            post { always { junit 'reports/**/*.xml' } }\n        }\n    }\n\n    post {\n        success { echo 'Pipeline succeeded ✅' }\n        failure { echo 'Pipeline failed ❌' }\n        always  { cleanWs() }\n    }\n}</code></pre></div>\n        <h3>The required top-level pieces</h3>\n        <ul>\n          <li><strong><code>agent</code></strong> &mdash; mandatory. Where the pipeline (or a stage) runs: <code>any</code>, <code>none</code>, <code>{ label 'linux' }</code>, <code>{ docker { image 'node:20' } }</code>, <code>{ kubernetes {...} }</code>.</li>\n          <li><strong><code>stages</code></strong> &mdash; mandatory. Contains one or more <code>stage()</code> blocks, each with a <code>steps {}</code> block &mdash; the actual commands.</li>\n        </ul>\n        <h3>The optional-but-common pieces</h3>\n        <ul>\n          <li><strong><code>environment</code></strong> &mdash; sets env vars for the whole pipeline or a single stage.</li>\n          <li><strong><code>parameters</code></strong> &mdash; defines inputs a human (or another job) supplies when starting a build.</li>\n          <li><strong><code>options</code></strong> &mdash; pipeline-level behavior: timeouts, retry, log rotation, disabling concurrent builds.</li>\n          <li><strong><code>post</code></strong> &mdash; actions that run after stages finish, based on the result (<code>always</code>, <code>success</code>, <code>failure</code>, <code>unstable</code>, <code>changed</code>). Can appear at pipeline level and/or per-stage.</li>\n          <li><strong><code>when</code></strong> &mdash; conditionally runs a stage (e.g. only on the <code>main</code> branch).</li>\n        </ul>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li><code>agent</code> and <code>stages</code> are the only mandatory blocks.</li>\n          <li><code>post</code> is how you handle notifications/cleanup regardless of outcome &mdash; <code>always</code> is your cleanup hook.</li>\n          <li>Memorize this skeleton; you will write it from memory in interviews and on the job.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "scripted-groovy",
    "group": "pipelines",
    "level": "Core",
    "title": "Scripted pipeline & Groovy basics",
    "sectionNo": "08",
    "category": "Pipelines — the core skill",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Scripted Pipeline is just Groovy code with Jenkins step functions sprinkled in, run inside a <code>node</code> block instead of <code>pipeline</code>.</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Jenkinsfile (scripted) · groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">node('linux') {\n    stage('Checkout') { checkout scm }\n\n    stage('Build') {\n        def version = readFile('VERSION').trim()\n        echo \"Building version ${version}\"\n        sh \"make build VERSION=${version}\"\n    }\n\n    stage('Test') {\n        try {\n            sh 'make test'\n        } catch (err) {\n            currentBuild.result = 'UNSTABLE'\n        }\n    }\n}</code></pre></div>\n        <p>Notice real Groovy control flow &mdash; <code>if/else</code>, <code>for</code>, <code>try/catch</code>, variables &mdash; used directly, which Declarative doesn't allow outside a <code>script {}</code> block.</p>\n        <h3>Groovy essentials you actually need</h3>\n        <ul>\n          <li>String interpolation: <code>\"Hello ${name}\"</code> (double quotes required, not single).</li>\n          <li>Lists/maps: <code>def list = [1,2,3]</code>, <code>def map = [key: 'value']</code>.</li>\n          <li><code>def</code> declares a loosely-typed variable.</li>\n          <li>Closures: <code>{ it -> println it }</code> &mdash; you'll see these constantly in pipeline steps like <code>docker.image('x').inside { sh 'test' }</code>.</li>\n        </ul>\n        <h3>Mixing the two: <code>script {}</code></h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">stage('Conditional logic') {\n    steps {\n        script {\n            if (env.BRANCH_NAME == 'main') {\n                sh './deploy.sh prod'\n            } else {\n                echo 'Skipping deploy on non-main branch'\n            }\n        }\n    }\n}</code></pre></div>\n        <div class=\"callout\"><p><strong>Interview framing:</strong> \"Declarative gives structure and validation; when I need imperative logic like loops over a dynamic list, I drop into <code>script {}</code> rather than rewriting the whole pipeline as Scripted.\" That single sentence answers a very common question well.</p></div>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Scripted = <code>node {}</code> + plain Groovy; Declarative = <code>pipeline {}</code> + structured blocks.</li>\n          <li><code>script {}</code> lets you use Groovy logic inside an otherwise Declarative pipeline.</li>\n          <li>Know basic Groovy: string interpolation, <code>def</code>, lists/maps, closures.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "stages-steps-post-when",
    "group": "pipelines",
    "level": "Core",
    "title": "Stages, steps, when & post in depth",
    "sectionNo": "09",
    "category": "Pipelines — the core skill",
    "body": [
      {
        "t": "html",
        "html": "\n        <h3>The <code>when</code> directive</h3>\n        <p>Controls whether a stage runs at all &mdash; evaluated before entering the stage.</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">stage('Deploy to Prod') {\n    when {\n        branch 'main'\n        expression { return currentBuild.currentResult == 'SUCCESS' }\n    }\n    steps { sh './deploy.sh prod' }\n}</code></pre></div>\n        <p>Common conditions: <code>branch 'main'</code>, <code>tag \"release-*\"</code>, <code>environment name: 'DEPLOY_ENV', value: 'prod'</code>, <code>expression { ... }</code> for custom Groovy logic, and <code>anyOf { }</code> / <code>allOf { }</code> to combine conditions.</p>\n        <h3>The <code>post</code> directive, per stage or pipeline-wide</h3>\n        <table class=\"w-full text-sm my-3\" style=\"border-collapse:collapse;\">\n          <tbody>\n            <tr style=\"border-bottom:1px solid var(--border);\"><td class=\"py-1.5 pr-4\"><code>always</code></td><td class=\"py-1.5\" style=\"color:var(--text-2);\">Runs no matter what &mdash; the place for cleanup/notifications.</td></tr>\n            <tr style=\"border-bottom:1px solid var(--border);\"><td class=\"py-1.5 pr-4\"><code>success</code> / <code>failure</code></td><td class=\"py-1.5\" style=\"color:var(--text-2);\">Only on that specific outcome.</td></tr>\n            <tr style=\"border-bottom:1px solid var(--border);\"><td class=\"py-1.5 pr-4\"><code>unstable</code></td><td class=\"py-1.5\" style=\"color:var(--text-2);\">Build completed but e.g. tests failed.</td></tr>\n            <tr><td class=\"py-1.5 pr-4\"><code>changed</code></td><td class=\"py-1.5\" style=\"color:var(--text-2);\">Result differs from the previous build &mdash; great for \"back to green\" alerts.</td></tr>\n          </tbody>\n        </table>\n        <h3>Sequential by default</h3>\n        <p>Stages run top to bottom, one at a time, unless you explicitly opt into <code>parallel</code> (covered in Advanced Patterns). Each stage shows as its own segment in the Blue Ocean / stage-view UI, which is exactly why splitting logically (Checkout / Build / Test / Deploy) matters for readability and debugging.</p>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li><code>when</code> decides if a stage runs; <code>post</code> reacts to how it (or the pipeline) finished.</li>\n          <li><code>post { always { cleanWs() } }</code> is close to a universal pattern &mdash; leave no mess behind.</li>\n          <li>Stage granularity is a readability and debuggability choice, not just cosmetic.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "params-triggers",
    "group": "pipelines",
    "level": "Core",
    "title": "Parameters & triggers",
    "sectionNo": "10",
    "category": "Pipelines — the core skill",
    "body": [
      {
        "t": "html",
        "html": "\n        <h3>Parameters &mdash; letting humans or upstream jobs feed inputs</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">parameters {\n    string(name: 'VERSION', defaultValue: '1.0.0', description: 'Version to build')\n    choice(name: 'ENV', choices: ['dev','staging','prod'], description: 'Target environment')\n    booleanParam(name: 'RUN_INTEGRATION_TESTS', defaultValue: true)\n    password(name: 'DEPLOY_TOKEN', description: 'One-off secret (prefer Credentials for real secrets)')\n}</code></pre></div>\n        <p>Access them anywhere with <code>params.VERSION</code>, <code>params.ENV</code>, etc. First build after adding a <code>parameters</code> block won't show the form yet &mdash; Jenkins needs one run to register the definitions.</p>\n        <h3>Triggers &mdash; what starts a build</h3>\n        <ul>\n          <li><strong>Webhook (push-based, preferred)</strong>: your Git host (GitHub/GitLab/Bitbucket) calls a Jenkins URL the instant code is pushed. Near-instant, low overhead.</li>\n          <li><strong>SCM polling (<code>pollSCM</code>)</strong>: Jenkins checks the repo on a cron schedule for changes. Legacy fallback when webhooks aren't reachable (e.g. Jenkins behind a firewall the Git host can't reach); wastes resources vs. webhooks.</li>\n          <li><strong><code>cron</code> trigger</strong>: time-based, independent of code changes &mdash; nightly builds, scheduled cleanup jobs.</li>\n          <li><strong>Upstream/downstream (<code>build job:</code>)</strong>: one pipeline triggers another when it finishes.</li>\n        </ul>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">triggers {\n    cron('H 2 * * *')        // nightly, Jenkins picks the exact minute to spread load\n    pollSCM('H/15 * * * *')  // fallback poll every ~15 min\n}</code></pre></div>\n        <div class=\"callout\"><p><strong>Why the <code>H</code>?</strong> <code>H</code> (\"hash\") lets Jenkins pick a pseudo-random-but-stable minute/hour based on job name, so thousands of nightly jobs don't all fire at exactly 02:00 and hammer the controller at once. Good interview detail.</p></div>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Prefer webhooks over polling &mdash; faster and cheaper.</li>\n          <li><code>params.X</code> reads a parameter anywhere in the pipeline.</li>\n          <li><code>H</code> in cron syntax spreads scheduled load instead of thundering-herding at the top of the hour.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "multibranch",
    "group": "pipelines",
    "level": "Core",
    "title": "Multibranch pipelines",
    "sectionNo": "11",
    "category": "Pipelines — the core skill",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>A regular Pipeline job builds one branch. A <strong>Multibranch Pipeline</strong> job scans a repository and automatically creates a sub-job for <em>every branch (and PR)</em> that contains a Jenkinsfile &mdash; no manual job-per-branch setup.</p>\n        <h3>How it works</h3>\n        <ul>\n          <li>You point it at a repo (or better, a GitHub/GitLab <strong>Organization</strong> job, which scans every repo in an org).</li>\n          <li>Jenkins periodically (or via webhook) re-scans: new branch with a Jenkinsfile &rarr; new sub-job appears automatically; branch deleted &rarr; job is pruned.</li>\n          <li>Each branch's pipeline uses <em>that branch's own Jenkinsfile</em> &mdash; so a feature branch can safely experiment with pipeline changes without touching <code>main</code>'s.</li>\n        </ul>\n        <p>Inside the Jenkinsfile you get the <code>env.BRANCH_NAME</code> variable for free, which is the standard way to branch pipeline behavior:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">stage('Deploy') {\n    when { branch 'main' }\n    steps { sh './deploy.sh prod' }\n}</code></pre></div>\n        <div class=\"callout good\"><p><strong>This is the default for real projects.</strong> Almost every modern Jenkins setup uses Multibranch (or Organization) pipelines rather than one hand-created job per branch &mdash; it's what makes \"every PR gets its own CI run\" effortless.</p></div>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Multibranch = one job definition, auto-discovered sub-jobs per branch/PR.</li>\n          <li>Organization job = Multibranch, scaled up to an entire GitHub/GitLab org.</li>\n          <li><code>env.BRANCH_NAME</code> plus <code>when { branch }</code> is the standard pattern for branch-specific behavior.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "agents-labels",
    "group": "intermediate",
    "level": "Intermediate",
    "title": "Agents, labels & distributed builds",
    "sectionNo": "12",
    "category": "Intermediate practices",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Real Jenkins fleets have several kinds of agents &mdash; maybe a beefy Linux box for backend builds, a Windows box for a legacy .NET app, and Docker-capable agents for containerized services. <strong>Labels</strong> are how you route a stage to the right one.</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">pipeline {\n    agent { label 'linux && docker' }   // any agent tagged with BOTH labels\n    stages {\n        stage('Build on Windows') {\n            agent { label 'windows' }    // overrides the top-level agent just for this stage\n            steps { bat 'build.bat' }\n        }\n    }\n}</code></pre></div>\n        <h3>Per-stage agent overrides</h3>\n        <p>You can set <code>agent</code> at the pipeline level and again inside an individual <code>stage</code> &mdash; the stage-level one wins for that stage. This is how a single pipeline can build on Linux, then flip to Windows, then back, in one run. Each stage with its own <code>agent</code> gets a fresh workspace on that agent.</p>\n        <h3>Static vs. dynamic (cloud) agents</h3>\n        <ul>\n          <li><strong>Static</strong>: permanent VMs registered once, always available, cheaper for constant load, but idle capacity is wasted and you patch them yourself.</li>\n          <li><strong>Dynamic/cloud</strong>: created on-demand (Docker plugin, Kubernetes plugin, EC2 plugin) for the duration of one build, then destroyed. Better utilization and always a clean environment, at the cost of a small startup delay per build. This is the modern default &mdash; covered fully in Advanced.</li>\n        </ul>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Labels route stages to specific agent capabilities (OS, tools, size).</li>\n          <li>Stage-level <code>agent</code> overrides the pipeline-level one, and gets its own workspace.</li>\n          <li>Ephemeral (cloud) agents are the modern default for isolation and utilization.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "credentials",
    "group": "intermediate",
    "level": "Intermediate",
    "title": "Credentials management",
    "sectionNo": "13",
    "category": "Intermediate practices",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Never hardcode secrets in a Jenkinsfile &mdash; it's committed to git and visible in the UI. Jenkins's <strong>Credentials plugin</strong> stores secrets encrypted at rest and injects them at runtime without printing them to the log (Jenkins auto-masks known credential values in console output).</p>\n        <h3>Credential types you'll actually use</h3>\n        <ul>\n          <li><strong>Username/Password</strong> &mdash; registry logins, basic-auth APIs.</li>\n          <li><strong>Secret text</strong> &mdash; a single token (API key, Slack webhook URL).</li>\n          <li><strong>SSH Username with private key</strong> &mdash; git-over-SSH, SSH deploys.</li>\n          <li><strong>Secret file</strong> &mdash; a whole file, e.g. a kubeconfig or a <code>.p12</code> cert.</li>\n        </ul>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">withCredentials([\n    usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),\n    string(credentialsId: 'slack-webhook', variable: 'SLACK_URL')\n]) {\n    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'\n}</code></pre></div>\n        <p>Credentials live in <strong>credential stores</strong> scoped globally, to a folder, or to a specific job &mdash; scope tightly (folder/job level) so a compromised pipeline can't read secrets it has no business touching.</p>\n        <div class=\"callout danger\"><p><strong>Common mistake:</strong> printing a secret via <code>echo $DOCKER_PASS</code> directly, or interpolating it into a shell string with Groovy <code>\"${DOCKER_PASS}\"</code> instead of environment-variable syntax, can leak it past Jenkins's masking. Always let the secret flow through as an env var to a tool, never through Groovy string interpolation.</p></div>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li><code>withCredentials</code> injects secrets as scoped env vars for the duration of the block only.</li>\n          <li>Scope credentials as narrowly as possible (job/folder, not global) &mdash; least privilege.</li>\n          <li>Jenkins masks known credential values in logs, but only if they flow through supported bindings.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "git-integration",
    "group": "intermediate",
    "level": "Intermediate",
    "title": "Git integration deep dive",
    "sectionNo": "14",
    "category": "Intermediate practices",
    "body": [
      {
        "t": "html",
        "html": "\n        <p><code>checkout scm</code> is the shorthand that reuses whatever SCM configuration the job (or Multibranch scan) already knows. For more control, use the explicit <code>git</code> step or the full <code>checkout</code> syntax.</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">checkout([\n    $class: 'GitSCM',\n    branches: [[name: '*/main']],\n    userRemoteConfigs: [[url: 'git@github.com:org/repo.git', credentialsId: 'github-ssh']],\n    extensions: [[$class: 'CloneOption', shallow: true, depth: 1]]\n])</code></pre></div>\n        <h3>Useful built-in environment variables (Multibranch / Git plugin)</h3>\n        <table class=\"w-full text-sm my-3\" style=\"border-collapse:collapse;\"><tbody>\n          <tr style=\"border-bottom:1px solid var(--border);\"><td class=\"py-1.5 pr-4\"><code>GIT_COMMIT</code></td><td class=\"py-1.5\" style=\"color:var(--text-2);\">Full SHA of the checked-out commit.</td></tr>\n          <tr style=\"border-bottom:1px solid var(--border);\"><td class=\"py-1.5 pr-4\"><code>BRANCH_NAME</code></td><td class=\"py-1.5\" style=\"color:var(--text-2);\">Current branch (Multibranch jobs).</td></tr>\n          <tr style=\"border-bottom:1px solid var(--border);\"><td class=\"py-1.5 pr-4\"><code>CHANGE_ID / CHANGE_TARGET</code></td><td class=\"py-1.5\" style=\"color:var(--text-2);\">PR number and its target branch, when building a pull request.</td></tr>\n        </tbody></table>\n        <h3>Performance: shallow clones & sparse checkout</h3>\n        <p>On large monorepos, a full clone every build is slow. <code>shallow: true, depth: 1</code> fetches only the latest commit; sparse checkout limits which directories are pulled. Both dramatically cut checkout time on big repos.</p>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li><code>checkout scm</code> = \"do whatever this job is already configured to check out\" &mdash; the standard choice in Multibranch pipelines.</li>\n          <li>Know the difference between build-time git env vars: commit SHA, branch name, PR change id.</li>\n          <li>Shallow clones are a real, commonly-asked performance optimization.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "artifacts-tests",
    "group": "intermediate",
    "level": "Intermediate",
    "title": "Artifacts, archiving & test reports",
    "sectionNo": "15",
    "category": "Intermediate practices",
    "body": [
      {
        "t": "html",
        "html": "\n        <h3>Archiving build output</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">post {\n    always {\n        archiveArtifacts artifacts: 'dist/**/*.jar', fingerprint: true\n        junit testResults: 'reports/**/*.xml', allowEmptyResults: true\n    }\n}</code></pre></div>\n        <p><code>archiveArtifacts</code> copies matching files into Jenkins's own storage so they're downloadable from the build page &mdash; fine for small binaries, but for anything sizeable or long-lived, push to a real artifact repository (<strong>Nexus</strong> or <strong>Artifactory</strong>) instead; Jenkins's own storage isn't meant to be a package registry.</p>\n        <p><code>fingerprint: true</code> lets Jenkins track exactly which build produced which file, which is how it can answer \"which build's jar is running in prod?\" across a chain of pipelines.</p>\n        <h3>Test reporting</h3>\n        <p>The <code>junit</code> step parses JUnit-format XML (nearly every test framework can emit this &mdash; pytest, Jest, Go test, etc. all have a JUnit-XML reporter) and turns it into trend graphs, pass/fail counts per build, and flaky-test tracking. A build with failing tests reported this way becomes <strong>UNSTABLE</strong>, not <strong>FAILURE</strong> &mdash; the pipeline keeps running through <code>post</code>.</p>\n        <h3>Stashing files between stages/agents</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">stage('Build') {\n    steps { sh 'make build'; stash includes: 'dist/**', name: 'app-binaries' }\n}\nstage('Deploy') {\n    agent { label 'deploy-node' }\n    steps { unstash 'app-binaries'; sh './deploy.sh' }\n}</code></pre></div>\n        <div class=\"callout\"><p><strong><code>stash</code>/<code>unstash</code> vs. <code>archiveArtifacts</code>:</strong> stash is a short-lived, in-pipeline handoff of files between stages that might run on <em>different agents</em> &mdash; it's cleared at the end of the build. <code>archiveArtifacts</code> is for long-term, downloadable build output. Classic interview question.</p></div>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li><code>archiveArtifacts</code> = persist output on the controller; real long-term storage should go to Nexus/Artifactory.</li>\n          <li><code>junit</code> step turns test XML into UNSTABLE builds + trend data, not a hard failure.</li>\n          <li><code>stash</code>/<code>unstash</code> moves files between stages/agents within one build only.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "notifications",
    "group": "intermediate",
    "level": "Intermediate",
    "title": "Notifications & post-build actions",
    "sectionNo": "16",
    "category": "Intermediate practices",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Nobody watches the Jenkins UI all day &mdash; failures need to reach people where they already are.</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">post {\n    failure {\n        slackSend(channel: '#ci-alerts', color: 'danger',\n                  message: \"❌ ${env.JOB_NAME} #${env.BUILD_NUMBER} failed: ${env.BUILD_URL}\")\n    }\n    changed {\n        emailext(\n            subject: \"Build ${currentBuild.currentResult}: ${env.JOB_NAME} #${env.BUILD_NUMBER}\",\n            body: 'See ${BUILD_URL} for details.',\n            to: 'team@company.com'\n        )\n    }\n}</code></pre></div>\n        <p>The <strong>Slack Notification plugin</strong> and <strong>Email Extension plugin (email-ext)</strong> are the two most common. <code>post { changed { } }</code> is especially useful &mdash; it fires only when the result differs from the previous build, so you get pinged on \"just broke\" and \"back to green\" without noisy per-build spam.</p>\n        <h3>Other common post-build actions</h3>\n        <ul>\n          <li>Publishing HTML reports (coverage, lint output) via the HTML Publisher plugin.</li>\n          <li>Updating a status check on GitHub/GitLab so the PR shows pass/fail inline.</li>\n          <li>Triggering a downstream job: <code>build job: 'deploy-pipeline', wait: false</code>.</li>\n        </ul>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Route failures to Slack/email so people don't have to poll Jenkins.</li>\n          <li><code>post { changed }</code> avoids notification fatigue &mdash; know when to reach for it over <code>failure</code>.</li>\n          <li>Downstream job triggering with <code>build job:</code> connects pipelines into larger workflows.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "shared-libraries",
    "group": "intermediate",
    "level": "Intermediate",
    "title": "Shared libraries",
    "sectionNo": "17",
    "category": "Intermediate practices",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Once you have 10+ Jenkinsfiles copy-pasting the same Docker-build-and-push logic, it's time for a <strong>Shared Library</strong>: reusable Groovy code, itself stored in a separate git repo, that any Jenkinsfile can import.</p>\n        <h3>Standard structure</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">plaintext</span></div><pre><code class=\"language-plaintext\">(shared-library-repo)/\n├── vars/\n│   ├── buildAndPush.groovy     ← becomes a global step: buildAndPush(...)\n│   └── notifySlack.groovy\n├── src/\n│   └── org/company/Utils.groovy ← regular Groovy classes, import like Java\n└── resources/\n    └── org/company/template.yaml ← non-Groovy files, loaded via libraryResource()</code></pre></div>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">vars/buildAndPush.groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">def call(String image, String tag) {\n    sh \"docker build -t ${image}:${tag} .\"\n    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'U', passwordVariable: 'P')]) {\n        sh \"echo $P | docker login -u $U --password-stdin\"\n        sh \"docker push ${image}:${tag}\"\n    }\n}</code></pre></div>\n        <p>Using it from any Jenkinsfile:</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Jenkinsfile · groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">@Library('my-shared-lib@main') _\npipeline {\n    agent any\n    stages {\n        stage('Build & Push') { steps { buildAndPush('myapp', env.BUILD_NUMBER) } }\n    }\n}</code></pre></div>\n        <p>The <code>@main</code> pins a branch/tag of the library &mdash; you can pin different Jenkinsfiles to different library versions, which matters a lot when rolling out a breaking change gradually. Libraries are registered globally by an admin (Manage Jenkins &rarr; System &rarr; Global Pipeline Libraries), or loaded ad-hoc with <code>library('name')</code>.</p>\n        <div class=\"callout good\"><p><strong>Why this matters for interviews:</strong> Shared Libraries are the #1 sign of \"has run Jenkins at scale\" on a resume. Being able to sketch the <code>vars/</code>+<code>@Library</code> pattern from memory is a strong signal.</p></div>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li><code>vars/*.groovy</code> files become global pipeline steps, callable by filename.</li>\n          <li>Libraries live in their own git repo and are versioned/pinned like any dependency.</li>\n          <li>This is how large orgs enforce a standard pipeline (security scans, notifications, deploy logic) across hundreds of repos.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "docker-integration",
    "group": "advanced",
    "level": "Advanced",
    "title": "Docker integration",
    "sectionNo": "18",
    "category": "Advanced / production-grade",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Docker solves the \"works on my machine\" problem for build environments too: instead of installing every language/tool version on every agent, you run the build itself <em>inside</em> a container with exactly the right toolchain.</p>\n        <h3>Pattern 1 &mdash; run a stage inside a container</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">pipeline {\n    agent { docker { image 'node:20-alpine'; args '-v $HOME/.npm:/root/.npm' } }\n    stages {\n        stage('Build') { steps { sh 'npm ci && npm run build' } }\n    }\n}</code></pre></div>\n        <p>The <strong>Docker Pipeline plugin</strong> pulls the image, starts a container, mounts the workspace in, runs your steps, and tears it down &mdash; a perfectly clean, reproducible environment on every single build, with zero manual tool installs on the agent itself (the agent just needs Docker installed).</p>\n        <h3>Pattern 2 &mdash; build & push an image as your deliverable</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">stage('Build & Push Image') {\n    steps {\n        script {\n            def img = docker.build(\"myorg/myapp:${env.BUILD_NUMBER}\")\n            docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-creds') {\n                img.push()\n                img.push('latest')\n            }\n        }\n    }\n}</code></pre></div>\n        <h3>Docker-outside-of-Docker vs. Docker-in-Docker</h3>\n        <p>When the agent itself is a container (e.g. a Kubernetes pod) and a stage needs to run <code>docker build</code>, you either mount the host's <code>/var/run/docker.sock</code> into the agent (DooD &mdash; simpler, shares the host daemon) or run a full nested Docker daemon (DinD &mdash; more isolated, heavier, needs privileged mode). DooD is the far more common production choice; DinD's privileged requirement is a security smell most teams avoid.</p>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li><code>agent { docker { image ... } }</code> runs a stage's steps inside that container image.</li>\n          <li><code>docker.build()</code> / <code>docker.withRegistry()</code> / <code>image.push()</code> is the standard Groovy-DSL way to build and publish images.</li>\n          <li>DooD (mount the socket) is generally preferred over DinD (nested daemon, needs <code>--privileged</code>).</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "kubernetes-agents",
    "group": "advanced",
    "level": "Advanced",
    "title": "Kubernetes plugin & dynamic agents",
    "sectionNo": "19",
    "category": "Advanced / production-grade",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>At scale, the best practice is: Jenkins controller runs as a small, stable pod, and every single build gets a <strong>brand-new Kubernetes pod as its agent</strong>, created right before the build and deleted right after. Zero idle capacity, perfect isolation, and the pod's container image can be tailored per-pipeline.</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">pipeline {\n    agent {\n        kubernetes {\n            yaml '''\n                apiVersion: v1\n                kind: Pod\n                spec:\n                  containers:\n                  - name: maven\n                    image: maven:3.9-eclipse-temurin-17\n                    command: ['sleep']\n                    args: ['infinity']\n                  - name: kubectl\n                    image: bitnami/kubectl:latest\n                    command: ['sleep']\n                    args: ['infinity']\n            '''\n        }\n    }\n    stages {\n        stage('Build') { steps { container('maven') { sh 'mvn -B package' } } }\n        stage('Deploy') { steps { container('kubectl') { sh 'kubectl apply -f k8s/' } } }\n    }\n}</code></pre></div>\n        <p>Each <code>containers</code> entry in the pod template is a sidecar sharing the same pod network/workspace; the <code>container('name')</code> step tells subsequent steps which one to execute in. This \"one pod, many tool containers\" pattern is extremely common &mdash; one container for the build tool, one for <code>kubectl</code>, one for a security scanner, etc., all in the same ephemeral pod.</p>\n        <div class=\"callout\"><p><strong>Why this beats static agent pools:</strong> no capacity planning, no patching a fleet of VMs, every build gets an identical fresh environment (no state leaking between builds), and you naturally autoscale with the underlying cluster's node pool.</p></div>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Kubernetes plugin creates a pod per build from a YAML pod template, then destroys it &mdash; true ephemeral agents.</li>\n          <li><code>container('name')</code> targets a specific sidecar container within the pod for a set of steps.</li>\n          <li>This is the standard \"cloud-native Jenkins\" architecture interviewers expect a DevOps candidate to describe.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "security",
    "group": "advanced",
    "level": "Advanced",
    "title": "Security: auth, RBAC, secrets, script security",
    "sectionNo": "20",
    "category": "Advanced / production-grade",
    "body": [
      {
        "t": "html",
        "html": "\n        <h3>Authentication (who can log in)</h3>\n        <p>Configured under <strong>Manage Jenkins &rarr; Security</strong>: Jenkins's own user database, or delegate to LDAP/Active Directory, or SSO via SAML/OIDC plugins. Production instances almost always federate to the company's existing identity provider rather than maintaining separate Jenkins passwords.</p>\n        <h3>Authorization (who can do what)</h3>\n        <ul>\n          <li><strong>Matrix Authorization Strategy</strong> &mdash; grant permissions (read/build/configure/admin...) per user or group, globally.</li>\n          <li><strong>Role-Based Authorization Strategy (Role Strategy plugin)</strong> &mdash; define reusable roles (e.g. \"developer\", \"release-manager\") and assign them per-folder, which scales far better than per-user matrix entries on every job.</li>\n          <li><strong>Project-based Matrix</strong> &mdash; per-job/folder overrides of the global matrix.</li>\n        </ul>\n        <div class=\"callout\"><p><strong>Least privilege in practice:</strong> most engineers get Build+Read on their team's folder only; only a small platform/DevOps team gets global Configure/Admin. Being able to explain this model is a strong \"have you actually run Jenkins for a team\" signal in interviews.</p></div>\n        <h3>Script security & the Groovy sandbox</h3>\n        <p>Pipeline Groovy runs in a <strong>sandbox</strong> by default, which blocks dangerous operations (arbitrary file/network/system access, reflection tricks). If a Jenkinsfile calls something the sandbox doesn't recognize as safe, the build pauses and an administrator must explicitly <strong>approve the script signature</strong> under Manage Jenkins &rarr; In-process Script Approval. Shared Library code from a trusted, admin-approved repo can run outside the sandbox with full trust &mdash; another reason libraries are usually maintained by a platform team, not every developer.</p>\n        <h3>Other hardening basics</h3>\n        <ul>\n          <li><strong>CSRF protection</strong> (\"Prevent Cross Site Request Forgery exploits\", uses a crumb token) &mdash; leave this enabled.</li>\n          <li><strong>Agent &rarr; Controller access control</strong> &mdash; restricts what an agent process is allowed to do back to the controller, limiting blast radius if an agent is compromised.</li>\n          <li>Never disable script security \"to make the pipeline work\" &mdash; fix the underlying script or get it properly approved instead.</li>\n        </ul>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Authentication = who can log in; Authorization = what they can do once in. Know both terms precisely.</li>\n          <li>Role Strategy plugin scales permission management far better than a flat matrix for large teams.</li>\n          <li>The Groovy sandbox + script approval is Jenkins's core defense against a malicious/buggy Jenkinsfile taking over the controller.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "jcasc",
    "group": "advanced",
    "level": "Advanced",
    "title": "Jenkins Configuration as Code (JCasC)",
    "sectionNo": "21",
    "category": "Advanced / production-grade",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Just like a Jenkinsfile turns one job into code, <strong>JCasC (Configuration as Code plugin)</strong> turns the entire <em>controller's</em> configuration &mdash; security realm, authorization, clouds, global tool locations, credentials references &mdash; into a single version-controlled YAML file.</p>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">jenkins.yaml</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-yaml\">jenkins:\n  systemMessage: \"Managed by JCasC - do not edit by hand\"\n  numExecutors: 0\n  securityRealm:\n    ldap:\n      server: \"ldaps://ldap.company.com\"\n  authorizationStrategy:\n    roleBased:\n      roles:\n        global:\n          - name: \"admin\"\n            permissions: [\"Overall/Administer\"]\n  clouds:\n    - kubernetes:\n        name: \"k8s\"\n        serverUrl: \"https://kubernetes.default\"\n        namespace: \"jenkins-agents\"\ncredentials:\n  system:\n    domainCredentials:\n      - credentials:\n          - usernamePassword:\n              scope: GLOBAL\n              id: \"dockerhub-creds\"\n              username: \"cibot\"\n              password: \"${DOCKERHUB_PASSWORD}\"   # injected from env, never hardcoded</code></pre></div>\n        <p>Point Jenkins at this file via the <code>CASC_JENKINS_CONFIG</code> environment variable. Combined with a custom Docker image (base <code>jenkins/jenkins</code> + your plugin list via <code>plugins.txt</code> + this YAML), you can destroy the entire controller and rebuild an identical one from git in minutes &mdash; \"cattle, not pets\" applied to your CI server itself.</p>\n        <div class=\"callout good\"><p><strong>Why senior teams care:</strong> before JCasC, controller config drifted silently through the UI over years, undocumented and unreproducible. JCasC makes controller setup reviewable, diffable and disaster-recoverable, exactly like application infra managed by Terraform.</p></div>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>JCasC = the entire controller config as one YAML file, not just individual jobs.</li>\n          <li>Pairs naturally with a custom Jenkins Docker image + <code>plugins.txt</code> for fully reproducible controllers.</li>\n          <li>Secrets referenced, never hardcoded &mdash; typically pulled from env vars or an external secret manager at startup.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "scaling-backup",
    "group": "advanced",
    "level": "Advanced",
    "title": "Scaling, performance, backup & DR",
    "sectionNo": "22",
    "category": "Advanced / production-grade",
    "body": [
      {
        "t": "html",
        "html": "\n        <h3>Scaling the controller</h3>\n        <ul>\n          <li>Keep the controller's own executors at <strong>0</strong> in production &mdash; it should only orchestrate, never build.</li>\n          <li>Watch <strong>queue length</strong> and average wait time &mdash; a permanently non-empty queue means you need more agent capacity.</li>\n          <li>JVM tuning matters at scale: heap size, GC choice (G1GC is standard for modern Jenkins), and enough <code>-Xmx</code> headroom for large job counts.</li>\n          <li>Folder-based organization and pipeline-level log rotation (<code>options { buildDiscarder(logRotator(numToKeepStr: '30')) } </code>) keep <code>JENKINS_HOME</code> from growing unbounded.</li>\n        </ul>\n        <h3>Scaling agent capacity</h3>\n        <p>Static pools hit a ceiling and waste money on idle capacity. The standard modern answer is <strong>cloud agents</strong> (Kubernetes plugin scaling pods with the cluster's autoscaler, or the EC2 plugin spinning up/down instances) so capacity tracks actual demand.</p>\n        <h3>Backup & disaster recovery</h3>\n        <p>Everything that matters lives under <code>JENKINS_HOME</code>: job configs, build history, plugin state, encrypted credentials (plus the <code>secrets/</code> master key needed to decrypt them &mdash; <strong>back that up too, or credentials become unrecoverable</strong>).</p>\n        <ul>\n          <li>Simplest approach: scheduled filesystem/volume snapshot of <code>JENKINS_HOME</code> (works well since it's a Docker volume in most modern setups).</li>\n          <li>The <strong>ThinBackup plugin</strong> offers scheduled, selective backups (jobs + config, optionally excluding heavy build artifacts) from within Jenkins.</li>\n          <li>With JCasC + a pinned plugin list + IaC-provisioned agents, true DR becomes \"restore <code>JENKINS_HOME</code> data volume (jobs/build history/credentials) and redeploy the controller image\" &mdash; config and plugins are already reproducible from git, so you're only restoring state, not rebuilding configuration by hand.</li>\n        </ul>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Controller executors = 0 in production; all real work happens on agents.</li>\n          <li>Back up all of <code>JENKINS_HOME</code>, including the secrets master key &mdash; not just job XML.</li>\n          <li>JCasC + IaC turns disaster recovery from \"rebuild by hand\" into \"redeploy + restore data\".</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "advanced-patterns",
    "group": "advanced",
    "level": "Advanced",
    "title": "Advanced pipeline patterns",
    "sectionNo": "23",
    "category": "Advanced / production-grade",
    "body": [
      {
        "t": "html",
        "html": "\n        <h3>Parallel stages</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">stage('Test') {\n    parallel {\n        stage('Unit')        { steps { sh 'npm run test:unit' } }\n        stage('Integration') { steps { sh 'npm run test:integration' } }\n        stage('Lint')         { steps { sh 'npm run lint' } }\n    }\n}</code></pre></div>\n        <p>Independent stages run concurrently (each needs its own available executor), cutting wall-clock pipeline time considerably &mdash; the single biggest \"speed up our CI\" lever most teams reach for.</p>\n        <h3>The <code>matrix</code> directive &mdash; build across a grid of variables</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">matrix {\n    axes {\n        axis { name 'PLATFORM'; values 'linux', 'windows', 'mac' }\n        axis { name 'NODE_VERSION'; values '18', '20' }\n    }\n    stages { stage('Test') { steps { sh \"test-runner.sh ${PLATFORM} ${NODE_VERSION}\" } } }\n}</code></pre></div>\n        <p>Generates one stage per combination (here, 6 combinations) &mdash; the standard way to test a matrix of OS × runtime-version, or browser × viewport for frontend E2E tests.</p>\n        <h3>Manual approval gates</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">stage('Approve Prod Deploy') {\n    steps {\n        timeout(time: 24, unit: 'HOURS') {\n            input message: 'Deploy to production?', submitter: 'release-managers'\n        }\n    }\n}</code></pre></div>\n        <p>Pauses the pipeline (without holding an executor hostage indefinitely, if wrapped in <code>timeout</code>) until an authorized person clicks Proceed/Abort &mdash; the standard Continuous <em>Delivery</em> (human gate) vs. Continuous <em>Deployment</em> (fully automatic) boundary.</p>\n        <h3>Resilience: <code>retry</code>, <code>timeout</code>, <code>catchError</code>, <code>lock</code></h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">groovy</span><button class=\"cb-copy\" onclick=\"copyCode(this)\">Copy</button></div><pre><code class=\"language-groovy\">stage('Flaky network call') {\n    steps {\n        retry(3) { timeout(time: 2, unit: 'MINUTES') { sh './call-external-api.sh' } }\n    }\n}\nstage('Non-blocking step') {\n    steps { catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') { sh './optional-scan.sh' } }\n}\nstage('Exclusive resource') {\n    steps { lock('shared-staging-db') { sh './run-migration.sh' } }\n}</code></pre></div>\n        <ul>\n          <li><strong><code>retry(n)</code></strong> &mdash; re-runs the wrapped block on failure, up to n times. Great for flaky network calls, wrong for masking a genuinely broken build.</li>\n          <li><strong><code>timeout</code></strong> &mdash; kills a hung step instead of tying up an executor forever.</li>\n          <li><strong><code>catchError</code></strong> &mdash; lets a step fail without failing the whole pipeline, downgrading the result instead.</li>\n          <li><strong><code>lock</code></strong> (Lockable Resources plugin) &mdash; serializes access to a shared resource (a staging DB, a limited license) across concurrent builds.</li>\n        </ul>\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li><code>parallel</code> is the top lever for reducing pipeline duration; independent, resource-permitting stages should almost always be parallelized.</li>\n          <li><code>matrix</code> = auto-generated grid of stages across combinations of variables.</li>\n          <li><code>input</code> = human approval gate; <code>retry</code>/<code>timeout</code>/<code>catchError</code>/<code>lock</code> = the resilience toolbox for flaky or shared resources.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "quiz",
    "group": "interview",
    "level": "Interview",
    "title": "Timed knowledge quiz",
    "sectionNo": "24",
    "category": "Interview prep",
    "body": [
      {
        "t": "quiz",
        "questions": [
          {
            "q": "What is the correct modern terminology for what used to be called “master” and “slave” in Jenkins?",
            "options": [
              "Controller and Agent",
              "Server and Client",
              "Primary and Replica",
              "Host and Worker"
            ],
            "correct": 0,
            "explain": "Jenkins renamed master→controller and slave→agent; you'll see both terms in the wild but should use controller/agent."
          },
          {
            "q": "Which two blocks are mandatory in every Declarative Pipeline?",
            "options": [
              "environment and post",
              "agent and stages",
              "parameters and triggers",
              "options and tools"
            ],
            "correct": 1,
            "explain": "agent (where it runs) and stages (what it does) are the only required top-level blocks."
          },
          {
            "q": "A build has passing compilation but 3 failing unit tests reported via the junit step. What is the resulting build status?",
            "options": [
              "FAILURE",
              "ABORTED",
              "UNSTABLE",
              "SUCCESS"
            ],
            "correct": 2,
            "explain": "Test failures surfaced through the junit step mark the build UNSTABLE, not FAILURE — the pipeline still completes."
          },
          {
            "q": "Which step reuses whatever SCM configuration a Multibranch Pipeline job already has?",
            "options": [
              "git clone",
              "pullSource()",
              "checkout scm",
              "fetchRepo()"
            ],
            "correct": 2,
            "explain": "checkout scm checks out using the job's already-configured SCM settings — the standard choice in Multibranch pipelines."
          },
          {
            "q": "What's the main difference between stash/unstash and archiveArtifacts?",
            "options": [
              "stash is for Docker images only",
              "archiveArtifacts is deprecated",
              "stash moves files between stages/agents within one build; archiveArtifacts persists files long-term on the controller",
              "There is no difference"
            ],
            "correct": 2,
            "explain": "stash/unstash is a short-lived, in-build handoff between stages that might run on different agents; archiveArtifacts is for durable, downloadable output."
          },
          {
            "q": "You need a secret injected into a shell step without it appearing in plaintext in the Jenkinsfile or leaking past log masking. What do you use?",
            "options": [
              "A parameters { password() } block only",
              "env.SECRET = 'hunter2' hardcoded",
              "withCredentials([...]) binding it to an env var",
              "Echoing it directly from the Credentials UI"
            ],
            "correct": 2,
            "explain": "withCredentials binds a stored, encrypted credential to a scoped env var for the duration of the block, with log masking support."
          },
          {
            "q": "Why does Jenkins prefer webhook triggers over SCM polling?",
            "options": [
              "Webhooks work without any network access",
              "Polling is not supported in Declarative Pipeline",
              "Webhooks are push-based and near-instant; polling wastes resources checking for changes that usually aren't there",
              "There is no meaningful difference"
            ],
            "correct": 2,
            "explain": "Webhooks notify Jenkins the instant a push happens; polling repeatedly checks on a schedule, wasting resources most of the time."
          },
          {
            "q": "What does the H in a cron trigger like H/15 * * * * do?",
            "options": [
              "Marks the job as high priority",
              "Nothing, it's a typo people copy-paste",
              "Lets Jenkins pick a pseudo-random stable offset to spread load across many scheduled jobs",
              "Forces the job to run on an agent labeled 'H'"
            ],
            "correct": 2,
            "explain": "H (hash) spreads scheduled jobs so they don't all fire at the exact same instant and overload the controller."
          },
          {
            "q": "In a Multibranch Pipeline, which built-in variable tells you the current branch inside the Jenkinsfile?",
            "options": [
              "env.GIT_BRANCH_CURRENT",
              "env.BRANCH_NAME",
              "env.SCM_BRANCH",
              "params.BRANCH"
            ],
            "correct": 1,
            "explain": "env.BRANCH_NAME is populated automatically for Multibranch Pipeline jobs."
          },
          {
            "q": "What's the purpose of the script {} block inside a Declarative Pipeline?",
            "options": [
              "It disables the Groovy sandbox",
              "It's required around every sh step",
              "It lets you use imperative Groovy logic (loops, if/else) that Declarative syntax alone can't express",
              "It marks a stage as optional"
            ],
            "correct": 2,
            "explain": "script {} is the escape hatch to write plain Groovy logic inside an otherwise Declarative pipeline."
          },
          {
            "q": "What should the number of executors on the Jenkins controller be set to in a well-architected production setup?",
            "options": [
              "As high as possible for speed",
              "Equal to the number of CPU cores",
              "0 — the controller should orchestrate only, never run builds",
              "1, for a single always-on build slot"
            ],
            "correct": 2,
            "explain": "Setting controller executors to 0 forces all real build work onto agents, keeping the controller lightweight and more secure."
          },
          {
            "q": "Which plugin/approach lets Jenkins spin up a brand-new pod as the agent for each individual build, then delete it afterward?",
            "options": [
              "The Docker-in-Docker plugin",
              "The Kubernetes plugin, using a pod template",
              "The Static Agent Pool plugin",
              "ThinBackup"
            ],
            "correct": 1,
            "explain": "The Kubernetes plugin provisions an ephemeral pod per build from a YAML pod template — the standard cloud-native agent pattern."
          },
          {
            "q": "What does the Jenkins Groovy sandbox primarily protect against?",
            "options": [
              "Slow network calls",
              "A Jenkinsfile performing dangerous operations (arbitrary file/system access) without admin approval",
              "Running out of disk space",
              "Two jobs having the same name"
            ],
            "correct": 1,
            "explain": "The sandbox restricts what pipeline Groovy can do; anything outside the safe list needs explicit admin approval via Script Approval."
          },
          {
            "q": "What is Jenkins Configuration as Code (JCasC) primarily used for?",
            "options": [
              "Writing Jenkinsfiles faster with autocomplete",
              "Defining the entire controller's configuration (security, clouds, tools) as version-controlled YAML",
              "A replacement for the Credentials plugin",
              "Compiling Java-based plugins"
            ],
            "correct": 1,
            "explain": "JCasC captures controller-level configuration as code, enabling reproducible, disaster-recoverable Jenkins controllers."
          },
          {
            "q": "Which authorization approach scales best when you have many teams and want reusable permission sets assigned per folder?",
            "options": [
              "Anyone can do anything",
              "Role-Based Authorization Strategy (Role Strategy plugin)",
              "Disabling authorization entirely",
              "Logged-in users can do anything"
            ],
            "correct": 1,
            "explain": "Role Strategy lets you define reusable roles and assign them per folder/job pattern, which scales far better than a flat global matrix."
          },
          {
            "q": "A shared library's vars/deployApp.groovy defines a call(String env) method. How do you invoke it from a Jenkinsfile after @Library('my-lib') _?",
            "options": [
              "import deployApp('prod')",
              "library.deployApp('prod')",
              "deployApp('prod')",
              "@deployApp('prod')"
            ],
            "correct": 2,
            "explain": "Files under vars/ become global pipeline steps callable directly by filename: deployApp('prod')."
          },
          {
            "q": "Why is Docker-outside-of-Docker (mounting the host's docker.sock) generally preferred over Docker-in-Docker in CI agents?",
            "options": [
              "DinD is faster",
              "DooD avoids running a nested daemon in privileged mode, which is a bigger security exposure",
              "DinD doesn't support Linux",
              "There's no real difference"
            ],
            "correct": 1,
            "explain": "DinD typically requires --privileged mode, a significant security concern; DooD shares the host daemon via the socket instead."
          },
          {
            "q": "What is the main purpose of the retry() step?",
            "options": [
              "To re-run an entire failed pipeline automatically every night",
              "To re-attempt a specific wrapped block on failure, useful for flaky operations like network calls",
              "To retry approval gates",
              "To restart the Jenkins service"
            ],
            "correct": 1,
            "explain": "retry(n) { ... } re-runs just the wrapped steps up to n times — ideal for genuinely flaky operations, not for masking real bugs."
          },
          {
            "q": "What does post { changed { ... } } trigger on?",
            "options": [
              "Every single build, always",
              "Only when files changed in git",
              "Only when the build result differs from the immediately previous build",
              "Only on Mondays"
            ],
            "correct": 2,
            "explain": "changed fires only when this build's result differs from the last one — great for 'just broke' / 'back to green' alerts without spamming every build."
          },
          {
            "q": "Which of these is NOT a standard credential type in the Jenkins Credentials plugin?",
            "options": [
              "Secret text",
              "SSH Username with private key",
              "Username with password",
              "OAuth2 auto-refresh token"
            ],
            "correct": 3,
            "explain": "Jenkins ships Secret text, Username/password, SSH key, Secret file (and Certificate); OAuth2 auto-refresh isn't a built-in core type."
          },
          {
            "q": "In the matrix directive, if you define 2 axes with 3 and 2 values respectively, how many stage combinations run by default?",
            "options": [
              "2",
              "3",
              "5",
              "6"
            ],
            "correct": 3,
            "explain": "Matrix generates the cartesian product of all axis values — 3 × 2 = 6 combinations, unless excludes are defined."
          },
          {
            "q": "What's the safest way to gate a production deploy behind human sign-off without tying up an executor indefinitely?",
            "options": [
              "input alone, with no timeout",
              "timeout() wrapping an input step",
              "A cron trigger set far in the future",
              "parameters { booleanParam }"
            ],
            "correct": 1,
            "explain": "Wrapping input in timeout() ensures an unattended approval gate eventually aborts instead of holding resources forever."
          },
          {
            "q": "Why should you back up the Jenkins secrets master key, not just JENKINS_HOME job configs?",
            "options": [
              "It's not actually necessary",
              "Without it, stored encrypted credentials become permanently undecryptable if you restore onto a new instance",
              "It speeds up builds",
              "It's required to install plugins"
            ],
            "correct": 1,
            "explain": "Credentials are encrypted using that master key; losing it while restoring JENKINS_HOME elsewhere makes secrets unrecoverable."
          },
          {
            "q": "Which statement best distinguishes Continuous Delivery from Continuous Deployment?",
            "options": [
              "They are exactly the same thing",
              "Continuous Delivery always uses Jenkins; Deployment always uses GitHub Actions",
              "Continuous Delivery keeps a manual approval gate before production release; Continuous Deployment releases to production fully automatically",
              "Continuous Deployment only applies to mobile apps"
            ],
            "correct": 2,
            "explain": "The dividing line is the human approval gate (e.g. an input step) before prod — present in Delivery, absent in full Deployment."
          }
        ]
      }
    ]
  },
  {
    "id": "rapid-fire",
    "group": "interview",
    "level": "Interview",
    "title": "Rapid-fire cheat sheet",
    "sectionNo": "25",
    "category": "Interview prep",
    "body": [
      {
        "t": "cheatsheet",
        "items": [
          {
            "term": "Jenkinsfile",
            "def": "A text file (Groovy Pipeline DSL) checked into your repo that defines the whole CI/CD pipeline as code."
          },
          {
            "term": "Controller",
            "def": "The core Jenkins process: web UI, scheduling, config storage. Should not run heavy builds itself."
          },
          {
            "term": "Agent",
            "def": "A separate machine/container/pod that executes the actual build steps."
          },
          {
            "term": "Executor",
            "def": "A concurrency slot on a node; N executors = N builds can run at once on that node."
          },
          {
            "term": "Declarative vs Scripted",
            "def": "Declarative = structured pipeline{} syntax, default choice. Scripted = raw Groovy in node{}, more flexible, used as the escape hatch via script{}."
          },
          {
            "term": "stage / steps",
            "def": "stage = a named phase shown in the UI; steps = the actual commands run inside it."
          },
          {
            "term": "post { }",
            "def": "Runs after stages complete based on outcome: always, success, failure, unstable, changed."
          },
          {
            "term": "when { }",
            "def": "Conditionally runs a stage, e.g. when { branch 'main' }."
          },
          {
            "term": "agent { docker {} } / agent { kubernetes {} }",
            "def": "Runs a stage's steps inside a container / a freshly created Kubernetes pod."
          },
          {
            "term": "Multibranch Pipeline",
            "def": "Auto-discovers branches/PRs containing a Jenkinsfile and creates a sub-job for each automatically."
          },
          {
            "term": "withCredentials()",
            "def": "Injects a stored credential as a scoped, log-masked environment variable for a block of steps."
          },
          {
            "term": "stash / unstash",
            "def": "Passes files between stages that may run on different agents, cleared at end of build."
          },
          {
            "term": "archiveArtifacts",
            "def": "Persists build output on the controller for download; for long-term storage, push to Nexus/Artifactory instead."
          },
          {
            "term": "junit step",
            "def": "Publishes JUnit-XML test results; failing tests mark the build UNSTABLE, not FAILURE."
          },
          {
            "term": "Shared Library",
            "def": "Reusable Groovy pipeline code in its own git repo, imported via @Library('name') and exposed as global steps via vars/*.groovy."
          },
          {
            "term": "JCasC",
            "def": "Configuration as Code plugin: the entire controller config expressed as version-controlled YAML."
          },
          {
            "term": "Blue Ocean",
            "def": "A more visual, modern pipeline-run UI for Jenkins, showing stages as a graphical flow."
          },
          {
            "term": "Role Strategy plugin",
            "def": "Authorization approach defining reusable roles assigned per folder — scales better than a flat permission matrix."
          },
          {
            "term": "Groovy sandbox / Script Approval",
            "def": "Pipeline Groovy runs restricted by default; unrecognized operations need explicit admin approval."
          },
          {
            "term": "H in cron syntax",
            "def": "A hash-based offset Jenkins picks per job to spread scheduled load instead of everything firing at once."
          },
          {
            "term": "parallel { }",
            "def": "Runs independent stages concurrently — the biggest lever for cutting pipeline duration."
          },
          {
            "term": "matrix { }",
            "def": "Auto-generates one stage per combination across defined axes (e.g. OS × runtime version)."
          },
          {
            "term": "input step",
            "def": "Pauses the pipeline for a human approval — the boundary between Continuous Delivery and full Deployment."
          },
          {
            "term": "lock() (Lockable Resources)",
            "def": "Serializes concurrent builds' access to a shared, limited resource like a staging DB."
          },
          {
            "term": "DooD vs DinD",
            "def": "Docker-outside-of-Docker (mount host socket, preferred) vs Docker-in-Docker (nested daemon, needs --privileged)."
          }
        ]
      }
    ]
  },
  {
    "id": "troubleshooting",
    "group": "interview",
    "level": "Interview",
    "title": "Troubleshooting scenarios",
    "sectionNo": "26",
    "category": "Interview prep",
    "body": [
      {
        "t": "troubleshoot",
        "items": [
          {
            "scenario": "A build has been sitting in the queue for 20 minutes with the message “Waiting for next available executor”.",
            "diagnosis": "All executors matching this job's required label (or all executors globally) are busy, or no agent currently online has the required label at all.",
            "fix": "Check Manage Jenkins → Nodes for idle capacity and matching labels; add agents or increase executor count; verify the label expression in agent{ label '' } actually matches an online node."
          },
          {
            "scenario": "A pipeline fails with “Scripts not permitted to use method ... Script Approval”.",
            "diagnosis": "The Jenkinsfile called a Groovy method the sandbox doesn't recognize as safe.",
            "fix": "Have an admin review and approve the specific signature under Manage Jenkins → In-process Script Approval, or rewrite the step using an approved pipeline step instead of raw Groovy."
          },
          {
            "scenario": "Credentials work locally but the pipeline fails with “credentials not found” for a valid credential ID.",
            "diagnosis": "Credential scope mismatch — the credential is stored at a folder/job scope the current pipeline can't see, or the ID has a typo.",
            "fix": "Check Manage Jenkins → Credentials for the exact ID and the store it lives in (global vs folder-scoped); move/duplicate it to a scope the job can access."
          },
          {
            "scenario": "The same Jenkinsfile behaves differently across branches for no obvious reason.",
            "diagnosis": "In a Multibranch Pipeline, each branch runs its own copy of the Jenkinsfile — an older branch may have stale pipeline logic.",
            "fix": "Diff the Jenkinsfile between branches; rebase/merge main's pipeline changes into the branch, or confirm the difference is intentional (e.g. when { branch } logic)."
          },
          {
            "scenario": "A build reports SUCCESS but the deployed artifact is clearly the wrong/old version.",
            "diagnosis": "Likely a stale workspace, a caching layer in the build tool, or a stash/unstash mismatch pulling in old files.",
            "fix": "Add post { always { cleanWs() } }, verify checkout scm actually ran before build steps, and confirm stash names match unstash calls exactly."
          },
          {
            "scenario": "Console output shows a secret value in plaintext despite using withCredentials.",
            "diagnosis": "The secret was interpolated via Groovy string interpolation (e.g. inside ${VAR}) rather than passed through as a shell environment variable, bypassing Jenkins's log masking.",
            "fix": "Always reference credential-bound variables as native shell/env vars inside single-quoted sh strings, never via Groovy ${} interpolation."
          },
          {
            "scenario": "Webhook-triggered builds stopped firing after working fine for months.",
            "diagnosis": "Often a changed webhook secret/URL, an expired token on the Git host side, or a network/firewall change blocking the Git host from reaching Jenkins.",
            "fix": "Check the webhook delivery log on GitHub/GitLab for the actual HTTP response Jenkins returned; verify connectivity and re-test the webhook payload manually."
          },
          {
            "scenario": "A pipeline stage using agent { docker { image 'x' } } fails with a permission or docker.sock error.",
            "diagnosis": "The Jenkins agent process user doesn't have permission to talk to the Docker daemon, or the socket isn't mounted/available on that agent.",
            "fix": "Ensure the agent has Docker installed and the Jenkins user is in the docker group (or the socket is properly mounted for a containerized agent)."
          }
        ]
      }
    ]
  },
  {
    "id": "comparison",
    "group": "interview",
    "level": "Interview",
    "title": "Jenkins vs. GitHub Actions vs. GitLab CI vs. CircleCI",
    "sectionNo": "27",
    "category": "Interview prep",
    "body": [
      {
        "t": "html",
        "html": "\n  <p>You will very likely be asked to compare Jenkins with hosted CI tools. Here's the honest, non-marketing breakdown.</p>\n  <div style=\"overflow-x:auto;\" class=\"my-4\">\n  <table class=\"w-full text-sm\" style=\"border-collapse:collapse; min-width:640px;\">\n    <thead>\n      <tr style=\"border-bottom:2px solid var(--border);\">\n        <th class=\"text-left py-2 pr-4\" style=\"color:var(--text);\">Dimension</th>\n        <th class=\"text-left py-2 pr-4\" style=\"color:var(--text);\">Jenkins</th>\n        <th class=\"text-left py-2 pr-4\" style=\"color:var(--text);\">GitHub Actions</th>\n        <th class=\"text-left py-2 pr-4\" style=\"color:var(--text);\">GitLab CI</th>\n        <th class=\"text-left py-2\" style=\"color:var(--text);\">CircleCI</th>\n      </tr>\n    </thead>\n    <tbody style=\"color:var(--text-2);\">\n      <tr style=\"border-bottom:1px solid var(--border);\"><td class=\"py-2 pr-4\"><strong style=\"color:var(--text)\">Hosting</strong></td><td class=\"py-2 pr-4\">Self-hosted (full control)</td><td class=\"py-2 pr-4\">Hosted (self-hosted runners optional)</td><td class=\"py-2 pr-4\">Hosted or self-hosted</td><td class=\"py-2\">Hosted (self-hosted runners optional)</td></tr>\n      <tr style=\"border-bottom:1px solid var(--border);\"><td class=\"py-2 pr-4\"><strong style=\"color:var(--text)\">Config format</strong></td><td class=\"py-2 pr-4\">Jenkinsfile (Groovy DSL)</td><td class=\"py-2 pr-4\">YAML workflows</td><td class=\"py-2 pr-4\">YAML (.gitlab-ci.yml)</td><td class=\"py-2\">YAML</td></tr>\n      <tr style=\"border-bottom:1px solid var(--border);\"><td class=\"py-2 pr-4\"><strong style=\"color:var(--text)\">Ops burden</strong></td><td class=\"py-2 pr-4\">High — you run/patch/scale it</td><td class=\"py-2 pr-4\">~None (hosted)</td><td class=\"py-2 pr-4\">Low if hosted, high if self-managed</td><td class=\"py-2\">~None (hosted)</td></tr>\n      <tr style=\"border-bottom:1px solid var(--border);\"><td class=\"py-2 pr-4\"><strong style=\"color:var(--text)\">Plugin/integration depth</strong></td><td class=\"py-2 pr-4\">Enormous (2000+ plugins)</td><td class=\"py-2 pr-4\">Large Marketplace of Actions</td><td class=\"py-2 pr-4\">Strong, tightly integrated with GitLab itself</td><td class=\"py-2\">Good, smaller than Jenkins/GH</td></tr>\n      <tr style=\"border-bottom:1px solid var(--border);\"><td class=\"py-2 pr-4\"><strong style=\"color:var(--text)\">Best fit</strong></td><td class=\"py-2 pr-4\">Large/legacy orgs needing full control &amp; compliance</td><td class=\"py-2 pr-4\">Projects already on GitHub, fast setup</td><td class=\"py-2 pr-4\">Teams already using GitLab end-to-end</td><td class=\"py-2\">Teams wanting a polished hosted-only experience</td></tr>\n      <tr><td class=\"py-2 pr-4\"><strong style=\"color:var(--text)\">Pricing model</strong></td><td class=\"py-2 pr-4\">Free (you pay for infra)</td><td class=\"py-2 pr-4\">Free tier + usage-based minutes</td><td class=\"py-2 pr-4\">Free tier + usage-based minutes</td><td class=\"py-2\">Free tier + usage-based credits</td></tr>\n    </tbody>\n  </table>\n  </div>\n  <div class=\"callout\"><p><strong>How to answer \"why would you choose Jenkins over GitHub Actions?\" in an interview:</strong> lead with control and compliance — self-hosted means your build environment, network access, and data never leave your infrastructure, which matters a lot for regulated industries and large legacy codebases with deep, custom tool integrations that hosted runners don't support out of the box.</p></div>\n"
      }
    ]
  }
]
