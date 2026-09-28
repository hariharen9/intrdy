# 📋 DevOps Interview Preparation Roadmap & Todo List

A structured, phased roadmap covering all the remaining critical domains required to achieve 100% readiness for Senior DevOps, Cloud, and Platform Engineering interviews.

---

## 🎯 Phase 1: Linux Internals, Systems & Shell Automation

- [ ] **1.1 Linux Process Management & Signals**
  - [ ] Process states (`R`, `S`, `D`, `Z` - Zombie / Orphan processes)
  - [ ] Signals & lifecycle: `SIGTERM` (15), `SIGKILL` (9), `SIGINT` (2), `SIGHUP` (1)
  - [ ] Monitoring & profiling: `ps aux`, `top`, `htop`, `pidstat`, `strace`, `lsof`
- [ ] **1.2 Linux Memory & File Systems**
  - [ ] Virtual Memory, Page Cache, Swap, and OOM Killer (`oom_score_adj`)
  - [ ] Inodes, Hard vs Soft Symlinks, File descriptors (`/proc/<pid>/fd`)
  - [ ] Disk analysis & troubleshooting: `df -h`, `du -sh`, `iostat`, `ncdu`
  - [ ] Permissions & Ownership: `chmod` (octal vs symbolic), `chown`, `umask`, SUID/SGID/Sticky bit
- [ ] **1.3 Systemd & Services Management**
  - [ ] Unit files (`.service`, `.timer`, `.socket`), service dependency graphs
  - [ ] `systemctl` operations & reading logs with `journalctl` (filtering by unit, time, priority)
- [ ] **1.4 Production Shell (Bash) Scripting**
  - [ ] Defensive scripting flags: `set -euo pipefail` & traps
  - [ ] Text processing power tools: `awk`, `sed`, `grep`/`ripgrep`, `cut`, `sort`, `uniq`, `xargs`
  - [ ] Parameter expansion, exit codes, subshells, and cron job scheduling

---

## ☁️ Phase 2: Cloud Engineering & Architecture (AWS Focus)

- [ ] **2.1 Cloud Identity & Access Management (IAM)**
  - [ ] IAM Users, Groups, Roles, Policies (Identity-based vs Resource-based)
  - [ ] Trust Policies & `sts:AssumeRole`, Instance Profiles, Cross-Account access
  - [ ] Principle of Least Privilege and IAM Permission Boundaries
- [ ] **2.2 Cloud Networking & VPC Infrastructure**
  - [ ] VPC Architecture: Public Subnets vs Private Subnets, CIDR block sizing
  - [ ] Route Tables, Internet Gateways (IGW), NAT Gateways vs NAT Instances
  - [ ] Security Groups (Stateful) vs Network ACLs (Stateless)
  - [ ] VPC Peering, Transit Gateway, VPC Endpoints (Interface / Gateway for S3 & DynamoDB)
- [ ] **2.3 Managed Compute & Storage**
  - [ ] EC2 Auto Scaling Groups (ASG), Launch Templates, Spot vs On-Demand instances
  - [ ] AWS Elastic Kubernetes Service (EKS): Control Plane, Managed Node Groups, Fargate profiles
  - [ ] S3: Bucket policies, CORS, Encryption (SSE-S3, SSE-KMS), Lifecycle rules, Versioning
- [ ] **2.4 Load Balancing & DNS**
  - [ ] Elastic Load Balancers: ALB (L7 HTTP/HTTPS) vs NLB (L4 TCP/UDP)
  - [ ] Route 53: Record types (`A`, `AAAA`, `CNAME`, `ALIAS`, `TXT`, `MX`), Routing policies (Latency, Geolocation, Weighted, Failover)

---

## 📊 Phase 3: Observability, Monitoring & SRE

- [x] **3.1 Metrics & Alerting with Prometheus & Grafana**
  - [x] Prometheus Architecture: Pull-based scraping, Exporters (Node Exporter, kube-state-metrics), TSDB
  - [x] PromQL fundamentals: Rate, Irate, Histograms, Quantiles, Gauges, Counters
  - [x] Alertmanager: Alert routing, grouping, silencing, and notification channels (Slack, PagerDuty)
  - [x] Grafana: Dashboard design, variable templating, alerting rules
- [x] **3.2 Centralized Logging**
  - [x] Log collection architectures: Fluentbit / Promtail / Vector agents
  - [x] Log aggregation backends: Grafana Loki vs ELK/EFK (Elasticsearch, Logstash/Fluentd, Kibana)
  - [x] Structured JSON logging and retention policies
