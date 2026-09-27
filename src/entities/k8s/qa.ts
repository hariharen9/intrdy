import type { QAItem } from './types'

export const K8S_QA_FUND: QAItem[] = [
  [
    'What is Kubernetes and what problem does it solve?',
    'Kubernetes is a container orchestration platform that automates deployment, scaling, self-healing, and management of containerized applications across a cluster of machines. It solves the problem of running containers at scale in production — manually managing dozens of containers across tens of servers is fragile and operationally impossible.',
  ],
  [
    'What are the main components of the Kubernetes control plane?',
    'kube-apiserver (the single REST gateway — all communication goes through it), etcd (distributed key-value store — the single source of truth for all cluster state), kube-scheduler (watches for unscheduled pods and assigns them to nodes based on resources/constraints), kube-controller-manager (runs controllers: Deployment, ReplicaSet, Node, etc.), and cloud-controller-manager (cloud-provider-specific logic — LBs, node lifecycle).',
  ],
  [
    'What runs on each worker node?',
    'kubelet (the node agent — talks to the API server, ensures pods declared for that node are running), kube-proxy (maintains network rules / iptables for Service routing), and a container runtime (containerd or CRI-O — actually runs containers).',
  ],
  [
    'What is a Pod and why is it the smallest deployable unit — not the container?',
    'A Pod is one or more containers that share a network namespace (same IP, same localhost) and can share volumes. K8s schedules Pods (not individual containers) because some tightly-coupled processes need to co-locate — e.g., an app and its log-shipper sidecar. The pod is the unit of scheduling, placement, and lifecycle.',
  ],
  [
    'Deployment vs StatefulSet vs DaemonSet — when do you use each?',
    'Deployment: stateless apps where pods are interchangeable (web servers, APIs). StatefulSet: stateful apps that need stable network IDs, stable persistent storage, and ordered deployment/scaling (databases, Kafka, Zookeeper). DaemonSet: one pod per node for infrastructure concerns (log shippers, monitoring agents, CNI plugins).',
  ],
  [
    'What is a Service and what problem does it solve?',
    'Pods are ephemeral — they die and get new IPs. A Service provides a stable virtual IP (ClusterIP) and DNS name that load-balances across all healthy matching pods, discovered via label selectors. Without Services, you\'d need to track pod IPs manually.',
  ],
  [
    'What is the difference between ClusterIP, NodePort, and LoadBalancer?',
    'ClusterIP: stable IP only reachable from inside the cluster. NodePort: opens a fixed port (30000-32767) on every node, forwarding to the service — reachable from outside but not production-grade. LoadBalancer: provisions a cloud LB (AWS ELB, GCP LB) with a public IP — the right choice for production external traffic.',
  ],
  [
    'What is etcd and why is it so critical?',
    'etcd is the distributed key-value store that holds 100% of cluster state (pod specs, node info, secrets, configs, RBAC rules). If etcd is lost and you have no backup, you lose your entire cluster configuration — the API server, scheduler, and controllers all go down. It must be highly available (3 or 5 node quorum) and regularly backed up.',
  ],
  [
    'How does a Pod get scheduled onto a node?',
    'You submit a Pod spec via kubectl. The API server validates and stores it in etcd. The kube-scheduler watches for unscheduled pods, runs filtering (which nodes satisfy resource requests, taints, node selectors) then scoring (which is the best fit), and assigns the pod to a node by writing the nodeName back to etcd. The kubelet on that node watches for pods assigned to it and starts the container.',
  ],
  [
    'What is a ConfigMap vs a Secret?',
    'Both inject configuration into pods. ConfigMap stores non-sensitive config (environment strings, config files) as plaintext in etcd. Secret stores sensitive data (passwords, tokens, certs) but is only base64-encoded by default — not encrypted! For real security you need encryption-at-rest enabled in the API server or use an external secret store (Vault, AWS Secrets Manager).',
  ],
]

