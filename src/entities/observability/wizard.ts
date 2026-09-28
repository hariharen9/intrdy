import type { WizardNode } from '@/entities/topic'

export const OBSERVABILITY_WIZARD_TREE: Record<string, WizardNode> = {
  start: {
    q: 'What type of Observability or SRE incident are you diagnosing?',
    options: [
      { label: 'Prometheus Target is DOWN or missing metrics', next: 'target_down' },
      { label: 'Prometheus High Memory / OOMKilled / Slow Queries', next: 'high_mem' },
      { label: 'Grafana Dashboard slow, timing out, or displaying "No Data"', next: 'grafana_issues' },
      { label: 'Alertmanager not sending Slack / PagerDuty notifications', next: 'alert_issues' },
      { label: 'PromQL query returning incorrect or NaN values', next: 'promql_issues' },
    ],
  },

  // 1. Target Down
  target_down: {
    q: 'Are the target endpoints discoverable in Prometheus UI under Status → Targets?',
    options: [
      { label: 'Target is listed as DOWN with an error message', next: 'target_down_error' },
      { label: 'Target is NOT listed at all in Status → Targets', next: 'target_missing' },
      { label: 'Target is UP, but specific metric names are missing', next: 'metric_dropped' },
    ],
  },
  target_down_error: {
    q: 'What error is shown in the Error column on the Targets page?',
    options: [
      { label: 'context deadline exceeded / timeout', next: 'scrape_timeout' },
      { label: 'connection refused', next: 'conn_refused' },
      { label: 'server returned HTTP 401 / 403 Forbidden', next: 'auth_error' },
      { label: 'x509: certificate signed by unknown authority', next: 'tls_error' },
    ],
  },
  scrape_timeout: {
    result: true,
    title: 'Fix Scrape Timeout (Context Deadline Exceeded)',
    body: 'The target application is taking longer to generate its /metrics payload than the configured scrape_timeout (default 10s). This usually occurs when the application formats too many metrics synchronously or calculates heavy database stats on every scrape.',
    cmds: [
      '# 1. Test curl response time directly inside the Prometheus container or Pod',
      'kubectl exec -it deployment/prometheus -n monitoring -- time curl -s http://<pod-ip>:<port>/metrics > /dev/null',
      '# 2. In prometheus.yml, temporarily increase scrape_timeout (must be <= scrape_interval):',
      'scrape_configs:\n  - job_name: "slow-app"\n    scrape_interval: 30s\n    scrape_timeout: 25s',
      '# 3. Optimize application exporter: cache heavy metrics or remove high-cardinality loops in /metrics endpoint handler',
    ],
  },
  conn_refused: {
    result: true,
    title: 'Fix Connection Refused on Scrape Target',
    body: 'The target host is reachable on the network, but no process is listening on the scraped port, or the process is bound only to 127.0.0.1 (localhost) inside the container rather than 0.0.0.0.',
    cmds: [
      '# 1. Verify app listening interface inside the target container:',
      'netstat -tuln | grep <port>   # Look for 0.0.0.0:<port>, NOT 127.0.0.1:<port>',
      '# 2. Check Kubernetes Service port & targetPort mapping:',
      'kubectl get svc <service-name> -o yaml | grep -A 4 ports',
      '# 3. Check NetworkPolicies in Kubernetes blocking ingress traffic from namespace "monitoring":',
      'kubectl get networkpolicies -n <app-namespace>',
    ],
  },
  auth_error: {
    result: true,
    title: 'Fix Scrape Authentication (401 / 403)',
    body: 'The target /metrics endpoint is protected by Basic Auth, OAuth, or Bearer tokens that Prometheus has not been configured to supply.',
    cmds: [
      '# Add bearer_token_file or basic_auth to your scrape config in prometheus.yml:',
      'scrape_configs:\n  - job_name: "secure-app"\n    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token\n    tls_config:\n      insecure_skip_verify: true',
    ],
  },
  tls_error: {
    result: true,
    title: 'Fix Scrape TLS Certificate Errors',
    body: 'Prometheus is attempting an HTTPS scrape against a self-signed or internal CA certificate.',
    cmds: [
      '# Mount your internal CA certificate into the Prometheus Pod or configure tls_config:',
      'scrape_configs:\n  - job_name: "internal-https"\n    scheme: https\n    tls_config:\n      ca_file: /etc/prometheus/certs/ca.crt\n      # Or for dev only: insecure_skip_verify: true',
    ],
  },
  target_missing: {
    result: true,
    title: 'Target Missing in Prometheus Service Discovery',
    body: 'Prometheus Kubernetes Service Discovery (k8s_sd) is not picking up your Pods or Endpoints. In Kubernetes, this usually means missing annotations or incorrect ServiceMonitor selectors in Prometheus Operator.',
    cmds: [
      '# 1. If using Prometheus Annotations, verify Pod / Service has:',
      'prometheus.io/scrape: "true"\nprometheus.io/port: "8080"\nprometheus.io/path: "/metrics"',
      '# 2. If using Prometheus Operator ServiceMonitor, check selector labels:',
      'kubectl get servicemonitor <name> -n monitoring -o yaml',
      '# Verify Service labels match selector in ServiceMonitor (spec.selector.matchLabels)',
    ],
  },
  metric_dropped: {
    result: true,
    title: 'Metric Exists on Target but Missing in Prometheus',
    body: 'If the target is UP but specific metrics cannot be queried in PromQL, they are likely being filtered out by `metric_relabel_configs` or exceed sample limits.',
    cmds: [
      '# 1. Curl the raw endpoint directly to verify the metric is actually emitted:',
      'curl -s http://<app-endpoint>/metrics | grep <metric_name>',
      '# 2. Check prometheus.yml for drop/keep actions in metric_relabel_configs:',
      'metric_relabel_configs:\n  - source_labels: [__name__]\n    regex: "(drop_me_.*)"\n    action: drop',
      '# 3. Check if target exceeded sample_limit in scrape_configs',
    ],
  },

  // 2. High Memory / OOMKilled
  high_mem: {
    q: 'What is the primary symptom on your Prometheus server?',
    options: [
      { label: 'Prometheus Pod was OOMKilled (Exit code 137)', next: 'oom_kill' },
      { label: 'Prometheus memory steadily grows and never drops (Cardinality Explosion)', next: 'cardinality_explosion' },
      { label: 'Prometheus crashes during startup while WAL replay is running', next: 'wal_corrupt' },
    ],
  },
  oom_kill: {
    result: true,
    title: 'Remediating Prometheus OOMKilled (Exit Code 137)',
    body: 'Prometheus OOMs almost always occur during heavy queries over high-cardinality series or during Head block compactions when RAM limit is too tight.',
    cmds: [
      '# 1. Inspect Prometheus memory allocation and OOM state in Kubernetes:',
      'kubectl describe pod -l app.kubernetes.io/name=prometheus -n monitoring | grep -A 5 "Last State"',
      '# 2. Check TSDB Head series count via PromQL:',
      'prometheus_tsdb_head_series',
      '# 3. Rule of Thumb for RAM sizing:',
      '# Minimum RAM = (Number of active series * 1.5KB) + Query Overhead (2-4GB)',
      '# For 2 million active series: Plan for 8GB to 12GB RAM limit',
    ],
  },
  cardinality_explosion: {
    result: true,
    title: 'High-Cardinality Label Explosion Remediation',
    body: 'High cardinality occurs when dynamic, unbounded values (such as User IDs, UUIDs, email addresses, or full query strings) are placed into metric labels.',
    cmds: [
      '# 1. Run promtool TSDB analyzer against data directory:',
      'promtool tsdb analyze /var/prometheus/data',
      '# Look at "Top 10 label names with high cardinality" and "Highest cardinality metrics"',
      '# 2. Strip unbounded labels at scrape time using metric_relabel_configs:',
      'metric_relabel_configs:\n  - regex: "user_id|session_token|request_uuid"\n    action: labeldrop',
    ],
  },
  wal_corrupt: {
    result: true,
    title: 'Fix Corrupted WAL or Crash-Looping on Startup',
    body: 'If a Prometheus instance crashes abruptly during a write, the Write-Ahead Log (WAL) segment may get corrupted, preventing Prometheus from starting.',
    cmds: [
      '# 1. Check startup logs for WAL errors:',
      'kubectl logs -l app.kubernetes.io/name=prometheus -n monitoring -c prometheus --tail=50',
      '# 2. If corrupted, clean the active WAL directory (or move corrupted segment):',
      '# Note: Data in WAL from last 2 hours might be lost, but older historical blocks remain intact.',
      'rm -rf /var/prometheus/data/wal/000000XX',
    ],
  },

  // 3. Grafana Issues
  grafana_issues: {
    q: 'What is happening inside the Grafana dashboard?',
    options: [
      { label: 'Panels show "504 Gateway Timeout" or take > 30s to load', next: 'grafana_timeout' },
      { label: 'Panels show "No Data" or empty graphs', next: 'grafana_nodata' },
      { label: 'Variable dropdown ($pod / $service) is empty or slow', next: 'grafana_variables' },
    ],
  },
  grafana_timeout: {
    result: true,
    title: 'Optimizing Slow Grafana Dashboards & Query Timeouts',
    body: 'Slow dashboards are caused by raw range queries over long time windows without step alignment, or running expensive regular expressions (e.g. `pod=~".*"`).',
    cmds: [
      '# 1. Use $__rate_interval instead of hardcoded [1m] or [5m] in rate queries:',
      'rate(http_requests_total[$__rate_interval])',
      '# 2. Create Prometheus Recording Rules for heavy calculations:',
      '# Pre-computes 5m rate every 30s in the background, reducing dashboard query time from 12s to 20ms!',
      'groups:\n  - name: service_rates\n    rules:\n      - record: job:http_requests:rate5m\n        expr: sum(rate(http_requests_total[5m])) by (job, status)',
      '# 3. In Grafana Panel settings: increase "Min step" and enable "Max data points" (default 1000)',
    ],
  },
  grafana_nodata: {
    result: true,
    title: 'Fix "No Data" in Grafana Panels',
    body: 'If Grafana shows "No Data", verify the time picker range, template variable values, and datasource connection.',
    cmds: [
      '# 1. Test datasource connection in Grafana: Administration → Data Sources → Prometheus → "Save & Test"',
      '# 2. Check if template variables match currently active label values:',
      'label_values(http_requests_total, service)',
      '# 3. Check for timezone discrepancies or time drift between Kubernetes nodes (NTP sync)',
    ],
  },
  grafana_variables: {
    result: true,
    title: 'Fix Slow / Empty Grafana Template Variables',
    body: 'Running heavy PromQL queries in template variable definitions causes every dashboard load to stall while fetching thousands of label values.',
    cmds: [
      '# Fast variable query (uses Prometheus Metadata API):',
      'label_values(node_uname_info, instance)',
      '# Slow variable query (Avoid this in variables!):',
      '# BAD: sum(rate(node_cpu_seconds_total[1h])) by (instance)',
      '# Enable "Refresh on dashboard load" or "Refresh on time range change" appropriately.',
    ],
  },

  // 4. Alertmanager Issues
  alert_issues: {
    q: 'Where is the alerting failure occurring?',
    options: [
      { label: 'Alert is not showing as "Firing" in Prometheus UI', next: 'alert_prom_eval' },
      { label: 'Alert is Firing in Prometheus, but Alertmanager sends no Slack/PagerDuty notification', next: 'alertmanager_routing' },
      { label: 'Alerts are spamming multiple notifications repeatedly', next: 'alert_spam' },
    ],
  },
  alert_prom_eval: {
    result: true,
    title: 'Prometheus Alert Rule Not Triggering',
    body: 'Prometheus evaluates alert rules every `evaluation_interval` (default 15s). The alert only moves to FIRING after being continuously true for the duration specified in the `for` field.',
    cmds: [
      '# 1. In Prometheus UI: Navigate to Alerts page and inspect the rule state:',
      '# INACTIVE: Condition is currently false',
      '# PENDING: Condition is true, but has not reached the "for" duration (e.g. for: 5m)',
      '# FIRING: Condition is true and "for" threshold passed → Sent to Alertmanager',
      '# 2. Test the alert expression directly in the Expression Browser:',
      'expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.05',
    ],
  },
  alertmanager_routing: {
    result: true,
    title: 'Alertmanager Routing & Notification Failure',
    body: 'If an alert is FIRING in Prometheus but not received in Slack or PagerDuty, the issue is typically mismatched route labels in `alertmanager.yml` or an active Silence.',
    cmds: [
      '# 1. Check Alertmanager UI for active Silences or Inhibitions (Status → Silences)',
      '# 2. Test routing with amtool CLI:',
      'amtool config show\namtool config routes test --labels alertname=HighErrorRate,severity=critical',
      '# 3. Verify webhook URL / Slack integration URL in receiver config in alertmanager.yml:',
      'receivers:\n  - name: "slack-notifications"\n    slack_configs:\n      - api_url: "https://hooks.slack.com/services/XXX/YYY/ZZZ"\n        channel: "#alerts-prod"',
    ],
  },
  alert_spam: {
    result: true,
    title: 'Fix Alert Spam & Notification Storms',
    body: 'Alert storms happen when grouping (`group_by`) is too granular or `repeat_interval` is set too low.',
    cmds: [
      '# In alertmanager.yml, configure smart grouping and repeat intervals:',
      'route:\n  group_by: ["alertname", "cluster", "service"] # Groups all Pod alerts from same service into 1 Slack message\n  group_wait: 30s        # Wait 30s before sending first notification to batch alerts\n  group_interval: 5m     # Wait 5m before sending update when new alerts arrive for same group\n  repeat_interval: 4h    # Do not re-notify for the same continuous alert for 4 hours',
    ],
  },

  // 5. PromQL issues
  promql_issues: {
    result: true,
    title: 'PromQL Vector Matching & Calculation Gotchas',
    body: 'Common PromQL gotchas include missing `group_left` on many-to-one matches, dividing counters without `rate()`, or taking `rate()` over a Gauge.',
    cmds: [
      '# 1. NEVER use rate() on a Gauge! (rate() expects monotonically increasing Counters):',
      '# Correct for Counter: rate(http_requests_total[5m])',
      '# Correct for Gauge:   avg_over_time(node_memory_MemAvailable_bytes[5m])',
      '# 2. When joining metrics with different label sets, use on() with group_left:',
      'http_requests_total * on(instance) group_left(version) node_info',
    ],
  },
}
