import type { WizardNode } from '@/entities/topic'

export const DOCKER_CRASH_WIZARD_TREE: Record<string, WizardNode> = {
  start: {
    q: "What Docker issue or unexpected behavior are you facing?",
    options: [
      { label: "Container stops / exits immediately after running 'docker run'", next: "container_exits" },
      { label: "Error: 'Bind for 0.0.0.0:8080 failed: port is already allocated'", next: "port_allocated" },
      { label: "Cannot access container in browser (localhost:8080 not connecting)", next: "browser_connection" },
      { label: "Container exited with code 137 (OOMKilled / Out of Memory)", next: "oom_killed" },
      { label: "My local code changes are not updating inside the container", next: "live_reload" },
      { label: "Docker is consuming all my hard drive disk space!", next: "disk_space" },
    ],
  },

  container_exits: {
    result: true,
    title: "Fix Container Exiting Immediately",
    body: "A Docker container only stays alive as long as its foreground PID 1 process is running. If your script finishes or runs as a background daemon, Docker considers the job done and exits with code 0.",
    cmds: [
      "# 1. Check the logs of the stopped container to see why it exited:",
      "docker logs <container_name_or_id>",
      "",
      "# 2. If you ran an interactive shell container, ensure you passed -it:",
      "docker run -it ubuntu bash",
      "",
      "# 3. In Dockerfiles, ensure your CMD runs in the foreground (do NOT use 'systemctl' or background '&'):",
      "# Good: CMD [\"nginx\", \"-g\", \"daemon off;\"]",
      "# Bad:  CMD service nginx start",
    ],
  },

  port_allocated: {
    result: true,
    title: "Resolve Port Already in Use",
    body: "Another process or a previous Docker container is already listening on that host port.",
    cmds: [
      "# 1. Check which container is occupying the port:",
      "docker ps --filter 'publish=8080'",
      "",
      "# 2. Stop or remove the conflicting container:",
      "docker stop <conflicting_container>",
      "",
      "# 3. Or simply map to a different host port: -p <HOST_PORT>:<CONTAINER_PORT>",
      "docker run -d -p 8081:80 --name my-app nginx",
      "# Now access your app at http://localhost:8081",
    ],
  },

  browser_connection: {
    result: true,
    title: "Fix Cannot Connect to Container (localhost)",
    body: "Check the 3 most common connection hurdles: missing `-p` port mapping, wrong host/container port order, or app listening on `127.0.0.1` inside container instead of `0.0.0.0`.",
    cmds: [
      "# 1. Verify you passed the port flag: -p <HOST_PORT>:<CONTAINER_PORT>",
      "docker run -d -p 8080:80 nginx",
      "",
      "# 2. CRITICAL: Ensure your Node/Python/Go app binds to '0.0.0.0' (all interfaces),",
      "# NOT 'localhost' or '127.0.0.1' inside the container!",
      "# Example (Node.js Express): app.listen(8080, '0.0.0.0')",
      "# Example (FastAPI/Uvicorn): uvicorn main:app --host 0.0.0.0 --port 8000",
    ],
  },

  oom_killed: {
    result: true,
    title: "Fix Container Out of Memory (Exit Code 137)",
    body: "Exit code 137 (128 + 9 SIGKILL) means the Linux kernel OOM Killer terminated your container because it exceeded its allocated memory limit.",
    cmds: [
      "# 1. Inspect container exit status:",
      "docker inspect <container_id> --format '{{.State.OOMKilled}}' # Outputs: true",
      "",
      "# 2. Increase memory limit when running:",
      "docker run -d -m 2g --memory-swap 2g my-heavy-app",
      "",
      "# 3. In Docker Compose:",
      "# deploy:",
      "#   resources:",
      "#     limits:",
      "#       memory: 2G",
    ],
  },

  live_reload: {
    result: true,
    title: "Enable Live Code Reload with Bind Mounts",
    body: "If you only used `COPY . .` in your Dockerfile, your code was baked into the image at build time. To reflect live edits on your host machine without rebuilding, mount your current directory with `-v`.",
    cmds: [
      "# 1. Run with a Bind Mount pointing to your local directory:",
      "# Linux / macOS:",
      "docker run -d -p 3000:3000 -v $(pwd):/app -v /app/node_modules my-node-app",
      "",
      "# Windows PowerShell:",
      "docker run -d -p 3000:3000 -v ${PWD}:/app -v /app/node_modules my-node-app",
      "",
      "# 2. In Docker Compose (docker-compose.yml):",
      "# volumes:",
      "#   - .:/app",
      "#   - /app/node_modules",
    ],
  },

  disk_space: {
    result: true,
    title: "Reclaim Docker Disk Space",
    body: "Docker caches old build layers, dangling images, stopped containers, and unused volumes.",
    cmds: [
      "# 1. Check how much disk space Docker is currently using:",
      "docker system df",
      "",
      "# 2. Clean up dangling images, stopped containers, and unused networks safely:",
      "docker system prune",
      "",
      "# 3. AGGRESSIVE CLEANUP: Remove all unused images and build caches (frees gigabytes!):",
      "docker system prune -af --volumes",
    ],
  },
}
