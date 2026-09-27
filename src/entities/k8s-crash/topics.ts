import type { Topic, TopicGroup } from '@/entities/topic'

export const K8S_CRASH_GROUPS: TopicGroup[] = [
  {
    "id": "part-1",
    "name": "Part 1: Architecture & Core Primitives"
  },
  {
    "id": "part-2",
    "name": "Part 2: Workloads & Cluster Networking"
  },
  {
    "id": "part-3",
    "name": "Part 3: Config, Storage & Probes"
  },
  {
    "id": "part-4",
    "name": "Part 4: Troubleshooting & Cheat Sheet"
  }
]

export const K8S_CRASH_TOPICS: Topic[] = [
  {
    "id": "k8s-arch",
    "title": "1. Kubernetes Architecture in 3 Minutes",
    "group": "part-1",
    "level": "Basics",
    "sectionNo": "01",
    "category": "Architecture",
    "body": [
      {
        "t": "html",
        "html": "<div class=\"callout callout-info\"><div class=\"callout-title\">The Core Mental Model: Desired State vs Actual State</div><p>Kubernetes is a declarative engine. You tell it: <em>\"I want 3 replicas of my web app running.\"</em> The <strong>Control Plane</strong> stores this desired state in <strong>etcd</strong> and continuously works to make the cluster's actual state match your declaration.</p></div><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 my-4\"><div class=\"p-4 rounded-xl border border-[var(--border)] bg-[var(--panel2)]\"><h4 class=\"font-bold text-[var(--accent)] mb-2\">🧠 Control Plane (Master Node)</h4><ul class=\"text-xs space-y-1.5 text-[var(--muted)]\"><li><strong>kube-apiserver:</strong> The gateway. All CLI commands & controllers talk only to this API.</li><li><strong>etcd:</strong> High-availability key-value store holding the complete cluster state.</li><li><strong>kube-scheduler:</strong> Selects the best healthy worker node to host new Pods.</li><li><strong>kube-controller-manager:</strong> Runs reconciliation loops (Deployments, Nodes, Endpoints).</li></ul></div><div class=\"p-4 rounded-xl border border-[var(--border)] bg-[var(--panel2)]\"><h4 class=\"font-bold text-sky-400 mb-2\">⚙️ Worker Nodes (Compute)</h4><ul class=\"text-xs space-y-1.5 text-[var(--muted)]\"><li><strong>kubelet:</strong> The node agent that ensures containers described in PodSpecs are running.</li><li><strong>kube-proxy:</strong> Maintains IP packet routing rules (iptables/IPVS) for Services.</li><li><strong>Container Runtime:</strong> (containerd/CRI-O) downloads images and runs containers.</li></ul></div></div>"
      },
      {
        "t": "code",
        "lang": "bash",
        "c": "# Check cluster nodes status\nkubectl get nodes -o wide\n\n# View control plane system pods\nkubectl get pods -n kube-system\n\n# Get cluster info and API endpoint\nkubectl cluster-info"
      }
    ]
  },
  {
    "id": "k8s-pods",
    "title": "2. The Atom of Kubernetes: Pods",
    "group": "part-1",
    "level": "Basics",
    "sectionNo": "02",
    "category": "Workloads",
    "body": [
      {
        "t": "p",
        "c": "A Pod is the smallest atomic unit in Kubernetes. Containers inside the same Pod share the same network namespace (meaning they can communicate via localhost on different ports) and can share local volume mounts."
      },
      {
        "t": "code",
        "lang": "yaml",
        "c": "apiVersion: v1\nkind: Pod\nmetadata:\n  name: nginx-demo\n  labels:\n    app: web\nspec:\n  containers:\n  - name: nginx\n    image: nginx:1.25-alpine\n    ports:\n    - containerPort: 80"
      },
      {
        "t": "code",
        "lang": "bash",
        "c": "# Create a pod imperatively (for quick tests)\nkubectl run temp-test --image=curlimages/curl -- rm -rf /\n\n# Apply the declarative manifest\nkubectl apply -f pod.yaml\n\n# View pod details & event history\nkubectl describe pod nginx-demo\n\n# View logs & stream\nkubectl logs nginx-demo -f\n\n# Exec into running pod\nkubectl exec -it nginx-demo -- sh"
      }
    ]
  },
  {
    "id": "k8s-manifests",
    "title": "3. Anatomy of a Kubernetes Manifest",
    "group": "part-1",
    "level": "Basics",
    "sectionNo": "03",
    "category": "Declarative YAML",
    "body": [
      {
        "t": "html",
        "html": "<div class=\"p-4 rounded-xl border border-[var(--border)] bg-[var(--panel2)]\"><h4 class=\"font-bold text-emerald-400 mb-2\">The Universal 4 Fields:</h4><ol class=\"text-xs space-y-2 text-[var(--text)] list-decimal pl-4\"><li><strong>apiVersion:</strong> Which API version schemas are used (e.g. <code>v1</code>, <code>apps/v1</code>, <code>networking.k8s.io/v1</code>).</li><li><strong>kind:</strong> The resource type (e.g. <code>Pod</code>, <code>Deployment</code>, <code>Service</code>, <code>ConfigMap</code>).</li><li><strong>metadata:</strong> Identification data (<code>name</code>, <code>namespace</code>, <code>labels</code>, <code>annotations</code>).</li><li><strong>spec:</strong> The desired specification (containers, replicas, ports, volumes).</li></ol></div>"
      },
      {
        "t": "code",
        "lang": "bash",
        "c": "# Generate a clean Deployment YAML without deploying it\nkubectl create deployment my-app --image=nginx:alpine --replicas=3 --dry-run=client -o yaml > deployment.yaml\n\n# Generate a Service YAML linking to my-app\nkubectl expose deployment my-app --port=80 --target-port=80 --dry-run=client -o yaml > service.yaml"
      }
    ]
  },
  {
    "id": "k8s-deployments",
    "title": "4. Deployments & Zero-Downtime Rollouts",
    "group": "part-2",
    "level": "Intermediate",
    "sectionNo": "04",
    "category": "Workloads",
    "body": [
      {
        "t": "p",
        "c": "Deployments manage ReplicaSets, which manage Pods. If a Pod crashes or node reboots, the Deployment automatically creates a replacement. When updating image versions, Deployments perform a zero-downtime Rolling Update."
      },
      {
        "t": "code",
        "lang": "yaml",
        "c": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api-service\n  labels:\n    app: api\nspec:\n  replicas: 3\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxSurge: 1        # can create 1 extra pod during rollout\n      maxUnavailable: 0  # guarantees 3 pods always available\n  selector:\n    matchLabels:\n      app: api\n  template:\n    metadata:\n      labels:\n        app: api\n    spec:\n      containers:\n      - name: api\n        image: mycompany/api:v1.0.0\n        ports:\n        - containerPort: 8080"
      },
      {
        "t": "code",
        "lang": "bash",
        "c": "# Scale replicas up/down\nkubectl scale deployment api-service --replicas=5\n\n# Update image (triggers rolling update)\nkubectl set image deployment/api-service api=mycompany/api:v2.0.0\n\n# Watch rollout progress\nkubectl rollout status deployment/api-service\n\n# Rollback to previous version if bug found!\nkubectl rollout undo deployment/api-service"
      }
    ]
  },
  {
    "id": "k8s-services",
    "title": "5. Services & Internal DNS",
    "group": "part-2",
    "level": "Intermediate",
    "sectionNo": "05",
    "category": "Networking",
    "body": [
      {
        "t": "p",
        "c": "Pod IPs are ephemeral and change on every restart. A Service provides a stable IP address and CoreDNS name, automatically load balancing requests across all Pods matching its label selector."
      },
      {
        "t": "code",
        "lang": "yaml",
        "c": "apiVersion: v1\nkind: Service\nmetadata:\n  name: api-service\nspec:\n  type: ClusterIP # Default: internal cluster access only\n  selector:\n    app: api      # Routes to pods with label 'app: api'\n  ports:\n  - port: 80       # Port the Service listens on\n    targetPort: 8080 # Port the container listens on"
      },
      {
        "t": "html",
        "html": "<div class=\"p-3 rounded-lg border border-[var(--border)] bg-[var(--panel)] text-xs text-[var(--muted)]\"><strong>Internal CoreDNS Resolution:</strong> Any Pod in the same namespace can reach this service simply via <code>http://api-service:80</code>. Across namespaces: <code>http://api-service.default.svc.cluster.local</code>.</div>"
      }
    ]
  },
  {
    "id": "k8s-ingress",
    "title": "6. Ingress: Layer 7 Routing & SSL",
    "group": "part-2",
    "level": "Intermediate",
    "sectionNo": "06",
    "category": "Networking",
    "body": [
      {
        "t": "p",
        "c": "While a LoadBalancer Service creates a costly cloud load balancer per service, an Ingress Controller (like NGINX or Traefik) uses a single IP/Load Balancer to route HTTP/HTTPS traffic to dozens of internal Services based on hostname or URI path."
      },
      {
        "t": "code",
        "lang": "yaml",
        "c": "apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: main-ingress\n  annotations:\n    kubernetes.io/ingress.class: nginx\nspec:\n  rules:\n  - host: app.example.com\n    http:\n      paths:\n      - path: /api\n        pathType: Prefix\n        backend:\n          service:\n            name: api-service\n            port:\n              number: 80\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: frontend-service\n            port:\n              number: 80"
      }
    ]
  },
  {
    "id": "k8s-config-secrets",
    "title": "7. ConfigMaps & Secrets",
    "group": "part-3",
    "level": "Intermediate",
    "sectionNo": "07",
    "category": "Configuration",
    "body": [
      {
        "t": "p",
        "c": "Never hardcode environment configs or credentials inside container images. Use ConfigMaps for non-sensitive data (URLs, flags) and Secrets for sensitive data (API keys, passwords)."
      },
      {
        "t": "code",
        "lang": "yaml",
        "c": "apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: app-config\ndata:\n  ENVIRONMENT: \"production\"\n  LOG_LEVEL: \"info\"\n---\napiVersion: v1\nkind: Secret\nmetadata:\n  name: app-secret\ntype: Opaque\nstringData:\n  DB_PASSWORD: \"SuperSecretPassword123!\""
      }
    ]
  },
  {
    "id": "k8s-storage",
    "title": "8. Persistent Volumes & PVCs",
    "group": "part-3",
    "level": "Intermediate",
    "sectionNo": "08",
    "category": "Storage",
    "body": [
      {
        "t": "p",
        "c": "Container storage is ephemeral by default — files written are lost when the container restarts. PersistentVolumes (PV) represent cluster storage, while PersistentVolumeClaims (PVC) are user requests for storage."
      },
      {
        "t": "code",
        "lang": "yaml",
        "c": "apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: db-data-pvc\nspec:\n  accessModes:\n    - ReadWriteOnce\n  resources:\n    requests:\n      storage: 10Gi\n---\n# In your Pod/Deployment spec:\nspec:\n  volumes:\n  - name: db-storage\n    persistentVolumeClaim:\n      claimName: db-data-pvc\n  containers:\n  - name: postgres\n    image: postgres:15\n    volumeMounts:\n    - name: db-storage\n      mountPath: /var/lib/postgresql/data"
      }
    ]
  },
  {
    "id": "k8s-probes-limits",
    "title": "9. Health Probes, Requests & Limits",
    "group": "part-3",
    "level": "Intermediate",
    "sectionNo": "09",
    "category": "Reliability",
    "body": [
      {
        "t": "code",
        "lang": "yaml",
        "c": "spec:\n  containers:\n  - name: web\n    image: web:v1\n    resources:\n      requests:\n        cpu: \"100m\"     # 0.1 CPU core guaranteed\n        memory: \"128Mi\" # 128 MB RAM reserved\n      limits:\n        cpu: \"500m\"     # Throttle if > 0.5 CPU core\n        memory: \"256Mi\" # OOMKill if > 256 MB RAM\n    readinessProbe:\n      httpGet:\n        path: /ready\n        port: 8080\n      initialDelaySeconds: 5\n      periodSeconds: 5\n    livenessProbe:\n      httpGet:\n        path: /healthz\n        port: 8080\n      initialDelaySeconds: 15\n      periodSeconds: 10"
      }
    ]
  },
  {
    "id": "k8s-wizard-topic",
    "title": "10. Interactive Pod Triage & Diagnostic Wizard",
    "group": "part-4",
    "level": "Advanced",
    "sectionNo": "10",
    "category": "Troubleshooting",
    "body": [
      {
        "t": "p",
        "c": "Select the symptoms of your failing Pod below to follow the guided step-by-step diagnostic workflow."
      },
      {
        "t": "wizard"
      }
    ]
  },
  {
    "id": "k8s-quiz-cheat",
    "title": "11. Knowledge Check & Ultimate kubectl Cheat Sheet",
    "group": "part-4",
    "level": "Advanced",
    "sectionNo": "11",
    "category": "Reference",
    "body": [
      {
        "t": "quiz",
        "questions": [
          {
            "q": "What happens when a container exceeds its configured memory limit?",
            "options": [
              "Kubernetes throttles memory bandwidth and slows down the CPU.",
              "The Linux kernel OOM killer terminates the container with exit code 137, triggering a Pod restart.",
              "Kubernetes automatically adds more memory from neighboring nodes.",
              "The Service stops routing traffic to the Pod but keeps it running."
            ],
            "correct": 1,
            "explain": "When a container exceeds memory limits, it is killed with an OOMKilled (Exit Code 137) status. CPU, unlike memory, is throttled rather than terminated."
          }
        ]
      },
      {
        "t": "cheatsheet",
        "items": [
          {
            "term": "kubectl get pods,svc,deploy -o wide",
            "def": "List core workloads with IP and node info"
          },
          {
            "term": "kubectl describe pod <pod-name>",
            "def": "Inspect events, failure messages, and state"
          },
          {
            "term": "kubectl logs -f <pod-name> -c <container>",
            "def": "Stream real-time container stdout/stderr"
          },
          {
            "term": "kubectl logs <pod-name> --previous",
            "def": "View logs from the previously crashed instance"
          },
          {
            "term": "kubectl exec -it <pod-name> -- sh",
            "def": "Open interactive shell inside pod container"
          },
          {
            "term": "kubectl port-forward svc/<svc-name> 8080:80",
            "def": "Forward local port 8080 to cluster Service port 80"
          },
          {
            "term": "kubectl top nodes / kubectl top pods",
            "def": "View live CPU & memory utilization"
          },
          {
            "term": "kubectl delete pod <pod-name> --now",
            "def": "Force restart pod (Deployment will recreate it)"
          }
        ]
      }
    ]
  }
]
