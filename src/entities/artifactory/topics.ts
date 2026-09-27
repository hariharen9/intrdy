import type { Topic, TopicGroup } from '@/entities/topic'

export const ARTIFACTORY_GROUPS: TopicGroup[] = [
  {
    "id": "m1",
    "name": "Foundations"
  },
  {
    "id": "m2",
    "name": "Core Practical Skills"
  },
  {
    "id": "m3",
    "name": "Intermediate Practices"
  },
  {
    "id": "m4",
    "name": "Advanced / Production-Grade"
  },
  {
    "id": "m5",
    "name": "Interview Prep"
  }
]

export const ARTIFACTORY_TOPICS: Topic[] = [
  {
    "id": "t1",
    "group": "m1",
    "level": "Basics",
    "title": "What is a Registry, Really?",
    "sectionNo": "01",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>What is a Registry, Really?</h2>\n          <p>At the most basic level, a <strong>registry</strong> is a versioned, network-addressable storage system that hands out <em>immutable artifacts</em> in exchange for credentials and a coordinate. You push something once, and anyone who pulls it gets the exact same bytes.</p>\n          <p>The word gets overloaded. In this course we'll distinguish:</p>\n          <ul>\n            <li><strong>Artifact repository</strong> (JFrog Artifactory, Sonatype Nexus) — stores binaries: JARs, wheels, npm packages, Maven artifacts, Go modules, Helm charts, Docker images.</li>\n            <li><strong>Container registry</strong> (Docker Hub, GHCR, ECR, Harbor) — stores container images via the OCI Distribution Spec.</li>\n            <li><strong>Binary repository manager</strong> — the umbrella term for products like Artifactory that do both.</li>\n          </ul>\n          <h3>The library analogy</h3>\n          <p>Think of a registry as a <em>library for software components</em>. Your CI job is a researcher who checks out a specific edition of a book (a versioned package) to build an argument (your application). The registry doesn't rewrite the book, it doesn't judge it, it just hands you the exact copy you asked for — and remembers who borrowed it.</p>\n          <p>Without a registry, every build would either recompile its dependencies from source (slow, flaky) or download them from random mirrors (unverifiable, risky). Registries turn \"software supply chain\" from a metaphor into a concrete piece of infrastructure.</p>\n          <h3>Why this matters for your next job</h3>\n          <p>In interviews, when someone asks \"what problem does a registry solve?\" they're not asking for the definition. They want you to articulate that it solves <strong>reproducibility, caching, access control, and supply-chain integrity</strong> all at once. Miss any of those four and you sound like someone who's only used Docker Hub.</p>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Resolving by coordinate — bash</span></div><pre><code class=\"language-bash\"># A registry lets you address an artifact by coordinate\n# The same command on CI, laptop, or prod produces identical bytes\ndocker pull nginx:1.27.0@sha256:22c23f8c32...\n\n# Or for a JVM artifact:\n# Maven coordinate: org.apache.commons:commons-lang3:3.14.0\n# Resolved through Artifactory → cached on the repo edge</code></pre></div>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> If asked \"why Artifactory instead of S3?\", the sharp answer is: <em>S3 is object storage; Artifactory is content-addressable, metadata-aware, proxy-capable, and understands each package format natively</em>. You can't proxy Maven Central through a plain S3 bucket.</p></div>\n          <h3>Terminology watchlist</h3>\n          <p><em>\"Repository\"</em> has two different meanings in this space and trips up every new hire. In Git it means a project; in registry-land it means a single logical stream of artifacts (e.g., \"docker-local\", \"npm-remote\"). Always clarify which meaning is in use when reading docs.</p>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>A registry is a versioned, network-addressable store of immutable artifacts.</li><li>Artifact repo, container registry, and binary repo manager overlap but aren't identical.</li><li>The real value is reproducibility + caching + access control + supply-chain integrity.</li><li>\"Repository\" means different things in Git vs. registry contexts.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t2",
    "group": "m1",
    "level": "Basics",
    "title": "Repository Types: Local, Remote, Virtual, Federated",
    "sectionNo": "02",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Repository Types: Local, Remote, Virtual, Federated</h2>\n          <p>Artifactory's single most important idea is that every repository belongs to one of a small number of <strong>types</strong>, and the type dictates behavior more than any other setting. If you understand the four types below, you understand 80% of Artifactory's admin surface.</p>\n          <h3>Local — \"mine\"</h3>\n          <p>A local repository stores artifacts that were <em>pushed here</em>. You deploy your build outputs to local repos. They're writable, owned, and authoritative. Think: <code>libs-release-local</code>, <code>docker-local</code>.</p>\n          <h3>Remote — \"theirs, cached\"</h3>\n          <p>A remote repository is a <strong>read-through cache</strong> of an upstream source (Maven Central, npmjs.org, PyPI, Docker Hub). When a client asks for <code>commons-lang3:3.14.0</code>, Artifactory checks locally first — if absent, it fetches from the upstream, stores it, and serves it. Subsequent requests hit the cache.</p>\n          <p>This is the single biggest productivity lever you have: one remote repo definition eliminates every external outage, rate limit, and bandwidth issue for your CI cluster.</p>\n          <h3>Virtual — \"one name, many sources\"</h3>\n          <p>A virtual repository is a <strong>logical union</strong>. It aggregates multiple local + remote repos behind a single URL. When you pull from a virtual, Artifactory searches the underlying repos in order and returns the first match. When you push, it goes to the configured <em>default deployment target</em>.</p>\n          <p>Developers are given the virtual URL. They never need to know whether a package lives on the local cache or upstream. This is how you achieve a single source of truth without forcing developers to juggle URLs.</p>\n          <h3>Federated — \"multi-site, consistent\"</h3>\n          <p>Federated repos (introduced ~2020) replicate contents between Artifactory instances in different data centers, with conflict-resolution and metadata sync. They're how you build a global registry without manual push/pull scripting.</p>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Repo topology for a Maven team — yaml</span></div><pre><code class=\"language-yaml\"># Typical Artifactory repo layout for a JVM team\nrepositories:\n  - key: libs-release-local\n    type: local\n    packageType: maven\n    description: \"Our own published artifacts\"\n\n  - key: maven-central-remote\n    type: remote\n    packageType: maven\n    url: https://repo1.maven.org/maven2/\n    description: \"Mirror of Maven Central (cached)\"\n\n  - key: libs-release\n    type: virtual\n    packageType: maven\n    repositories:\n      - libs-release-local\n      - maven-central-remote\n    defaultDeploymentRepo: libs-release-local</code></pre></div>\n          <div class=\"callout callout-warn\"><p><strong>Common mistake:</strong> Pointing CI directly at a remote repo instead of the virtual. This works until the day upstream goes down or changes a checksum — then you have no fallback and no local override path. Always configure clients to hit the virtual.</p></div>\n          <div class=\"callout callout-tip\"><p><strong>Terminology:</strong> \"Virtual repository\" in Artifactory has nothing to do with \"virtual\" in the Docker or virtualization sense. It's closer to a DNS alias with write-routing semantics.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Local = your own published artifacts. Remote = cached proxy of an upstream. Virtual = aggregation behind one URL. Federated = multi-site sync.</li><li>Remote repos are the single biggest reliability upgrade for any CI pipeline.</li><li>Developers should only ever see virtual repo URLs.</li><li>The \"default deployment target\" on a virtual decides where pushes actually land.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t3",
    "group": "m1",
    "level": "Basics",
    "title": "Package Formats & the OCI Standard",
    "sectionNo": "03",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Package Formats & the OCI Standard</h2>\n          <p>A registry isn't one protocol — it's many protocols wearing the same clothes. Each package format (npm, Maven, PyPI, Go modules, Conan, Helm, Docker, OCI) has its own layout, metadata schema, and HTTP contract. Artifactory's job is to speak all of them.</p>\n          <h3>The format zoo</h3>\n          <ul>\n            <li><strong>Maven/Gradle</strong> — group/artifact/version directory layout, <code>.pom</code> metadata, SNAPSHOTs with timestamps.</li>\n            <li><strong>npm</strong> — package tarballs + <code>package.json</code> metadata, with a JSON-based registry API (CouchDB-style).</li>\n            <li><strong>PyPI</strong> — simple index HTML + tarballs/wheels, with PEP 503/691 APIs.</li>\n            <li><strong>Go modules</strong> — zip + <code>go.mod</code> served over a custom <code>go-import</code> meta-tag protocol.</li>\n            <li><strong>Docker images / OCI images</strong> — layered blobs + a manifest JSON, served via the <strong>OCI Distribution Spec</strong>.</li>\n          </ul>\n          <h3>OCI — the unifying standard</h3>\n          <p>The <strong>Open Container Initiative</strong> Distribution Spec (v1.0+) is the protocol every modern container registry speaks. It defines four verbs: <em>push blob, pull blob, push manifest, pull manifest</em>. Docker Hub, GHCR, ECR, GCR, Harbor, and Artifactory all speak it.</p>\n          <p>OCI also defined the <strong>Image Specification</strong>, which describes what a container image actually <em>is</em>: a stack of layers + a config JSON + a manifest tying them together. Once you internalize this, \"container image\" stops being magic and starts being a well-defined data structure.</p>\n          <h3>Content-addressability</h3>\n          <p>OCI addresses every blob and manifest by its <strong>sha256 digest</strong>. A tag like <code>nginx:1.27.0</code> is a mutable pointer to a digest; the digest itself never changes. This is why pinning images by digest in Kubernetes manifests is a security best practice — it removes the \"someone re-tagged nginx\" attack surface.</p>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">OCI content-addressability — bash</span></div><pre><code class=\"language-bash\"># Inspect an OCI image to see the layers + manifest + config\ndocker manifest inspect nginx:1.27.0 | head -n 30\n\n# Pull by digest — immune to tag reassignment\ndocker pull nginx@sha256:22c23f8c32c3b8a...\n\n# The digest IS the content — if one byte changes, digest changes</code></pre></div>\n          <div class=\"callout callout-danger\"><p><strong>Gotcha:</strong> The <code>latest</code> tag is mutable. Never pin production workloads to <code>:latest</code>. Always use a specific version tag or — better — a digest. This is one of the most common findings in container security audits.</p></div>\n          <div class=\"callout callout-tip\"><p><strong>Terminology:</strong> \"Docker image\" and \"OCI image\" are functionally the same today. Docker donated its image format to OCI in 2017. When you see \"OCI image\" it just means \"image conforming to the OCI Image Spec, which Docker also implements.\"</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Each package format (Maven, npm, PyPI, OCI, …) has its own protocol and layout.</li><li>OCI Distribution Spec is the modern standard every container registry speaks.</li><li>Images are content-addressed: digests are immutable, tags are mutable pointers.</li><li>Pin production images by digest, never by <code>:latest</code>.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t4",
    "group": "m1",
    "level": "Basics",
    "title": "Architecture & Where the Bytes Live",
    "sectionNo": "04",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Architecture & Where the Bytes Live</h2>\n          <p>Before you install or operate Artifactory, you should understand the runtime shape. Three things are running:</p>\n          <ol>\n            <li><strong>Artifactory application</strong> — a Java service (Tomcat-embedded in recent versions) that speaks REST, handles auth, routes requests, manages metadata.</li>\n            <li><strong>The binary store</strong> — where actual file bytes live. This can be the local filesystem, S3, GCS, Azure Blob, NFS, etc.</li>\n            <li><strong>A database</strong> — for metadata, access control, audit, search indexes. Typically PostgreSQL; Derby is bundled for dev.</li>\n          </ol>\n          <h3>Separation of concerns</h3>\n          <p>The critical insight is that <em>Artifactory does not care where the bytes physically live</em>. The application layer holds pointers (SHA256 → storage path) and the storage layer holds blobs. This is why you can swap filesystem for S3 without rebuilding anything, and why Artifactory supports \"eventual\" storage models for cheap long-term tiers.</p>\n          <h3>Filestore binarystore.xml</h3>\n          <p>Storage configuration lives in <code>$JFROG_HOME/artifactory/var/etc/artifactory/binarystore.xml</code>. This is where you define a <em>chain</em> of providers: cache-fs → s3-storage → archive. Every byte flows through this chain.</p>\n          <h3>The router process</h3>\n          <p>Modern Artifactory (7.x+) runs a separate <strong>router</strong> process in front of the app nodes. It handles TLS termination, request routing, and load balancing across multiple app nodes in an HA cluster. The router is what lets you add a third Artifactory node without downtime.</p>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">S3-backed storage chain — xml</span></div><pre><code class=\"language-xml\">&lt;!-- binarystore.xml: local-filesystem with S3 cold tier --&gt;\n&lt;config version=\"4\"&gt;\n  &lt;chain template=\"cache-fs,eventual-s3\"/&gt;\n  &lt;provider id=\"cache-fs\" type=\"cache-fs\"&gt;\n    &lt;maxCacheSize&gt;50000000000&lt;/maxCacheSize&gt; &lt;!-- 50 GB --&gt;\n    &lt;cacheProviderDir&gt;/var/opt/jfrog/artifactory/data/cache&lt;/cacheProviderDir&gt;\n  &lt;/provider&gt;\n  &lt;provider id=\"eventual-s3\" type=\"eventual-s3\"&gt;\n    &lt;bucketName&gt;mycompany-artifactory&lt;/bucketName&gt;\n    &lt;region&gt;us-east-1&lt;/region&gt;\n    &lt;endpoint&gt;s3.amazonaws.com&lt;/endpoint&gt;\n    &lt;useInstanceCredentials&gt;true&lt;/useInstanceCredentials&gt;\n  &lt;/provider&gt;\n&lt;/config&gt;</code></pre></div>\n          <div class=\"callout callout-warn\"><p><strong>Operations pitfall:</strong> The default filestore is the local filesystem on the app node. If you never configure binarystore.xml and you later try to run HA, the second node will not see the first node's binaries. Configure S3 or a shared NFS store <em>before</em> adding HA nodes.</p></div>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> When asked \"how would you back up Artifactory?\", the strong answer distinguishes the two layers: metadata (pg_dump of the DB) and binaries (snapshot the storage volume, or use Artifactory's built-in Export to an archive). Backup strategy differs based on binarystore config.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Three runtime layers: app, binary store, metadata database.</li><li>The filestore is pluggable — local FS, S3, GCS, Azure Blob, NFS.</li><li>The router process fronts HA clusters and terminates TLS.</li><li>Never add HA nodes before configuring a shared filestore.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t5",
    "group": "m1",
    "level": "Basics",
    "title": "Getting Started: Install, Access, First Push",
    "sectionNo": "05",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Getting Started: Install, Access, First Push</h2>\n          <p>The fastest path to hands-on experience is the <strong>JFrog Platform Docker image</strong>. It bundles Artifactory, Xray (scanning), and the router in one container. Good enough to learn; not what you'd run in production.</p>\n          <h3>Local install (Docker)</h3>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Spin up Artifactory OSS locally — bash</span></div><pre><code class=\"language-bash\"># Start the JFrog Platform locally\nexport JFROG_HOME=$HOME/jfrog\ndocker run --name artifactory -d \\\n  -e JF_SHARED_NODE_ID=local1 \\\n  -v $JFROG_HOME/artifactory/var:/var/opt/jfrog/artifactory/var \\\n  -v $JFROG_HOME/artifactory/data:/var/opt/jfrog/artifactory/data \\\n  -p 8081:8081 -p 8082:8082 \\\n  releases-docker.jfrog.io/jfrog/artifactory-oss:7.90.13\n\n# Wait ~90 seconds for startup, then open\nopen http://localhost:8082\n# Default: admin / password (you will be forced to change it)</code></pre></div>\n          <h3>First push — Docker</h3>\n          <p>Docker treats any OCI-compliant registry as a remote. You point it at Artifactory by prefixing image names with the host:</p>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">First Docker push — bash</span></div><pre><code class=\"language-bash\"># Authenticate once\ndocker login localhost:8082 -u admin -p &lt;password&gt;\n\n# Build and push\ndocker build -t localhost:8082/docker-local/myapp:1.0.0 .\ndocker push localhost:8082/docker-local/myapp:1.0.0\n\n# Pull from a different machine (after login)\ndocker pull localhost:8082/docker-local/myapp:1.0.0</code></pre></div>\n          <h3>First push — Maven/Gradle</h3>\n          <p>JVM projects publish to Artifactory via a Gradle plugin or Maven <code>distributionManagement</code>. The pattern is the same everywhere: declare a repository URL, provide credentials, invoke <code>publish</code>.</p>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Gradle publish to Artifactory — groovy</span></div><pre><code class=\"language-groovy\">// build.gradle.kts\nplugins { id(\"maven-publish\") }\n\npublishing {\n  publications {\n    create&lt;MavenPublication&gt;(\"lib\") { from(components[\"java\"]) }\n  }\n  repositories {\n    maven {\n      name = \"artifactory\"\n      url = uri(\"http://localhost:8082/artifactory/libs-release-local\")\n      credentials {\n        username = System.getenv(\"ARTIFACTORY_USER\") ?: \"admin\"\n        password = System.getenv(\"ARTIFACTORY_PASS\")\n      }\n    }\n  }\n}\n// ./gradlew publish</code></pre></div>\n          <div class=\"callout callout-warn\"><p><strong>Common mistake:</strong> Hardcoding Artifactory credentials in <code>build.gradle</code> or <code>settings.xml</code> and committing them. Always use environment variables, a credentials file outside the repo, or the JFrog CLI config store.</p></div>\n          <div class=\"callout callout-tip\"><p><strong>Tip:</strong> The JFrog CLI (<code>jfrog rt u</code> for upload, <code>jfrog rt dl</code> for download) works uniformly across every package type. Learn it once, use it everywhere.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>The OSS Docker image is the fastest way to practice.</li><li>Docker pushes use the registry path as an image name prefix.</li><li>Gradle/Maven publish via the standard publishing plugins, pointing at Artifactory URLs.</li><li>Never commit credentials — use env vars or the JFrog CLI config store.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t6",
    "group": "m2",
    "level": "Core",
    "title": "Proxying Upstream: The Cache That Saves Your CI",
    "sectionNo": "06",
    "category": "Core Practical Skills",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Proxying Upstream: The Cache That Saves Your CI</h2>\n          <p>The single highest-ROI thing you can do with a registry is <strong>proxy every upstream your builds depend on</strong>. It's a one-afternoon project that typically saves thousands of CI hours over a year.</p>\n          <h3>Why proxy?</h3>\n          <ul>\n            <li><strong>Reliability</strong> — npmjs.org, Maven Central, and PyPI have occasional outages. A cached copy shields your CI.</li>\n            <li><strong>Speed</strong> — internal networks are fast. Pulling <code>lodash</code> from the cache is 10-100x faster than pulling from California.</li>\n            <li><strong>Bandwidth cost</strong> — a large team pulls the same dependencies thousands of times. Caching them once, internally, is a measurable line item.</li>\n            <li><strong>Security</strong> — every proxy request can be scanned by Xray or another policy engine <em>before</em> it enters your network.</li>\n            <li><strong>Audit</strong> — you can answer \"who pulled what when\" for compliance.</li>\n          </ul>\n          <h3>Setting up a remote repo (npm example)</h3>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Create and use an npm proxy — bash</span></div><pre><code class=\"language-bash\"># Using the JFrog CLI to create a remote npm proxy\njfrog rt repo-create npm-remote \\\n  --package-type=npm \\\n  --repo-type=remote \\\n  --url=https://registry.npmjs.org/ \\\n  --retrieval-cache-period-sec=7200 \\\n  --assumed-offline-period-sec=300\n\n# Point npm at the virtual (which aggregates local + remote)\nnpm config set registry http://localhost:8082/artifactory/api/npm/npm-virtual/\nnpm config set //localhost:8082/artifactory/api/npm/:_authToken &lt;token&gt;</code></pre></div>\n          <h3>Offline and Assumed-Offline</h3>\n          <p>Two settings make proxies robust to upstream flakiness:</p>\n          <ul>\n            <li><strong>Retrieval Cache Period</strong> — how long a cached item is served without re-checking upstream. Default 600s; bump to 7200s+ for stable packages.</li>\n            <li><strong>Assumed Offline Period</strong> — if upstream returns 5xx, Artifactory serves cached content and retries only after this interval. Prevents a noisy upstream from taking down your CI.</li>\n          </ul>\n          <div class=\"callout callout-warn\"><p><strong>Common gotcha:</strong> The first request to a remote repo is always slow — it has to fetch from upstream. If your CI has a cold cache after a rebuild, expect a 5-10 minute \"warm-up\" while everything downloads for the first time. Schedule a warm-up job before peak hours.</p></div>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> When asked \"how would you reduce CI build time by 30%?\", proxying all upstreams through Artifactory is a legitimate answer. Quantify: typical team sees 20-50% reduction in dependency-resolution time.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Proxy every upstream: npm, PyPI, Maven Central, Docker Hub, GitHub releases.</li><li>Retrieval Cache and Assumed Offline settings protect you from upstream flakiness.</li><li>The first cold build is slow; schedule warm-up jobs.</li><li>Proxies are simultaneously a performance, reliability, security, and audit lever.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t7",
    "group": "m2",
    "level": "Core",
    "title": "Authentication: Users, API Keys, Tokens",
    "sectionNo": "07",
    "category": "Core Practical Skills",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Authentication: Users, API Keys, Tokens</h2>\n          <p>Artifactory supports a layered auth model. You'll encounter all of these in the wild — interviewers love asking which one to use when.</p>\n          <h3>Internal users</h3>\n          <p>Artifactory has its own user database. The default <code>admin</code> account has god-mode. Create humans (developers) and <strong>service accounts</strong> (CI bots) separately. Humans get passwords + 2FA; service accounts get scoped tokens.</p>\n          <h3>API Keys (legacy) → Reference Tokens (current)</h3>\n          <p>Historically Artifactory used <strong>API Keys</strong> — a long-lived string that acted as a password. JFrog has deprecated these in favor of <strong>Reference Tokens</strong>, which are JWT-like and can be revoked without changing the user's password. Always prefer Reference Tokens in new work; treat API Keys as a compatibility artifact.</p>\n          <h3>Scoped Access Tokens</h3>\n          <p>The most flexible option. A <strong>JWT</strong> signed by the platform that encodes scopes like <code>read:repo:libs-release</code>. Short-lived, revocable, auditable. This is what your CI should use.</p>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Create and use a scoped token — bash</span></div><pre><code class=\"language-bash\"># Create a scoped access token for CI (via JFrog CLI)\njfrog atc create ci-deployer \\\n  --scope=\"read:* write:libs-release-local\" \\\n  --expiry=3600 \\\n  --description=\"CI deployer token, 1-hour TTL\"\n\n# Use it in CI (never commit it!)\nexport JFROG_CLI_ACCESS_TOKEN=eyJ...\njfrog rt u build/libs/*.jar libs-release-local/</code></pre></div>\n          <h3>Password encryption policy</h3>\n          <p>By default Artifactory rejects plaintext passwords in build tools and requires encrypted ones (the \"Encrypted Password\" toggle in user profile). This stops build logs from accidentally leaking credentials when verbose logging is on.</p>\n          <div class=\"callout callout-danger\"><p><strong>Security gotcha:</strong> Docker's <code>~/.docker/config.json</code> stores your registry password base64-encoded, which is NOT encryption. On shared dev machines, any user who can read that file has your Artifactory access. Use Docker credential helpers (pass, osxkeychain, wincred) instead of the plain file.</p></div>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> \"When do you use API keys vs. access tokens vs. SSO?\" — answer: API keys only for legacy integrations that don't support JWT; access tokens for service accounts with limited scope and TTL; SSO for interactive human use. Never for humans to script.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Three auth modes: internal users, Reference Tokens (preferred), scoped Access Tokens (best for CI).</li><li>API Keys are legacy — prefer Reference Tokens and JWTs.</li><li>Enable encrypted passwords to avoid plaintext leaks in build logs.</li><li>Use Docker credential helpers, not the plaintext config.json.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t8",
    "group": "m2",
    "level": "Core",
    "title": "Docker: Tags, Digests, Manifest Lists",
    "sectionNo": "08",
    "category": "Core Practical Skills",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Docker: Tags, Digests, Manifest Lists</h2>\n          <p>Container images are the most-trafficked artifacts in modern registries. This topic nails down the exact mental model you need for production work.</p>\n          <h3>Anatomy of an image</h3>\n          <p>An image is three things, connected by hashes:</p>\n          <ol>\n            <li><strong>Blobs</strong> — the actual layer tarballs and the config JSON. Each has a sha256 digest.</li>\n            <li><strong>Manifest</strong> — a JSON document listing the blob digests and their media types. Has its own digest.</li>\n            <li><strong>Tag</strong> — a mutable pointer from <code>:1.27.0</code> to a manifest digest.</li>\n          </ol>\n          <h3>Manifest lists / multi-arch</h3>\n          <p>A <strong>manifest list</strong> (OCI index) is a manifest that points to other manifests, one per platform. When you <code>docker pull nginx:1.27.0</code>, Docker reads the manifest list and picks the manifest matching <code>linux/amd64</code> or <code>linux/arm64</code>. This is how a single tag works across architectures.</p>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Multi-arch builds and digest pinning — bash</span></div><pre><code class=\"language-bash\"># Inspect a multi-arch image\ndocker manifest inspect nginx:1.27.0 | jq '.manifests[] | {platform, digest}'\n\n# Build a multi-arch image with buildx\ndocker buildx build \\\n  --platform linux/amd64,linux/arm64 \\\n  -t myregistry.example.com/myapp:1.0.0 \\\n  --push .\n\n# Pin a deployment to a digest (immutable)\n# nginx@sha256:22c23f8c... — will never change even if :1.27.0 is re-tagged</code></pre></div>\n          <h3>Promotion patterns</h3>\n          <p>Two standard patterns for promoting images through environments:</p>\n          <ul>\n            <li><strong>Tag-by-stage</strong> — tag the same digest as <code>:dev</code>, then <code>:staging</code>, then <code>:prod</code>. Fast, but tags are mutable.</li>\n            <li><strong>Digest-pin by stage</strong> — keep one canonical tag per build (e.g., <code>:v1.4.3-abc1234</code>) and reference by digest in Kubernetes manifests. Slower but tamper-evident.</li>\n          </ul>\n          <div class=\"callout callout-warn\"><p><strong>Common mistake:</strong> Using <code>:latest</code> in a Helm chart or Kubernetes manifest. The next <code>helm upgrade</code> will NOT re-pull if the node already has a cached image, even if <code>:latest</code> was re-pushed. Always use an explicit version tag or digest.</p></div>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> When asked \"how do you guarantee the same container runs in dev and prod?\", the answer is: build once, tag with a unique identifier (Git SHA or semantic version), pin to digest in manifests, and promote that single artifact through environments without rebuilding.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>An image = blobs + manifest + tag. Digests are immutable, tags are mutable pointers.</li><li>Manifest lists enable one tag across architectures.</li><li>Pin production workloads to digests, never to <code>:latest</code>.</li><li>Build once, promote by re-tagging or re-referencing the same digest.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t9",
    "group": "m2",
    "level": "Core",
    "title": "Helm Charts: Packaging Kubernetes Apps",
    "sectionNo": "09",
    "category": "Core Practical Skills",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Helm Charts: Packaging Kubernetes Apps</h2>\n          <p>Helm charts are <strong>targz archives of YAML manifests</strong> plus metadata. Since Helm v3.8, charts are stored in OCI registries using the same Distribution Spec as container images. This was a big deal — it means your Artifactory can host charts the same way it hosts images.</p>\n          <h3>Chart anatomy</h3>\n          <ul>\n            <li><code>Chart.yaml</code> — name, version, appVersion, dependencies</li>\n            <li><code>values.yaml</code> — default configuration</li>\n            <li><code>templates/</code> — the actual K8s resources, templated with Go templates</li>\n            <li><code>charts/</code> — bundled sub-charts</li>\n          </ul>\n          <h3>Pushing a chart to Artifactory</h3>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Helm chart lifecycle via OCI registry — bash</span></div><pre><code class=\"language-bash\"># Package the chart\nhelm package ./myapp\n\n# Login to the OCI-based Helm registry\nhelm registry login myregistry.example.com -u deployer -p &lt;token&gt;\n\n# Push the .tgz as an OCI artifact\nhelm push myapp-1.4.3.tgz oci://myregistry.example.com/helm-local\n\n# Install from Artifactory\nhelm pull oci://myregistry.example.com/helm-local/myapp --version 1.4.3\nhelm install myapp oci://myregistry.example.com/helm-local/myapp --version 1.4.3</code></pre></div>\n          <h3>Legacy Helm repos (v2 style)</h3>\n          <p>Before OCI, Helm used a custom HTTP API with an <code>index.yaml</code> file listing all charts. Artifactory still supports this legacy format. If you're integrating with an older CI system, you may still see <code>helm repo add myrepo https://.../api/helm/myrepo</code>. Know both styles exist.</p>\n          <div class=\"callout callout-tip\"><p><strong>Terminology watch:</strong> A Helm \"repo\" historically meant an HTTP server with an index.yaml. An OCI Helm \"repo\" is just an OCI namespace. The word means different things in different Helm versions — always ask which one.</p></div>\n          <div class=\"callout callout-warn\"><p><strong>Gotcha:</strong> Chart version and appVersion are separate. Bumping appVersion without bumping chart version breaks Helm's semantic versioning expectations. Always bump both, and never reuse a chart version.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Helm charts are packaged YAML + templates in a .tgz.</li><li>Modern Helm uses OCI registries — same protocol as Docker images.</li><li>Legacy Helm used HTTP + index.yaml — still supported in Artifactory.</li><li>Never reuse a chart version; bump chart and appVersion together.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t10",
    "group": "m2",
    "level": "Core",
    "title": "Maven, Gradle, and the JVM Ecosystem",
    "sectionNo": "10",
    "category": "Core Practical Skills",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Maven, Gradle, and the JVM Ecosystem</h2>\n          <p>Maven and Gradle consume artifacts through Artifactory as if it were Maven Central itself. The trick is configuring them to resolve through your virtual repo and publish to your local repo.</p>\n          <h3>Maven settings.xml</h3>\n          <p>Most teams distribute a <code>settings.xml</code> that points the <code>central</code> mirror at Artifactory. Every <code>mvn</code> invocation on every machine transparently routes through the proxy.</p>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Maven settings for Artifactory — xml</span></div><pre><code class=\"language-xml\">&lt;!-- ~/.m2/settings.xml --&gt;\n&lt;settings&gt;\n  &lt;mirrors&gt;\n    &lt;mirror&gt;\n      &lt;id&gt;artifactory&lt;/id&gt;\n      &lt;mirrorOf&gt;*&lt;/mirrorOf&gt;\n      &lt;url&gt;https://artifactory.example.com/artifactory/libs-release&lt;/url&gt;\n    &lt;/mirror&gt;\n  &lt;/mirrors&gt;\n  &lt;servers&gt;\n    &lt;server&gt;\n      &lt;id&gt;artifactory&lt;/id&gt;\n      &lt;username&gt;${env.ARTIFACTORY_USER}&lt;/username&gt;\n      &lt;password&gt;${env.ARTIFACTORY_TOKEN}&lt;/password&gt;\n    &lt;/server&gt;\n  &lt;/servers&gt;\n  &lt;profiles&gt;\n    &lt;profile&gt;\n      &lt;id&gt;artifactory&lt;/id&gt;\n      &lt;repositories&gt;\n        &lt;repository&gt;\n          &lt;id&gt;snapshots&lt;/id&gt;\n          &lt;url&gt;https://artifactory.example.com/artifactory/libs-snapshot&lt;/url&gt;\n          &lt;snapshots&gt;&lt;enabled&gt;true&lt;/enabled&gt;&lt;/snapshots&gt;\n        &lt;/repository&gt;\n      &lt;/repositories&gt;\n    &lt;/profile&gt;\n  &lt;/profiles&gt;\n  &lt;activeProfiles&gt;\n    &lt;activeProfile&gt;artifactory&lt;/activeProfile&gt;\n  &lt;/activeProfiles&gt;\n&lt;/settings&gt;</code></pre></div>\n          <h3>Gradle: init scripts</h3>\n          <p>Gradle prefers <code>init.gradle</code> scripts over <code>settings.xml</code>. You can rewrite all repositories to point at Artifactory with a few lines:</p>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Gradle init script to route via Artifactory — groovy</span></div><pre><code class=\"language-groovy\">// ~/.gradle/init.d/artifactory.init.gradle.kts\nallprojects {\n  repositories {\n    maven { url = uri(\"https://artifactory.example.com/artifactory/libs-release\") }\n    maven { url = uri(\"https://artifactory.example.com/artifactory/libs-snapshot\") }\n  }\n  afterEvaluate {\n    repositories.removeIf { it.name == \"MavenRepo\" } // remove direct Maven Central\n  }\n}</code></pre></div>\n          <h3>SNAPSHOTs: the versioned mutable</h3>\n          <p>Maven SNAPSHOT versions (<code>1.4.3-SNAPSHOT</code>) are a special case: they ARE mutable, by design. Artifactory stores them with timestamps and keeps a configurable number of <em>unique snapshots</em>. Configure \"Max Unique Snapshots\" on the local repo to avoid runaway disk use.</p>\n          <div class=\"callout callout-warn\"><p><strong>Common mistake:</strong> Not setting Max Unique Snapshots on a SNAPSHOT repo. A busy project can generate thousands of snapshot builds per day; within a month you'll have 100,000 artifacts eating disk. Set it to 5-10 on day one.</p></div>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> \"How do you ensure a Maven build is reproducible?\" Answer: SNAPSHOTs are not reproducible by design. For reproducible builds, use release versions pinned in a parent POM or BOM, and resolve through a virtual repo backed by a remote cache of Maven Central.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Route all Maven/Gradle traffic through a virtual repo via settings.xml or init scripts.</li><li>SNAPSHOTs are intentionally mutable; set Max Unique Snapshots to control disk use.</li><li>Build metadata (build name, number, agent) is attached automatically via the JFrog plugin.</li><li>Never publish release versions to a SNAPSHOT repo — treat them as immutable.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t11",
    "group": "m2",
    "level": "Core",
    "title": "Build Metadata: The Bill of Materials",
    "sectionNo": "11",
    "category": "Core Practical Skills",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Build Metadata: The Bill of Materials</h2>\n          <p>Artifacts alone aren't enough. You need to know <em>which CI run produced which artifact</em>, what dependencies it pulled, and what environment it was built on. This is what <strong>build info</strong> captures.</p>\n          <h3>What build info records</h3>\n          <p>A build info JSON captures:</p>\n          <ul>\n            <li>Build name + number + agent (who built it)</li>\n            <li>All modules (artifacts published) with checksums</li>\n            <li>All dependencies resolved (with the exact registry URL and checksum)</li>\n            <li>Environment variables (selectively — passwords are filtered)</li>\n            <li>Git commit, branch, VCS URL</li>\n            <li>Timing data</li>\n          </ul>\n          <h3>The JFrog CLI + build-info plugin</h3>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Capturing and publishing build info — bash</span></div><pre><code class=\"language-bash\"># In CI — wrap your build and publish build info\nexport JFROG_CLI_BUILD_NAME=myapp\nexport JFROG_CLI_BUILD_NUMBER=$CI_BUILD_ID\n\n# Capture all downloads during the build\njfrog rt dl \"libs-release-local/org/example/*/*.jar\" \\\n  --build-name=$JFROG_CLI_BUILD_NAME \\\n  --build-number=$JFROG_CLI_BUILD_NUMBER\n\n# Upload build outputs\njfrog rt u \"build/libs/*.jar\" libs-release-local/ \\\n  --build-name=$JFROG_CLI_BUILD_NAME \\\n  --build-number=$JFROG_CLI_BUILD_NUMBER\n\n# Publish the aggregated build info\njfrog rt bp</code></pre></div>\n          <h3>Why this matters</h3>\n          <p>Build info is what turns Artifactory from a file server into a <strong>software supply-chain ledger</strong>. You can answer questions like: \"Which builds depend on commons-collections 3.2.1, which has a CVE?\" — a question that would take days to answer without build info.</p>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> When asked \"how do you respond to a CVE in a transitive dependency?\", the answer involves build info: query Artifactory for every build that resolved the affected version, then notify the owners. This is what Xray Impact Analysis does automatically.</p></div>\n          <div class=\"callout callout-warn\"><p><strong>Gotcha:</strong> Build info only captures artifacts that went through the JFrog CLI or the Gradle/Maven plugins. Direct <code>curl</code> uploads and random <code>npm install</code> invocations bypass it. Be deliberate about routing all artifact traffic through the plugins.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Build info records producer, dependencies, environment, and timing for each CI run.</li><li>Published via <code>jfrog rt bp</code> after capturing uploads/downloads.</li><li>Enables supply-chain queries like \"what depends on CVE-affected X?\"</li><li>Only routed traffic is captured — be intentional about using the plugins.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t12",
    "group": "m3",
    "level": "Intermediate",
    "title": "CI/CD Integration: GitHub Actions, GitLab, Jenkins",
    "sectionNo": "12",
    "category": "Intermediate Practices",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>CI/CD Integration: GitHub Actions, GitLab, Jenkins</h2>\n          <p>Every major CI system has a first-class Artifactory integration. The pattern is always the same: authenticate, route traffic through Artifactory, capture build info, publish. Here are the three you'll encounter most.</p>\n          <h3>GitHub Actions</h3>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">GitHub Actions + JFrog CLI — yaml</span></div><pre><code class=\"language-yaml\"># .github/workflows/build.yml\nname: Build and publish\non: [push]\njobs:\n  publish:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-java@v4\n        with: { distribution: temurin, java-version: 21 }\n\n      - name: Set up JFrog CLI\n        uses: jfrog/setup-jfrog-cli@v4\n        env:\n          JF_URL: ${{ secrets.JF_URL }}\n          JF_ACCESS_TOKEN: ${{ secrets.JF_ACCESS_TOKEN }}\n\n      - name: Build and publish\n        env:\n          JFROG_CLI_BUILD_NAME: myapp\n          JFROG_CLI_BUILD_NUMBER: ${{ github.run_number }}\n        run: |\n          jfrog rt gradle-config --server-id-resolve=art --server-id-deploy=art\n          jfrog rt gradle \"clean build artifactoryPublish\"\n          jfrog rt build-publish</code></pre></div>\n          <h3>GitLab CI</h3>\n          <p>GitLab has built-in <code>CI_JOB_TOKEN</code> integration with Artifactory via the OIDC integration (added ~2023). Configure an OIDC provider in Artifactory pointing at GitLab, then the token is exchanged automatically. No long-lived secrets in CI variables.</p>\n          <h3>Jenkins</h3>\n          <p>The Artifactory Jenkins plugin (<code>artifactory</code>) is the most feature-rich. It wraps build steps in a DSL that automatically captures build info. The downside is that the DSL is verbose and the plugin is large — teams increasingly prefer the JFrog CLI for simplicity.</p>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Jenkins Artifactory plugin DSL — groovy</span></div><pre><code class=\"language-groovy\">// Jenkinsfile snippet\nrtServer (\n  id: \"artifactory\",\n  url: \"https://artifactory.example.com\",\n  credentialsId: \"artifactory-creds\"\n)\nrtGradleRun (\n  tool: \"Gradle-8.5\",\n  switches: \"--build-cache\",\n  tasks: \"clean build artifactoryPublish\",\n  deployerId: \"artifactory\",\n  resolverId: \"artifactory\"\n)\nrtPublishBuildInfo (serverId: \"artifactory\")</code></pre></div>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> \"How do you keep CI credentials safe?\" Answer: use OIDC federation wherever possible (GitHub Actions + JFrog Workload Identity, GitLab OIDC). Fall back to short-lived scoped access tokens injected via secret stores. Avoid long-lived passwords entirely.</p></div>\n          <div class=\"callout callout-warn\"><p><strong>Gotcha:</strong> GitHub Actions' <code>setup-jfrog-cli</code> action caches the CLI binary — but it does NOT cache your resolved dependencies. If your build pulls 500 MB of Maven artifacts, you still pay that time cost every run unless you're routing through an Artifactory proxy that caches.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Pattern: authenticate → route via virtual → capture build info → publish.</li><li>Prefer OIDC federation (no secrets in CI), fall back to scoped access tokens.</li><li>JFrog CLI is portable across all CI systems — prefer it over vendor plugins for simplicity.</li><li>Always route dependency resolution through Artifactory, not just uploads.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t13",
    "group": "m3",
    "level": "Intermediate",
    "title": "Artifact Promotion Workflows",
    "sectionNo": "13",
    "category": "Intermediate Practices",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Artifact Promotion Workflows</h2>\n          <p>\"Build once, promote many times\" is the DevOps slogan. But how does that actually work? You have three realistic patterns.</p>\n          <h3>Pattern 1: Tag-based promotion</h3>\n          <p>Build produces artifact <code>myapp-1.4.3-abc1234.jar</code>. After passing QA, you copy it to <code>libs-staging-local</code>. After passing prod gates, copy to <code>libs-prod-local</code>. The physical artifact never moves; Artifactory does a server-side copy.</p>\n          <h3>Pattern 2: Build-info promotion</h3>\n          <p>Artifactory's REST API has a <code>/api/build/promote</code> endpoint that takes a build name/number and moves all artifacts produced by that build to a target repo in one atomic operation. This is what mature teams actually use.</p>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Build-info promotion via REST API — bash</span></div><pre><code class=\"language-bash\"># Promote a build from dev to staging\ncurl -u admin:$TOKEN -X POST \\\n  \"https://artifactory.example.com/api/build/promote\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"status\": \"staged\",\n    \"ciUser\": \"jenkins\",\n    \"targetRepo\": \"libs-staging-local\",\n    \"sourceRepo\": \"libs-dev-local\",\n    \"copy\": true\n  }'\n\n# Promote again to production\ncurl -u admin:$TOKEN -X POST \\\n  \"https://artifactory.example.com/api/build/promote\" \\\n  -d '{\n    \"status\": \"released\",\n    \"targetRepo\": \"libs-prod-local\",\n    \"sourceRepo\": \"libs-staging-local\"\n  }'</code></pre></div>\n          <h3>Pattern 3: Virtual-repo layering</h3>\n          <p>Skip the physical copy. Give each environment a virtual repo that aggregates different combinations: dev-virtual = [dev-local, remote]; staging-virtual = [dev-local, staging-local, remote]; prod-virtual = [staging-local, prod-local, remote]. Promotion is re-configuring what each virtual exposes. Rarely used but elegant.</p>\n          <div class=\"callout callout-warn\"><p><strong>Common mistake:</strong> Re-building an artifact in each environment (\"build in dev, rebuild in staging\"). This guarantees that staging is testing a <em>different binary</em> than dev, which defeats the point. Always promote the exact artifact.</p></div>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> \"Describe a good promotion workflow.\" The strong answer: build once, attach build info, use <code>/api/build/promote</code> to move artifacts between environment-specific repos, record the promotion event in your change management system, and have prod pull only from the prod repo.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Build once, promote the exact artifact — never rebuild per environment.</li><li>Use /api/build/promote for atomic, auditable promotion of all build outputs.</li><li>Tag-based promotion works but is manual; build-info promotion is automated.</li><li>Each environment should have its own local repo as the promotion target.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t14",
    "group": "m3",
    "level": "Intermediate",
    "title": "Xray: Scanning and Supply-Chain Security",
    "sectionNo": "14",
    "category": "Intermediate Practices",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Xray: Scanning and Supply-Chain Security</h2>\n          <p>JFrog Xray is the security scanner that pairs with Artifactory. It inspects artifacts for CVEs, license violations, and secrets. It works at the artifact level — the same package scanned is the same package deployed.</p>\n          <h3>What Xray scans</h3>\n          <ul>\n            <li>Container image layers and their transitive packages</li>\n            <li>Maven, npm, PyPI, Go artifacts and their declared dependencies</li>\n            <li>Helm charts (and the images they reference)</li>\n            <li>Generic binaries for known vulnerabilities</li>\n          </ul>\n          <h3>Watches, Policies, and Rules</h3>\n          <p>Xray has three layers of abstraction:</p>\n          <ul>\n            <li><strong>Watch</strong> — a set of repos and build names to monitor.</li>\n            <li><strong>Policy</strong> — a set of rules attached to a watch. E.g., \"fail if CVSS ≥ 7\".</li>\n            <li><strong>Rule</strong> — one condition. E.g., \"block any artifact with CVE-2024-1234\".</li>\n          </ul>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Xray policy blocking critical CVEs — yaml</span></div><pre><code class=\"language-yaml\"># Example Xray policy (via JFrog CLI)\nname: prod-security-policy\ntype: security\nrules:\n  - name: block-critical\n    priority: 1\n    criteria:\n      minSeverity: Critical\n      applicabilityScan: true # only block if actually exploitable\n    actions:\n      blockDownload:\n        active: true\n        unscanned: true\n      failBuild: true\n      notifyWatchRecipients: true\n  - name: warn-high\n    priority: 2\n    criteria:\n      minSeverity: High\n    actions:\n      failBuild: false\n      createJiraTicket: true</code></pre></div>\n          <h3>Applicability scanning</h3>\n          <p>Modern Xray can analyze whether a CVE in a dependency is actually <em>reachable</em> from your code (via AST analysis). This drastically reduces false positives. It's a paid feature but worth it for large orgs.</p>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> \"How do you prevent a CVE in a dependency from reaching production?\" Answer: run Xray in your CI pipeline — fail the build if any artifact has a CVSS ≥ 7 that is actually applicable. Block downloads of vulnerable artifacts at the registry level as a defense-in-depth measure.</p></div>\n          <div class=\"callout callout-warn\"><p><strong>Gotcha:</strong> Xray needs up-to-date vulnerability databases. It polls JFrog's cloud feed hourly. If your instance is offline or behind a strict firewall, you must sync the feed manually or you'll miss new CVEs.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Xray scans artifacts for CVEs, license issues, and secrets at the artifact level.</li><li>Watches → Policies → Rules is the abstraction hierarchy.</li><li>Applicability scanning reduces false positives by checking actual reachability.</li><li>Block vulnerable artifacts at the registry as a defense-in-depth measure.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t15",
    "group": "m3",
    "level": "Intermediate",
    "title": "Replication: Multi-Site Sync",
    "sectionNo": "15",
    "category": "Intermediate Practices",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Replication: Multi-Site Sync</h2>\n          <p>When you have teams in multiple regions or data centers, each site needs fast local access to artifacts. Replication solves this by copying artifacts between Artifactory instances.</p>\n          <h3>Push vs. Pull replication</h3>\n          <ul>\n            <li><strong>Push</strong> — source Artifactory actively replicates to target after each change. Low latency, requires source to know all targets.</li>\n            <li><strong>Pull</strong> — target Artifactory polls source on a schedule. Useful across NAT or firewalls, since the target initiates the connection.</li>\n          </ul>\n          <h3>Smart remote repositories</h3>\n          <p>A <strong>Smart Remote</strong> is a remote repo whose upstream is another Artifactory. Artifactory understands this and optimizes: metadata is cached, downloads are streamed directly from the remote Artifactory's storage (not through the local proxy), and the remote Artifactory can apply its own policies. This is the preferred way to chain Artifactory instances.</p>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Push replication every 15 minutes — bash</span></div><pre><code class=\"language-bash\"># Configure replication via REST\ncurl -u admin:$TOKEN -X POST \\\n  \"https://artifactory-us.example.com/api/replication/libs-release-local\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"url\": \"https://artifactory-eu.example.com/artifactory/libs-release-local\",\n    \"username\": \"replicator\",\n    \"password\": \"redacted\",\n    \"cronExp\": \"0 0/15 * * * ?\",\n    \"enabled\": true,\n    \"syncDeletes\": true,\n    \"syncProperties\": true,\n    \"repoKey\": \"libs-release-local\"\n  }'</code></pre></div>\n          <div class=\"callout callout-warn\"><p><strong>Operations pitfall:</strong> Syncing deletes via replication is dangerous. One accidental <code>rm -rf</code> script on the source propagates to all targets. Leave <code>syncDeletes: false</code> unless you have a very good reason and strong access controls.</p></div>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> \"How would you serve a globally distributed engineering org?\" Answer: one Artifactory per region, each with local repos for build outputs and Smart Remote repos pointing at the primary for shared artifacts. Use federated repos for truly synchronized content like Docker images used by all regions.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Push = source pushes; Pull = target polls. Choose based on network topology.</li><li>Smart Remote is the preferred way to chain Artifactory instances.</li><li>Be cautious with syncDeletes — accidental deletions propagate.</li><li>Federated repos are best for globally-synchronized content; replication is best for one-way flows.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t16",
    "group": "m3",
    "level": "Intermediate",
    "title": "Backup and Disaster Recovery",
    "sectionNo": "16",
    "category": "Intermediate Practices",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Backup and Disaster Recovery</h2>\n          <p>Treating Artifactory like a stateless web server is the #1 cause of registry-related disasters. You have two layers to protect: <strong>metadata</strong> and <strong>binaries</strong>. They have different backup strategies.</p>\n          <h3>Metadata backup</h3>\n          <p>PostgreSQL: <code>pg_dump</code> nightly to durable storage. Artifactory: built-in <code>Export System Configuration</code> for users, permissions, repo configs. The JFrog Platform also supports full <em>System Backup</em> via the UI.</p>\n          <h3>Binary backup</h3>\n          <p>Depends on your binarystore:</p>\n          <ul>\n            <li><strong>Filesystem</strong> — snapshot the volume (EBS snapshot, ZFS snapshot, LVM snapshot).</li>\n            <li><strong>S3/GCS</strong> — enable versioning and cross-region replication; no manual backup needed.</li>\n            <li><strong>NFS</strong> — snapshot at the storage layer.</li>\n          </ul>\n          <h3>Artifactory's built-in Export</h3>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Full system export to archive — bash</span></div><pre><code class=\"language-bash\"># Full export to an archive (via REST)\ncurl -u admin:$TOKEN -X POST \\\n  \"https://artifactory.example.com/api/export/system\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"exportPath\": \"/mnt/backup/artifactory/2026-01-15\",\n    \"includeMetadata\": true,\n    \"includeBinaries\": true,\n    \"createArchive\": true,\n    \"excludeBuilds\": false,\n    \"verbose\": false\n  }'\n\n# Restore is the reverse — use /api/import/system\n# Importing requires Artifactory to be in a clean state (no pre-existing data)</code></pre></div>\n          <h3>Recovery time vs. recovery point</h3>\n          <p>Two metrics matter:</p>\n          <ul>\n            <li><strong>RPO</strong> — how much data can you afford to lose? For Artifactory: a day is usually fine; you can rebuild from CI.</li>\n            <li><strong>RTO</strong> — how fast must you be back online? For Artifactory: typically hours, because CI can't deploy without it.</li>\n          </ul>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> \"What's your Artifactory disaster recovery plan?\" Strong answer: metadata via nightly pg_dump + config export, binaries via volume snapshots or S3 versioning. Test restoration quarterly — backup is only as good as the last verified restore.</p></div>\n          <div class=\"callout callout-warn\"><p><strong>Gotcha:</strong> An Artifactory \"Export\" that includes binaries can be enormous (TB scale) and slow (hours). For most orgs, separate DB dumps + storage-layer snapshots is faster and gives better RPO. Only use full export for migration or one-time archival.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Two layers to protect: metadata (pg_dump) and binaries (storage snapshots or S3 versioning).</li><li>Artifactory's built-in export is comprehensive but slow; storage-layer backups are usually faster.</li><li>Test restores quarterly — an untested backup is a liability.</li><li>Define RPO and RTO explicitly; Artifactory typically targets hours for RTO, days for RPO.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t17",
    "group": "m3",
    "level": "Intermediate",
    "title": "Cleanup Policies and Storage Hygiene",
    "sectionNo": "17",
    "category": "Intermediate Practices",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Cleanup Policies and Storage Hygiene</h2>\n          <p>Left untended, an Artifactory instance bloats until it fills the disk. Cleanup policies prevent this by automatically removing artifacts based on rules.</p>\n          <h3>What to clean</h3>\n          <ul>\n            <li><strong>Old snapshots</strong> — via \"Max Unique Snapshots\" on Maven repos.</li>\n            <li><strong>Unused Docker images</strong> — anything not pulled in N days.</li>\n            <li><strong>Unused npm/PyPI packages</strong> — similar logic.</li>\n            <li><strong>Build artifacts from old builds</strong> — keep only the last N builds per job.</li>\n          </ul>\n          <h3>Artifactory's built-in cleanup</h3>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Cleanup user plugin — bash</span></div><pre><code class=\"language-bash\"># Create a cleanup user plugin (Groovy, stored in etc/artifactory/plugins/)\n# Example: delete Docker images untouched for 90 days\nimport org.artifactory.repo.RepoPathFactory as RPF\nimport org.artifactory.search.Searches\n\nexecutions {\n  cleanupOldDockerImages(httpMethod: HttpMethods.POST) { params -&gt;\n    def cutoff = System.currentTimeMillis() - (90 * 24 * 3600 * 1000L)\n    def removed = 0\n    searches.artifactsByPattern(\n      repoKey: \"docker-local\",\n      pattern: \"**/manifests/sha256--*\") { repoPath -&gt;\n      def info = repositories.getArtifactsInfo(repoPath)\n      if (info.lastDownloaded &lt; cutoff) {\n        repositories.delete(repoPath)\n        removed++\n      }\n    }\n    message = \"Removed $removed old Docker manifests\"\n    status = 200\n  }\n}</code></pre></div>\n          <h3>Third-party tools</h3>\n          <p><strong>JFrog Cleanup Plugin</strong>, <strong>ArtiClean</strong>, and AQL-based scripts are the common patterns. AQL (Artifactory Query Language) lets you write SQL-like queries over artifacts and is the most flexible approach.</p>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">AQL query for old Docker images — json</span></div><pre><code class=\"language-json\">// AQL: find all Docker images not downloaded in 90 days\nitems.find({\n  \"repo\": \"docker-local\",\n  \"type\": \"file\",\n  \"path\": {\"$match\": \"*/manifests/*\"},\n  \"stat.downloaded\": {\"$lt\": \"2026-01-01\"}\n}).include(\"name\", \"repo\", \"path\", \"stat.downloaded\")\n  .sort({\"$desc\": [\"created\"]})\n  .limit(1000)</code></pre></div>\n          <div class=\"callout callout-danger\"><p><strong>Safety gotcha:</strong> Always dry-run cleanup scripts on a dev instance first. A buggy query can delete production artifacts. Implement a \"soft delete\" pattern — move to a trash repo for 30 days, then hard-delete — so mistakes are recoverable.</p></div>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> \"How do you prevent Artifactory from consuming all disk space?\" Answer: combination of Max Unique Snapshots for Maven, cleanup policies via AQL or user plugins for Docker/npm, and a trash-repo pattern so deletions are recoverable for 30 days.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Set Max Unique Snapshots on every SNAPSHOT repo from day one.</li><li>Use AQL to query and delete stale artifacts on a schedule.</li><li>Implement a \"soft delete\" trash repo so mistakes are recoverable.</li><li>Monitor disk usage via Artifactory's Storage Summary dashboard — alert at 80%.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t18",
    "group": "m4",
    "level": "Advanced",
    "title": "High Availability Clusters",
    "sectionNo": "18",
    "category": "Advanced / Production-Grade",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>High Availability Clusters</h2>\n          <p>A production Artifactory deployment is a <strong>cluster of app nodes</strong> fronted by a <strong>router</strong>, sharing a <strong>database</strong> and a <strong>shared filestore</strong>. This is what you build when you can't tolerate registry outages.</p>\n          <h3>Architecture</h3>\n          <ul>\n            <li>3+ Artifactory app nodes (odd number for consensus).</li>\n            <li>1 router process per node (or external load balancer).</li>\n            <li>PostgreSQL cluster (primary + replicas).</li>\n            <li>Shared storage (S3 with eventual providers, or NFS).</li>\n          </ul>\n          <h3>How requests route</h3>\n          <p>A request hits the router, which decides: read requests can go to any node; write requests go to the <em>primary</em> node (one of the app nodes is elected primary). The router handles failover automatically.</p>\n          <h3>Bootstrap process</h3>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">HA system.yaml template — yaml</span></div><pre><code class=\"language-yaml\"># system.yaml — same file on every node, slight differences\nshared:\n  node:\n    id: \"artifactory-node-1\"  # unique per node\n    ip: 10.0.1.10\n  database:\n    type: postgresql\n    url: \"jdbc:postgresql://pg-cluster:5432/artifactory\"\n    username: artifactory\n    password: \"${env.DB_PASSWORD}\"\n  binaryStorage:\n    type: s3-storage-v3-direct\n    bucketName: my-artifactory-bucket\n    region: us-east-1\nrouter:\n  topology:\n    local:\n      required: true\n    external:\n      required: true\n  tls: true\n  entrypoints:\n    - external: 8082\n    - internal: 8046</code></pre></div>\n          <div class=\"callout callout-warn\"><p><strong>Operations pitfall:</strong> Adding a new node to an HA cluster requires that the new node's filestore can see existing binaries. If you're on local-filesystem storage (default), the new node starts empty and will return 404 for everything until replication catches up. Use S3/NFS from the start.</p></div>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> \"Walk me through how you'd scale Artifactory for 1000 engineers.\" Answer: 3-5 app nodes behind a router with external load balancing, shared S3 filestore, replicated PostgreSQL, per-region router for global traffic. Add monitoring for request latency and cache hit ratio.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>HA = multiple app nodes + router + shared DB + shared filestore.</li><li>Router handles read/write routing and failover.</li><li>Shared filestore is mandatory — local-filesystem HA is broken.</li><li>Scale reads by adding nodes; scale writes by tuning DB and storage.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t19",
    "group": "m4",
    "level": "Advanced",
    "title": "RBAC, Permissions, and Access Control",
    "sectionNo": "19",
    "category": "Advanced / Production-Grade",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>RBAC, Permissions, and Access Control</h2>\n          <p>Artifactory permissions are modeled as: <strong>Users / Groups / Roles / Permissions</strong>. Most orgs only use two of these and get the model wrong.</p>\n          <h3>The four objects</h3>\n          <ul>\n            <li><strong>User</strong> — a human or service account.</li>\n            <li><strong>Group</strong> — a set of users. Sync from LDAP/AD/Okta.</li>\n            <li><strong>Permission Target</strong> — the thing being protected (a repo, build, release bundle).</li>\n            <li><strong>Role</strong> — an action set (read, write, annotate, delete, manage). Assigned to groups on a permission target.</li>\n          </ul>\n          <h3>Permission hierarchy</h3>\n          <p>Every user inherits permissions from every group they're in. <strong>Deny always wins over allow</strong>. This is where people get burned — you can't revoke access by removing a user from a group if they're in another group that grants it.</p>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Permission target with group roles — json</span></div><pre><code class=\"language-json\">// REST: create a permission target\n{\n  \"name\": \"prod-app-deployers\",\n  \"repo\": {\n    \"include-patterns\": [\"libs-prod-local/**\"],\n    \"exclude-patterns\": [],\n    \"repositories\": [\"libs-prod-local\"],\n    \"actions\": {\n      \"users\": {},\n      \"groups\": {\n        \"prod-deployers\": [\"r\", \"w\", \"m\", \"n\", \"d\"]\n      }\n    }\n  },\n  \"build\": {\n    \"include-patterns\": [\"myapp/**\"],\n    \"repositories\": [\"artifactory-build-info\"],\n    \"actions\": {\n      \"groups\": {\n        \"prod-deployers\": [\"r\", \"w\", \"m\", \"d\"]\n      }\n    }\n  }\n}</code></pre></div>\n          <h3>Include/Exclude patterns</h3>\n          <p>Permissions support Ant-style patterns. <code>libs-prod-local/**</code> grants everything; <code>libs-prod-local/com/acme/critical/**</code> scopes it. Use exclude patterns for exceptions (e.g., exclude a single sensitive artifact from a team's read access).</p>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> \"How do you scope CI permissions?\" Answer: never give CI broad admin access. Create a service account per pipeline, scoped to exactly the repos it needs, with minimal roles (usually deploy+annotate). Use OIDC federation so no secrets live in CI.</p></div>\n          <div class=\"callout callout-warn\"><p><strong>Gotcha:</strong> The \"anonymous\" user exists by default and has read access to public repos. If your Artifactory is internet-facing, disable anonymous access immediately.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Four objects: Users, Groups, Permission Targets, Roles.</li><li>Deny overrides allow — use exclude patterns for exceptions.</li><li>Sync groups from IdP (LDAP/AD/Okta) rather than managing locally.</li><li>Never give CI service accounts admin — use scoped permission targets.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t20",
    "group": "m4",
    "level": "Advanced",
    "title": "SSO and OIDC Federation",
    "sectionNo": "20",
    "category": "Advanced / Production-Grade",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>SSO and OIDC Federation</h2>\n          <p>Modern Artifactory federates identity from your IdP (Okta, Azure AD, Google Workspace) via <strong>SAML 2.0</strong> for humans and <strong>OIDC</strong> for machines. This eliminates password management and enables short-lived machine credentials.</p>\n          <h3>SAML for humans</h3>\n          <p>Configure a SAML provider in the JFrog Platform, then users click \"Login with Okta\" and are redirected. Group membership can be synced from SAML assertions — when a user authenticates, they're automatically added to Artifactory groups matching their SAML groups.</p>\n          <h3>OIDC for machines</h3>\n          <p>OIDC is the more interesting one for platform engineering. A CI system (GitHub Actions, GitLab) produces a short-lived JWT signed by the IdP. Artifactory exchanges it for an access token with predefined scopes. No secrets ever touch the CI system.</p>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">OIDC in GitHub Actions — yaml</span></div><pre><code class=\"language-yaml\"># GitHub Actions OIDC integration\npermissions:\n  id-token: write\n  contents: read\n\njobs:\n  publish:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: jfrog/setup-jfrog-cli@v4\n        env:\n          JF_URL: https://mycompany.jfrog.io\n          # Note: NO JF_ACCESS_TOKEN!\n          JF_OIDC_PROVIDER_NAME: github-actions\n          JF_OIDC_AUDIENCE: jfrog-aud\n\n      - name: CLI auto-exchanges OIDC token\n        run: jfrog rt ping\n        # jfrog rt reads $ACTIONS_ID_TOKEN_REQUEST_TOKEN\n        # exchanges for access token automatically</code></pre></div>\n          <h3>Identity mappings</h3>\n          <p>An <strong>identity mapping</strong> says: \"OIDC token with claims (issuer=X, audience=Y, repository=Z) maps to Artifactory group G with scope S.\" This is the policy that makes OIDC safe — you control exactly which repo actions each GitHub Actions workflow is allowed to perform.</p>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> \"How do you secure CI-to-Artifactory authentication?\" Answer: OIDC federation. GitHub Actions (or GitLab CI) emits a short-lived JWT signed by the IdP; Artifactory exchanges it for a scoped access token. No long-lived secrets ever touch CI, and every token is tied to a specific workflow + branch.</p></div>\n          <div class=\"callout callout-warn\"><p><strong>Gotcha:</strong> OIDC identity mappings need to include branch and environment constraints. A mapping that grants any GitHub Actions workflow access to prod is a serious vulnerability — always bind to specific repo + branch patterns.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>SAML for humans (interactive SSO), OIDC for machines (CI).</li><li>OIDC eliminates secrets in CI entirely — CI emits a signed token, Artifactory exchanges it.</li><li>Identity mappings bind tokens to specific repos, branches, and environments.</li><li>Never create a wide-open identity mapping — always scope to repository + branch + environment.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t21",
    "group": "m4",
    "level": "Advanced",
    "title": "Performance Tuning and Caching",
    "sectionNo": "21",
    "category": "Advanced / Production-Grade",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Performance Tuning and Caching</h2>\n          <p>Artifactory is rarely CPU-bound. It's almost always <strong>I/O-bound</strong> — disk, network, or database. Understanding where the bottleneck is saves you from throwing money at the wrong resource.</p>\n          <h3>The four bottlenecks</h3>\n          <ol>\n            <li><strong>Metadata DB</strong> — slow queries on large artifact counts. Mitigated by indexing and tuning.</li>\n            <li><strong>Binary store</strong> — slow S3 or slow NFS. Mitigated by cache-fs and appropriate cache sizing.</li>\n            <li><strong>JVM heap</strong> — too small causes GC pauses; too large causes long GC stops. Default 4GB is usually too small for production.</li>\n            <li><strong>Network</strong> — cross-region pulls. Mitigated by regional replicas.</li>\n          </ol>\n          <h3>JVM tuning</h3>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Production JVM tuning — bash</span></div><pre><code class=\"language-bash\"># system.yaml — JVM settings\nshared:\n  extraJavaOpts: &gt;-\n    -Xms8g -Xmx8g\n    -XX:+UseG1GC\n    -XX:MaxGCPauseMillis=200\n    -XX:+ParallelRefProcEnabled\n    -XX:+UseStringDeduplication\n    -XX:+ExplicitGCInvokesConcurrent\n    -Djdk.nio.maxCachedBufferSize=262144\n    -Dio.netty.allocator.type=pooled\n\n# Monitor with JFR — Artifactory exposes :8046/artifactory/jfr for on-demand profiling</code></pre></div>\n          <h3>Cache-fs tuning</h3>\n          <p>The cache-fs provider stores recently-accessed binaries on local SSD. Size it to your working set — typically 20-50 GB. Too small and you hit S3 constantly; too large wastes expensive storage.</p>\n          <h3>Database tuning</h3>\n          <p>PostgreSQL: set <code>work_mem</code> to 64-128MB, <code>maintenance_work_mem</code> to 1-2GB, enable <code>effective_cache_size</code> matching your RAM. Run <code>VACUUM ANALYZE</code> weekly on large tables.</p>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> \"Artifactory is slow — how do you diagnose?\" Answer: start with metrics (request latency p95, cache hit ratio, DB query time, storage latency). If cache hit ratio < 80%, expand cache-fs. If DB queries are slow, check for missing indexes. If storage latency is high, check S3 or NFS.</p></div>\n          <div class=\"callout callout-warn\"><p><strong>Gotcha:</strong> Setting heap above 32GB on commodity JVMs crosses the \"compressed Oops\" threshold — pointer compression turns off and effective memory usage doubles. Cap at ~26-30GB unless you understand what you're doing.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Bottlenecks: metadata DB, binary store, JVM heap, network. Diagnose before tuning.</li><li>Cache-fs is the single biggest perf lever — size to your working set.</li><li>Cap JVM heap at ~26GB to stay under compressed Oops threshold.</li><li>Monitor cache hit ratio — anything below 80% means your cache is undersized.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t22",
    "group": "m4",
    "level": "Advanced",
    "title": "Disaster Recovery: Federation at Scale",
    "sectionNo": "22",
    "category": "Advanced / Production-Grade",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Disaster Recovery: Federation at Scale</h2>\n          <p><strong>Federation</strong> (introduced ~2022) is different from replication: every federated member is both source and target, with bidirectional sync and conflict resolution. It's what you use when you have multiple active-active Artifactory instances.</p>\n          <h3>Federation vs. replication</h3>\n          <ul>\n            <li><strong>Replication</strong>: unidirectional, push or pull, no conflict resolution. Good for backup or caching.</li>\n            <li><strong>Federation</strong>: bidirectional, active-active, conflict resolution based on timestamps + priority. Good for multi-region deployments where both sides may write.</li>\n          </ul>\n          <h3>Conflict resolution</h3>\n          <p>If the same path is pushed to two federated members simultaneously (rare for immutable artifacts), Artifactory uses <em>last-write-wins by timestamp</em>, with priority-based tiebreaker. For artifacts this rarely matters since the same version pushed twice is identical.</p>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Federated Docker repo across 3 regions — bash</span></div><pre><code class=\"language-bash\"># Create a federated repo via REST\ncurl -u admin:$TOKEN -X PUT \\\n  \"https://artifactory.example.com/api/repositories/docker-federated\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"rclass\": \"federated\",\n    \"packageType\": \"docker\",\n    \"members\": [\n      {\"url\": \"https://artifactory-us.example.com/artifactory\", \"enabled\": true},\n      {\"url\": \"https://artifactory-eu.example.com/artifactory\", \"enabled\": true},\n      {\"url\": \"https://artifactory-ap.example.com/artifactory\", \"enabled\": true}\n    ]\n  }'\n\n# Check federation status\njfrog rt curl /api/federation/status/docker-federated</code></pre></div>\n          <h3>When to use federation</h3>\n          <p>Use federation for:</p>\n          <ul>\n            <li>Docker images used by globally distributed teams (same image, pulled from nearest site).</li>\n            <li>Helm charts shared across regions.</li>\n            <li>Golden base images that multiple sites need.</li>\n          </ul>\n          <p>Don't use federation for: build outputs that should be region-specific (use replication or independent local repos).</p>\n          <div class=\"callout callout-warn\"><p><strong>Operations pitfall:</strong> Federation syncs metadata but NOT build info. Build info is instance-local. A build published in US is not visible in EU. For global build visibility, use the JFrog Platform's cross-instance build sync feature.</p></div>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> \"How do you serve a globally distributed company?\" Answer: one Artifactory per major region, connected via federation for shared content (Docker images, golden Helm charts). Region-specific build outputs stay local. Each region pulls shared content from the nearest federated member.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Federation is bidirectional, active-active with conflict resolution.</li><li>Use for shared content (Docker images, Helm charts); use replication for one-way flows.</li><li>Federation syncs artifacts, not build info — use platform-level build sync for that.</li><li>Size federation to your geography: typically 3-5 federated members globally.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t23",
    "group": "m4",
    "level": "Advanced",
    "title": "Observability: Metrics, Logs, and Tracing",
    "sectionNo": "23",
    "category": "Advanced / Production-Grade",
    "body": [
      {
        "t": "html",
        "html": "\n          <h2>Observability: Metrics, Logs, and Tracing</h2>\n          <p>A production Artifactory emits metrics, structured logs, and (optionally) distributed traces. Without observability, you're operating blind.</p>\n          <h3>Metrics</h3>\n          <p>Artifactory exposes a Prometheus endpoint at <code>/artifactory/api/v1/metrics</code>. Key metrics:</p>\n          <ul>\n            <li><code>artifactory_http_request_duration_seconds</code> — p50/p95/p99 per method and status</li>\n            <li><code>artifactory_repo_storage_used_bytes</code> — per repo</li>\n            <li><code>artifactory_artifact_count</code> — per repo</li>\n            <li><code>artifactory_download_bytes_total</code>, <code>artifactory_upload_bytes_total</code></li>\n            <li><code>artifactory_cache_hit_ratio</code> — for remote repos</li>\n          </ul>\n          <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">Prometheus + alerting — yaml</span></div><pre><code class=\"language-yaml\"># Prometheus scrape config\nscrape_configs:\n  - job_name: artifactory\n    metrics_path: /artifactory/api/v1/metrics\n    basic_auth:\n      username: metrics-reader\n      password: &lt;token&gt;\n    static_configs:\n      - targets:\n        - artifactory-1.example.com:8082\n        - artifactory-2.example.com:8082\n        - artifactory-3.example.com:8082\n\n# Alert on cache miss rate spike\nalerts:\n  - alert: ArtifactoryLowCacheHit\n    expr: artifactory_cache_hit_ratio &lt; 0.8\n    for: 15m\n    annotations:\n      summary: \"Cache hit ratio below 80% for 15m — likely undersized cache\"</code></pre></div>\n          <h3>Logs</h3>\n          <p>Logs live in <code>$JFROG_HOME/artifactory/var/log</code>. Key files: <code>artifactory-service.log</code> (main app), <code>request.log</code> (access), <code>artifactory-access.log</code> (auth events). All are JSON-structured in modern versions.</p>\n          <h3>Distributed tracing</h3>\n          <p>Artifactory supports OpenTelemetry — you can export traces to Jaeger, Tempo, or Datadog to correlate a slow request across router → app → DB → S3.</p>\n          <div class=\"callout callout-tip\"><p><strong>Interview angle:</strong> \"How do you monitor Artifactory health?\" Answer: Prometheus metrics with dashboards showing request latency p95, cache hit ratio, storage growth, and error rate. Alert on cache hit ratio < 80%, error rate > 1%, and disk usage > 85%. Use OTel traces to debug slow requests.</p></div>\n          <div class=\"callout callout-warn\"><p><strong>Gotcha:</strong> The metrics endpoint returns a lot of data. Scraping every 15s on a large cluster can itself cause load. Use 30-60s scrape intervals and downsample via recording rules.</p></div>\n          <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul><li>Prometheus at /artifactory/api/v1/metrics — key metrics: request latency, cache hit, storage used.</li><li>Logs are JSON-structured in $JFROG_HOME/var/log — ship to your log aggregator.</li><li>OpenTelemetry traces let you follow a slow request across router → app → DB → storage.</li><li>Alert on cache hit ratio < 80%, error rate > 1%, disk usage > 85%.</li></ul></div>\n        "
      }
    ]
  },
  {
    "id": "t24",
    "group": "m5",
    "level": "Interview",
    "title": "Timed Knowledge Quiz",
    "sectionNo": "24",
    "category": "Interview Prep",
    "body": [
      {
        "t": "p",
        "c": "Test your registry and Artifactory knowledge with 25 comprehensive questions spanning repository types, checksum search, Docker manifest lists, promotion pipelines, HA topology, and disaster recovery."
      },
      {
        "t": "quiz",
        "questions": [
          {
            "q": "What is the primary purpose of a remote repository in Artifactory?",
            "options": [
              "Stores artifacts you publish from your CI",
              "Acts as a caching proxy for an upstream source",
              "Aggregates multiple repos behind one URL",
              "Replicates artifacts to another region"
            ],
            "correct": 1,
            "explain": "Remote repos cache upstream sources (Maven Central, npmjs.org, Docker Hub) to improve reliability and performance."
          },
          {
            "q": "Which repository type would you give developers as their single source URL?",
            "options": [
              "Local",
              "Remote",
              "Virtual",
              "Federated"
            ],
            "correct": 2,
            "explain": "Virtual repos aggregate local + remote behind one URL, so developers don't need to know the topology."
          },
          {
            "q": "A Docker image is pinned by digest instead of tag. What does this guarantee?",
            "options": [
              "The image builds faster",
              "The exact same bytes will be pulled every time, immune to tag reassignment",
              "Multi-arch support works automatically",
              "The image is automatically signed"
            ],
            "correct": 1,
            "explain": "Digests are content-addressed (SHA256). Tags are mutable pointers; digests are immutable."
          },
          {
            "q": "What does a manifest list enable?",
            "options": [
              "Layer compression",
              "A single tag to serve images for multiple architectures",
              "Automatic signing",
              "Faster pushes"
            ],
            "correct": 1,
            "explain": "A manifest list (OCI index) points to per-platform manifests, letting one tag serve amd64, arm64, etc."
          },
          {
            "q": "Why should you never use :latest in production Kubernetes manifests?",
            "options": [
              "It's deprecated",
              "The tag is mutable — re-pushes don't trigger re-pulls and break reproducibility",
              "It causes DNS issues",
              "It exceeds pull limits"
            ],
            "correct": 1,
            "explain": ":latest can be re-tagged silently, and cached nodes won't re-pull, leading to silent version drift."
          },
          {
            "q": "What is build info?",
            "options": [
              "A list of running containers",
              "Metadata about a CI run: artifacts, dependencies, environment, timing",
              "A backup of the Artifactory database",
              "A license compliance report"
            ],
            "correct": 1,
            "explain": "Build info records the producer, dependencies, environment, and timing of each CI run, enabling supply-chain queries."
          },
          {
            "q": "Which tool scans Artifactory artifacts for CVEs and license issues?",
            "options": [
              "JFrog CLI",
              "Xray",
              "Router",
              "Prometheus"
            ],
            "correct": 1,
            "explain": "JFrog Xray is the supply-chain security scanner that integrates with Artifactory."
          },
          {
            "q": "What does the router process do in an HA cluster?",
            "options": [
              "Compiles artifacts",
              "Terminates TLS, routes requests, load balances across app nodes",
              "Scans for vulnerabilities",
              "Runs the database"
            ],
            "correct": 1,
            "explain": "The router fronts HA clusters, handling TLS termination and routing reads/writes to the right app node."
          },
          {
            "q": "Which auth method is best for CI systems today?",
            "options": [
              "Long-lived API keys stored in CI variables",
              "OIDC federation exchanging short-lived JWTs for access tokens",
              "Shared admin password",
              "SSH keys"
            ],
            "correct": 1,
            "explain": "OIDC eliminates long-lived secrets in CI entirely — tokens are scoped, short-lived, and tied to specific workflows."
          },
          {
            "q": "What is the \"Assumed Offline Period\" setting on a remote repo?",
            "options": [
              "Time before deleting cached artifacts",
              "How long to serve cached content when upstream returns errors",
              "Max TTL for a downloaded artifact",
              "Time before auto-renewing API keys"
            ],
            "correct": 1,
            "explain": "When upstream returns 5xx, Artifactory serves cached content and retries only after this interval, shielding CI from noisy upstreams."
          },
          {
            "q": "What separates federation from replication?",
            "options": [
              "Federation is slower",
              "Federation is bidirectional, active-active with conflict resolution; replication is unidirectional",
              "Federation only works for Docker",
              "There is no difference"
            ],
            "correct": 1,
            "explain": "Federation is active-active with conflict resolution; replication is one-way push or pull."
          },
          {
            "q": "Where does Artifactory store the physical bytes of artifacts?",
            "options": [
              "In the metadata database",
              "In the filestore configured via binarystore.xml (local, S3, GCS, etc.)",
              "In the router",
              "In Redis"
            ],
            "correct": 1,
            "explain": "Binarystore.xml defines the storage chain (cache-fs, S3, etc.). The app holds metadata pointers."
          },
          {
            "q": "What is a \"Max Unique Snapshots\" setting used for?",
            "options": [
              "Limits number of concurrent users",
              "Controls how many SNAPSHOT versions are retained to avoid runaway disk use",
              "Sets max download size",
              "Caps API rate limits"
            ],
            "correct": 1,
            "explain": "SNAPSHOTs are mutable by design; without a cap a busy project can accumulate 100k+ snapshots."
          },
          {
            "q": "In Artifactory RBAC, what happens when a user has both allow and deny permissions?",
            "options": [
              "The newest wins",
              "Deny always overrides allow",
              "Allow wins",
              "The user is locked out"
            ],
            "correct": 1,
            "explain": "Deny overrides allow — this is why exclude patterns on permission targets are important for exceptions."
          },
          {
            "q": "Why is a cache-fs provider important for Artifactory performance?",
            "options": [
              "It compiles Java",
              "It caches recently-accessed binaries on local SSD, avoiding S3 round-trips",
              "It scans for CVEs",
              "It signs artifacts"
            ],
            "correct": 1,
            "explain": "Cache-fs is the primary performance lever — size it to your working set (20-50 GB typical)."
          },
          {
            "q": "What does the OCI Distribution Spec define?",
            "options": [
              "A container runtime",
              "The protocol for pushing/pulling blobs and manifests to a registry",
              "A vulnerability scanner",
              "A Helm chart format"
            ],
            "correct": 1,
            "explain": "OCI Distribution Spec is the standard protocol every modern container registry speaks."
          },
          {
            "q": "What is an identity mapping in OIDC integration?",
            "options": [
              "Maps IP addresses to hostnames",
              "Maps OIDC token claims to Artifactory groups and scopes",
              "Maps Docker tags to digests",
              "Maps Helm charts to K8s namespaces"
            ],
            "correct": 1,
            "explain": "Identity mappings bind OIDC tokens to specific Artifactory permissions — they're what makes OIDC safe."
          },
          {
            "q": "Which backup approach is recommended for Artifactory binaries stored on S3?",
            "options": [
              "pg_dump of the database",
              "Enable S3 versioning + cross-region replication; no manual backup needed",
              "Nightly tarball of /var/opt/jfrog",
              "Use Artifactory's export feature only"
            ],
            "correct": 1,
            "explain": "S3 versioning + CRR is the cleanest backup strategy for S3-backed filestores."
          },
          {
            "q": "What is the correct promotion pattern for artifacts through environments?",
            "options": [
              "Rebuild the artifact in each environment",
              "Build once, promote the exact artifact between environment-specific repos",
              "Copy source code to each environment's repo",
              "Use :latest in every environment"
            ],
            "correct": 1,
            "explain": "Build once, promote the exact artifact — never rebuild per environment, or staging tests a different binary."
          },
          {
            "q": "AQL in Artifactory is used for:",
            "options": [
              "Auth queries",
              "SQL-like queries over artifact metadata for searches and cleanup",
              "API rate limiting",
              "Build validation"
            ],
            "correct": 1,
            "explain": "Artifactory Query Language lets you write SQL-like queries over artifacts — essential for cleanup and auditing."
          },
          {
            "q": "Which metric is most useful for detecting an undersized Artifactory cache?",
            "options": [
              "CPU usage",
              "Cache hit ratio",
              "Network bandwidth",
              "Disk IOPS"
            ],
            "correct": 1,
            "explain": "Cache hit ratio below 80% means most requests are hitting slow storage — expand cache-fs."
          },
          {
            "q": "What is a \"Smart Remote\" repository?",
            "options": [
              "A remote with automatic vulnerability scanning",
              "A remote repo whose upstream is another Artifactory instance, with optimized behavior",
              "A remote that auto-scales",
              "A remote for ML models"
            ],
            "correct": 1,
            "explain": "Smart Remote is the preferred way to chain Artifactory instances — Artifactory optimizes metadata and streaming."
          },
          {
            "q": "Why cap JVM heap around 26-30 GB rather than 64 GB?",
            "options": [
              "RAM is expensive",
              "Above ~32 GB, compressed Oops disables and effective memory use doubles",
              "Java doesn't support larger heaps",
              "Garbage collection stops working"
            ],
            "correct": 1,
            "explain": "The compressed Oops threshold is ~32 GB. Above it, pointers use 8 bytes instead of 4, effectively doubling memory usage."
          },
          {
            "q": "A Helm chart published via OCI is stored as:",
            "options": [
              "A YAML file",
              "A container image with chart media type — same protocol as Docker images",
              "A plain .tgz on a web server",
              "A Git repository"
            ],
            "correct": 1,
            "explain": "Modern Helm uses the OCI Distribution Spec, so charts are stored in the same registries as Docker images."
          },
          {
            "q": "What does syncDeletes: false on replication prevent?",
            "options": [
              "Accidental file corruption",
              "Accidental deletions on the source from propagating to all targets",
              "Memory leaks",
              "Stale cache entries"
            ],
            "correct": 1,
            "explain": "If you run rm -rf on the source, syncDeletes:true would propagate to all targets — leave it false as a safety net."
          }
        ]
      }
    ]
  },
  {
    "id": "t25",
    "group": "m5",
    "level": "Interview",
    "title": "Rapid-Fire Cheat Sheet",
    "sectionNo": "25",
    "category": "Interview Prep",
    "body": [
      {
        "t": "p",
        "c": "25 essential terms and definitions — perfect for rapid lookup and last-minute interview refresh."
      },
      {
        "t": "cheatsheet",
        "items": [
          {
            "term": "Artifact Repository",
            "def": "A versioned store of immutable binaries (JARs, wheels, images) addressed by coordinate."
          },
          {
            "term": "Container Registry",
            "def": "A registry specifically for OCI-compliant container images."
          },
          {
            "term": "Local Repository",
            "def": "Stores artifacts pushed directly to this Artifactory instance."
          },
          {
            "term": "Remote Repository",
            "def": "Caching proxy of an upstream source like Maven Central or Docker Hub."
          },
          {
            "term": "Virtual Repository",
            "def": "Aggregates multiple local + remote repos behind a single URL."
          },
          {
            "term": "Federated Repository",
            "def": "Bidirectional, active-active sync between multiple Artifactory instances."
          },
          {
            "term": "OCI Distribution Spec",
            "def": "The standard protocol every modern container registry speaks."
          },
          {
            "term": "Digest",
            "def": "Content-addressed SHA256 identifier of an image — immutable."
          },
          {
            "term": "Tag",
            "def": "Mutable pointer from a name like :1.27.0 to a digest."
          },
          {
            "term": "Manifest List",
            "def": "OCI index pointing to per-platform manifests for multi-arch support."
          },
          {
            "term": "Build Info",
            "def": "Metadata recording producer, dependencies, environment, and timing of a CI run."
          },
          {
            "term": "Binarystore.xml",
            "def": "Config file defining the chain of binary storage providers."
          },
          {
            "term": "Router",
            "def": "Process fronting HA clusters, handling TLS and request routing."
          },
          {
            "term": "Reference Token",
            "def": "Modern revocable token replacing legacy API keys."
          },
          {
            "term": "Access Token",
            "def": "JWT with scopes like read:repo:libs-release, preferred for CI."
          },
          {
            "term": "OIDC Federation",
            "def": "Machine auth pattern where CI emits JWTs exchanged for access tokens."
          },
          {
            "term": "Xray",
            "def": "JFrog supply-chain scanner for CVEs, licenses, and secrets."
          },
          {
            "term": "Watch / Policy / Rule",
            "def": "Xray abstraction hierarchy for applying security checks."
          },
          {
            "term": "AQL",
            "def": "Artifactory Query Language — SQL-like queries over artifact metadata."
          },
          {
            "term": "SNAPSHOT",
            "def": "Mutable Maven version, retained by Max Unique Snapshots setting."
          },
          {
            "term": "Smart Remote",
            "def": "Remote repo whose upstream is another Artifactory, with optimized behavior."
          },
          {
            "term": "Cache-fs",
            "def": "Storage provider caching recent binaries on local SSD."
          },
          {
            "term": "Promotion",
            "def": "Moving a build's artifacts between environment-specific repos without rebuilding."
          },
          {
            "term": "Replication",
            "def": "Unidirectional sync between Artifactory instances (push or pull)."
          },
          {
            "term": "RPO / RTO",
            "def": "Recovery Point Objective (data loss tolerance) / Recovery Time Objective (time to restore)."
          }
        ]
      }
    ]
  },
  {
    "id": "t26",
    "group": "m5",
    "level": "Interview",
    "title": "Troubleshooting Scenarios",
    "sectionNo": "26",
    "category": "Interview Prep",
    "body": [
      {
        "t": "p",
        "c": "8 realistic production scenarios — the exact kind senior interviewers ask to test operational debugging experience."
      },
      {
        "t": "troubleshoot",
        "items": [
          {
            "scenario": "CI builds randomly fail with \"404 not found\" for common Maven dependencies like commons-lang3.",
            "diagnosis": "Direct Maven Central access (not via Artifactory) is being rate-limited or the upstream had a transient outage. Or the virtual repo doesn't include the remote proxy.",
            "fix": "Route all Maven traffic through a virtual repo that aggregates a remote proxy of Maven Central. Enable \"Assumed Offline\" so cached content is served during outages."
          },
          {
            "scenario": "Docker push to Artifactory returns \"unauthorized: authentication required\" even with correct credentials.",
            "diagnosis": "Most likely: password contains special characters not URL-encoded in docker login, or the token has expired (default token TTL is often short). Alternatively, \"Encrypted Password\" is enabled and you're using the plaintext one.",
            "fix": "Generate a fresh scoped access token and pass it to docker login. Verify the repo permissions include the user/group. Check the \"Encrypted Password\" setting in user profile."
          },
          {
            "scenario": "A newly added HA node returns 404 for artifacts that exist on the primary node.",
            "diagnosis": "The new node's filestore is not seeing the same bytes — typically because the cluster is using the default local-filesystem storage (each node has its own disk) instead of shared storage.",
            "fix": "Configure binarystore.xml to use S3 or shared NFS. Migrate existing binaries. Remove the misconfigured node from the cluster. Add nodes only after shared storage is working."
          },
          {
            "scenario": "Artifact disk usage is growing 10 GB per day and you're running out of space.",
            "diagnosis": "SNAPSHOT retention is unbounded, Docker images accumulate without cleanup, or build outputs are never pruned. Check Max Unique Snapshots setting and cleanup policies.",
            "fix": "Set Max Unique Snapshots to 5-10 on SNAPSHOT repos. Create an AQL-based cleanup job for Docker images not pulled in 90 days. Route to a trash repo for 30 days before hard delete."
          },
          {
            "scenario": "Docker pulls are slow (10+ seconds) for images that should be cached.",
            "diagnosis": "Cache-fs is too small, causing constant misses and S3 round-trips. Or the cache-fs directory is on slow HDD instead of SSD.",
            "fix": "Increase maxCacheSize to cover your working set (typically 50 GB). Move cacheProviderDir to local NVMe SSD. Monitor cache hit ratio — target > 80%."
          },
          {
            "scenario": "Xray reports no vulnerabilities, but a known CVE exists in a transitive dependency.",
            "diagnosis": "Xray's vulnerability database is out of date — the instance can't reach JFrog's cloud feed, or sync hasn't happened in hours.",
            "fix": "Check Administration → Xray → Security → Database Sync. Verify network egress to https://releases.jfrog.io. If air-gapped, set up manual feed sync via export/import."
          },
          {
            "scenario": "Build info shows dependencies from an unexpected Artifactory instance.",
            "diagnosis": "JFROG_CLI_SERVER_ID in CI is pointing to the wrong configured server, or ~/.jfrog config was copied from a colleague's dev machine.",
            "fix": "Audit CI environment variables. Use OIDC federation instead of server IDs so the identity comes from the CI system, not a local config file."
          },
          {
            "scenario": "After a failed Artifactory upgrade, all API calls return 503 but the process is running.",
            "diagnosis": "The router process is up but the app is in a degraded state — likely a schema migration failed or the database is read-only.",
            "fix": "Check /var/opt/jfrog/artifactory/var/log/artifactory-service.log for migration errors. Verify DB connectivity and permissions. Roll back the app version while keeping the DB schema, then retry the upgrade with pre-flight checks."
          }
        ]
      },
      {
        "t": "wizard"
      }
    ]
  },
  {
    "id": "t27",
    "group": "m5",
    "level": "Interview",
    "title": "Comparison: Artifactory vs Alternatives",
    "sectionNo": "27",
    "category": "Interview Prep",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>How Artifactory stacks up against the main alternatives (Sonatype Nexus, CNCF Harbor, AWS ECR) across dimensions that matter in production.</p>\n        <div style=\"overflow-x: auto; margin: 1.5rem 0;\">\n          <table class=\"comp-table\" style=\"width: 100%; border-collapse: collapse;\">\n            <thead>\n              <tr style=\"border-bottom: 2px solid var(--border);\">\n                <th style=\"padding: 0.75rem; text-align: left;\">Dimension</th>\n                <th style=\"padding: 0.75rem; text-align: left;\">Artifactory</th><th style=\"padding: 0.75rem; text-align: left;\">Sonatype Nexus</th><th style=\"padding: 0.75rem; text-align: left;\">Harbor</th><th style=\"padding: 0.75rem; text-align: left;\">AWS ECR</th>\n              </tr>\n            </thead>\n            <tbody>\n              \n                <tr style=\"border-bottom: 1px solid var(--border);\">\n                  <td style=\"padding: 0.75rem; font-weight: 600;\">Package types supported</td>\n                  <td style=\"padding: 0.75rem;\">30+ types (Maven, npm, PyPI, Docker, Helm, Conan, Go, NuGet, …)</td><td style=\"padding: 0.75rem;\">10+ types (Maven, npm, PyPI, Docker, NuGet, Yum)</td><td style=\"padding: 0.75rem;\">OCI images + Helm charts only</td><td style=\"padding: 0.75rem;\">OCI images + Helm charts only</td>\n                </tr>\n              \n                <tr style=\"border-bottom: 1px solid var(--border);\">\n                  <td style=\"padding: 0.75rem; font-weight: 600;\">Supply-chain scanning</td>\n                  <td style=\"padding: 0.75rem;\">Built-in (Xray): CVEs, licenses, secrets, applicability</td><td style=\"padding: 0.75rem;\">Via Sonatype Lifecycle/Firewall (separate product)</td><td style=\"padding: 0.75rem;\">Built-in Trivy + Clair</td><td style=\"padding: 0.75rem;\">ECR Scanning (Trivy-based, AWS-native)</td>\n                </tr>\n              \n                <tr style=\"border-bottom: 1px solid var(--border);\">\n                  <td style=\"padding: 0.75rem; font-weight: 600;\">HA / multi-region</td>\n                  <td style=\"padding: 0.75rem;\">Native HA + Federation (active-active)</td><td style=\"padding: 0.75rem;\">Nexus Pro HA (active-passive primarily)</td><td style=\"padding: 0.75rem;\">Multi-instance with PostgreSQL replication</td><td style=\"padding: 0.75rem;\">Regional per AWS region; cross-region replication via ECR Public</td>\n                </tr>\n              \n                <tr style=\"border-bottom: 1px solid var(--border);\">\n                  <td style=\"padding: 0.75rem; font-weight: 600;\">Cloud model</td>\n                  <td style=\"padding: 0.75rem;\">Self-hosted + SaaS (JFrog Platform Cloud)</td><td style=\"padding: 0.75rem;\">Self-hosted + SaaS (Sonatype Nexus Repository Manager)</td><td style=\"padding: 0.75rem;\">Self-hosted only (CNCF graduated)</td><td style=\"padding: 0.75rem;\">AWS-managed SaaS</td>\n                </tr>\n              \n                <tr style=\"border-bottom: 1px solid var(--border);\">\n                  <td style=\"padding: 0.75rem; font-weight: 600;\">Pricing model</td>\n                  <td style=\"padding: 0.75rem;\">Per-user or compute-based; OSS free for basic</td><td style=\"padding: 0.75rem;\">Per-seat OSS + Pro editions</td><td style=\"padding: 0.75rem;\">Free and open source</td><td style=\"padding: 0.75rem;\">Per-GB storage + data transfer</td>\n                </tr>\n              \n                <tr style=\"border-bottom: 1px solid var(--border);\">\n                  <td style=\"padding: 0.75rem; font-weight: 600;\">Best for</td>\n                  <td style=\"padding: 0.75rem;\">Polyglot orgs needing one registry for everything</td><td style=\"padding: 0.75rem;\">JVM-heavy orgs, strong Maven/Nexus history</td><td style=\"padding: 0.75rem;\">Kubernetes-native shops prioritizing container images</td><td style=\"padding: 0.75rem;\">AWS shops wanting zero-ops registry</td>\n                </tr>\n              \n            </tbody>\n          </table>\n        </div>\n        <div class=\"callout callout-tip\" style=\"margin-top: 1.5rem;\">\n          <div class=\"callout-title\">How to answer \"Why X over Y?\" in an interview</div>\n          <p>When an interviewer asks \"why would you choose Artifactory over Harbor/ECR/Nexus?\", avoid bashing the alternatives. The strong answer frames it around your org's actual needs: \"For a polyglot engineering org publishing JVM artifacts, npm packages, Helm charts, and Docker images, Artifactory gives us a single pane of glass with consistent auth, promotion, and Xray scanning across all formats. Harbor is excellent if you're purely Kubernetes-native and want an OSS CNCF project. ECR is the right call if you're all-in on AWS and want zero operational overhead. Nexus works well for teams with a deep Maven history. The decision isn't about which tool is 'best' — it's about which matches our package mix, team scale, and operational appetite.\"</p>\n        </div>\n      "
      }
    ]
  }
]