export const K8S_QA_ADV: QAItem[] = [
  [
    'Walk me through what happens, end-to-end, when you run `kubectl apply -f deployment.yaml`.',
    'kubectl serializes the manifest and sends a PUT/POST to kube-apiserver. The API server authenticates (certificate/token), authorizes (RBAC), runs admission controllers (DefaultStorageClass, PodSecurity, webhooks), and persists to etcd. The Deployment controller detects the new/changed Deployment and reconciles — creates/updates a ReplicaSet. The ReplicaSet controller creates Pod objects. The scheduler assigns pods to nodes. Kubelets on those nodes pull the image and start containers. Readiness probes must pass before the pod joins the Service endpoints.',
  ],
  [
    'What is the difference between liveness, readiness, and startup probes?',
    'Liveness: is the container still alive? Failure → kubelet kills and restarts it. Readiness: is the container ready to receive traffic? Failure → pod is removed from Service endpoints (no traffic) but NOT restarted. Startup: is the container still starting? Disables liveness+readiness until it passes — prevents killing a slow-starting app. Design rule: never make a liveness probe check downstream dependencies (DB, API) — you\'ll cause cascading restarts.',
  ],
  [
    'Explain Kubernetes networking: how does a packet travel from Pod A to Pod B on a different node?',
    'Every pod gets a unique cluster-wide IP (no NAT between pods — this is the flat network model). Traffic from Pod A leaves via its veth pair into the node\'s bridge/overlay network. The CNI plugin (Calico, Flannel, Cilium) handles inter-node routing — either via BGP routes (Calico), VXLAN overlay (Flannel), or eBPF (Cilium). The packet arrives at Node B\'s network interface, traverses the bridge, and enters Pod B\'s veth. kube-proxy (or Cilium BPF) manages iptables/ipvs rules for Service VIP translation.',
  ],
  [
    'What is a rolling update and how does Kubernetes guarantee zero-downtime?',
    'A rolling update incrementally replaces old pods with new ones. Controlled by maxUnavailable (max old pods down at once) and maxSurge (max new pods above desired count). Zero-downtime requires: readiness probes on new pods (traffic only goes to ready pods), correct terminationGracePeriodSeconds so old pods finish in-flight requests, and a preStop hook if needed. If new pods never become ready, the rollout stalls (it doesn\'t take down old pods).',
  ],
  [
    'What is RBAC and how does it work in Kubernetes?',
    'Role-Based Access Control. Four objects: Role (namespaced rules — which verbs on which resources), ClusterRole (same but cluster-wide), RoleBinding (grants a Role to a Subject in a namespace), ClusterRoleBinding (grants a ClusterRole cluster-wide). Subjects are Users, Groups, or ServiceAccounts. Best practice: use ServiceAccounts for pods, give them the minimum permissions needed (principle of least privilege), never use the default service account for sensitive workloads.',
  ],
  [
    'What is a Horizontal Pod Autoscaler (HPA) and how does it work?',
    'HPA watches a target metric (CPU%, memory, or custom via Metrics API) and adjusts the replica count of a Deployment/StatefulSet to maintain a target threshold. It queries kube-metrics-server every 15s. Scaling out is fast; scale-in has a stabilization window (default 5min) to prevent flapping. HPA + Cluster Autoscaler work together: HPA adds pods → if no room, CA adds nodes.',
  ],
  [
    'What is the difference between a PersistentVolume (PV) and a PersistentVolumeClaim (PVC)?',
    'PV is a piece of storage provisioned in the cluster (static by admin, or dynamic via StorageClass). PVC is a request for storage by a user — specifying size, access mode (RWO/RWX/ROX), and optionally StorageClass. K8s binds a PVC to a matching PV. With dynamic provisioning (most cloud clusters), you just create a PVC and the StorageClass provisioner creates the PV + cloud disk automatically. PVs outlive pods — data persists across restarts.',
  ],
  [
    'How does Kubernetes handle secrets — and what are the security concerns?',
    'Secrets are stored in etcd, base64-encoded (not encrypted by default). They can be injected as env vars or volume-mounted files. Risks: base64 is trivially decoded; etcd access = all secrets. Mitigations: enable EncryptionConfiguration on the API server (AES-GCM at rest), use RBAC to tightly restrict secret GET/LIST, audit who accesses secrets, and for production use an external secrets operator (External Secrets Operator pulling from AWS SM / Vault) so secrets never live in etcd at all.',
  ],
  [
    'What is a Namespace and when should you use multiple namespaces?',
    'Namespaces provide a logical partition within a cluster — for resource quotas, network policies, and RBAC scope. Use multiple namespaces for: environment isolation (dev/staging/prod in the same cluster — though separate clusters is stronger), team isolation, and multi-tenancy. Not a security boundary by default — a compromised pod in namespace A can still reach namespace B unless you apply NetworkPolicies. Cluster-level resources (Nodes, PVs, StorageClasses, ClusterRoles) are not namespaced.',
  ],
  [
    'How would you do a zero-downtime deployment of a database (StatefulSet)?',
    'StatefulSets update pods one at a time by ordinal order (highest first). Use updateStrategy: RollingUpdate with partition to do canary-style rollouts. Ensure: PodDisruptionBudget (minAvailable: 2 for a 3-replica DB so quorum is maintained), proper readiness probes, and that your DB supports replica rolling upgrades. For critical DBs, many teams do blue-green at the StatefulSet level or use the database\'s own replication-aware upgrade tooling (e.g., Patroni for Postgres).',
  ],
  [
    'What is a NetworkPolicy and what happens without one?',
    'Without NetworkPolicy, all pods can freely communicate with all other pods across all namespaces — a compromised pod can probe your entire cluster. NetworkPolicy lets you define ingress/egress rules using label selectors and namespace selectors. Key: NetworkPolicies are enforced by the CNI plugin — you must use a CNI that supports it (Calico, Cilium — not Flannel without extra tooling). A common pattern: default-deny-all, then whitelist specific traffic.',
  ],
  [
    'What is Helm and why do teams use it?',
    'Helm is the package manager for Kubernetes. A Chart is a collection of YAML manifests parameterized with Go templates + a values.yaml. Helm lets you: install complex apps (like Prometheus, nginx-ingress) with one command, override values per environment, upgrade with helm upgrade, rollback with helm rollback, and track releases in cluster state. Alternative: Kustomize (patch-based, no templating) — often used in GitOps pipelines (ArgoCD/Flux support both).',
  ],
  [
    'Explain the difference between kubectl apply and kubectl create/replace.',
    '`kubectl create` fails if the resource exists. `kubectl replace` replaces the full object (requires the full manifest). `kubectl apply` is declarative and idempotent — it computes a 3-way merge between the current live object, the last-applied config, and your new manifest, then applies only the diff. This is why `apply` is the GitOps-friendly choice — you can run it repeatedly without side effects.',
  ],
]
