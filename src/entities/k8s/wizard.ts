import type { WizardNode } from './types'

export const K8S_WIZARD_TREE: Record<string, WizardNode> = {
  start: {
    q: "What's going wrong in your cluster?",
    options: [
      { label: 'My Pod is stuck in Pending', next: 'pending' },
      { label: 'My Pod keeps CrashLoopBackOff', next: 'crashloop' },
      { label: 'Pod is Running but I cannot reach the app', next: 'unreachable' },
      { label: 'My Deployment is not rolling out', next: 'rollout' },
      { label: 'Nodes look unhealthy or NotReady', next: 'node_notready' },
      { label: 'PVC is stuck in Pending', next: 'pvc_pending' },
    ],
  },

  pending: {
    q: 'What does `kubectl describe pod <name>` say in the Events section?',
    options: [
      { label: '0/N nodes are available: insufficient cpu/memory', next: 'pending_resources' },
      { label: 'no nodes matched node selector / taint', next: 'pending_taint' },
      { label: 'Pulling image... (stuck)', next: 'pending_image' },
      { label: 'Events are empty or very short', next: 'pending_events_empty' },
    ],
  },
  pending_resources: {
    result: true,
    title: 'Resource exhaustion — scale the cluster or relax requests',
    body: 'Your Pods request more CPU/memory than any single node has free. Either scale the node pool, reduce the resource requests, or enable Cluster Autoscaler. Remember: requests determine scheduling; limits determine throttling/OOM.',
    cmds: [
      'kubectl describe pod <name>       # look at Requests vs capacity',
      'kubectl describe nodes | grep -A5 "Allocated resources"',
      'kubectl top nodes                 # live node utilization',
    ],
  },
  pending_taint: {
    result: true,
    title: 'Scheduling blocked by taints or node selectors',
    body: 'The pod\'s nodeSelector, nodeAffinity, or a node\'s taint is preventing scheduling. Check for untolerated taints on all nodes. If you added a toleration, verify the key/value matches exactly (case-sensitive).',
    cmds: [
      'kubectl describe nodes | grep Taints',
      'kubectl get pod <name> -o yaml | grep -A10 tolerations',
      'kubectl get pod <name> -o yaml | grep -A10 nodeSelector',
    ],
  },
  pending_image: {
    result: true,
    title: 'Image pull failure',
    body: 'Either the image name / tag is wrong, the registry requires credentials, or network from nodes to registry is blocked. Check for ErrImagePull or ImagePullBackOff in events.',
    cmds: [
      'kubectl describe pod <name> | grep -A10 Events',
      'kubectl get secret regcred -o yaml          # check imagePullSecret',
      'docker pull <image>                         # test from your machine',
    ],
  },
  pending_events_empty: {
    result: true,
    title: 'Scheduler might be stuck — check control plane',
    body: 'Empty events often mean the kube-scheduler hasn\'t processed the pod yet. Could be scheduler down, or a webhook admission controller rejecting silently.',
    cmds: [
      'kubectl get pods -n kube-system | grep scheduler',
      'kubectl logs -n kube-system deployment/coredns',
      'kubectl get events --sort-by=.lastTimestamp',
    ],
  },

  crashloop: {
    q: 'What do logs show right before the crash?',
    options: [
      { label: 'App error / exception visible in logs', next: 'crashloop_app' },
      { label: 'Logs are empty', next: 'crashloop_empty' },
      { label: 'OOMKilled appears in describe', next: 'crashloop_oom' },
      { label: 'Liveness probe failing', next: 'crashloop_probe' },
    ],
  },
  crashloop_app: {
    result: true,
    title: 'Application crash — debug the code/config',
    body: 'The container process itself is crashing. Check logs from the previous crash (--previous), look for missing env vars, bad config maps, or startup exceptions. The pod restarts because its main process exits non-zero.',
    cmds: [
      'kubectl logs <pod> --previous       # logs from last crash',
      'kubectl logs <pod> -f               # stream current',
      'kubectl describe pod <pod> | grep -E "Exit Code|Last State"',
    ],
  },
  crashloop_empty: {
    result: true,
    title: 'Crash before logging — check the entrypoint',
    body: 'If logs are empty the container crashes before writing anything — usually a missing binary, wrong ENTRYPOINT, or the working directory doesn\'t exist in the image.',
    cmds: [
      'kubectl run debug --image=<same-image> -it --rm -- sh  # enter image manually',
      'kubectl describe pod <pod> | grep "Command\\|Args"',
    ],
  },
  crashloop_oom: {
    result: true,
    title: 'OOMKilled — increase memory limit',
    body: 'The container exceeded its memory limit and was killed by the kernel. Increase the limit in the container spec, or profile why memory usage is spiking (memory leak?).',
    cmds: [
      'kubectl describe pod <pod> | grep -A3 "OOMKilled"',
      'kubectl top pod <pod> --containers',
      '# Then edit deployment: kubectl edit deployment <name>  → increase resources.limits.memory',
    ],
  },
  crashloop_probe: {
    result: true,
    title: 'Liveness probe killing healthy container',
    body: 'If the liveness probe fails, Kubernetes kills and restarts the container even if it\'s actually running fine. Check the probe path, port, and initialDelaySeconds — the probe fires before the app finishes starting.',
    cmds: [
      'kubectl describe pod <pod> | grep -A10 Liveness',
      'kubectl exec -it <pod> -- curl localhost:<port>/healthz  # test manually',
      '# Fix: add initialDelaySeconds, or switch to startupProbe + livenessProbe',
    ],
  },

  unreachable: {
    q: "What type of Service is fronting your Pod?",
    options: [
      { label: 'ClusterIP (internal only)', next: 'unreachable_clusterip' },
      { label: 'NodePort or LoadBalancer', next: 'unreachable_external' },
      { label: 'Ingress resource', next: 'unreachable_ingress' },
    ],
  },
  unreachable_clusterip: {
    result: true,
    title: 'Debug ClusterIP connectivity',
    body: 'ClusterIP is only reachable from inside the cluster. Verify the Service selector matches the Pod labels exactly (most common mistake), the port mapping is correct, and the Pod\'s container is actually listening on that port.',
    cmds: [
      'kubectl get endpoints <svc-name>        # should list pod IPs, not empty',
      'kubectl get pod --show-labels           # compare with service selector',
      'kubectl run curl --image=curlimages/curl -it --rm -- curl http://<svc-name>:<port>',
    ],
  },
  unreachable_external: {
    result: true,
    title: 'Debug NodePort/LoadBalancer',
    body: 'For NodePort: hit any node IP on the node port. For LoadBalancer: the EXTERNAL-IP column must say an IP (not <pending> — that means cloud LB provisioning failed). Check security groups / firewall rules.',
    cmds: [
      'kubectl get svc <name>   # check EXTERNAL-IP and PORT(S)',
      'curl <node-ip>:<nodePort>',
      'kubectl describe svc <name> | grep -A5 Events   # LB provisioning events',
    ],
  },
  unreachable_ingress: {
    result: true,
    title: 'Debug Ingress routing',
    body: 'Ingress needs a running Ingress Controller (nginx, traefik, etc.). Check the controller pod is Running, verify the host/path rules, and confirm TLS is set up correctly if using HTTPS.',
    cmds: [
      'kubectl get ingress <name> -o yaml      # verify rules and backend',
      'kubectl get pods -n ingress-nginx       # controller running?',
      'kubectl describe ingress <name>         # check events for errors',
      'curl -H "Host: <your-host>" http://<ingress-ip>/<path>',
    ],
  },

  rollout: {
    result: true,
    title: 'Debug a stuck Deployment rollout',
    body: 'A rollout can stall because new pods are Pending/CrashLooping (blocking the rolling update), or a readiness probe never passes. kubectl rollout status will show the stall. You can rollback instantly while you investigate.',
    cmds: [
      'kubectl rollout status deployment/<name>',
      'kubectl describe deployment <name>  # check Conditions section',
      'kubectl get pods -l app=<label>     # see new vs old pods',
      'kubectl rollout undo deployment/<name>   # instant rollback',
    ],
  },

  node_notready: {
    result: true,
    title: 'Node NotReady — check kubelet and system resources',
    body: 'A NotReady node means the kubelet stopped sending heartbeats. Could be kubelet crashed, disk pressure, memory pressure, or network partition. SSH to the node and check kubelet status + system logs.',
    cmds: [
      'kubectl describe node <name>     # look at Conditions section',
      'kubectl get events --field-selector involvedObject.name=<node>',
      '# On the node itself:',
      'systemctl status kubelet',
      'journalctl -u kubelet -n 50',
      'df -h; free -m                   # check disk/memory pressure',
    ],
  },

  pvc_pending: {
    result: true,
    title: 'PVC stuck in Pending — check StorageClass',
    body: 'A PVC stays Pending when no PV matches (static provisioning) or the StorageClass provisioner fails (dynamic provisioning). Check the StorageClass name, the provisioner pod, and that the requested access mode is supported.',
    cmds: [
      'kubectl describe pvc <name>      # check Events for provisioner errors',
      'kubectl get storageclass         # verify default StorageClass exists',
      'kubectl get pods -n kube-system  # is the CSI provisioner running?',
    ],
  },
}
