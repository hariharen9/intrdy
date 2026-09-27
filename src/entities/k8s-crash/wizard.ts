import type { WizardNode } from '@/entities/topic'

export const K8S_CRASH_WIZARD_TREE: Record<string, WizardNode> = {
  "start": {
    "q": "What is the current status of your troubled Kubernetes Pod in kubectl get pods?",
    "options": [
      {
        "label": "CrashLoopBackOff / Error (Pod repeatedly crashes)",
        "next": "crashloop"
      },
      {
        "label": "ImagePullBackOff / ErrImagePull",
        "next": "image_err"
      },
      {
        "label": "Pending (Pod is never scheduled onto a Node)",
        "next": "pending"
      },
      {
        "label": "Running / Ready (0/1), but not receiving traffic",
        "next": "service_traffic"
      }
    ]
  },
  "crashloop": {
    "result": true,
    "title": "Fix CrashLoopBackOff Pods",
    "body": "The container process started, failed, and exited. Kubernetes is repeatedly trying to restart it with exponential backoff.",
    "cmds": [
      "# 1. View logs of the crashed container instance:",
      "kubectl logs <pod_name> --previous",
      "",
      "# 2. Inspect exit code and termination reason:",
      "kubectl describe pod <pod_name>",
      "",
      "# 3. If OOMKilled (Exit code 137), increase resources.limits.memory in the Deployment spec."
    ]
  },
  "image_err": {
    "result": true,
    "title": "Fix ImagePullBackOff / ErrImagePull",
    "body": "The worker node runtime failed to download the container image from the container registry.",
    "cmds": [
      "# 1. Check spelling of image name and tag in the PodSpec:",
      "kubectl describe pod <pod_name> | grep -A 5 \"Failed to pull image\"",
      "",
      "# 2. If the registry is private, create and attach an imagePullSecret:",
      "kubectl create secret docker-registry my-registry-secret \\",
      "  --docker-server=registry.example.com \\",
      "  --docker-username=ci-user \\",
      "  --docker-password=secret-token"
    ]
  },
  "pending": {
    "result": true,
    "title": "Fix Pending Pods (Scheduling Failure)",
    "body": "The kube-scheduler cannot find any healthy node with sufficient CPU/Memory or matching nodeSelectors/taints.",
    "cmds": [
      "# 1. Check why scheduler rejected all nodes:",
      "kubectl describe pod <pod_name> | grep -A 10 \"Events:\"",
      "",
      "# 2. Check cluster-wide node resource capacity:",
      "kubectl top nodes",
      "kubectl describe nodes | grep -A 6 \"Allocated resources:\"",
      "",
      "# 3. Lower resources.requests or scale up cluster node count."
    ]
  },
  "service_traffic": {
    "result": true,
    "title": "Fix Service Traffic Not Routing to Pod",
    "body": "The Pod is running, but HTTP requests to the Service fail with connection refused or 503.",
    "cmds": [
      "# 1. Check if the Service found matching Pod endpoints:",
      "kubectl get endpoints <service_name>",
      "",
      "# 2. If <none> is shown, fix the label selector mismatch:",
      "# Service spec.selector must match Pod metadata.labels exactly.",
      "",
      "# 3. If endpoints exist, verify the Readiness Probe is passing (Ready 1/1):",
      "kubectl describe pod <pod_name> | grep -A 5 \"Readiness:\""
    ]
  }
}
