import type { Topic, TopicBlock, TopicGroup } from './types'

function p(c: string): TopicBlock {
  return { t: 'p', c }
}
function ul(c: string[]): TopicBlock {
  return { t: 'ul', c }
}
function ol(c: string[]): TopicBlock {
  return { t: 'ol', c }
}
function code(lang: string, c: string): TopicBlock {
  return { t: 'code', lang, c }
}
function note(kind: 'tip' | 'warn', c: string): TopicBlock {
  return { t: 'note', kind, c }
}
function analogy(c: string): TopicBlock {
  return { t: 'analogy', c }
}
function bars(
  title: string,
  data: { label: string; value: number; unit?: string }[],
): TopicBlock {
  return { t: 'bars', title, data }
}
function cards(
  title: string,
  items: { h: string; c: string; chips?: string[] }[],
): TopicBlock {
  return { t: 'cards', title, items }
}
function flow(
  steps: {
    label: string
    sub?: string
    tone?: 'good' | 'bad' | 'default'
    group?: { label: string; sub?: string; tone?: 'good' | 'bad' | 'default' }[]
  }[],
  opts: {
    edges?: string[]
    heading?: string
    tone?: 'good' | 'bad' | 'default'
    note?: string
  } = {},
): TopicBlock {
  return {
    t: 'flow',
    steps,
    edges: opts.edges || [],
    heading: opts.heading,
    tone: opts.tone,
    note: opts.note,
  }
}
function stack(
  title: string,
  layers: { label: string; sub?: string; tone?: 'writable' | 'default' }[],
): TopicBlock {
  return { t: 'stack', title, layers }
}
function stackCompare(
  left: {
    title: string
    layers: { label: string; sub?: string; tone?: 'writable' | 'default' }[]
  },
  right: {
    title: string
    layers: { label: string; sub?: string; tone?: 'writable' | 'default' }[]
  },
): TopicBlock {
  return { t: 'stackCompare', left, right }
}
function timeline(
  events: { time: string; label: string; status: 'info' | 'fail' | 'ok' }[],
): TopicBlock {
  return { t: 'timeline', events }
}
function wizard(): TopicBlock {
  return { t: 'wizard' }
}

export const DOCKER_GROUPS: TopicGroup[] = [
  { id: 'fund', name: 'Fundamentals' },
  { id: 'img', name: 'Images & Dockerfile' },
  { id: 'run', name: 'Runtime & Networking' },
  { id: 'store', name: 'Storage & Config' },
  { id: 'compose', name: 'Compose & Multi-Container' },
  { id: 'prod', name: 'Production Concerns' },
  { id: 'interview', name: 'Interview Prep' },
]

