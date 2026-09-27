import type { QAItem } from './types'

export const DOCKER_QA_FUND: QAItem[] = [
  [
    "What is Docker, in one sentence you'd say out loud?",
    'A platform that packages an application with its dependencies into a portable, isolated unit (a container) that runs consistently across environments, using OS-level virtualization instead of full hardware virtualization.',
  ],
  [
    "Container vs Virtual Machine — what's the real difference?",
    'Containers share the host OS kernel and isolate at the process level via namespaces/cgroups (lightweight, fast startup); VMs virtualize hardware and run a full separate guest OS via a hypervisor (heavier, stronger isolation, slower to boot).',
  ],
  [
    'What is a Docker image vs a container?',
    "An image is a read-only, layered template (built from a Dockerfile) — it's the blueprint. A container is a running (or stopped) instance of that image, with an added writable layer and an actual process running.",
  ],
  [
    'Walk me through what happens when you run `docker run nginx`.',
    "Docker checks for the `nginx` image locally; pulls it from the registry if missing; creates a new container (writable layer, network, mounts) from the image; then starts the process defined by the image's CMD/ENTRYPOINT.",
  ],
  [
    'What is the difference between `docker stop` and `docker kill`?',
    '`stop` sends SIGTERM, gives the process a grace period (10s default) to shut down cleanly, then sends SIGKILL if it hasn\'t exited. `kill` sends SIGKILL immediately — no grace period.',
  ],
  [
    'If I `docker rm` a container, does the image get deleted too?',
    'No. Removing a container only deletes that container\'s writable layer and metadata. The underlying image (and any volumes it used, unless you pass `-v`) stays untouched.',
  ],
  [
    'Why do containers start so much faster than VMs?',
    'No hardware to virtualize and no guest OS to boot — a container is just a host process launched inside isolated namespaces/cgroups against an already-running kernel, so startup is closer to launching any other process.',
  ],
  [
    'What does EXPOSE actually do in a Dockerfile?',
    "It's purely documentation/metadata declaring which port the app inside listens on — it does not publish or open that port to the host. You still need `-p` (or `-P` to auto-publish all exposed ports) at runtime to actually reach it.",
  ],
  [
    'Why can two containers on the default bridge network not resolve each other by name?',
    "The legacy default bridge network doesn't run Docker's embedded DNS server for name resolution — only user-defined networks (including the one Compose creates automatically) get that. On the default bridge you'd need the deprecated `--link` flag or hardcoded IPs.",
  ],
]

export const DOCKER_QA_ADV: QAItem[] = [
  [
    'CMD vs ENTRYPOINT — explain clearly, ideally with an example.',
    'ENTRYPOINT fixes the executable that always runs; CMD supplies default arguments that can be overridden at `docker run`. E.g. `ENTRYPOINT ["python","app.py"]` + `CMD ["--port","8080"]` — running `docker run img --port 9090` overrides just the port, python app.py always runs.',
  ],
  [
    'How do Docker layers and the build cache work, and how do you optimize a Dockerfile for it?',
    "Each instruction produces a cached, content-hashed layer; if an instruction and its inputs are unchanged, Docker reuses the cached layer. Optimize by ordering instructions from least-to-most frequently changing — copy dependency manifests and install deps before copying full source code, so code edits don't bust the install-layer cache.",
  ],
  [
    'What is a multi-stage build and why does it matter?',
    'It lets you use one image (with full build tooling) to compile/build the app, then copy only the final artifact into a second, minimal runtime image — so compilers and dev dependencies never ship in production, dramatically shrinking image size and attack surface.',
  ],
  [
    'Volumes vs bind mounts vs tmpfs — when do you use each?',
    'Named volumes: Docker-managed, portable, best for persistent data like databases. Bind mounts: map an exact host path in, great for local dev live-reload, but couples you to host paths. tmpfs: in-memory only, never touches disk, for ephemeral/sensitive data.',
  ],
  [
    'How does container-to-container communication work by name?',
    "On a user-defined bridge (or Compose's auto-created network), Docker's embedded DNS server resolves other container/service names to their internal IPs — this doesn't work on the legacy default bridge network, which requires manual `--link` or IPs.",
  ],
  [
    'How would you reduce a production image from 900MB to under 50MB?',
    'Switch to an alpine/slim/distroless base, use a multi-stage build so build tools don\'t ship, combine and clean up in the same RUN layer (e.g. `apt-get install && rm -rf /var/lib/apt/lists/*` in one instruction), and add a `.dockerignore` to keep the build context lean.',
  ],
  [
    'A container keeps exiting right after it starts. How do you debug it?',
    '`docker logs <name>` first to see the crash reason. Common causes: the main process (PID 1) finished/crashed with nothing left running, a missing env var, a bad CMD/ENTRYPOINT, or the base image lacking an expected binary/shell. `docker inspect` for exit code — 137 means OOM-killed, 139 means segfault.',
  ],
  [
    'How do you keep secrets out of your images?',
    'Never pass secrets via `ARG`/`ENV` baked into the image (they persist in `docker history` and layers even if "deleted" later). Instead inject at runtime via `--env-file`/orchestrator secrets, or mount as a file using your platform\'s secret store (Docker secrets, Kubernetes Secrets, Vault).',
  ],
  [
    'What security hardening steps would you apply to a production container?',
    'Run as a non-root USER, drop Linux capabilities (`--cap-drop=ALL`, add back only what\'s needed), use `--read-only` root filesystem with tmpfs for the few writable paths, choose a minimal/distroless base image, scan for CVEs (Trivy/Scout), and never mount the Docker socket into untrusted containers.',
  ],
  [
    "Docker Compose's `depends_on` says a service started — is it actually ready?",
    'Not necessarily — plain `depends_on` only waits for the container process to start, not for the app inside to be ready to accept connections. Use a `healthcheck` on the dependency plus `depends_on: condition: service_healthy` to wait for real readiness.',
  ],
  [
    'Docker Swarm vs Kubernetes — how do you compare them in an interview?',
    'Swarm is built into Docker CLI, simpler to adopt, smaller feature set and ecosystem. Kubernetes is the industry-standard orchestrator with richer primitives (Deployments, Services, autoscaling, a large ecosystem) and is what most companies run in production today — Docker images are OCI-compliant so the same image runs on either unmodified.',
  ],
  [
    'What are exit codes 137 and 139, and why do they matter operationally?',
    '137 = 128+9 (SIGKILL) — almost always an out-of-memory kill by the kernel/cgroup limiter. 139 = 128+11 (SIGSEGV) — a segmentation fault in the process itself. Recognizing these immediately narrows debugging from "the container broke" to a concrete root cause.',
  ],
  [
    "What's the difference between `docker exec` and `docker attach`?",
    '`exec` starts a brand-new process inside the running container\'s namespaces (e.g. a debug shell) alongside whatever\'s already running. `attach` connects your terminal to the container\'s existing PID 1 process\'s stdin/stdout/stderr — exiting an attached session can, depending on flags, stop the main process itself.',
  ],
  [
    'What is OverlayFS and why does Docker use it?',
    'A union filesystem that lets Docker layer multiple read-only directories (image layers) plus one writable layer into a single merged view, without physically copying files between layers — reads fall through to the lowest layer that has the file, writes go to the top writable layer (copy-on-write).',
  ],
]
