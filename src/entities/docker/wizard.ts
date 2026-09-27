import type { WizardNode } from './types'

export const DOCKER_WIZARD_TREE: Record<string, WizardNode> = {
  start: {
    q: "What's happening with your container?",
    options: [
      { label: 'It exits immediately after starting', next: 'exits' },
      { label: "It's running but I can't reach it", next: 'unreachable' },
      { label: "It's slow or eating tons of CPU/memory", next: 'slow' },
      { label: 'It seems to hang / I just want to look inside', next: 'hang' },
    ],
  },
  exits: {
    result: true,
    title: 'Check the logs first',
    body: 'Almost always the main process crashed or exited on its own. A container dies the instant PID 1 exits — look for a script that ran once and returned, a missing env var, or a straight-up crash.',
    cmds: [
      'docker logs <name>',
      'docker inspect <name> --format "{{.State.ExitCode}}"  # 137=OOM-killed, 139=segfault',
    ],
  },
  unreachable: {
    result: true,
    title: 'Check the port mapping & network',
    body: "Confirm the port was actually published, that you're hitting the right host port, and that the container is on the network you think it's on.",
    cmds: [
      'docker ps   # look at the PORTS column',
      'curl localhost:<host-port>',
      'docker network inspect <network>',
    ],
  },
  slow: {
    result: true,
    title: 'Check resource limits and live usage',
    body: "Either the app is genuinely under-resourced, or it's about to get OOM-killed. Compare live usage against the configured limit.",
    cmds: [
      'docker stats',
      'docker inspect <name> --format "{{.HostConfig.Memory}}"',
    ],
  },
  hang: {
    result: true,
    title: 'Get inside and look around',
    body: "Attach a shell inside the running container's namespaces and inspect processes, files, and recent changes directly.",
    cmds: [
      'docker exec -it <name> sh',
      'docker top <name>',
      'docker diff <name>',
    ],
  },
}