- [x] **3.3 Distributed Tracing & OpenTelemetry (OTel)**
  - [x] Spans, Trace IDs, Baggage, and Context Propagation
  - [x] OpenTelemetry Collector architecture and Jaeger/Tempo backends
- [x] **3.4 SRE Core Principles**
  - [x] The 4 Golden Signals: Latency, Traffic, Errors, Saturation
  - [x] Defining SLI (Indicator), SLO (Objective), and SLA (Agreement)
  - [x] Error Budgets, Incident Management, and Blameless Post-Mortems

---

## 🔄 Phase 4: Modern GitOps & Cloud-Native Delivery

- [ ] **4.1 GitOps Workflows with ArgoCD / Flux**
  - [ ] Push-based CI/CD vs Pull-based GitOps mental models
  - [ ] ArgoCD Architecture: Application CRDs, App-of-Apps pattern, ApplicationSet
  - [ ] Sync policies (Auto-sync, Self-heal, Prune), Diff detection, and drift management
- [ ] **4.2 GitHub Actions & Modern Pipeline Automation**
  - [ ] Workflow triggers (`push`, `pull_request`, `workflow_dispatch`, `schedule`)
  - [ ] Jobs, matrix builds, reusable composite actions, and custom runners
  - [ ] OIDC-based authentication to AWS/GCP (eliminating long-lived secret keys)
- [ ] **4.3 Kubernetes Templating & Packaging**
  - [ ] **Helm**: Charts, `values.yaml`, templates, built-in functions, Chart hooks, versioning
  - [ ] **Kustomize**: Bases, overlays, patches, `kustomization.yaml` for multi-environment deployments

---

## 🌐 Phase 5: Networking & Web Infrastructure Fundamentals

- [ ] **5.1 Protocols & Web Basics**
  - [ ] OSI 7-Layer vs TCP/IP 4-Layer models
  - [ ] TCP 3-Way Handshake & Connection Teardown (SYN, SYN-ACK, ACK, FIN)
  - [ ] HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)
- [ ] **5.2 Encryption, TLS & Certificates**
  - [ ] Public Key Infrastructure (PKI), Asymmetric vs Symmetric encryption
  - [ ] TLS 1.3 Handshake flow, certificate chains, and SNI (Server Name Indication)
  - [ ] Automated certificate renewal with Kubernetes `cert-manager` & Let's Encrypt
- [ ] **5.3 Ingress Controllers & Reverse Proxies**
  - [ ] NGINX / Envoy / Traefik: Proxying, header manipulation, SSL termination, rate limiting, and timeouts
  - [ ] CDN architecture & edge caching (CloudFront / Cloudflare)

---

## 🔐 Phase 6: DevSecOps & Security

- [ ] **6.1 Secrets Management**
  - [ ] HashiCorp Vault / AWS Secrets Manager
  - [ ] Kubernetes Secrets Security: SealedSecrets, External Secrets Operator (ESO), Vault Agent sidecar
- [ ] **6.2 Container & Supply Chain Security**
  - [ ] Container image vulnerability scanning: Trivy, Grype, Snyk
  - [ ] Distroless & rootless containers, multi-stage minimal attack surface
  - [ ] Image signing & verification with Cosign / Sigstore
- [ ] **6.3 Cloud-Native & Kubernetes Security**
  - [ ] Kubernetes RBAC: Roles, ClusterRoles, RoleBindings, ServiceAccounts
  - [ ] `NetworkPolicies`: Pod-to-Pod traffic isolation and egress lockdown
  - [ ] Admission Controllers: OPA Gatekeeper / Kyverno for policy enforcement

---

## 🏗️ Phase 7: DevOps System Design & Live Scenarios

- [ ] **7.1 Deployment Strategies & Rollouts**
  - [ ] Rolling updates vs Recreate
  - [ ] Blue/Green deployment architecture
  - [ ] Canary releases with automated rollbacks using metrics (Argo Rollouts / Flagger)
- [ ] **7.2 High Availability & Disaster Recovery**
  - [ ] Multi-AZ vs Multi-Region architecture
  - [ ] Recovery Time Objective (RTO) vs Recovery Point Objective (RPO)
  - [ ] Database backup, replication, and failover strategies
- [ ] **7.3 Production Triage & Scenario Drills**
  - [ ] High CPU / High Memory / OOMKilled investigation drills
  - [ ] Network packet loss & DNS resolution timeout troubleshooting
  - [ ] 502 Bad Gateway vs 504 Gateway Timeout root-cause analysis
