import type { Topic, TopicBlock, TopicGroup } from './types'

function p(c: string): TopicBlock {
  return { t: 'p', c }
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

export const K8S_GROUPS: TopicGroup[] = [
  { id: 'foundations', name: 'Foundations' },
  { id: 'workloads', name: 'Workloads' },
  { id: 'config', name: 'Config & Storage' },
  { id: 'networking', name: 'Networking' },
  { id: 'production', name: 'Production & Security' },
  { id: 'interview', name: 'Interview Prep' },
]

export const K8S_TOPICS: Topic[] = [
  // ─── FOUNDATIONS ──────────────────────────────────────────────────────────
  {
    id: 'why-k8s',
    group: 'foundations',
    level: 'Beginner',
    sectionNo: '01',
    category: 'Concept',
    title: 'Why Kubernetes? The Container Orchestration Problem',
    body: [
      p(
        'You\'ve learned Docker. You can package an app into a container and run it. Now imagine you have 50 microservices, each needing 3–10 replicas, running across 20 servers. Who decides which container goes on which server? What happens when a server dies? How do you roll out a new version without downtime? How do you scale the payment service when traffic spikes on Black Friday? **That\'s the problem Kubernetes solves.**',
      ),
      analogy(
        'Think of Kubernetes as a very opinionated, very smart operations team. You tell it *what* you want (3 replicas of my app, always). It figures out *how* to achieve that, and it keeps fighting to maintain that state — even when servers fail, pods crash, or traffic spikes. You declare the desired state; Kubernetes continuously reconciles reality toward it.',
      ),
      cards('What Kubernetes gives you out of the box', [
        {
          h: 'Self-healing',
          c: 'If a container crashes or a node dies, K8s automatically reschedules the affected pods to healthy nodes.',
          chips: ['High Availability'],
        },
        {
          h: 'Horizontal Scaling',
          c: 'Scale a service from 2 to 20 replicas with one command — or automatically via HPA based on CPU/memory.',
          chips: ['HPA', 'VPA'],
        },
        {
          h: 'Rolling Updates',
          c: 'Deploy new versions gradually. If the new version is broken, rollback instantly — zero downtime.',
          chips: ['Zero Downtime'],
        },
        {
          h: 'Service Discovery',
          c: 'Pods get a stable DNS name via Services. No hardcoded IPs — K8s DNS resolves service names internally.',
          chips: ['DNS', 'ClusterIP'],
        },
        {
          h: 'Config & Secret Management',
          c: 'Separate config from code via ConfigMaps and Secrets. Inject at runtime — no rebuilding images.',
          chips: ['ConfigMap', 'Secret'],
        },
        {
          h: 'Storage Orchestration',
          c: 'Dynamically provision cloud volumes (EBS, GCE PD) and attach them to pods regardless of which node they land on.',
          chips: ['PVC', 'StorageClass'],
        },
      ]),
      note('tip', 'K8s does NOT replace Docker. Docker builds images; K8s runs and orchestrates them at scale. They are complementary.'),
      bars('Container Orchestration comparison', [
        { label: 'Kubernetes (market leader)', value: 96, unit: '% adoption (CNCF Survey)' },
        { label: 'Docker Swarm', value: 22, unit: '% adoption' },
        { label: 'HashiCorp Nomad', value: 9, unit: '% adoption' },
      ]),
    ],
  },

  {
    id: 'architecture',
    group: 'foundations',
    level: 'Beginner',
    sectionNo: '02',
    category: 'Architecture',
    title: 'Cluster Architecture: Control Plane & Worker Nodes',
    body: [
      p(
        'A Kubernetes cluster is split into two tiers: the **Control Plane** (the brain — makes decisions) and **Worker Nodes** (the muscle — runs your workloads). In production you always run multiple control plane nodes for high availability.',
      ),
      stackCompare(
        {
          title: 'Control Plane (the brain)',
          layers: [
            { label: 'kube-apiserver', sub: 'REST gateway — everything talks to this', tone: 'writable' },
            { label: 'etcd', sub: 'Distributed KV store — ALL cluster state' },
            { label: 'kube-scheduler', sub: 'Assigns pods to nodes' },
            { label: 'kube-controller-manager', sub: 'Runs Deployment, Node, RS controllers' },
            { label: 'cloud-controller-manager', sub: 'Cloud-specific: LBs, node lifecycle' },
          ],
        },
        {
          title: 'Worker Node (the muscle)',
          layers: [
            { label: 'kubelet', sub: 'Node agent — talks to API server, starts pods', tone: 'writable' },
            { label: 'kube-proxy', sub: 'Service iptables/ipvs rules on node' },
            { label: 'Container Runtime', sub: 'containerd / CRI-O — actually runs containers' },
            { label: 'Your Pods', sub: 'The actual workload containers' },
          ],
        },
      ),
      p('### kube-apiserver — The Single Front Door\nAll communication in the cluster goes through kube-apiserver. kubectl, controllers, kubelets — everything speaks REST to the API server. It validates requests, applies admission control, and persists to etcd. It is the only component that talks to etcd directly.'),
      p('### etcd — The Brain\'s Memory\netcd is a distributed, strongly-consistent key-value store (using the Raft consensus protocol). It holds ALL cluster state: pod specs, node info, service configs, secrets, RBAC rules — everything. Losing etcd without a backup means losing your entire cluster configuration.'),
      note('warn', 'etcd is the most critical component. In production: run 3 or 5 etcd nodes (odd numbers for Raft quorum), enable TLS, and take regular backups with `etcdctl snapshot save`.'),
      p('### The Reconciliation Loop — How Controllers Work\nEvery controller in K8s runs the same basic loop: Watch the API server for changes to its resource type. Compare the current state to the desired state. If they differ, take action to close the gap.'),
      flow(
        [
          { label: 'Desired State', sub: 'in etcd (you declared)' },
          { label: 'Controller Watches', sub: 'API server events' },
          { label: 'Compare', sub: 'desired vs actual' },
          { label: 'Act', sub: 'create/update/delete' },
          { label: 'Actual State', sub: 'reconciled' },
        ],
        { heading: 'The Kubernetes Control Loop (runs continuously)', tone: 'good' },
      ),
    ],
  },

  {
    id: 'kubectl',
    group: 'foundations',
    level: 'Beginner',
    sectionNo: '03',
    category: 'Tooling',
    title: 'kubectl: Your CLI to the Cluster',
    body: [
      p(
        '`kubectl` is the command-line tool that communicates with the kube-apiserver. It reads your `~/.kube/config` file to know which cluster to talk to and which credentials to use. Mastering kubectl is essential — it\'s how you inspect, debug, and manage everything in the cluster.',
      ),
      p('### Essential kubectl Commands'),
      code('bash', `# --- Cluster Info ---
kubectl cluster-info
kubectl get nodes                          # all nodes and status
kubectl describe node <name>               # detailed node info

# --- Working with Pods ---
kubectl get pods                           # pods in current namespace
kubectl get pods -n kube-system            # pods in a specific namespace
kubectl get pods -A                        # all namespaces
kubectl get pods -o wide                   # with node/IP info
kubectl describe pod <name>                # full details + events
kubectl logs <pod>                         # container logs
kubectl logs <pod> --previous              # logs from last crash
kubectl logs <pod> -c <container>          # multi-container pod
kubectl exec -it <pod> -- bash             # open a shell
kubectl exec -it <pod> -- curl localhost:8080/health

# --- Apply & Delete ---
kubectl apply -f deployment.yaml           # declarative apply (idempotent)
kubectl delete -f deployment.yaml          # delete resources in file
kubectl delete pod <name>                  # delete a specific pod

# --- Debugging ---
kubectl get events --sort-by=.lastTimestamp
kubectl top pods                           # CPU/memory (needs metrics-server)
kubectl top nodes
kubectl run debug --image=busybox -it --rm -- sh  # temp debug pod`),
      p('### Contexts: Managing Multiple Clusters'),
      code('bash', `# A kubeconfig can hold multiple clusters/users/contexts
kubectl config get-contexts                # list all contexts
kubectl config use-context <name>          # switch cluster
kubectl config current-context            # which cluster am I on?

# Shortcut: kubectx (community tool)
kubectx staging                           # switch to staging cluster
kubens monitoring                         # switch default namespace`),
      note('tip', '`kubectl explain <resource>` is your built-in documentation. `kubectl explain pod.spec.containers.resources` shows field docs without leaving the terminal.'),
      p('### The -o flag: Output Formats'),
      code('bash', `kubectl get pod <name> -o yaml        # full resource as YAML
kubectl get pod <name> -o json        # full resource as JSON
kubectl get pods -o wide              # extra columns (node, IP)
kubectl get pods -o custom-columns='NAME:.metadata.name,STATUS:.status.phase'

# JSONPath — extract specific fields
kubectl get pod <name> -o jsonpath='{.status.podIP}'
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="InternalIP")].address}'`),
    ],
  },

  {
    id: 'pods',
    group: 'foundations',
    level: 'Beginner',
    sectionNo: '04',
    category: 'Core Object',
    title: 'Pods: The Atomic Unit of Kubernetes',
    body: [
      p(
        'A **Pod** is the smallest deployable unit in Kubernetes — not a container. A pod wraps one or more containers that share the same network namespace (one IP address, same localhost) and optionally share volumes. You almost never create pods directly in production; you create Deployments that manage pods for you.',
      ),
      analogy(
        'A Pod is like a single server process environment. Just as multiple threads inside one process share memory, containers in a Pod share a network stack. The "sidecar" pattern exploits this: your main app and a helper (log shipper, proxy, vault agent) run as separate containers in the same pod, talking over localhost.',
      ),
      code('yaml', `# Minimal pod definition
apiVersion: v1
kind: Pod
metadata:
  name: my-app
  labels:
    app: my-app        # labels are key-value pairs — Services use these to find pods
spec:
  containers:
    - name: app
      image: nginx:1.25
      ports:
        - containerPort: 80
      resources:
        requests:
          cpu: "100m"      # 0.1 CPU core (milliCPU)
          memory: "128Mi"  # 128 mebibytes
        limits:
          cpu: "500m"
          memory: "256Mi"
      env:
        - name: LOG_LEVEL
          value: "info"
      livenessProbe:
        httpGet:
          path: /health
          port: 80
        initialDelaySeconds: 10
        periodSeconds: 15
      readinessProbe:
        httpGet:
          path: /ready
          port: 80
        initialDelaySeconds: 5
        periodSeconds: 10`),
      p('### Resource Requests vs Limits — Critical to Understand'),
      cards('Requests vs Limits', [
        {
          h: 'requests',
          c: 'The minimum guaranteed resources. Used by the **scheduler** to decide which node has enough room. Set this to what the app needs under normal load.',
          chips: ['Scheduling'],
        },
        {
          h: 'limits',
          c: 'The maximum the container can use. Exceeding CPU limit → throttled. Exceeding memory limit → OOMKilled (the pod is killed and restarted).',
          chips: ['OOMKill', 'Throttling'],
        },
      ]),
      note('warn', 'Always set both requests AND limits in production. A pod without requests gets scheduled anywhere (causes noisy-neighbor problems). A pod without limits can consume an entire node\'s memory and starve other pods.'),
      p('### Pod Lifecycle States'),
      timeline([
        { time: 'Pending', label: 'Pod accepted but not yet running — image pull, scheduling', status: 'info' },
        { time: 'Running', label: 'Pod bound to node, at least one container running', status: 'ok' },
        { time: 'Succeeded', label: 'All containers exited 0 (for Jobs)', status: 'ok' },
        { time: 'Failed', label: 'At least one container exited non-zero', status: 'fail' },
        { time: 'Unknown', label: 'Node stopped reporting — network partition', status: 'fail' },
      ]),
      p('### Multi-Container Pod Patterns'),
      cards('Sidecar Patterns', [
        { h: 'Sidecar', c: 'Extends the main container. E.g. log-shipper (Fluentd), vault-agent injecting secrets, service mesh proxy (Envoy/Linkerd).', chips: ['Log shipping', 'Service Mesh'] },
        { h: 'Init Container', c: 'Runs to completion BEFORE app containers start. Used for DB migrations, waiting for dependencies, pre-population of volumes.', chips: ['Startup sequencing'] },
        { h: 'Ephemeral Container', c: 'Injected into a running pod for debugging only. Cannot be restarted. `kubectl debug -it <pod> --image=busybox`', chips: ['Debugging'] },
      ]),
    ],
  },

  // ─── WORKLOADS ────────────────────────────────────────────────────────────
  {
    id: 'deployments',
    group: 'workloads',
    level: 'Beginner',
    sectionNo: '05',
    category: 'Workload',
    title: 'Deployments: Managing Stateless Apps',
    body: [
      p(
        'A **Deployment** is what you use for 90% of stateless applications (web servers, APIs, workers). It manages a **ReplicaSet**, which manages individual Pods. The Deployment controller ensures the desired number of replicas is always running, handles rolling updates, and supports rollbacks.',
      ),
      flow(
        [
          { label: 'Deployment', sub: 'you manage this' },
          { label: 'ReplicaSet (new)', sub: 'manages new pods' },
          { label: 'ReplicaSet (old)', sub: 'kept for rollback' },
          { label: 'Pods', sub: 'actual running containers' },
        ],
        { heading: 'Deployment → ReplicaSet → Pods hierarchy', edges: ['owns', 'creates', ''] },
      ),
      code('yaml', `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app           # must match pod labels below
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1     # at most 1 old pod down at a time
      maxSurge: 1           # at most 1 extra pod above desired
  template:                 # pod template — everything below is a pod spec
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: app
          image: my-registry/my-app:v2.1.0
          ports:
            - containerPort: 8080
          resources:
            requests: { cpu: "100m", memory: "128Mi" }
            limits:   { cpu: "500m", memory: "256Mi" }`),
      p('### Rolling Updates & Rollbacks'),
      code('bash', `# Deploy a new version
kubectl set image deployment/my-app app=my-registry/my-app:v2.2.0

# Watch the rollout
kubectl rollout status deployment/my-app

# View rollout history
kubectl rollout history deployment/my-app

# Rollback to previous version
kubectl rollout undo deployment/my-app

# Rollback to specific revision
kubectl rollout undo deployment/my-app --to-revision=2

# Pause/resume (useful for patching multiple things before rollout)
kubectl rollout pause deployment/my-app
kubectl rollout resume deployment/my-app`),
      note('tip', 'The Deployment keeps old ReplicaSets around (controlled by revisionHistoryLimit, default 10) precisely to support rollback. Don\'t set this to 0 or you lose rollback history.'),
      p('### Deployment Strategies'),
      cards('Update Strategies', [
        {
          h: 'RollingUpdate (default)',
          c: 'Gradually replaces old pods with new. Zero downtime if readiness probes are correct. Controlled by maxUnavailable + maxSurge.',
          chips: ['Zero Downtime', 'Default'],
        },
        {
          h: 'Recreate',
          c: 'Kills ALL old pods first, then starts new ones. Has downtime but guarantees no two versions run simultaneously. Use for apps that can\'t have two versions active.',
          chips: ['Has Downtime'],
        },
        {
          h: 'Blue-Green (manual)',
          c: 'Run two Deployments side by side (blue=v1, green=v2), then flip the Service selector. Instant cutover, instant rollback. Doubles resources temporarily.',
          chips: ['Instant Rollback'],
        },
        {
          h: 'Canary (manual / Argo Rollouts)',
          c: 'Send a small % of traffic to the new version. Monitor metrics. Gradually increase. Requires traffic splitting at Service or Ingress level.',
          chips: ['Risk Reduction'],
        },
      ]),
    ],
  },

  {
    id: 'statefulsets',
    group: 'workloads',
    level: 'Intermediate',
    sectionNo: '06',
    category: 'Workload',
    title: 'StatefulSets: Running Stateful Apps',
    body: [
      p(
        'Databases and other stateful apps need things that Deployments can\'t provide: **stable pod identity** (predictable names like `db-0`, `db-1`), **stable persistent storage** (each pod always mounts the same volume), and **ordered startup/shutdown** (start db-0 before db-1 before db-2). **StatefulSet** provides all three.',
      ),
      stackCompare(
        {
          title: 'Deployment (stateless)',
          layers: [
            { label: 'random-abc12', sub: 'pod name random — disposable' },
            { label: 'Shared or no volumes', sub: 'or each pod claims its own' },
            { label: 'Parallel start/stop', sub: 'all pods interchangeable' },
          ],
        },
        {
          title: 'StatefulSet (stateful)',
          layers: [
            { label: 'db-0, db-1, db-2', sub: 'stable ordinal names' },
            { label: 'PVC per pod', sub: 'db-0 always gets vol-db-0', tone: 'writable' },
            { label: 'Ordered: 0→1→2', sub: 'startup respects order' },
          ],
        },
      ),
      code('yaml', `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres-headless  # REQUIRED: headless service for DNS
  replicas: 3
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16
          env:
            - name: PGDATA
              value: /var/lib/postgresql/data/pgdata
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:          # Creates a PVC per pod automatically
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: fast-ssd
        resources:
          requests:
            storage: 50Gi`),
      note('tip', 'StatefulSets need a **Headless Service** (`clusterIP: None`). This gives each pod a stable DNS entry: `<pod-name>.<service-name>.<namespace>.svc.cluster.local`. e.g. `postgres-0.postgres-headless.default.svc.cluster.local` — this is how cluster members find each other.'),
      p('### DaemonSet and Jobs'),
      cards('Other Workload Types', [
        {
          h: 'DaemonSet',
          c: 'Runs exactly one pod per node (or per subset of nodes). Used for infrastructure: log shippers (Fluentd), monitoring agents (node-exporter), CNI plugins, security scanners.',
          chips: ['Fluentd', 'node-exporter'],
        },
        {
          h: 'Job',
          c: 'Runs a pod to completion (exit 0). Retries on failure. Use for one-off tasks: DB migrations, batch processing, data backups.',
          chips: ['Batch', 'One-time'],
        },
        {
          h: 'CronJob',
          c: 'Runs a Job on a cron schedule. `schedule: "0 2 * * *"` runs at 2am daily. Creates a Job each time. Use for backups, reports, cleanup tasks.',
          chips: ['Scheduled', 'Batch'],
        },
      ]),
    ],
  },

  {
    id: 'probes',
    group: 'workloads',
    level: 'Intermediate',
    sectionNo: '07',
    category: 'Reliability',
    title: 'Health Probes: Liveness, Readiness & Startup',
    body: [
      p(
        'Health probes are how Kubernetes knows if your containers are working correctly. Getting probes wrong is one of the most common causes of production incidents — **a bad liveness probe causes unnecessary restarts; a bad readiness probe silently drops traffic**. Understanding the difference is critical.',
      ),
      cards('Three probe types', [
        {
          h: '🫀 Liveness Probe',
          c: 'Is the container still alive? Failure → kubelet kills and restarts the container. Use for detecting deadlocks or infinite loops where the app is running but stuck.',
          chips: ['Kills on failure', 'Restarts container'],
        },
        {
          h: '✅ Readiness Probe',
          c: 'Is the container ready to serve traffic? Failure → pod removed from Service endpoints (no traffic sent). NOT restarted. Use for graceful startup and dependency checks.',
          chips: ['Removes from Service', 'No restart'],
        },
        {
          h: '🚀 Startup Probe',
          c: 'Is the slow-starting container done initializing? Disables liveness+readiness until it passes. Prevents killing apps with long boot times (JVM, legacy apps).',
          chips: ['Slow startups', 'Disables others'],
        },
      ]),
      code('yaml', `spec:
  containers:
    - name: app
      # Startup probe — give app up to 5min to start (30 * 10s)
      startupProbe:
        httpGet:
          path: /health
          port: 8080
        failureThreshold: 30
        periodSeconds: 10

      # Liveness — only kills if the app deadlocks, not if DB is slow
      livenessProbe:
        httpGet:
          path: /health/live      # must NOT check external deps
          port: 8080
        initialDelaySeconds: 0    # startupProbe handles initial wait
        periodSeconds: 15
        failureThreshold: 3

      # Readiness — remove from LB if not ready to serve
      readinessProbe:
        httpGet:
          path: /health/ready     # CAN check DB/cache connectivity
          port: 8080
        periodSeconds: 5
        failureThreshold: 3`),
      note('warn', 'NEVER check external dependencies (database, third-party APIs) in a liveness probe. If your DB is slow, the liveness probe fails → K8s kills your pod → restarts it → pod tries to connect to DB → still slow → kills again. You create a restart storm that makes an outage much worse.'),
      flow(
        [
          { label: 'Startup Probe', sub: 'passes first' },
          { label: 'Both enabled', sub: 'liveness + readiness' },
          { label: 'Readiness fails', sub: 'remove from Service', tone: 'bad' },
          { label: 'Liveness fails', sub: 'kill + restart', tone: 'bad' },
        ],
        { heading: 'Probe evaluation sequence' },
      ),
    ],
  },

  // ─── CONFIG & STORAGE ─────────────────────────────────────────────────────
  {
    id: 'config-secrets',
    group: 'config',
    level: 'Beginner',
    sectionNo: '08',
    category: 'Config',
    title: 'ConfigMaps & Secrets: Decoupling Config from Code',
    body: [
      p(
        'Hard-coding config into your container image is an anti-pattern — you\'d need a new build for every environment. **ConfigMap** and **Secret** let you inject configuration at runtime, keeping your image environment-agnostic.',
      ),
      stackCompare(
        {
          title: 'ConfigMap',
          layers: [
            { label: 'Non-sensitive config', sub: 'LOG_LEVEL, feature flags' },
            { label: 'Stored as plaintext', sub: 'in etcd, visible to anyone with access' },
            { label: 'Use for', sub: 'app settings, config files, env vars' },
          ],
        },
        {
          title: 'Secret',
          layers: [
            { label: 'Sensitive data', sub: 'DB passwords, API keys, TLS certs' },
            { label: 'Base64 encoded', sub: 'NOT encrypted by default!', tone: 'writable' },
            { label: 'Use for', sub: 'credentials, imagePullSecrets' },
          ],
        },
      ),
      code('yaml', `# ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  LOG_LEVEL: "info"
  APP_PORT: "8080"
  config.yaml: |                # can store entire config files
    database:
      max_connections: 20
    cache:
      ttl: 300

---
# Secret (values are base64-encoded)
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  DB_PASSWORD: cGFzc3dvcmQxMjM=     # base64('password123')
  API_KEY: c3VwZXJzZWNyZXQ=`),
      code('yaml', `# Consuming ConfigMap & Secret in a Pod
spec:
  containers:
    - name: app
      image: my-app:v1
      # Option 1: inject all keys as env vars
      envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
      # Option 2: inject specific keys
      env:
        - name: LOG_LEVEL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: LOG_LEVEL
      # Option 3: mount as files in a volume
      volumeMounts:
        - name: config-vol
          mountPath: /etc/config
  volumes:
    - name: config-vol
      configMap:
        name: app-config`),
      note('warn', 'Secrets are base64 — not secure at rest! Enable EncryptionConfiguration in the API server to encrypt secrets in etcd. In production, use External Secrets Operator + AWS Secrets Manager / HashiCorp Vault so secrets never live in etcd at all.'),
    ],
  },

  {
    id: 'storage',
    group: 'config',
    level: 'Intermediate',
    sectionNo: '09',
    category: 'Storage',
    title: 'Persistent Storage: Volumes, PVs & PVCs',
    body: [
      p(
        'Container filesystems are ephemeral — when a pod dies, its data dies with it. For databases and stateful apps, you need **PersistentVolumes (PV)** — storage that lives independently of any pod\'s lifecycle.',
      ),
      flow(
        [
          { label: 'StorageClass', sub: 'defines HOW to provision' },
          { label: 'PVC', sub: 'developer request: size + access mode' },
          { label: 'Provisioner', sub: 'creates cloud disk' },
          { label: 'PV', sub: 'the actual storage resource' },
          { label: 'Pod', sub: 'mounts the PV via PVC' },
        ],
        { heading: 'Dynamic Provisioning flow (most cloud clusters)', edges: ['→', '→ triggers', '→ creates', '→ bound to'], tone: 'good' },
      ),
      code('yaml', `# Step 1: StorageClass (usually pre-created by your cloud/admin)
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp3
  encrypted: "true"
reclaimPolicy: Delete   # Delete or Retain when PVC is deleted
allowVolumeExpansion: true

---
# Step 2: PVC — what you (the developer) create
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-data
spec:
  accessModes:
    - ReadWriteOnce      # RWO: one node at a time (most block storage)
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 50Gi

---
# Step 3: Mount in Pod
spec:
  containers:
    - name: postgres
      volumeMounts:
        - mountPath: /var/lib/postgresql/data
          name: db-volume
  volumes:
    - name: db-volume
      persistentVolumeClaim:
        claimName: postgres-data`),
      cards('Access Modes', [
        { h: 'ReadWriteOnce (RWO)', c: 'Can be mounted read-write by ONE node at a time. Most block storage (EBS, GCE PD). This is the most common.', chips: ['EBS', 'Default'] },
        { h: 'ReadWriteMany (RWX)', c: 'Can be mounted read-write by MANY nodes simultaneously. Requires NFS or distributed FS (EFS, NFS, CephFS).', chips: ['NFS', 'EFS'] },
        { h: 'ReadOnlyMany (ROX)', c: 'Many nodes can mount read-only simultaneously. Useful for shared data read by multiple pods.', chips: ['Shared Data'] },
      ]),
      note('tip', 'Expanding a PVC: edit the PVC spec with a larger storage value. If `allowVolumeExpansion: true` in the StorageClass, the cloud disk will resize online (no pod restart needed on most cloud providers with ext4/xfs).'),
    ],
  },

  // ─── NETWORKING ──────────────────────────────────────────────────────────
  {
    id: 'services',
    group: 'networking',
    level: 'Beginner',
    sectionNo: '10',
    category: 'Networking',
    title: 'Services: Stable Networking for Pods',
    body: [
      p(
        'Pods are ephemeral — they die, get rescheduled, and receive new IP addresses. A **Service** provides a stable virtual IP (ClusterIP) and DNS name that automatically load-balances traffic across all healthy pods matching its selector. It\'s the foundational networking primitive in Kubernetes.',
      ),
      analogy(
        'A Service is like a load balancer in front of a pool of identical servers. The pool (pods) changes — servers come and go — but the load balancer\'s IP address never changes. Clients always talk to the stable IP, never directly to individual pods.',
      ),
      code('yaml', `apiVersion: v1
kind: Service
metadata:
  name: my-app-svc
spec:
  selector:
    app: my-app         # finds all pods with this label
  ports:
    - port: 80          # Service port (clients call this)
      targetPort: 8080  # container port (where app listens)
      protocol: TCP
  type: ClusterIP       # default — only reachable inside cluster`),
      cards('Service Types', [
        {
          h: 'ClusterIP (default)',
          c: 'Stable virtual IP, reachable only from inside the cluster. Used for inter-service communication. Gets a DNS name: `<svc>.<namespace>.svc.cluster.local`',
          chips: ['Internal only', 'DNS'],
        },
        {
          h: 'NodePort',
          c: 'Extends ClusterIP + opens a port (30000-32767) on EVERY node. Reachable from outside via `<node-ip>:<nodePort>`. Not production-grade (bypasses cloud LB).',
          chips: ['External access', 'Dev/Testing'],
        },
        {
          h: 'LoadBalancer',
          c: 'Extends NodePort + provisions a cloud load balancer (AWS ELB, GCP LB) with a public IP. The right way to expose services externally in production.',
          chips: ['Production', 'Cloud LB'],
        },
        {
          h: 'Headless (clusterIP: None)',
          c: 'No virtual IP — DNS resolves directly to individual pod IPs. Required for StatefulSets so pods can discover each other by stable DNS names.',
          chips: ['StatefulSet', 'DNS direct'],
        },
        {
          h: 'ExternalName',
          c: 'Maps a Service to an external DNS name (e.g., RDS endpoint). No proxying — just DNS CNAME. Useful for migrating from in-cluster to external services.',
          chips: ['External DNS', 'Migration'],
        },
      ]),
      p('### DNS in Kubernetes\nEvery Service gets a DNS entry. From any pod inside the cluster:'),
      code('bash', `# Full DNS name
curl http://my-app-svc.production.svc.cluster.local/api

# Short form (within same namespace)
curl http://my-app-svc/api

# Cross-namespace (must use namespace)
curl http://my-app-svc.other-namespace/api

# Check DNS from inside a pod
kubectl exec -it debug-pod -- nslookup my-app-svc`),
      note('tip', 'kube-dns / CoreDNS resolves these names. Every pod is automatically configured to use the cluster DNS resolver — no manual setup needed.'),
    ],
  },

  {
    id: 'ingress',
    group: 'networking',
    level: 'Intermediate',
    sectionNo: '11',
    category: 'Networking',
    title: 'Ingress & Ingress Controllers: HTTP Routing',
    body: [
      p(
        'A **LoadBalancer** Service gives you a cloud LB per service — expensive and doesn\'t support HTTP routing. **Ingress** is a K8s resource that defines HTTP/HTTPS routing rules. An **Ingress Controller** (nginx, Traefik, etc.) reads these rules and actually implements them, typically from a single cloud LB.',
      ),
      flow(
        [
          { label: 'Internet traffic' },
          { label: 'Cloud LoadBalancer', sub: 'single entry point (1 LB for all)' },
          { label: 'Ingress Controller Pod', sub: 'nginx / traefik / HAProxy' },
          { label: 'Routes by host/path', sub: 'api.example.com/users → users-svc' },
          { label: 'Backend Service', sub: 'users-svc ClusterIP' },
          { label: 'Pods', sub: 'your app' },
        ],
        { heading: 'Ingress routing: one LB, many services', tone: 'good' },
      ),
      code('yaml', `# Install nginx ingress controller (Helm)
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx

---
# Ingress resource — routing rules
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod  # auto TLS
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - api.example.com
      secretName: api-tls-cert          # cert-manager fills this
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /users
            pathType: Prefix
            backend:
              service:
                name: users-service
                port:
                  number: 80
          - path: /orders
            pathType: Prefix
            backend:
              service:
                name: orders-service
                port:
                  number: 80`),
      note('tip', '**cert-manager** is the standard tool for automatic TLS certificate provisioning from Let\'s Encrypt. Install it alongside your Ingress Controller — it watches for `cert-manager.io/cluster-issuer` annotations and automatically issues and renews certs.'),
    ],
  },

  {
    id: 'network-policies',
    group: 'networking',
    level: 'Intermediate',
    sectionNo: '12',
    category: 'Security',
    title: 'NetworkPolicies: Firewall Rules for Pods',
    body: [
      p(
        'By default in Kubernetes, **any pod can talk to any other pod** across any namespace — a flat, open network. If a pod is compromised, an attacker can freely probe your entire cluster. **NetworkPolicy** lets you define firewall rules at the pod level using label selectors.',
      ),
      note('warn', 'NetworkPolicies are only enforced if your CNI plugin supports them. Calico, Cilium, and Weave support them. Flannel (vanilla) does NOT — you need Calico installed alongside Flannel or use Cilium instead.'),
      code('yaml', `# 1. Default deny all ingress — good starting point for production
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}     # selects ALL pods in namespace
  policyTypes:
    - Ingress
    - Egress

---
# 2. Allow only the API service to reach the database
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-to-db
  namespace: production
spec:
  podSelector:
    matchLabels:
      role: database         # applies to DB pods
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              role: api      # only from API pods
      ports:
        - protocol: TCP
          port: 5432`),
      cards('Common NetworkPolicy Patterns', [
        { h: 'Default Deny', c: 'Apply to all pods in namespace. Then add explicit allow rules. Start secure, open what\'s needed.', chips: ['Best Practice'] },
        { h: 'Allow same namespace', c: 'Allow all pods within a namespace to talk to each other, but block cross-namespace traffic by default.', chips: ['Namespace isolation'] },
        { h: 'Allow monitoring', c: 'Allow Prometheus to scrape metrics from all pods (port 9090/8080) regardless of other policies.', chips: ['Observability'] },
        { h: 'Egress to external', c: 'Allow pods to reach external services (internet, cloud APIs) on specific ports. Block all other outbound.', chips: ['Egress control'] },
      ]),
    ],
  },

  // ─── PRODUCTION & SECURITY ──────────────────────────────────────────────
  {
    id: 'rbac',
    group: 'production',
    level: 'Intermediate',
    sectionNo: '13',
    category: 'Security',
    title: 'RBAC: Role-Based Access Control',
    body: [
      p(
        'RBAC is how you control WHO can do WHAT to which Kubernetes resources. By default, every pod gets a "default" service account with no permissions. You must explicitly grant access. In production, this is your first line of defense against lateral movement if a pod is compromised.',
      ),
      flow(
        [
          { label: 'Subject', sub: 'User / Group / ServiceAccount' },
          { label: 'RoleBinding', sub: 'grants Role in a namespace' },
          { label: 'Role', sub: 'rules: verbs + resources' },
          { label: 'API Resources', sub: 'pods, secrets, deployments...' },
        ],
        { heading: 'RBAC: Subject → Binding → Role → Resources', edges: ['is granted', 'which references', 'grants access to'] },
      ),
      code('yaml', `# 1. ServiceAccount — identity for a pod
apiVersion: v1
kind: ServiceAccount
metadata:
  name: backend-sa
  namespace: production

---
# 2. Role — what permissions
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: production
rules:
  - apiGroups: [""]         # "" = core API group (pods, services, secrets)
    resources: ["pods", "pods/log"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list"]

---
# 3. RoleBinding — connect the ServiceAccount to the Role
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: backend-pod-reader
  namespace: production
subjects:
  - kind: ServiceAccount
    name: backend-sa
    namespace: production
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io

---
# 4. Use the ServiceAccount in a Deployment
spec:
  template:
    spec:
      serviceAccountName: backend-sa   # pod now has these permissions`),
      cards('RBAC Best Practices', [
        { h: 'Principle of Least Privilege', c: 'Grant only the minimum permissions needed. Start with nothing and add.', chips: ['Security'] },
        { h: 'Never use cluster-admin broadly', c: '`cluster-admin` ClusterRole has full control. Treat it like root — only for cluster admins.', chips: ['Critical'] },
        { h: 'Audit with kubectl auth', c: '`kubectl auth can-i list pods --as=system:serviceaccount:prod:my-sa` — check what a SA can do.', chips: ['Debugging'] },
        { h: 'Role vs ClusterRole', c: 'Role is namespaced. Use ClusterRole only for cluster-wide resources (Nodes, PVs) or when you need cross-namespace access.', chips: ['Scoping'] },
      ]),
    ],
  },

  {
    id: 'autoscaling',
    group: 'production',
    level: 'Intermediate',
    sectionNo: '14',
    category: 'Scaling',
    title: 'Autoscaling: HPA, VPA & Cluster Autoscaler',
    body: [
      p(
        'Kubernetes has three autoscaling mechanisms that work at different levels. Understanding when to use each — and how they interact — is a key devops interview topic.',
      ),
      cards('Three Autoscaling Mechanisms', [
        {
          h: '📈 HPA — Horizontal Pod Autoscaler',
          c: 'Scales the NUMBER of pods based on metrics (CPU%, memory, custom). Best for stateless apps. Works with Deployments and StatefulSets.',
          chips: ['Pod count', 'CPU/Custom metrics'],
        },
        {
          h: '⬆️ VPA — Vertical Pod Autoscaler',
          c: 'Adjusts the CPU/memory REQUESTS of pods based on historical usage. Can restart pods to apply new resource sizes. Don\'t use VPA and HPA on the same metric simultaneously.',
          chips: ['Resource sizing', 'Auto-rightsizing'],
        },
        {
          h: '🌐 Cluster Autoscaler',
          c: 'Scales the NUMBER of nodes. If pods can\'t schedule (Pending) due to resource shortage, CA adds nodes. If nodes are underutilized, CA removes them. Works with cloud managed node groups.',
          chips: ['Node count', 'Cloud integration'],
        },
      ]),
      code('yaml', `# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70   # scale out when avg CPU > 70%
    - type: Resource
      resource:
        name: memory
        target:
          type: AverageValue
          averageValue: 200Mi      # scale out when avg memory > 200Mi`),
      flow(
        [
          { label: 'Traffic Spike' },
          { label: 'CPU > 70%', sub: 'HPA detects' },
          { label: 'HPA adds pods', sub: 'new pod Pending' },
          { label: 'No room on nodes', sub: 'CA detects Pending' },
          { label: 'CA adds Node', sub: 'cloud provisions VM' },
          { label: 'Pod scheduled', sub: 'serving traffic' },
        ],
        { heading: 'HPA + Cluster Autoscaler working together', tone: 'good' },
      ),
      note('tip', 'HPA requires **metrics-server** to be installed. For custom metrics (requests/sec, queue depth), you need Prometheus + KEDA (Kubernetes Event-Driven Autoscaling) or the custom metrics API adapter.'),
    ],
  },

  {
    id: 'namespaces-quotas',
    group: 'production',
    level: 'Intermediate',
    sectionNo: '15',
    category: 'Multi-tenancy',
    title: 'Namespaces, ResourceQuotas & LimitRanges',
    body: [
      p(
        'Namespaces provide logical partitioning within a cluster. Combined with **ResourceQuotas** (total resource budget for a namespace) and **LimitRanges** (default limits per pod/container), they let you share a cluster safely across teams or environments.',
      ),
      code('yaml', `# ResourceQuota — total limits for the namespace
apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-alpha-quota
  namespace: team-alpha
spec:
  hard:
    pods: "50"                        # max 50 pods
    requests.cpu: "10"                # total CPU requests
    requests.memory: "20Gi"           # total memory requests
    limits.cpu: "20"
    limits.memory: "40Gi"
    persistentvolumeclaims: "20"       # max PVCs
    services.loadbalancers: "2"        # max LoadBalancer services

---
# LimitRange — sets defaults and bounds per pod
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: team-alpha
spec:
  limits:
    - type: Container
      default:                   # applied if container has no limits
        cpu: "500m"
        memory: "256Mi"
      defaultRequest:            # applied if container has no requests
        cpu: "100m"
        memory: "128Mi"
      max:                       # no container can exceed these
        cpu: "4"
        memory: "4Gi"
      min:                       # no container can go below these
        cpu: "50m"
        memory: "64Mi"`),
      note('tip', 'A good default: apply a LimitRange in every namespace so pods without explicit resource specs still get sensible defaults. Without this, any pod without limits can consume unlimited node resources.'),
    ],
  },

  {
    id: 'helm',
    group: 'production',
    level: 'Intermediate',
    sectionNo: '16',
    category: 'Packaging',
    title: 'Helm: Kubernetes Package Manager',
    body: [
      p(
        '**Helm** is the package manager for Kubernetes. If kubectl apply is like copying files by hand, Helm is like `apt install` or `npm install` — it installs complex applications with a single command, manages upgrades, and tracks what\'s installed.',
      ),
      analogy(
        'A Helm Chart is like an npm package for Kubernetes. The chart defines the shape of the deployment (deployments, services, ingress, RBAC). A `values.yaml` is like a config file — you override it per environment. `helm install` installs it, `helm upgrade` updates it, `helm rollback` reverts it.',
      ),
      code('bash', `# Add a chart repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Search for charts
helm search repo postgres

# Install a chart (creates a "release")
helm install my-postgres bitnami/postgresql \
  --namespace databases \
  --create-namespace \
  --set auth.postgresPassword=secretpassword \
  --set primary.persistence.size=50Gi

# Check what's installed
helm list --all-namespaces

# Upgrade with new values
helm upgrade my-postgres bitnami/postgresql \
  --set primary.resources.limits.memory=4Gi

# Rollback to previous release
helm rollback my-postgres 1

# Uninstall
helm uninstall my-postgres`),
      code('yaml', `# Structure of a custom Helm chart
my-chart/
  Chart.yaml           # chart metadata (name, version, description)
  values.yaml          # default configuration values
  templates/
    deployment.yaml    # uses Go template syntax
    service.yaml
    ingress.yaml
    _helpers.tpl       # reusable template functions

# Example template using values
# templates/deployment.yaml
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          resources:
            {{- toYaml .Values.resources | nindent 12 }}`),
      note('tip', 'For GitOps (ArgoCD, Flux), you commit Helm values files to git and let the CD tool reconcile. ArgoCD can install Helm charts from a git repo or chart registry and detects drift automatically.'),
    ],
  },

  {
    id: 'pod-scheduling',
    group: 'production',
    level: 'Advanced',
    sectionNo: '17',
    category: 'Scheduling',
    title: 'Advanced Scheduling: Taints, Tolerations & Affinity',
    body: [
      p(
        'The default scheduler assigns pods to nodes based on resource availability. But production clusters need more control: GPU workloads only on GPU nodes, databases preferring high-memory nodes, or microservices spread across availability zones for resilience.',
      ),
      cards('Scheduling Controls', [
        {
          h: 'Taints & Tolerations',
          c: 'Taints repel pods from nodes. A pod must have a matching Toleration to be scheduled on a tainted node. Used for dedicated node pools (GPU nodes, spot instances).',
          chips: ['Node dedication'],
        },
        {
          h: 'nodeSelector',
          c: 'Simple key-value label matching. Pod only schedules on nodes with matching labels. Hard requirement — if no node matches, pod stays Pending.',
          chips: ['Simple', 'Hard requirement'],
        },
        {
          h: 'Node Affinity',
          c: 'More expressive nodeSelector using In/NotIn/Exists operators. Can be required (hard) or preferred (soft — tries but doesn\'t block scheduling).',
          chips: ['Flexible', 'Soft/Hard'],
        },
        {
          h: 'Pod Affinity/Anti-Affinity',
          c: 'Schedule pods relative to OTHER pods. Anti-affinity spreads replicas across nodes/zones for resilience. Affinity co-locates pods that talk a lot (reduces latency).',
          chips: ['Topology spread', 'HA'],
        },
      ]),
      code('yaml', `# Taint a node (e.g., dedicated to GPU workloads)
kubectl taint nodes gpu-node-1 dedicated=gpu:NoSchedule

# Toleration in pod spec to run on tainted node
spec:
  tolerations:
    - key: "dedicated"
      operator: "Equal"
      value: "gpu"
      effect: "NoSchedule"

---
# Node Affinity — required + preferred
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:  # HARD
        nodeSelectorTerms:
          - matchExpressions:
              - key: kubernetes.io/arch
                operator: In
                values: ["amd64"]
      preferredDuringSchedulingIgnoredDuringExecution:  # SOFT
        - weight: 100
          preference:
            matchExpressions:
              - key: node.kubernetes.io/instance-type
                operator: In
                values: ["m5.2xlarge", "m5.4xlarge"]

---
# Pod Anti-Affinity — spread replicas across nodes
spec:
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        - labelSelector:
            matchLabels:
              app: my-app         # don't schedule on node that already has my-app
          topologyKey: kubernetes.io/hostname`),
      note('tip', '**TopologySpreadConstraints** is the modern way to spread pods across zones/nodes — more flexible than anti-affinity. Use `topologyKey: topology.kubernetes.io/zone` to spread across AZs automatically.'),
    ],
  },

  {
    id: 'observability',
    group: 'production',
    level: 'Intermediate',
    sectionNo: '18',
    category: 'Observability',
    title: 'Observability: Logging, Metrics & Tracing',
    body: [
      p(
        'You can\'t manage what you can\'t see. In Kubernetes, the three pillars of observability are **Logs** (what happened), **Metrics** (how the system is behaving), and **Traces** (how requests flow through distributed services). Each requires different tooling.',
      ),
      cards('The Observability Stack', [
        {
          h: '📋 Logs — EFK/ELK Stack',
          c: 'Fluentd/Fluent Bit DaemonSet collects logs from all nodes → Elasticsearch stores them → Kibana/Grafana visualizes. Alternatively: Loki (cheaper, label-based) + Grafana.',
          chips: ['Fluentd', 'Loki', 'Grafana'],
        },
        {
          h: '📊 Metrics — Prometheus + Grafana',
          c: 'Prometheus scrapes metrics from pods (/metrics endpoint). kube-state-metrics exposes K8s object metrics. Grafana visualizes dashboards. Alertmanager fires alerts to PagerDuty/Slack.',
          chips: ['Prometheus', 'Grafana', 'Alertmanager'],
        },
        {
          h: '🔍 Tracing — Jaeger / Tempo',
          c: 'Distributed tracing shows the path of a single request across microservices. OpenTelemetry SDK instruments your code. Jaeger/Tempo collects and visualizes traces.',
          chips: ['Jaeger', 'OpenTelemetry'],
        },
      ]),
      code('yaml', `# Prometheus scraping — annotate your pods
metadata:
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "8080"
    prometheus.io/path: "/metrics"

---
# Fluent Bit DaemonSet (simplified)
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluent-bit
  namespace: logging
spec:
  selector:
    matchLabels:
      app: fluent-bit
  template:
    spec:
      tolerations:
        - operator: Exists         # run on ALL nodes including control plane
      containers:
        - name: fluent-bit
          image: fluent/fluent-bit:latest
          volumeMounts:
            - name: varlog
              mountPath: /var/log
      volumes:
        - name: varlog
          hostPath:
            path: /var/log`),
      note('tip', 'The kube-prometheus-stack Helm chart installs Prometheus Operator, Grafana, Alertmanager, and kube-state-metrics in one command. This is the standard starting point for K8s observability.'),
    ],
  },

  {
    id: 'gitops',
    group: 'production',
    level: 'Advanced',
    sectionNo: '19',
    category: 'CI/CD',
    title: 'GitOps: ArgoCD & Flux',
    body: [
      p(
        '**GitOps** is an operational pattern where your Git repository is the single source of truth for cluster state. You don\'t `kubectl apply` directly in production — instead, a GitOps operator (ArgoCD or Flux) continuously syncs the cluster to match what\'s in Git. Git commits are deployments. Git reverts are rollbacks.',
      ),
      analogy(
        'Traditional CI/CD: CI builds the image, CD script runs kubectl apply directly into the cluster. GitOps: CI builds + pushes image + updates the image tag in a Git repo. The GitOps operator detects the Git change and syncs the cluster. The cluster pulls its state from Git — it\'s "pull-based" not "push-based".',
      ),
      stackCompare(
        {
          title: 'Traditional Push-based CD',
          layers: [
            { label: 'Dev pushes code' },
            { label: 'CI builds image' },
            { label: 'CD script runs kubectl' },
            { label: 'Cluster updated', tone: 'writable' },
          ],
        },
        {
          title: 'GitOps (Pull-based)',
          layers: [
            { label: 'Dev pushes code' },
            { label: 'CI builds + updates Git' },
            { label: 'ArgoCD/Flux detects change', tone: 'writable' },
            { label: 'Cluster self-reconciles' },
          ],
        },
      ),
      code('yaml', `# ArgoCD Application — declares that this app lives in Git
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/my-org/k8s-manifests
    targetRevision: main
    path: apps/my-app/production     # folder in git with K8s yamls
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true      # delete resources removed from Git
      selfHeal: true   # revert manual kubectl changes automatically
    syncOptions:
      - CreateNamespace=true`),
      cards('GitOps Benefits', [
        { h: 'Audit Trail', c: 'Every change is a Git commit with author + timestamp. kubectl apply history is often unclear.', chips: ['Compliance'] },
        { h: 'Disaster Recovery', c: 'If you lose a cluster, recreate it and point ArgoCD at your Git repo — cluster is rebuilt automatically.', chips: ['DR'] },
        { h: 'Self-healing', c: 'Manual kubectl changes are automatically reverted. Config drift is impossible when selfHeal is on.', chips: ['Reliability'] },
        { h: 'Multi-env promotions', c: 'Promote dev→staging→prod by merging/copying manifests between Git branches or folders.', chips: ['Multi-env'] },
      ]),
    ],
  },

  {
    id: 'troubleshooting',
    group: 'production',
    level: 'Intermediate',
    sectionNo: '20',
    category: 'Operations',
    title: 'Troubleshooting: The Cluster Debug Wizard',
    body: [
      p(
        'Production incidents happen. The ability to diagnose and fix cluster issues quickly and calmly is what separates senior DevOps engineers from beginners. This interactive wizard walks you through the most common K8s failure scenarios.',
      ),
      wizard(),
      p('### Common Debugging Cheatsheet'),
      code('bash', `# === Pod Debugging ===
kubectl describe pod <name>              # events + conditions (START HERE)
kubectl logs <pod> --previous            # crash logs
kubectl exec -it <pod> -- sh            # shell inside
kubectl debug -it <pod> --image=busybox  # ephemeral debug container

# === Service Connectivity ===
kubectl get endpoints <svc>             # pod IPs behind service (empty = label mismatch)
kubectl run curl --image=curlimages/curl -it --rm -- curl http://<svc>:<port>

# === Networking ===
kubectl get networkpolicies -A
kubectl describe networkpolicy <name>

# === Node Issues ===
kubectl get nodes
kubectl describe node <name>            # conditions: MemoryPressure, DiskPressure
kubectl drain <node> --ignore-daemonsets --delete-emptydir-data  # evacuate node
kubectl cordon <node>                   # stop scheduling new pods

# === Events (timeline of what happened) ===
kubectl get events --sort-by=.lastTimestamp -n production

# === Resource Usage ===
kubectl top nodes
kubectl top pods --containers`),
    ],
  },

  // ─── INTERVIEW ────────────────────────────────────────────────────────────
  {
    id: 'interview-fund',
    group: 'interview',
    level: 'Interview',
    title: 'Interview Q&A — Fundamentals',
    body: [],
  },
  {
    id: 'interview-adv',
    group: 'interview',
    level: 'Interview',
    title: 'Interview Q&A — Advanced & Scenario',
    body: [],
  },
]