export const DOCKER_TOPICS: Topic[] = [
  {
    id: 'why',
    group: 'fund',
    level: 'Beginner',
    sectionNo: '01',
    category: 'Concept',
    title: 'Why Docker? Containers vs VMs',
    body: [
      p(
        'The classic pain Docker solves: "it works on my machine." A developer builds against Python 3.11 with library X at version 2.0; the server runs 3.9 with version 1.4 — and something subtly breaks. A **container** eliminates that gap by packaging the app together with its exact runtime, libraries, and config into one portable, isolated unit that behaves identically anywhere Docker runs.',
      ),
      p(
        'The mechanism that makes this cheap is **OS-level virtualization**. A **virtual machine** virtualizes hardware: a hypervisor sits below several guest OSes, each with its own kernel, drivers, and full boot sequence. A **container** skips all of that — it shares the host\'s kernel and is isolated using two Linux kernel features: **namespaces** (what a process can *see* — its own PIDs, network stack, filesystem mounts) and **cgroups** (what a process can *use* — CPU, memory limits). No second kernel, no hypervisor, no boot.',
      ),
      stackCompare(
        {
          title: 'Virtual Machine (per guest)',
          layers: [
            { label: 'Physical Hardware' },
            { label: 'Hypervisor' },
            { label: 'Guest OS', sub: 'own kernel, full boot' },
            { label: 'App A' },
          ],
        },
        {
          title: 'Container (shared kernel)',
          layers: [
            { label: 'Physical Hardware' },
            { label: 'Host OS + shared kernel' },
            { label: 'Docker Engine' },
            { label: 'App A', tone: 'writable' },
          ],
        },
      ),
      analogy(
        'Think of a shipping container: the ship, crane, and truck moving it never open the box to inspect what\'s inside — they just handle a standardized shape. A Docker container does the same for software: your app and its dependencies are packed into a standard unit that any Docker host can run without caring what\'s inside.',
      ),
      bars('Rough startup-time order of magnitude (illustrative, not exact)', [
        { label: 'Container', value: 150, unit: '~50-300 ms' },
        { label: 'Virtual Machine', value: 45000, unit: '~30-60 s' },
      ]),
      ul([
        '**VM = full hardware virtualization** → own kernel per guest → strong isolation, heavy footprint (GBs), boots in tens of seconds',
        '**Container = shares host kernel** → process-level isolation, light footprint (MBs), starts in milliseconds',
        '**Density**: a host might run a handful of VMs comfortably, but dozens-to-hundreds of containers, since there\'s no per-instance kernel/OS overhead',
        'Docker isn\'t the only runtime — containerd, CRI-O, and Podman also run OCI-compliant containers; Docker popularized the developer workflow (`Dockerfile → build → run`) on top of these primitives',
      ]),
      note(
        'tip',
        'Interview framing: "Docker solves environment drift by shipping the environment itself, not just the code — and it does that cheaply by isolating processes with kernel namespaces/cgroups instead of virtualizing hardware."',
      ),
    ],
  },
  {
    id: 'arch',
    group: 'fund',
    level: 'Beginner',
    sectionNo: '02',
    category: 'Engine',
    title: 'Docker Architecture',
    body: [
      p(
        'Docker is a **client-server** application built from several distinct pieces that each do one job — a very common interview probe is simply "what happens under the hood when you run `docker run`?", and the honest answer is a chain of handoffs between these components.',
      ),
      flow(
        [
          { label: 'You', sub: 'docker CLI' },
          { label: 'dockerd', sub: 'the daemon' },
          { label: 'containerd', sub: 'lifecycle mgmt' },
          { label: 'runc', sub: 'spawns process' },
          { label: 'Linux Kernel', sub: 'namespaces + cgroups' },
        ],
        { edges: ['REST API / socket', 'manages', 'execs via', 'isolates via'] },
      ),
      flow(
        [
          { label: 'dockerd' },
          { label: 'Registry', sub: 'Docker Hub, ECR, GCR…' },
        ],
        {
          edges: ['pull / push'],
          note: 'Whenever an image isn\'t cached locally — or you explicitly push/pull — dockerd talks directly to the registry.',
        },
      ),
      analogy(
        'Think of a restaurant: you (the CLI) place an order with the head chef (dockerd), who delegates to the kitchen manager (containerd) actually coordinating stations, who hands the ticket to a line cook (runc) that physically plates the dish — spawns the real OS process. The registry is the supplier truck dropping off ingredients (images) on request.',
      ),
      ul([
        '**Docker CLI** — the `docker` command; every subcommand is really an HTTP call to the daemon\'s API',
        '**dockerd** (the daemon) — the long-running background service; builds images, tracks containers, manages networks and volumes',
        '**containerd** — a separate, lower-level daemon (a CNCF project used well beyond Docker, including inside Kubernetes) that manages the full container lifecycle',
        '**runc** — the low-level OCI-compliant tool that actually creates the namespaces/cgroups and execs the process — this is the last mile before your app is "a container"',
        '**Registry** — where images live; `docker pull`/`push` talk to it directly',
      ]),
      p(
        'Underneath runc, isolation comes from six main namespace types you should be able to name on the spot:',
      ),
      ul([
        '**PID** — its own process ID tree (PID 1 inside the container, unrelated to the host\'s PID 1)',
        '**NET** — its own network stack: interfaces, routing table, ports',
        '**MNT** — its own filesystem mount view',
        '**UTS** — its own hostname',
        '**IPC** — isolated inter-process communication (shared memory, semaphores)',
        '**USER** — can remap container UID/GID to different host UIDs/GIDs (used for rootless setups)',
      ]),
      note(
        'tip',
        'If asked to define a container precisely: "a container is a normal Linux process, just started with a restricted view of the system via namespaces, and a capped resource budget via cgroups." No new kernel, no magic — same kernel, less visibility.',
      ),
    ],
  },
  {
    id: 'cli',
    group: 'fund',
    level: 'Beginner',
    sectionNo: '03',
    category: 'CLI',
    title: 'Essential CLI — Command Reference',
    body: [
      p(
        'These are the commands you\'ll type constantly. Group them mentally by purpose rather than memorizing a flat list:',
      ),
      cards('', [
        { h: 'Lifecycle', c: 'run · start · stop · restart · rm · pause' },
        { h: 'Inspect & Debug', c: 'ps · logs · inspect · top · stats · diff' },
        { h: 'Images', c: 'build · images · pull · push · tag · rmi · history' },
        { h: 'Cleanup', c: 'system prune · volume prune · network prune' },
      ]),
      code(
        'bash',
        `docker run -d -p 8080:80 --name web nginx   # pull if needed, create, start
docker ps                                    # running containers
docker ps -a                                 # all containers (incl. stopped)
docker logs -f web                           # stream logs
docker exec -it web sh                       # shell into a running container
docker stop web && docker rm web             # graceful stop, then remove
docker rmi nginx                             # remove an image
docker images                                # list local images
docker inspect web                           # full JSON metadata
docker stats                                 # live CPU/mem/net usage
docker system prune -a                       # nuke unused images/containers/networks`,
      ),
      p(
        'Flags worth knowing cold: `-d` detached, `-it` interactive+tty, `-p host:container` port map, `-v` mount, `-e` env var, `--rm` auto-remove on exit, `--name` friendly name, `--restart=unless-stopped`.',
      ),
      p('A realistic day-1 workflow looks like this end to end — worth typing out yourself once:'),
      ol([
        '`docker build -t myapp:dev .` — build an image from the Dockerfile in the current directory',
        '`docker run -d -p 3000:3000 --name myapp myapp:dev` — start it, mapping a port',
        '`docker logs -f myapp` — watch it boot and confirm it\'s healthy',
        '`docker exec -it myapp sh` — poke around inside if something looks off',
        '`docker stop myapp && docker rm myapp` — tear it down when done',
        '`docker system prune` — periodically reclaim disk from stopped containers/dangling images',
      ]),
    ],
  },
  {
    id: 'lifecycle',
    group: 'fund',
    level: 'Beginner',
    sectionNo: '04',
    category: 'Lifecycle',
    title: 'Container Lifecycle',
    body: [
      p(
        'A container moves through a small set of well-defined states, and "what actually happens on `docker run`?" is one of the most common opening interview questions.',
      ),
      flow(
        [
          { label: 'Created' },
          { label: 'Running', tone: 'good' },
          { label: 'Stopped' },
          { label: 'Removed', tone: 'bad' },
        ],
        { edges: ['docker start', 'docker stop / process exits', 'docker rm'] },
      ),
      note(
        'tip',
        '`docker pause`/`docker unpause` toggle a running container in and out of a frozen state (via a cgroup freezer) without stopping it — not shown above since it\'s a side-branch, not part of the main path.',
      ),
      analogy(
        'Like a play: **created** is the actor cast and handed a script backstage, **running** is the actor performing on stage, **stopped** is the actor leaving when the scene (the main process) ends, and **removed** is the dressing room being cleared for the next production.',
      ),
      ol([
        'Docker checks if the image exists locally; pulls from the registry if not',
        'Creates a new container: writable layer, network namespace, volume mounts — this alone is `docker create`',
        'Allocates an IP and attaches to the chosen network',
        'Starts the process defined by CMD/ENTRYPOINT — this step alone is `docker start`',
        'The container keeps running exactly as long as that one process (PID 1) is alive',
      ]),
      p(
        '`docker stop` sends **SIGTERM** and waits (10s default) for a graceful shutdown, then escalates to **SIGKILL**. `docker kill` skips straight to SIGKILL. A container that doesn\'t handle SIGTERM (many apps ignore it by default) will always eat the full grace period on every deploy — worth fixing in the app itself.',
      ),
      note(
        'warn',
        'A container **exits the moment its PID 1 process exits** — this surprises people who expect a container to "stay alive" with a backgrounded process and nothing in the foreground. PID 1 also has to reap zombie child processes; if your app spawns children and isn\'t built for that, use `docker run --init` (adds a tiny init process, `tini`) to handle it correctly.',
      ),
    ],
  },
  {
    id: 'images',
    group: 'img',
    level: 'Beginner',
    sectionNo: '05',
    category: 'Storage',
    title: 'Images, Layers & the Union Filesystem',
    body: [
      p(
        'An image is a **read-only stack of layers**, where each layer is the filesystem *diff* produced by one Dockerfile instruction. Docker merges these into a single coherent view using a union filesystem — typically **OverlayFS** on Linux.',
      ),
      stack('', [
        { label: 'Layer 1 — FROM ubuntu:22.04', sub: 'base OS files' },
        { label: 'Layer 2 — RUN apt-get install curl', sub: 'adds curl binary' },
        { label: 'Layer 3 — COPY app.py /app', sub: 'adds application code' },
        { label: 'Writable layer', sub: 'container-only · exists while running', tone: 'writable' },
      ]),
      analogy(
        'Like a cake baked in stacked layers — flour base, sponge, then frosting — each layer is fixed the moment it\'s baked. A running container is like a thin, temporary layer of icing added for one serving: it can be scraped off (the container removed) without touching the cake layers underneath, which stay intact and get reused for the next serving.',
      ),
      p(
        'This layer sharing is why images are cheap on disk: if ten different images all start `FROM node:20-alpine`, that base layer is stored **once** and referenced by all ten — Docker content-addresses each layer by its hash, so identical layers are automatically deduplicated.',
      ),
      code(
        'bash',
        `docker history nginx:alpine
# shows each layer, the instruction that created it, and its size —
# useful for spotting exactly which step bloated your image`,
      ),
      note(
        'tip',
        'Interview one-liner: "An image is layers + metadata (read-only). A container is that image plus one writable layer plus a running process." Deleting a container never deletes the image underneath it.',
      ),
    ],
  },
  {
    id: 'dockerfile',
    group: 'img',
    level: 'Intermediate',
    sectionNo: '06',
    category: 'Recipe',
    title: 'Dockerfile Instructions',
    body: [
      p('The Dockerfile is the recipe Docker follows, top to bottom, to build an image.'),
      analogy(
        'Think of it as a strict recipe card: FROM is the base ingredient you start with, and every RUN/COPY after it is one preparation step, executed in order, each producing a new layer.',
      ),
      code(
        'dockerfile',
        `FROM node:20-alpine        # base image
WORKDIR /app                 # sets working dir for subsequent instructions
COPY package*.json ./        # copy deps first (cache trick, see next module)
RUN npm ci --production
COPY . .                     # then app code
ENV NODE_ENV=production
EXPOSE 3000                  # documentation only, doesn't publish the port
USER node                    # drop root
CMD ["node", "server.js"]    # default command when container starts`,
      ),
      ul([
        '**FROM** — the base image; always pin a tag (`node:20-alpine`, not `node:latest`) so builds are reproducible',
        '**RUN** — executes at **build** time, creates a layer (installing packages, compiling code)',
        '**COPY** vs **ADD** — COPY just copies files, predictable and simple. ADD does that *plus* auto-extracts local tar archives and can fetch remote URLs — surprising, implicit behavior. Default to COPY; reach for ADD only when you specifically need extraction',
        '**CMD** vs **ENTRYPOINT** — CMD sets *default arguments/command*, trivially overridden by `docker run image <anything>`. ENTRYPOINT fixes the executable that always runs. The idiomatic pairing: `ENTRYPOINT ["python","app.py"]` + `CMD ["--port","8080"]`, so `docker run img --port 9090` overrides just the port',
        '**ENV** — persists into the image *and* the running container (visible via `docker inspect`)',
        '**ARG** — only available at **build** time via `--build-arg`; not present in the final container unless you explicitly copy it into an ENV',
        '**WORKDIR** — sets/creates the working directory; prefer it over `RUN cd ...`, which doesn\'t persist across instructions',
        '**VOLUME** — declares a mount point, signalling this path holds data that shouldn\'t live in the writable layer',
        '**USER** — switches from root to a named/uid user for the remainder of the build and at runtime',
      ]),
      code(
        'dockerfile',
        `ARG VERSION=1.0
ENV APP_VERSION=$VERSION
# ARG only exists during build; copying its value into ENV is what makes
# it visible/usable inside the running container`,
      ),
      p(
        'Less common but worth recognizing: **LABEL** (metadata, e.g. `org.opencontainers.image.source`), **HEALTHCHECK** (defines how Docker checks liveness), **STOPSIGNAL** (customize the shutdown signal), **SHELL** (change the default shell used by RUN), **ONBUILD** (triggers only when *this* image is used as a base for another build).',
      ),
    ],
  },
  {
    id: 'caching',
    group: 'img',
    level: 'Intermediate',
    sectionNo: '07',
    category: 'Build',
    title: 'Build Cache & Multi-Stage Builds',
    body: [
      p(
        'Docker caches every layer by hashing the instruction plus its inputs. If nothing changed, it reuses the cached layer instead of re-executing — which is why **instruction order** is one of the highest-leverage things you control in a Dockerfile.',
      ),
      analogy(
        'Think of the build cache like a subway line with checkpoints: if the trip up to stop 4 hasn\'t changed, Docker doesn\'t re-ride from the start — it resumes right after the last valid checkpoint. But change something *early* in the route, and every checkpoint after it is invalidated, no matter how unrelated the later stops actually were.',
      ),
      flow(
        [
          { label: 'FROM node' },
          { label: 'COPY . .', tone: 'bad' },
          { label: 'RUN npm install', tone: 'bad' },
        ],
        {
          heading: '❌ Cache-busting order — any source edit reinstalls everything',
          tone: 'bad',
          edges: ['', ''],
        },
      ),
      flow(
        [
          { label: 'FROM node' },
          { label: 'COPY package.json .' },
          { label: 'RUN npm install', tone: 'good' },
          { label: 'COPY . .' },
        ],
        {
          heading: '✅ Cache-friendly order — installs stay cached across code edits',
          tone: 'good',
          edges: ['', '', ''],
        },
      ),
      p(
        '**Multi-stage builds** take this further: use a heavyweight image to *build* the app, then copy just the compiled artifact into a slim image to *run* it — compilers and dev dependencies never ship.',
      ),
      analogy(
        'Like construction scaffolding: cranes and scaffolding help build the skyscraper, but you don\'t hand the finished building over with the crane still attached. The `builder` stage is the scaffolding; the final stage is what you actually ship.',
      ),
      code(
        'dockerfile',
        `FROM golang:1.22 AS builder
WORKDIR /src
COPY . .
RUN go build -o app .

FROM gcr.io/distroless/base-debian12
COPY --from=builder /src/app /app
ENTRYPOINT ["/app"]`,
      ),
      p(
        'Result: a Go binary in a ~20MB final image instead of a ~900MB image carrying the full Go toolchain. "How do you shrink image size?" is one of the most common Docker interview questions, and multi-stage builds are the headline answer.',
      ),
    ],
  },
  {
    id: 'shrink',
    group: 'img',
    level: 'Intermediate',
    sectionNo: '08',
    category: 'Hygiene',
    title: 'Reducing Image Size & .dockerignore',
    body: [
      bars('Approximate image size by base (illustrative — always check current tags)', [
        { label: 'node:20 (full, Debian-based)', value: 1100, unit: '~1.1 GB' },
        { label: 'node:20-slim', value: 240, unit: '~240 MB' },
        { label: 'node:20-alpine', value: 180, unit: '~180 MB' },
        { label: 'distroless (nodejs runtime only)', value: 150, unit: '~150 MB' },
      ]),
      ul([
        '**Minimal base images**: `alpine`, `slim` variants, or **distroless** (no shell, no package manager — smaller attack surface, but also harder to `exec` into for debugging)',
        '**Multi-stage builds** so build-time-only tools never reach the final image',
        '**Combine RUN commands with && and clean up in the same layer** (`apt-get install ... && rm -rf /var/lib/apt/lists/*`) — cleaning in a later layer doesn\'t shrink anything, the earlier fat layer is still stored',
        '**Add a .dockerignore** to keep `node_modules`, `.git`, and build artifacts out of the **build context** sent to the daemon — smaller context, faster and cleaner builds',
      ]),
      code(
        'text',
        `# .dockerignore
.git
node_modules
*.log
Dockerfile
.env`,
      ),
    ],
  },
  {
    id: 'buildkit',
    group: 'img',
    level: 'Advanced',
    sectionNo: '09',
    category: 'Build Engine',
    title: 'BuildKit, Buildx & Next-Gen Container Builds',
    body: [
      p(
        '**BuildKit** is Docker\'s modern build backend (replacing the legacy linear builder). Instead of executing instructions sequentially top-to-bottom, BuildKit parses the Dockerfile into an internal **Low-Level Intermediate Representation (LLB)** Directed Acyclic Graph (DAG) — running independent stages in parallel and skipping unneeded stages automatically.',
      ),
      flow(
        [
          { label: 'Stage: Base' },
          {
            group: [
              { label: 'Stage: Frontend (Deps)', sub: 'Parallel Worker 1', tone: 'good' },
              { label: 'Stage: Backend (Deps)', sub: 'Parallel Worker 2', tone: 'good' },
            ],
            label: '',
          },
          { label: 'Stage: Production Bundle', tone: 'good' },
        ],
        { edges: ['splits concurrently into', 'merges into'], heading: '⚡ BuildKit DAG Concurrent Solver' },
      ),
      cards('Four Essential BuildKit Mount Types in RUN', [
        {
          h: 'Secret Mounts',
          c: 'Mounts sensitive API keys/tokens in-memory during RUN without writing to any image layer.',
          chips: ['--mount=type=secret', 'never in docker history'],
        },
        {
          h: 'Cache Mounts',
          c: 'Persists package manager cache directories across build runs (npm, pip, cargo, go).',
          chips: ['--mount=type=cache', '5x-10x faster re-builds'],
        },
        {
          h: 'SSH Agent Forwarding',
          c: 'Securely forwards host SSH keys to clone private repositories without copying keys into container.',
          chips: ['--mount=type=ssh', 'private git repos'],
        },
        {
          h: 'Bind Mounts',
          c: 'Directly reads host files during RUN without requiring an extra COPY instruction.',
          chips: ['--mount=type=bind', 'zero disk duplication'],
        },
      ]),
      code(
        'dockerfile',
        `# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./

# 1. Cache mount: package downloads persist across builds in host cache
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS builder
COPY . .

# 2. Secret mount: NPM_TOKEN mounted at runtime, NEVER baked into layer history
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
USER node
CMD ["node", "dist/server.js"]`,
      ),
      p(
        '### Multi-Architecture Builds with Docker Buildx\n**Docker Buildx** leverages BuildKit to cross-compile images for multiple CPU architectures (such as `linux/amd64` for cloud servers and `linux/arm64` for Apple Silicon / AWS Graviton) into a single multi-arch manifest list.',
      ),
      code(
        'bash',
        `# Enable and create an isolated Buildx instance with multi-arch drivers
docker buildx create --name mybuilder --use
docker buildx inspect --bootstrap

# Build for both AMD64 & ARM64 and push unified multi-arch manifest to registry
docker buildx build --platform linux/amd64,linux/arm64 -t myorg/app:1.0.0 --push .

# Build with CI Remote Cache (e.g. GitHub Actions cache backend)
docker buildx build \\
  --cache-to=type=gha,mode=max \\
  --cache-from=type=gha \\
  -t myorg/app:latest .`,
      ),
      ul([
        '**Automatic Pruning**: If you have 10 stages in a multi-stage Dockerfile but build `--target test`, BuildKit only evaluates stages required for `test`, discarding all production/lint stages',
        '**Rootless & Daemonless**: BuildKit can run as a standalone container or unprivileged user in Kubernetes environments (e.g. in Tekton / Argo Workflows)',
        '**High-resolution Terminal**: Colorized progress output with exact stage timings (`docker build --progress=auto`)',
      ]),
      note(
        'tip',
        'Interview framing: "Never use `--build-arg` for private tokens or registry credentials because build args are permanently visible in `docker history`. Always reach for BuildKit\'s `RUN --mount=type=secret` or `type=ssh`."',
      ),
    ],
  },
  {
    id: 'net-basics',
    group: 'run',
    level: 'Intermediate',
    sectionNo: '10',
    category: 'Network',
    title: 'Networking: Bridge, Host, None',
    body: [
      p('Every container gets networking via a **network driver** you choose at run time:'),
      flow(
        [
          {
            group: [
              { label: 'Container A', sub: '172.17.0.2' },
              { label: 'Container B', sub: '172.17.0.3' },
            ],
            label: '',
          },
          { label: 'Bridge', sub: 'docker0 · 172.17.0.0/16' },
          { label: 'Host' },
          { label: 'Outside World', tone: 'good' },
        ],
        { edges: ['', '', 'NAT + -p 8080:80'] },
      ),
      analogy(
        'Like an apartment building: the bridge network is the building\'s internal hallway system — each container/apartment gets an internal address and can find a neighbor by name via the building directory (DNS). The front door (NAT + `-p` port publishing) is the *only* way an outside visitor gets in, and only to the units you\'ve explicitly listed at the front desk.',
      ),
      ul([
        '**bridge** (default) — a private virtual network on the host; containers get their own IP and reach the outside via NAT; you must explicitly `-p` publish ports to reach them from the host',
        '**host** — the container shares the host\'s network namespace directly: no NAT, no port mapping, but also no isolation, and two containers can\'t bind the same port',
        '**none** — no networking at all, fully isolated',
        '**overlay** — spans multiple Docker hosts (used in Swarm / multi-host clusters)',
      ]),
      code(
        'bash',
        `docker network ls
docker network create mynet
docker run -d --network mynet --name api myapi
docker run -d --network mynet --name db postgres`,
      ),
      note(
        'tip',
        'On a **user-defined bridge network** (or anything Compose creates), containers reach each other by **container/service name** as a DNS hostname (`api` can call `http://db:5432`). This does **not** work on the legacy default bridge network — a very common gotcha and interview question.',
      ),
    ],
  },
  {
    id: 'net-ports',
    group: 'run',
    level: 'Intermediate',
    sectionNo: '11',
    category: 'Ports',
    title: 'Port Publishing & DNS Resolution',
    body: [
      p(
        '`-p HOST_PORT:CONTAINER_PORT` maps a port on the host to one inside the container. `EXPOSE` in a Dockerfile is documentation only — it publishes nothing by itself.',
      ),
      code(
        'bash',
        `docker run -d -p 8080:80 nginx            # host:8080 -> container:80
docker run -d -p 127.0.0.1:8080:80 nginx  # bind only to localhost
docker run -d -P nginx                    # publish ALL exposed ports to random host ports`,
      ),
      p(
        'A quick end-to-end check worth internalizing: build → run with `-p` → `curl localhost:<host-port>` from the host to confirm the mapping actually works before you assume the app is broken.',
      ),
      p(
        'Docker runs an embedded DNS server (`127.0.0.11` inside every container) that resolves other container names to their internal IPs on the same user-defined network — this is exactly how service discovery works in Compose and custom networks without any extra tooling.',
      ),
    ],
  },
  {
    id: 'volumes',
    group: 'store',
    level: 'Intermediate',
    sectionNo: '12',
    category: 'Mounts',
    title: 'Volumes, Bind Mounts & tmpfs',
    body: [
      p(
        'Containers are **ephemeral** by design — anything written only to the writable layer disappears the moment the container is removed. Three mechanisms exist to persist or share data, and knowing exactly when to reach for each is a real interview differentiator.',
      ),
      cards('', [
        {
          h: 'Named Volumes',
          c: 'Docker-managed storage, survives container removal, portable, backed up independently.',
          chips: ['best for databases'],
        },
        {
          h: 'Bind Mounts',
          c: 'Maps an exact host path in. Great for local dev live-reload.',
          chips: ['couples you to host paths'],
        },
        {
          h: 'tmpfs',
          c: 'Lives in host memory only, never touches disk, wiped on stop.',
          chips: ['secrets / temp data'],
        },
      ]),
      analogy(
        'Volumes are a filing cabinet the building manager (Docker) maintains independently of whoever\'s renting the apartment — get evicted (container removed), the cabinet stays put. A bind mount is peering directly into a specific real folder on the landlord\'s actual property. tmpfs is a whiteboard, wiped clean the instant the room is vacated.',
      ),
      code(
        'bash',
        `docker volume create dbdata
docker run -d -v dbdata:/var/lib/postgresql/data postgres   # named volume
docker run -d -v $(pwd):/app node                            # bind mount (dev)
docker run -d --tmpfs /app/cache nginx                        # tmpfs
docker volume inspect dbdata                                  # where it actually lives on disk`,
      ),
      note(
        'tip',
        'Interview one-liner: "Volumes are managed by Docker and outlive the container; a container\'s own writable layer does not — it\'s deleted with `docker rm`."',
      ),
    ],
  },
  {
    id: 'config',
    group: 'store',
    level: 'Intermediate',
    sectionNo: '13',
    category: 'Config',
    title: 'Environment Variables & Secrets',
    body: [
      p(
        'Never bake secrets (passwords, API keys) into an image layer — anyone with the image can extract them, and they persist in image history even if a "later" layer appears to delete them.',
      ),
      analogy(
        'Don\'t tape the spare key under the doormat (baking a secret into the image). Hand it directly to whoever needs it, exactly when they need it (runtime injection), and never write it down somewhere permanent.',
      ),
      flow(
        [
          { label: 'Secret in ARG/ENV', tone: 'bad' },
          { label: 'Baked into image layer', tone: 'bad' },
          { label: 'Visible via docker history', tone: 'bad' },
        ],
        { heading: '❌ Baked in', tone: 'bad', edges: ['', ''] },
      ),
      flow(
        [
          { label: 'Secret in env-file / mounted file' },
          { label: 'Injected at runtime', tone: 'good' },
          { label: 'Never touches an image layer', tone: 'good' },
        ],
        { heading: '✅ Injected at runtime', tone: 'good', edges: ['', ''] },
      ),
      ul([
        '**-e KEY=value** or **--env-file .env** for runtime config — simple, but visible via `docker inspect`',
        '**For real secrets**: Docker secrets (Swarm), mounted secret files, or your orchestrator\'s store (Kubernetes Secrets, Vault) — prefer a mounted **file** over an env var where possible, since env vars can leak through crash dumps or child-process environments',
        '**--build-arg** values ARE visible in `docker history` — never pass real secrets that way',
      ]),
      code('bash', 'docker run -e DATABASE_URL=postgres://... --env-file .env myapp'),
    ],
  },
  {
    id: 'compose-basics',
    group: 'compose',
    level: 'Intermediate',
    sectionNo: '14',
    category: 'Compose',
    title: 'Docker Compose Fundamentals',
    body: [
      p(
        'Compose defines and runs a **multi-container** app from one declarative YAML file, instead of chaining many `docker run` commands by hand.',
      ),
      analogy(
        'Docker Compose is the conductor of an orchestra — instead of individually cueing every musician (running each container manually), you hand the conductor a single score (`docker-compose.yml`) and it brings everyone in at the right time, in the right order.',
      ),
      flow(
        [
          { label: 'You', sub: 'localhost:3000' },
          { label: 'web service', tone: 'good' },
          { label: 'db service', tone: 'good' },
        ],
        {
          edges: ['', '⇄ by name'],
          note: 'Compose creates a shared network automatically — web and db can resolve each other by service name in either direction.',
        },
      ),
      code(
        'yaml',
        `services:
  web:
    build: .
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=production
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:16
    volumes:
      - dbdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 5

volumes:
  dbdata:`,
      ),
      code(
        'bash',
        `docker compose up -d          # build+start everything
docker compose ps
docker compose logs -f web
docker compose down -v        # stop and remove volumes too`,
      ),
    ],
  },
  {
    id: 'compose-adv',
    group: 'compose',
    level: 'Intermediate',
    sectionNo: '15',
    category: 'Readiness',
    title: 'Compose: depends_on, healthchecks, profiles',
    body: [
      p(
        'Plain `depends_on` only waits for the *container process* to start, not for the app inside to be *ready* — a database container can report "running" well before Postgres is actually accepting connections.',
      ),
      timeline([
        { time: 'T+0.0s', label: 'Compose starts the db container', status: 'info' },
        {
          time: 'T+0.0s',
          label: 'Compose starts the web container (depends_on: db, no healthcheck)',
          status: 'info',
        },
        { time: 'T+0.1s', label: 'web attempts to connect to Postgres', status: 'info' },
        {
          time: 'T+0.1s',
          label: "Connection refused — Postgres isn't accepting connections yet",
          status: 'fail',
        },
        {
          time: 'T+3.0s',
          label: 'Postgres finishes booting and starts accepting connections',
          status: 'info',
        },
        {
          time: 'with healthcheck added',
          label: 'condition: service_healthy holds web back until db actually reports healthy',
          status: 'ok',
        },
      ]),
      ul([
        '**profiles** — tag services (e.g. `debug`, `tools`) so they only start when explicitly requested: `docker compose --profile debug up`',
        '**.env** at the project root is auto-loaded for variable substitution (`${DB_PASSWORD}`) inside the compose file',
        '**docker compose exec web sh** — shell into a running compose service',
        '**Multiple compose files** can layer (`-f base.yml -f override.yml`) for dev/staging/prod variants of the same stack',
      ]),
    ],
  },
  {
    id: 'resources',
    group: 'prod',
    level: 'Advanced',
    sectionNo: '16',
    category: 'Limits',
    title: 'Resource Limits & cgroups',
    body: [
      p(
        'By default a container can use unlimited host CPU/memory — one runaway container can starve everything else on the box. Limits are enforced by Linux **cgroups**.',
      ),
      analogy(
        'cgroups are like a shared kitchen with a landlord-enforced gas meter per tenant: try to use the whole building\'s gas supply and you get shut off (OOM-killed) rather than quietly starving your neighbors.',
      ),
      code('bash', `docker run -d --memory=512m --memory-swap=512m --cpus=1.5 myapp`),
      bars('Example: a container against its memory limit', [
        { label: 'Used', value: 380, unit: '380 MB' },
        { label: 'Limit', value: 512, unit: '512 MB' },
      ]),
      ul([
        '**--memory** — hard cap; exceeding it gets the process **OOM-killed** (exit code 137)',
        '**--cpus** — fractional CPU cores the container may use',
        '**--memory-swap** — total memory+swap; set equal to `--memory` to disable swap entirely',
        'In Compose: `deploy.resources.limits` (Swarm) or the plain `mem_limit`/`cpus` keys',
      ]),
      note(
        'warn',
        'Exit code **137** = SIGKILL, almost always an OOM kill. Exit code **139** = segfault. Knowing these two numbers cold is a strong interview signal.',
      ),
    ],
  },
  {
    id: 'security',
    group: 'prod',
    level: 'Advanced',
    sectionNo: '17',
    category: 'Security',
    title: 'Container Security',
    body: [
      ul([
        '**Run as non-root**: `USER appuser` in the Dockerfile, or `--user 1000:1000` at runtime — a container running as root is root-equivalent on a kernel exploit',
        '**Drop capabilities**: `--cap-drop=ALL --cap-add=NET_BIND_SERVICE` instead of the full default Linux capability set',
        '**Read-only root filesystem**: `--read-only` (+ tmpfs for the few paths that truly need writes) stops malware from persisting changes',
        '**Block privilege escalation**: `--security-opt=no-new-privileges` stops setuid binaries from gaining more than they started with',
        '**Scan images**: Trivy/Grype/Docker Scout catch known CVEs in your base image and dependencies before you ship',
        '**Minimal/distroless base images** — fewer packages, smaller attack surface, often no shell to pivot from',
        '**Never mount the Docker socket** (`/var/run/docker.sock`) into untrusted containers — it grants effective root on the host',
        '**Sign and verify images** (Docker Content Trust / cosign) so you know an image wasn\'t tampered with in transit',
        '**seccomp/AppArmor profiles** restrict available syscalls — Docker ships a sane default seccomp profile already',
      ]),
      note(
        'tip',
        'If asked "how do you secure a container," walk the checklist top to bottom: non-root user → drop capabilities → read-only fs → minimal base image → scan for CVEs → don\'t expose the docker socket. That sequence *is* the answer.',
      ),
    ],
  },
  {
    id: 'logging',
    group: 'prod',
    level: 'Advanced',
    sectionNo: '18',
    category: 'Observability',
    title: 'Logging & Monitoring',
    body: [
      analogy(
        'Treat container logs like a flight recorder: if they\'re not shipped somewhere durable and rotated, they\'re the first thing to overflow and vanish right when you need them most — during a crash.',
      ),
      p(
        'By default, stdout/stderr is captured by the **json-file** logging driver on the host disk, which can grow unbounded without rotation.',
      ),
      code(
        'bash',
        `docker run -d --log-driver=json-file --log-opt max-size=10m --log-opt max-file=3 myapp
docker logs --since 10m -f myapp
docker stats --no-stream`,
      ),
      ul([
        '**Other log drivers**: `syslog`, `journald`, `gelf`, `awslogs`, `fluentd` — route logs to a central aggregator (ELK, Loki, CloudWatch) in production instead of relying on `docker logs`',
        '**`docker stats`** gives live CPU%, memory used/limit, network I/O, block I/O per container — the first stop when something\'s slow',
      ]),
    ],
  },
  {
    id: 'registries',
    group: 'prod',
    level: 'Advanced',
    sectionNo: '19',
    category: 'Artifacts',
    title: 'Registries, Tagging & Publishing',
    body: [
      code(
        'bash',
        `docker build -t myorg/myapp:1.4.0 .
docker tag myorg/myapp:1.4.0 myorg/myapp:latest
docker push myorg/myapp:1.4.0
docker login registry.example.com
docker pull myorg/myapp:1.4.0`,
      ),
      flow(
        [
          {
            group: [
              { label: ':1.4.0' },
              { label: ':latest' },
              { label: ':git-a1b2c3d' },
            ],
            label: '',
          },
          { label: 'sha256:abcd1234…', sub: 'actual image content', tone: 'good' },
        ],
        { edges: ['all point to'] },
      ),
      analogy(
        'Tags are nicknames pointing at the same person: "Mom," "Dr. Smith," and "the person at 221B Baker Street" can all name the exact same individual. Multiple tags can point at the exact same image content (digest).',
      ),
      ul([
        '**Avoid deploying `:latest` in production** — it\'s not reproducible and not rollback-friendly; prefer immutable version tags or the image **digest** (`@sha256:...`)',
        '**Private registries**: Docker Hub (private repos), AWS ECR, GCP Artifact Registry, Azure ACR, self-hosted Harbor',
        '**A tag strategy that reads well in interviews**: semver tags (`1.4.0`) + a moving `latest`/`stable` alias + a git-sha tag for full traceability back to the exact commit',
      ]),
    ],
  },
  {
    id: 'cicd',
    group: 'prod',
    level: 'Advanced',
    sectionNo: '20',
    category: 'Pipelines',
    title: 'Docker in CI/CD: DinD, DooD & Secure Pipelines',
    body: [
      p(
        'Running Docker inside continuous integration and deployment pipelines is one of the most critical day-to-day patterns in modern software delivery. However, building and testing container images inside CI runners requires choosing between distinct isolation strategies with major security tradeoffs.',
      ),
      cards('Three CI/CD Container Execution Paradigms', [
        {
          h: 'DooD (Docker-out-of-Docker)',
          c: 'Mounts host socket (/var/run/docker.sock) into CI runner. Fast layer cache, but grants root on host.',
          chips: ['-v /var/run/docker.sock', 'shared host cache', 'privileged risk'],
        },
        {
          h: 'DinD (Docker-in-Docker)',
          c: 'Runs a child Docker daemon inside container with --privileged. Isolated, but slower and complex storage.',
          chips: ['docker:dind', 'own daemon graph', 'needs --privileged'],
        },
        {
          h: 'Daemonless (Kaniko / Buildah)',
          c: 'Executes Dockerfile in user-space inside Kubernetes pods without Docker daemon or root privileges.',
          chips: ['no daemon', 'K8s native', 'zero host escape risk'],
        },
      ]),
      p(
        '### The Production CI/CD Pipeline Lifecycle\nA robust enterprise deployment pipeline executes five sequential verification gates before any container reaches production:',
      ),
      timeline([
        { time: '1. Commit & Test', label: 'Unit tests & linting run in lightweight multi-stage builder target', status: 'ok' },
        { time: '2. Buildx & Remote Cache', label: 'Builds multi-arch image using GitHub Actions or Registry cache (type=gha / type=registry)', status: 'ok' },
        { time: '3. CVE Vulnerability Scan', label: 'Trivy / Docker Scout scans base image and dependencies — fails build on CRITICAL vulnerabilities', status: 'ok' },
        { time: '4. Cryptographic Signing', label: 'Cosign / Notary signs image digest with KMS key to ensure supply-chain authenticity', status: 'ok' },
        { time: '5. Immutable Deployment', label: 'Orchestrator updates Pod spec using explicit immutable digest (@sha256:...) instead of :latest tag', status: 'ok' },
      ]),
      p(
        '### Example Production GitHub Actions Workflow\nA gold-standard automated build, scan, and publish workflow using official Docker GitHub Actions:',
      ),
      code(
        'yaml',
        `name: Build, Scan & Publish

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Extract Docker Metadata (Tags & Labels)
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/\${{ github.repository }}
          tags: |
            type=semver,pattern={{version}}
            type=sha,prefix=git-
            type=raw,value=latest,enable=\${{ github.ref == 'refs/heads/main' }}

      - name: Build and Push with GHA Caching
        id: build-step
        uses: docker/build-push-action@v6
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: \${{ steps.meta.outputs.tags }}
          labels: \${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Run Trivy Vulnerability Scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: \${{ steps.build-step.outputs.imageid }}
          format: 'table'
          exit-code: '1'
          ignore-unfixed: true
          severity: 'CRITICAL,HIGH'`,
      ),
      ul([
        '**Never bind the Docker socket in multi-tenant CI**: Mounting `/var/run/docker.sock` allows any runner job to spin up containers that inspect other tenant storage or elevate privileges',
        '**Always build with Git commit SHA tags**: Enables instant, deterministic git-to-production traceability and trivial zero-downtime rollbacks',
        '**Use mode=max with CI Caching**: Standard cache only stores intermediate layers of the final target; `mode=max` caches all multi-stage intermediate layers across runs',
      ]),
      note(
        'tip',
        'Interview framing: "In CI/CD, the key differences between DooD and DinD come down to security and caching. DooD shares the host daemon (fast, but security risk in shared runners), while DinD isolates daemon storage at the cost of requiring --privileged. For secure Kubernetes-native CI (like Tekton or GitLab on K8s), we prefer daemonless builders like Kaniko or rootless BuildKit."',
      ),
    ],
  },
  {
    id: 'debug',
    group: 'prod',
    level: 'Advanced',
    sectionNo: '21',
    category: 'Triage',
    title: 'Debugging & Troubleshooting Playbook',
    body: [
      p(
        'Pick your symptom below and work through it — this is the same triage order to reach for in a real incident or a live interview whiteboard.',
      ),
      wizard(),
      ul([
        '**Exits immediately** → `docker logs <name>` first; often the main process crashed, or CMD/ENTRYPOINT was wrong',
        '**Port already allocated** → `docker ps` or `lsof -i :PORT` to find what\'s already bound',
        '**Permission denied on a volume** → UID/GID mismatch between host and container user',
        '**"command not found"** → the base image lacks the binary/shell you assumed (common with `alpine`/`distroless`)',
        '**Container appears to hang** → `docker exec -it <name> sh` in and inspect live',
      ]),
      code(
        'bash',
        `docker inspect <name>              # full config, mounts, network, env
docker diff <name>                 # filesystem changes vs the image
docker events                      # live daemon event stream
docker exec -it <name> sh          # or bash if available`,
      ),
    ],
  },
  {
    id: 'orchestration',
    group: 'prod',
    level: 'Advanced',
    sectionNo: '22',
    category: 'Fleet',
    title: 'Beyond a Single Host: Swarm vs Kubernetes',
    body: [
      p(
        'Docker alone runs containers on **one machine**. Once you need multiple hosts, auto-restart on failure, rolling updates, and cluster-wide service discovery, you need an **orchestrator**.',
      ),
      cards('', [
        {
          h: 'Single Docker Host',
          c: 'One Docker Engine runs containers directly on one machine — you\'re the scheduler.',
          chips: ['Docker Engine', 'Container A', 'Container B'],
        },
        {
          h: 'Kubernetes Cluster',
          c: 'A scheduler places pods across many nodes, with self-healing and autoscaling built in.',
          chips: ['Scheduler', 'Node 1 — pods', 'Node 2 — pods', 'Node 3 — pods'],
        },
      ]),
      analogy(
        'A single Docker host is one delivery truck. Kubernetes is an entire logistics company: dispatch (the scheduler), automatically rerouting around a broken-down truck (self-healing), and adding more trucks during a rush (autoscaling).',
      ),
      ul([
        '**Docker Swarm** — built into the Docker CLI (`docker swarm init`, `docker service create`), simplest to adopt, smaller ecosystem, less common in current job postings',
        '**Kubernetes** — the industry standard; a Pod is roughly "one or more containers sharing networking," and K8s layers on Deployments, Services, ConfigMaps/Secrets, and a cluster-wide scheduler — everything Compose does for one host, K8s does across a fleet, plus self-healing and autoscaling',
        'Since ~2020, Docker Engine talks to **containerd** directly, and Kubernetes talks to runtimes via the **CRI** (Container Runtime Interface) — Docker images are OCI-compliant, so an image built with `docker build` runs unmodified on Kubernetes',
      ]),
      note(
        'tip',
        'Given a Kubernetes background already: the direct interview link is "a Dockerfile and the image it produces are exactly what a K8s Pod spec references via `image:` — Docker builds it, Kubernetes schedules and runs it at scale."',
      ),
    ],
  },
  {
    id: 'incidents',
    group: 'interview',
    level: 'Advanced',
    sectionNo: '23',
    category: 'Scenarios',
    title: 'DevOps Scenarios: The Six Production Incidents',
    body: [
      p(
        'Standard failure modes frequently probed in senior DevOps whiteboarding rounds. When an interviewer says *"a container is acting up in production,"* walk through structured hypothesis testing rather than random guessing.',
      ),
      cards('The 6 High-Frequency Production Failure Modes', [
        {
          h: '1. API Unreachable',
          c: 'Container runs, but requests fail or timeout from host / other services.',
          chips: ['0.0.0.0 binding', 'port mapping', 'iptables'],
        },
        {
          h: '2. Immediate Crash',
          c: 'Container enters CrashLoop or exits immediately after startup.',
          chips: ['PID 1 exit', 'ENTRYPOINT format', 'rescue shell'],
        },
        {
          h: '3. OOMKilled',
          c: 'Killed abruptly under traffic or background jobs with exit code 137.',
          chips: ['cgroups cap', 'JVM/Node heap', 'exit code 137'],
        },
        {
          h: '4. Host vs Container DNS',
          c: 'Works when tested on host machine, fails inside container network.',
          chips: ['localhost fallacy', 'user-defined bridge', 'healthchecks'],
        },
        {
          h: '5. Build 10x Slower',
          c: 'CI builds or local docker build suddenly takes minutes instead of seconds.',
          chips: ['cache-busting order', '.dockerignore', '--progress=plain'],
        },
        {
          h: '6. Laptop vs CI Drift',
          c: 'Runs cleanly on developer MacBook, fails on Linux staging / runner.',
          chips: ['ARM64 vs AMD64', 'UID permissions', 'Musl vs Glibc'],
        },
      ]),
      note(
        'tip',
        '**The Incident Triage Script (Say this out loud in interviews):**\n"First I establish the exact symptom and blast radius. Then I gather evidence across lifecycle status, logs, configuration, and kernel resource limits. I formulate the smallest testable hypothesis, run the cheapest test to falsify it, implement the fix, verify resolution, and add automated regression checks."',
      ),
      p(
        '### 1. "Container is running, but API is unreachable." (networking)\n**Root Cause**: Did the process bind to loopback `127.0.0.1` inside the container instead of wildcard `0.0.0.0`? A server listening on `127.0.0.1` only accepts requests originating inside that container\'s own isolated network namespace. Other culprits: reversed `-p host:container` port mapping or firewall iptables forwarding rules.',
      ),
      code(
        'bash',
        `# Check what address the process is actually listening on inside container
docker exec web ss -tulpn || docker exec web netstat -tuln

# Verify network connectivity & DNS resolution from client container
docker exec web nc -vz db 5432
docker exec web getent hosts db

# Inspect iptables NAT port forwarding rules on the host
iptables -t nat -L -n -v | grep DOCKER`,
      ),
      p(
        '### 2. "Container keeps crashing immediately." (PID 1 / config)\n**Root Cause**: A container exits the instant its PID 1 process terminates. Common triggers: a script that ran in background and returned, missing mandatory environment variables, or shell vs exec syntax issues in `ENTRYPOINT` / `CMD`.',
      ),
      code(
        'bash',
        `# Inspect exit code and termination reason
docker inspect <name> --format '{{.State.ExitCode}}'
docker logs --tail 100 <name>

# Validate ENTRYPOINT formatting (must be JSON array for exec form)
docker inspect --format '{{json .Config.Entrypoint}}' <image>

# Rescue and debug using an overridden interactive shell
docker run --rm -it --entrypoint sh <image:tag>`,
      ),
      p(
        '### 3. "Container is getting OOMKilled." (cgroups)\n**Root Cause**: The Linux kernel cgroup memory limiter issued SIGKILL because the process exceeded `--memory`. Runtime heaps like the JVM or Node.js may not respect container boundaries without explicit flags (`-XX:MaxRAMPercentage` or `--max-old-space-size`).\n\n> *Senior Interview Signal*: Increasing the memory limit is a temporary mitigation, not a root-cause diagnosis!',
      ),
      code(
        'bash',
        `# Check if container was killed by cgroup OOM killer (exit code 137)
docker inspect <name> --format 'OOMKilled: {{.State.OOMKilled}}, ExitCode: {{.State.ExitCode}}'

# Inspect configured memory limit vs host RAM
docker inspect <name> --format 'Memory Limit: {{.HostConfig.Memory}} bytes'
docker stats --no-stream`,
      ),
      p(
        '### 4. "Works on the host, fails inside the container." (DNS / interfaces)\n**Root Cause**: Hardcoded `localhost` / `127.0.0.1` database connection strings (which points to the container itself, not the database container), containers running on the default bridge network where embedded DNS name resolution is disabled, or connecting before dependent services are ready.',
      ),
      code(
        'bash',
        `# 1. Replace localhost with container/service DNS name on user-defined bridge
DATABASE_URL=postgres://user:pass@db:5432/appdb

# 2. Verify containers are on the same user-defined network
docker network inspect my-custom-network

# 3. In Compose, wait for real readiness via healthcheck
# depends_on: db: { condition: service_healthy }`,
      ),
      p(
        '### 5. "Build suddenly became 10x slower." (cache bust)\n**Root Cause**: Volatile files (like application source code, timestamped files, or git metadata) were copied prior to dependency manifests (`package.json`, `go.mod`, `pom.xml`), busting the layer cache on every commit. Also check for missing `.dockerignore` transferring massive directories into the daemon build context.',
      ),
      code(
        'bash',
        `# Run build with plain output to pinpoint the exact invalidated step
docker build --progress=plain -t myapp .

# Check size of build context being sent to Docker daemon
# If "Sending build context to Docker daemon" is hundreds of MBs, check .dockerignore!`,
      ),
      p(
        '### 6. "Works locally on laptop, fails in CI or staging." (drift)\n**Root Cause**: Architecture mismatch (Apple Silicon ARM64 vs Linux x86_64 AMD64 CI runners), non-root user UID/GID permission discrepancies on host mounts (e.g. host user 501 vs container user 1000), or C standard library differences (Alpine Musl vs Debian Glibc with native C addons).',
      ),
      code(
        'bash',
        `# Build multi-architecture images with Docker buildx
docker buildx build --platform linux/amd64,linux/arm64 -t myorg/myapp:1.0.0 .

# Verify image digest for immutable, reproducible deployment
docker inspect --format '{{index .RepoDigests 0}}' myorg/myapp:1.0.0

# Check ownership on mounted volumes
docker run --rm -v myvolume:/data alpine ls -ldn /data`,
      ),
    ],
  },
  {
    id: 'interview-fund',
    group: 'interview',
    level: 'Fundamentals',
    sectionNo: '24',
    category: 'Prep',
    title: 'Interview Q&A — Fundamentals',
    body: [],
  },
  {
    id: 'interview-adv',
    group: 'interview',
    level: 'Advanced',
    sectionNo: '25',
    category: 'Deep Dive',
    title: 'Interview Q&A — Intermediate & Advanced',
    body: [],
  },
]
