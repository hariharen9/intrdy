import type { QAItem } from '@/entities/topic'

export const k8sCrashQAFundamentals: QAItem[] = [
  [
    "What is the fundamental difference between a Pod and a Container?",
    "A container is a single isolated process. A Pod is the smallest deployable unit in Kubernetes that encapsulates one or more tightly coupled containers sharing the same Network namespace (IP address and localhost) and storage volumes."
  ],
  [
    "Why should you almost never create standalone Pods directly in production?",
    "Standalone Pods are ephemeral and self-healing is not managed. If the worker node hosting the Pod dies, the Pod is lost forever. Using a Deployment or StatefulSet ensures a controller continuously reconciles desired replica counts and reschedules failed Pods."
  ],
  [
    "What is the difference between ClusterIP, NodePort, and LoadBalancer Services?",
    "• ClusterIP: Internal-only cluster IP (default), accessible only inside the cluster.\n• NodePort: Exposes a dedicated port (30000-32767) on every node IP for external access.\n• LoadBalancer: Provisions an external cloud load balancer (e.g. AWS ALB/NLB) that routes traffic to NodePorts/ClusterIP."
  ],
  [
    "What is the difference between a Liveness Probe and a Readiness Probe?",
    "• Liveness Probe: Checks if the application process is alive. If it fails, Kubernetes restarts the container.\n• Readiness Probe: Checks if the application is ready to accept user traffic. If it fails, Kubernetes stops routing Service traffic to that Pod until it passes, without restarting it."
  ]
]

export const k8sCrashQAAdvanced: QAItem[] = [
  [
    "What is the difference between resource \"requests\" and \"limits\"?",
    "• Requests: Guaranteed minimum resources reserved by the scheduler to place the Pod on a node.\n• Limits: Maximum cap a container can consume. Exceeding CPU limit causes CPU throttling; exceeding Memory limit causes the container to be killed with OOMKilled (Exit Code 137)."
  ],
  [
    "How do ConfigMaps and Secrets get injected into containers?",
    "They can be injected either as Environment Variables (evaluated at container startup) or mounted as read-only filesystem Volumes (which can update dynamically when the ConfigMap is modified in the cluster)."
  ]
]
