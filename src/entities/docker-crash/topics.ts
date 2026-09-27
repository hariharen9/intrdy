import type { Topic, TopicGroup } from '@/entities/topic'

export const DOCKER_CRASH_GROUPS: TopicGroup[] = [
  {
    "id": "foundations",
    "name": "Mental Models & Daily Commands"
  },
  {
    "id": "dockerfiles",
    "name": "Dockerfiles & Multi-Stage Builds"
  },
  {
    "id": "networking-storage",
    "name": "Networking, Volumes & Compose"
  },
  {
    "id": "drills",
    "name": "Troubleshooting & Quick Drills"
  }
]

export const DOCKER_CRASH_TOPICS: Topic[] = [
  {
    "id": "containers-vs-vms",
    "group": "foundations",
    "level": "Basics",
    "title": "Containers vs Virtual Machines (Mental Model in 3 Minutes)",
    "sectionNo": "01",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Before Docker, if you wanted to isolate applications or run multiple services on one server, you created <strong>Virtual Machines (VMs)</strong> using hypervisors like VMware or VirtualBox.</p>\n        \n        <h3>The Problem with Virtual Machines</h3>\n        <p>Every single VM carries an entire guest operating system (Linux kernel, drivers, systemd, system binaries), weighing gigabytes and consuming gigabytes of RAM before your app even starts.</p>\n\n        <h3>The Container Revolution: Shared Linux Kernel</h3>\n        <p>A <strong>Container</strong> is NOT a mini virtual machine. <strong>A container is simply a normal, isolated Linux process running on your host machine.</strong></p>\n        <p>It leverages two built-in Linux kernel features:</p>\n        <ul>\n          <li><strong>Namespaces:</strong> Provide isolation (the container gets its own private process list, network interfaces, mount points, and hostname).</li>\n          <li><strong>Control Groups (cgroups):</strong> Enforce resource limits (limiting CPU, memory, and disk I/O so one runaway container cannot crash the host).</li>\n        </ul>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">comparison</span></div><pre><code class=\"language-plaintext\">Virtual Machine (VM):\n  [App A]      [App B]\n  [Guest OS]   [Guest OS]   ◄── Heavyweight (GBs of RAM, slow minutes boot)\n  [Hypervisor / Host OS]\n  [Physical Hardware]\n\nDocker Container:\n  [App A]      [App B]\n  [Docker Engine]           ◄── Lightweight (Zero guest OS, starts in milliseconds!)\n  [Shared Host Linux Kernel]\n  [Physical Hardware]</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Containers share the host kernel &mdash; they do NOT run a guest operating system.</li>\n          <li>Containers start in milliseconds and consume virtually zero idle RAM overhead.</li>\n          <li>\"It works on my machine\" is solved because the container packages code, runtime, and system libraries together.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "core-concepts-blueprint-snapshot",
    "group": "foundations",
    "level": "Basics",
    "title": "The 3 Core Concepts: Dockerfile, Image & Container",
    "sectionNo": "02",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>To master Docker without confusion, understand how these three concepts relate to each other:</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">diagram</span></div><pre><code class=\"language-plaintext\">┌───────────────────────────┐      docker build       ┌───────────────────────────┐      docker run        ┌───────────────────────────┐\n│        Dockerfile         │ ──────────────────────► │       Docker Image        │ ─────────────────────► │     Running Container     │\n│ (Plain text recipe / code │                         │ (Immutable packaged       │                        │ (Live, isolated running   │\n│  instructions)            │                         │  binary snapshot)         │                        │  process instance)        │\n└───────────────────────────┘                         └───────────────────────────┘                        └───────────────────────────┘</code></pre></div>\n\n        <div class=\"cards-grid\">\n          <div class=\"card\">\n            <h4>1. Dockerfile (The Blueprint)</h4>\n            <p>A simple text file with step-by-step instructions: what base OS to use, what files to copy, what commands to run, and how to start the app.</p>\n          </div>\n          <div class=\"card\">\n            <h4>2. Image (The Snapshot)</h4>\n            <p>A packaged, read-only template built from a Dockerfile. Images are published to registries (Docker Hub, GHCR, ECR) and shared across teams.</p>\n          </div>\n          <div class=\"card\">\n            <h4>3. Container (The Live Instance)</h4>\n            <p>The actual running process created from an image. You can launch 1, 10, or 100 containers from a single Docker image in seconds.</p>\n          </div>\n        </div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Dockerfile = Source recipe; Image = Compiled artifact snapshot; Container = Live running process.</li>\n          <li>Images are immutable: once built, their layers never change.</li>\n          <li>Containers add a thin read-write layer on top of the read-only image layers.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "daily-essential-commands",
    "group": "foundations",
    "level": "Basics",
    "title": "Core Docker Commands (The 20% You Use 80% of the Time)",
    "sectionNo": "03",
    "category": "Foundations",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>You don't need to memorize 50 flags. These core commands cover virtually all daily developer operations:</p>\n\n        <h3>1. Running &amp; Inspecting Containers</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Run an Nginx web server in detached background mode (-d) on port 8080 (-p)\ndocker run -d -p 8080:80 --name my-web nginx\n\n# List all currently running containers\ndocker ps\n\n# List ALL containers (including stopped / exited ones)\ndocker ps -a\n\n# Follow live output logs of a container in real-time\ndocker logs -f my-web</code></pre></div>\n\n        <h3>2. Entering &amp; Managing Containers</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Open an interactive shell inside a running container (vital for debugging!)\ndocker exec -it my-web sh\n\n# Stop a running container gracefully (sends SIGTERM)\ndocker stop my-web\n\n# Force stop and delete a container\ndocker rm -f my-web</code></pre></div>\n\n        <h3>3. Managing Images</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Build an image from a Dockerfile in current directory (.) with a tag (-t)\ndocker build -t my-node-app:1.0 .\n\n# List all downloaded / built images locally\ndocker images\n\n# Delete a local image\ndocker rmi my-node-app:1.0</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li><code>-d</code> runs in detached background; <code>-p 8080:80</code> maps host port to container port.</li>\n          <li><code>docker exec -it &lt;name&gt; sh</code> opens a live terminal inside any running container.</li>\n          <li><code>docker logs -f &lt;name&gt;</code> streams real-time application logs.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "writing-clean-dockerfiles",
    "group": "dockerfiles",
    "level": "Basics",
    "title": "Writing Clean, Cached Dockerfiles",
    "sectionNo": "04",
    "category": "Dockerfiles",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>A well-structured Dockerfile builds fast, caches dependencies properly, and runs securely with non-root permissions.</p>\n\n        <h3>Sample Production Dockerfile (Node.js Example)</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">dockerfile</span></div><pre><code class=\"language-dockerfile\"># 1. Base Image: Use official, minimal, LTS images (Alpine or Slim)\nFROM node:20-alpine\n\n# 2. Set working directory inside container\nWORKDIR /app\n\n# 3. Cache Optimization: Copy package manifests FIRST\nCOPY package*.json ./\n\n# 4. Install dependencies (Cached unless package.json changes!)\nRUN npm ci --only=production\n\n# 5. Copy remaining application source code\nCOPY . .\n\n# 6. Security: Switch to non-root user (built into node image)\nUSER node\n\n# 7. Document the port the container listens on\nEXPOSE 3000\n\n# 8. Start the application\nCMD [\"node\", \"server.js\"]</code></pre></div>\n\n        <h3>The Golden Rule of Docker Layer Caching</h3>\n        <p>Docker executes instructions top-to-bottom and caches each layer. If a layer changes, <strong>all subsequent layers must be re-executed from scratch!</strong></p>\n        <div class=\"callout tip\"><p><strong>Pro Tip:</strong> Always copy dependency files (<code>package.json</code>, <code>requirements.txt</code>, <code>pom.xml</code>) and run your package install step <em>before</em> copying the rest of your source code. That way, editing a line of code in <code>server.js</code> re-builds in 0.5s instead of re-installing all packages!</p></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Use minimal base images (e.g. <code>node:20-alpine</code>, <code>python:3.11-slim</code>).</li>\n          <li>Optimize layer caching: copy package manifests and run install <em>before</em> copying app code.</li>\n          <li>Always run as a non-root user (<code>USER node</code>) for container security.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "multi-stage-builds",
    "group": "dockerfiles",
    "level": "Intermediate",
    "title": "Multi-Stage Builds: Shrinking Images from 1GB to 25MB",
    "sectionNo": "05",
    "category": "Dockerfiles",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>When compiling Go, Rust, Java, or building React/Vue/Angular frontends, you need heavy SDKs, compilers, TypeScript, and devDependencies during the build phase. But in production, you only need the compiled binary or static HTML/JS files.</p>\n        \n        <h3>The Problem with Single-Stage Builds</h3>\n        <p>Leaving build tools, package managers, and devDependencies in your production image bloats sizes to 1GB+, slows down deployments, and introduces security vulnerabilities (CVEs).</p>\n\n        <h3>Multi-Stage Build Solution (React + Nginx Example)</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">dockerfile</span></div><pre><code class=\"language-dockerfile\"># ─── STAGE 1: Build the React Application ───────────────────\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build  # Generates compiled static files in /app/dist\n\n# ─── STAGE 2: Tiny Production Runtime ───────────────────────\nFROM nginx:alpine\n# Copy ONLY the compiled build artifacts from Stage 1 into Nginx!\nCOPY --from=builder /app/dist /usr/share/nginx/html\n\nEXPOSE 80\nCMD [\"nginx\", \"-g\", \"daemon off;\"]</code></pre></div>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">comparison</span></div><pre><code class=\"language-plaintext\">Single-Stage Build (Node + npm + devDependencies + Source Code):  ~1.2 GB\nMulti-Stage Build  (Nginx Alpine + Compiled Static Files Only):    ~25 MB (98% smaller!)</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Multi-Stage builds use multiple <code>FROM</code> statements in a single Dockerfile.</li>\n          <li>Use <code>COPY --from=builder</code> to selectively copy only compiled binaries into the final image.</li>\n          <li>Dramatically reduces image sizes, accelerates CI/CD pulls, and eliminates build-tool security vulnerabilities.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "networking-port-mapping",
    "group": "networking-storage",
    "level": "Basics",
    "title": "Port Mapping & Container Networking Made Simple",
    "sectionNo": "06",
    "category": "Networking & Storage",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>By default, containers live in an isolated internal network. To talk to them from your browser, or let two containers talk to each other, you use <strong>Port Mapping</strong> and <strong>Bridge Networks</strong>.</p>\n\n        <h3>1. Port Mapping Explained (<code>-p HOST:CONTAINER</code>)</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Traffic hitting your machine at http://localhost:8080 forwards to port 80 inside Nginx:\ndocker run -d -p 8080:80 nginx</code></pre></div>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">diagram</span></div><pre><code class=\"language-plaintext\">   [Your Laptop / Browser]  ──►  http://localhost:8080 (Host Port)\n                                          │\n                               (Docker Port Forwarding -p 8080:80)\n                                          ▼\n                         [Container: Nginx on Port 80]</code></pre></div>\n\n        <h3>2. Container-to-Container Communication</h3>\n        <p>Never hardcode container IP addresses. When containers join the same custom user-defined network, Docker provides automatic <strong>DNS resolution by container name</strong>:</p>\n\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># 1. Create a shared bridge network\ndocker network create my-app-net\n\n# 2. Run database container on the network\ndocker run -d --name postgres-db --network my-app-net -e POSTGRES_PASSWORD=secret postgres:alpine\n\n# 3. Run application on the SAME network:\n# Inside your app, database connection string is simply: \"postgres-db:5432\"!\ndocker run -d --name api-server --network my-app-net -p 3000:3000 my-api-image</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li><code>-p 8080:80</code> maps Host Port 8080 to Container Port 80.</li>\n          <li>Containers on the same user-defined network talk to each other using container names as DNS hostnames.</li>\n          <li>Always ensure backend services listen on <code>0.0.0.0</code> (all interfaces) inside the container.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "persisting-data-volumes",
    "group": "networking-storage",
    "level": "Intermediate",
    "title": "Persisting Data with Volumes & Bind Mounts",
    "sectionNo": "07",
    "category": "Networking & Storage",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Containers are <strong>ephemeral</strong>. If you run a PostgreSQL database container, write 1,000 rows, and run <code>docker rm</code>, <strong>all your data is permanently lost</strong> unless you attach persistent storage.</p>\n\n        <h3>Volumes vs. Bind Mounts: When to Use Which</h3>\n        <div class=\"cards-grid\">\n          <div class=\"card\">\n            <h4>1. Named Volumes (Production Data)</h4>\n            <p>Managed completely by Docker in a safe location (<code>/var/lib/docker/volumes/</code>). Survives container deletion.<br/>\n            <strong>Best For:</strong> Databases (PostgreSQL, MySQL, Redis, MongoDB).</p>\n          </div>\n          <div class=\"card\">\n            <h4>2. Bind Mounts (Local Live Reload)</h4>\n            <p>Directly maps a directory from your laptop filesystem into the container.<br/>\n            <strong>Best For:</strong> Local development so saving files in VS Code updates inside the container immediately.</p>\n          </div>\n        </div>\n\n        <h3>Practical Examples</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># 1. Named Volume: Persist database data across restarts\ndocker run -d --name my-db -v pg_data:/var/lib/postgresql/data postgres:alpine\n\n# 2. Bind Mount: Live code reload for local development\n# (Maps current host folder into /app inside container)\ndocker run -d -p 3000:3000 -v $(pwd):/app -v /app/node_modules my-node-app</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Containers are ephemeral: deleting a container destroys all internal filesystem changes.</li>\n          <li>Use Named Volumes (<code>-v volume_name:/path</code>) for persistent databases in production.</li>\n          <li>Use Bind Mounts (<code>-v $(pwd):/app</code>) for instant local code reloading during development.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "docker-compose-multicontainer",
    "group": "networking-storage",
    "level": "Intermediate",
    "title": "Docker Compose: Running Multi-Container Stacks",
    "sectionNo": "08",
    "category": "Networking & Storage",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Running multi-tier applications (Web App + PostgreSQL + Redis Cache) with manual <code>docker run</code> commands is tedious and error-prone. <strong>Docker Compose</strong> lets you declare your entire stack in a single <code>docker-compose.yml</code> file.</p>\n\n        <h3>Complete <code>docker-compose.yml</code> Example</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">yaml</span></div><pre><code class=\"language-yaml\">version: '3.8'\n\nservices:\n  # 1. Web Application Service\n  web:\n    build: .\n    ports:\n      - \"3000:3000\"\n    environment:\n      - DATABASE_URL=postgres://appuser:secret@db:5432/appdb\n    depends_on:\n      - db\n    volumes:\n      - .:/app\n      - /app/node_modules\n\n  # 2. PostgreSQL Database Service\n  db:\n    image: postgres:15-alpine\n    environment:\n      POSTGRES_USER: appuser\n      POSTGRES_PASSWORD: secret\n      POSTGRES_DB: appdb\n    volumes:\n      - db_data:/var/lib/postgresql/data\n\nvolumes:\n  db_data: # Declares persistent named volume</code></pre></div>\n\n        <h3>Essential Compose Commands</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># Start entire application stack in the background\ndocker compose up -d\n\n# View live streaming logs of all services together\ndocker compose logs -f\n\n# Stop and remove all containers and shared networks\ndocker compose down\n\n# Stop containers AND delete persistent database volumes\ndocker compose down -v</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Docker Compose brings up multi-container applications in one command (<code>docker compose up -d</code>).</li>\n          <li>Automatically creates a shared bridge network &mdash; services reach each other by service name (e.g. <code>db</code>).</li>\n          <li>Use <code>docker compose down</code> to stop and clean up everything cleanly.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "disk-cleanup-hygiene",
    "group": "networking-storage",
    "level": "Basics",
    "title": "Managing & Cleaning Docker Disk Usage",
    "sectionNo": "09",
    "category": "Networking & Storage",
    "body": [
      {
        "t": "html",
        "html": "\n        <p>Over weeks of building and running containers, Docker accumulates stopped containers, old build cache layers, and unreferenced (dangling) images &mdash; quietly consuming 20GB+ of hard drive space.</p>\n\n        <h3>1. Inspecting Disk Space: <code>docker system df</code></h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\">docker system df\n\n# Output example:\n# TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE\n# Images          14        3         4.8GB     3.9GB (81%)\n# Containers      8         2         120MB     85MB (70%)\n# Local Volumes   6         1         1.2GB     900MB (75%)\n# Build Cache     42        0         8.4GB     8.4GB (100%)</code></pre></div>\n\n        <h3>2. Cleaning Up Safely</h3>\n        <div class=\"code-block\"><div class=\"cb-head\"><span class=\"cb-lang\">bash</span></div><pre><code class=\"language-bash\"># 1. Safe Cleanup: Remove stopped containers, dangling images, and unused networks\ndocker system prune\n\n# 2. Aggressive Cleanup: Remove ALL unused images and build caches (frees maximum space!)\ndocker system prune -af\n\n# 3. Clean unused volumes (Warning: deletes unattached database volume data!)\ndocker volume prune</code></pre></div>\n\n        <div class=\"keypoints\"><h4>KEY TAKEAWAYS</h4><ul>\n          <li>Run <code>docker system df</code> to see where disk space is being consumed.</li>\n          <li>Use <code>docker system prune</code> regularly to clear build caches and stopped containers.</li>\n        </ul></div>"
      }
    ]
  },
  {
    "id": "docker-troubleshoot-wizard",
    "group": "drills",
    "level": "Intermediate",
    "title": "Interactive Docker Troubleshooting Decision Wizard",
    "sectionNo": "10",
    "category": "Troubleshooting & Drills",
    "body": [
      {
        "t": "p",
        "c": "Running into a Docker issue? Container exiting immediately, port conflict, localhost connection error, or out of memory (137)? Use our interactive decision wizard to get the exact diagnosis and fix."
      },
      {
        "t": "wizard"
      }
    ]
  },
  {
    "id": "docker-quiz-cheatsheet",
    "group": "drills",
    "level": "Basics",
    "title": "Docker Knowledge Quiz & Essential Cheat Sheet",
    "sectionNo": "11",
    "category": "Troubleshooting & Drills",
    "body": [
      {
        "t": "quiz",
        "questions": [
          {
            "q": "Why are Docker containers significantly lighter and faster to start than Virtual Machines?",
            "options": [
              "Containers use faster SSD drivers",
              "Containers share the host OS kernel and do not run a guest operating system",
              "Containers run inside the BIOS",
              "Containers only run compiled C++ code"
            ],
            "correct": 1,
            "explain": "Containers share the underlying host Linux kernel via namespaces and cgroups, eliminating the heavy overhead of running a full guest OS per VM."
          },
          {
            "q": "What does the command 'docker run -d -p 8080:80 nginx' do?",
            "options": [
              "Runs Nginx in foreground and opens port 8080 on the container",
              "Runs Nginx in detached background mode, forwarding host port 8080 to container port 80",
              "Deletes the container after 8080 seconds",
              "Installs Nginx onto the host operating system"
            ],
            "correct": 1,
            "explain": "-d runs the container in detached background mode, and -p 8080:80 maps port 8080 on your host machine to port 80 inside the container."
          },
          {
            "q": "Why should you copy 'package.json' and run 'npm install' BEFORE copying your application source code in a Dockerfile?",
            "options": [
              "Because npm install fails if source files exist",
              "To leverage Docker layer caching so editing source code does not force a full re-install of dependencies",
              "To compress the image files",
              "It is a strict requirement of Node.js"
            ],
            "correct": 1,
            "explain": "Docker caches layers top-to-bottom. If package.json hasn't changed, Docker reuses the cached node_modules layer, speeding up rebuilds from minutes to seconds."
          },
          {
            "q": "What is the primary purpose of a Multi-Stage Dockerfile build?",
            "options": [
              "To deploy to multiple cloud providers simultaneously",
              "To use a heavy build environment for compilation and copy only the final artifacts into a minimal production runtime image",
              "To run multiple containers at the same time",
              "To automatically generate unit tests"
            ],
            "correct": 1,
            "explain": "Multi-stage builds allow you to keep compilers and SDKs in the build stage, copying only production binaries/artifacts into a tiny final image (reducing image size by up to 95%)."
          },
          {
            "q": "How do two containers in the same Docker Compose stack communicate with each other?",
            "options": [
              "By using public cloud IP addresses",
              "By using their Docker Compose service names as DNS hostnames (e.g. 'postgres://db:5432')",
              "Through localhost ports only",
              "By mounting shared text files"
            ],
            "correct": 1,
            "explain": "Docker Compose automatically sets up a shared bridge network with internal DNS, allowing containers to communicate using their service names (like 'db' or 'redis')."
          }
        ]
      },
      {
        "t": "cheatsheet",
        "items": [
          {
            "term": "docker run -d -p 8080:80 <image>",
            "def": "Runs container in detached mode with port mapping."
          },
          {
            "term": "docker ps",
            "def": "Lists currently running containers (add -a to show stopped ones)."
          },
          {
            "term": "docker logs -f <name>",
            "def": "Follows real-time streaming output logs of a container."
          },
          {
            "term": "docker exec -it <name> sh",
            "def": "Opens an interactive terminal shell inside a running container."
          },
          {
            "term": "docker stop / docker rm -f",
            "def": "Gracefully stops or forcefully removes a container."
          },
          {
            "term": "docker build -t <name:tag> .",
            "def": "Builds a Docker image from a Dockerfile in current directory."
          },
          {
            "term": "docker compose up -d",
            "def": "Spins up an entire multi-container stack defined in docker-compose.yml."
          },
          {
            "term": "docker compose down",
            "def": "Stops and removes all containers and networks in a Compose stack."
          },
          {
            "term": "docker system prune -af",
            "def": "Cleans up all unused images, stopped containers, and build cache."
          }
        ]
      }
    ]
  }
]
