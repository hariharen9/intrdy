import type { QAItem } from '@/entities/topic'

export const dockerCrashQAFundamentals: QAItem[] = [
  [
    'What is the fundamental difference between a Container and a Virtual Machine (VM)?',
    'Virtual Machines virtualize the physical hardware, requiring a full guest operating system (with its own kernel, memory, and startup overhead) running on top of a hypervisor. Containers virtualize the operating system, running as isolated user-space processes that share the host Linux kernel (using cgroups and namespaces). Containers start in milliseconds and use orders of magnitude less RAM and CPU.',
  ],
  [
    'Explain the difference between a Dockerfile, an Image, and a Container.',
    '- Dockerfile: The plain-text recipe/blueprint containing step-by-step build instructions (FROM, COPY, RUN, CMD).\n- Image: The immutable, read-only packaged snapshot created when you build a Dockerfile. It contains your app code, runtime, libraries, and base OS files.\n- Container: A running, isolated process instance created from an Image. You can spin up multiple containers from a single image.',
  ],
  [
    'What is the difference between `CMD` and `ENTRYPOINT` in a Dockerfile?',
    '- `ENTRYPOINT`: Sets the primary executable that will always run when the container starts (e.g. `ENTRYPOINT ["nginx"]` or `["python"]`).\n- `CMD`: Provides default arguments to the ENTRYPOINT (e.g. `CMD ["-g", "daemon off;"]`). Arguments passed after `docker run <image> <args>` will override `CMD`, but will append to `ENTRYPOINT`.',
  ],
  [
    'What does the port mapping flag `-p 8080:80` mean?',
    '`-p <HOST_PORT>:<CONTAINER_PORT>`. It forwards traffic hitting port `8080` on your host machine to port `80` inside the isolated container network, allowing external browsers or clients to reach your containerized web server.',
  ],
  [
    'What is the difference between a Docker Volume and a Bind Mount?',
    '- Docker Volumes (Named Volumes): Managed completely by Docker in a dedicated storage directory (e.g. `/var/lib/docker/volumes/`). Ideal for database persistence (PostgreSQL/MySQL) in production because Docker manages permissions and performance.\n- Bind Mounts (`-v $(pwd):/app`): Maps an exact directory on your host filesystem directly into the container. Ideal for local development so editing files in VS Code updates inside the container immediately.',
  ],
  [
    'What is a Multi-Stage Build and why should you always use it in production?',
    'A Multi-Stage build uses multiple `FROM` instructions in a single Dockerfile. You use a heavy build stage (with compilers, SDKs, npm, Maven) to build the app, and then `COPY --from=builder` only the compiled binary/artifacts into a tiny, minimal runtime image (like Alpine or Distroless). This reduces image sizes from 1GB+ down to 20-50MB and removes attack vectors (compilers, package managers) from production.',
  ],
  [
    'How do you execute commands or open a shell inside an already running container?',
    'Run `docker exec -it <container_name_or_id> sh` (or `bash`). The `-i` flag keeps stdin open, and `-t` allocates a pseudo-terminal.',
  ],
  [
    'What is Docker Compose and what problem does it solve?',
    'Docker Compose is a tool for defining and running multi-container Docker applications using a single YAML file (`docker-compose.yml`). Instead of running 5 long `docker run` commands with manual network and volume flags, you run `docker compose up -d` to bring up your web app, database, Redis cache, and message queue together with automated service discovery and shared networking.',
  ],
]

export const dockerCrashQAAdvanced: QAItem[] = [
  [
    'Why is the order of commands in a Dockerfile critical for build caching?',
    'Docker caches each instruction layer. When an instruction changes, its cache and all subsequent layers are invalidated. If you put `COPY . .` before `RUN npm install`, every single code edit invalidates the package install layer, forcing a 2-minute npm install on every build. Best practice: `COPY package*.json ./`, `RUN npm install`, and THEN `COPY . .`.',
  ],
  [
    'How does service discovery work between containers in Docker Compose?',
    'Docker Compose automatically creates a custom user-defined bridge network for the stack. Containers can communicate with each other directly using their service names as DNS hostnames (e.g. `postgres://db:5432/myapp` where `db` is the service name in `docker-compose.yml`), eliminating hardcoded IP addresses.',
  ],
  [
    'What causes Exit Code 137 in Docker and how do you diagnose it?',
    'Exit code 137 indicates the container process was sent `SIGKILL` (128 + 9), almost always triggered by the Linux kernel OOM (Out Of Memory) Killer because the container exceeded its configured memory limit. Diagnose by running `docker inspect <container> --format \'{{.State.OOMKilled}}\'`.',
  ],
  [
    'How do you safely clean up gigabytes of accumulated unused Docker objects?',
    'Run `docker system df` to check usage, and run `docker system prune -af --volumes` to permanently remove all stopped containers, dangling build caches, unused networks, and unreferenced images.',
  ],
]
