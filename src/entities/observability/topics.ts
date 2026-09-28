import type { Topic, TopicGroup } from '@/entities/topic'

export const OBSERVABILITY_GROUPS: TopicGroup[] = [
  { id: 'foundations', name: 'PART 1: Foundations & Architecture' },
  { id: 'promql', name: 'PART 2: PromQL Mastery & Mock Query UI' },
  { id: 'alerting_grafana', name: 'PART 3: Alertmanager & Grafana Mock UI' },
  { id: 'advanced_sre', name: 'PART 4: Advanced SRE & Incident Drills' },
]

export const OBSERVABILITY_TOPICS: Topic[] = [
  // -------------------------------------------------------------
  // MODULE 1: The 4 Golden Signals & Observability Philosophy
  // -------------------------------------------------------------
  {
    id: 'golden-signals',
    group: 'foundations',
    level: 'Beginner',
    title: '1. Observability Philosophy & The 4 Golden Signals',
    sectionNo: '01',
    body: [
      {
        t: 'p',
        c: 'Monitoring tells you when a system is broken by checking predefined failure modes. **Observability** is the ability to infer the internal states of a system based on its external outputs (telemetry: metrics, logs, and distributed traces) to diagnose novel and unknown failure modes.',
      },
      {
        t: 'cards',
        title: 'Core Observability Frameworks: SRE Golden Signals vs RED & USE',
        items: [
          {
            h: 'Google SRE 4 Golden Signals',
            c: '• Latency: Time taken to service a request (split by success vs error).\n• Traffic: Demand placed on the system (e.g., Requests per second).\n• Errors: Rate of requests that fail explicitly (HTTP 500) or implicitly.\n• Saturation: How close a resource is to 100% capacity (CPU, memory, queues).',
            chips: ['Industry Standard', 'SRE Core'],
          },
          {
            h: 'The RED Method (For Request Services)',
            c: '• Rate: The number of requests per second the service is serving.\n• Errors: The number of failed requests per second.\n• Duration: The amount of time those requests take to complete.',
            chips: ['Microservices', 'APIs'],
          },
          {
            h: 'The USE Method (For Infrastructure Resources)',
            c: '• Utilization: Percentage of time that a resource (CPU, disk, network) was busy.\n• Saturation: Degree to which extra work is queued waiting for the resource.\n• Errors: Count of error events (e.g. disk read errors, dropped packets).',
            chips: ['Hardware', 'Nodes & VMs'],
          },
        ],
      },
      {
        t: 'p',
        c: 'Prometheus fundamentally follows a **Pull Model** (scraping metrics endpoints over HTTP) rather than a Push model. This gives the monitoring infrastructure built-in target liveness detection and prevents monitoring systems from being overwhelmed during traffic spikes.',
      },
      {
        t: 'flow',
        heading: 'Prometheus Pull-Based Collection Lifecycle',
        tone: 'good',
        steps: [
          { label: 'Kubernetes API', sub: 'Service Discovery' },
          { label: 'Prometheus Server', sub: 'Calculates Scrape List' },
          { label: 'Target /metrics', sub: 'HTTP GET Scrape' },
          { label: 'Head TSDB', sub: 'Write to Memory + WAL' },
          { label: 'Evaluation Engine', sub: 'Alert Rules & Grafana' },
        ],
        edges: ['Discovers Pods', 'Periodically Pulls', 'Returns Plaintext', 'Appends Samples', 'Queries Metrics'],
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 2: TSDB Internals & Metric Types
  // -------------------------------------------------------------
  {
    id: 'tsdb-internals',
    group: 'foundations',
    level: 'Intermediate',
    title: '2. Prometheus TSDB Architecture & Metric Types',
    sectionNo: '02',
    body: [
      {
        t: 'p',
        c: 'Every metric sample in Prometheus is stored as a 64-bit float timestamp and a 64-bit float value: `(timestamp, value)`. Samples are compressed using **Gorilla XOR compression** for values and delta-of-delta compression for timestamps, reducing storage to ~1.37 bytes per sample.',
      },
      {
        t: 'stackCompare',
        left: {
          title: 'In-Memory Head Block (Last 2h)',
          layers: [
            { label: 'In-Memory Chunk Buffer', sub: 'Active writable chunks in RAM', tone: 'writable' },
            { label: 'Write-Ahead Log (WAL)', sub: 'Sequential append on disk for crash safety' },
            { label: 'Memory-Mapped Chunks (mmap)', sub: 'Flushed chunks mapped from disk' },
            { label: 'Inverted Index Posting Lists', sub: 'Fast lookup by label pairs' },
          ],
        },
        right: {
          title: 'Persistent Block on Disk (2h - 14d+)',
          layers: [
            { label: 'meta.json', sub: 'Block time range, stats & compaction level' },
            { label: 'index (Inverted Index)', sub: 'Maps series IDs to chunk disk offsets' },
            { label: 'chunks/000001 (Compressed)', sub: 'Read-only compacted raw sample chunks' },
            { label: 'tombstones', sub: 'Soft-deletion records for purged series' },
          ],
        },
      },
      {
        t: 'p',
        c: 'Prometheus defines 4 distinct client-side **Metric Types** with specific semantic meanings and mathematical properties:',
      },
      {
        t: 'cards',
        title: 'The 4 Prometheus Metric Types',
        items: [
          {
            h: '1. Counter (e.g. http_requests_total)',
            c: 'A cumulative metric that only ever increases or resets to 0 on restart. ALWAYS use with `rate()`, `irate()`, or `increase()`. Never query raw counters directly.',
            chips: ['Monotonic', 'Use with rate()'],
          },
          {
            h: '2. Gauge (e.g. node_memory_MemFree_bytes)',
            c: 'A numerical value that fluctuates up and down freely. Represents instantaneous snapshots. Use with `avg_over_time()`, `min_over_time()`, `max_over_time()`. Never use rate() on gauges.',
            chips: ['Fluctuating', 'Instant Value'],
          },
          {
            h: '3. Histogram (e.g. http_request_duration_seconds)',
            c: 'Counts observations in configurable cumulative buckets (`le` label), plus `_sum` and `_count`. Allows cross-node percentile aggregation via `histogram_quantile()`.',
            chips: ['Bucketed', 'P90/P99 Math'],
          },
          {
            h: '4. Summary (e.g. rpc_duration_seconds)',
            c: 'Calculates configurable quantiles (P50, P90, P99) directly on the client instance over a sliding time window. Highly accurate per instance, but cannot be summed or aggregated across pods.',
            chips: ['Client Quantiles', 'No Aggregation'],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 3: Kubernetes Service Discovery & Scrape Configuration
  // -------------------------------------------------------------
  {
    id: 'scrape-configs',
    group: 'foundations',
    level: 'Intermediate',
    title: '3. Scrape Configs, Relabeling & Kubernetes Discovery',
    sectionNo: '03',
    body: [
      {
        t: 'p',
        c: 'Prometheus discovers targets dynamically in Kubernetes via the Kubernetes API. The **relabeling pipeline** is one of the most critical concepts in Prometheus configuration.',
      },
      {
        t: 'flow',
        heading: 'The Prometheus Relabeling Pipeline',
        tone: 'default',
        steps: [
          { label: 'Target Discovery', sub: 'Kubernetes SD returns meta labels (__meta_*)' },
          { label: 'relabel_configs', sub: 'Filter targets, rewrite __address__ & set job/instance' },
          { label: 'HTTP Scrape', sub: 'Fetches raw /metrics payload from target' },
          { label: 'metric_relabel_configs', sub: 'Drop high-cardinality labels or unwanted metrics' },
          { label: 'TSDB Ingestion', sub: 'Appends clean series into database' },
        ],
        edges: ['Discovers Pods', 'Applies Pre-Scrape Rules', 'Sends HTTP GET', 'Filters Samples', 'Stores Data'],
      },
      {
        t: 'p',
        c: 'Here is a production-grade `prometheus.yml` configuration demonstrating Kubernetes Pod discovery and label filtering:',
      },
      {
        t: 'code',
        lang: 'yaml',
        title: 'prometheus.yml (Production Kubernetes Scrape Config)',
        c: `global:
  scrape_interval: 15s      # How frequently to scrape targets
  evaluation_interval: 15s  # How frequently to evaluate alert/recording rules
  scrape_timeout: 10s       # Scrape timeout (must be <= scrape_interval)

scrape_configs:
  - job_name: "kubernetes-pods"
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      # 1. Only scrape pods that have the annotation "prometheus.io/scrape: true"
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true

      # 2. Rewrite scrape path if custom annotation "prometheus.io/path" is set
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)

      # 3. Rewrite scrape address & port if "prometheus.io/port" annotation is set
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\\\\d+)?;(\\\\d+)
        replacement: $1:$2
        target_label: __address__

      # 4. Map Kubernetes namespace and pod name to clean metric labels
      - source_labels: [__meta_kubernetes_namespace]
        target_label: namespace
      - source_labels: [__meta_kubernetes_pod_name]
        target_label: pod

    # Metric Relabeling: Drop high-cardinality debugging metrics before saving to TSDB
    metric_relabel_configs:
      - source_labels: [__name__]
        regex: "(jvm_gc_memory_allocated_bytes_total|http_client_raw_payload_.*)"
        action: drop`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 4: PromQL Deep Dive & Mathematical Principles
  // -------------------------------------------------------------
  {
    id: 'promql-deep-dive',
    group: 'promql',
    level: 'Advanced',
    title: '4. PromQL Mastery: Vector Math & Aggregations',
    sectionNo: '04',
    body: [
      {
        t: 'p',
        c: 'PromQL operates on two fundamental vector types:\n• **Instant Vector**: A set of time series containing a single sample for each time series, all sharing the same timestamp (e.g. `http_requests_total`).\n• **Range Vector**: A set of time series containing a buffer of samples over time for each time series (e.g. `http_requests_total[5m]`). Range vectors cannot be graphed directly; they MUST be converted into an Instant Vector using a rate function like `rate()` or `increase()`.',
      },
      {
        t: 'cards',
        title: 'Essential PromQL Production Formulas',
        items: [
          {
            h: '1. P99 Request Latency (Histogram Quantile)',
            c: 'histogram_quantile(\n  0.99,\n  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)\n)\nCalculates 99th percentile response time per microservice.',
            chips: ['SLI / SLO', 'Percentiles'],
          },
          {
            h: '2. Percentage HTTP Error Rate',
            c: '(\n  sum(rate(http_requests_total{status=~"5.."}[5m]))\n  /\n  sum(rate(http_requests_total[5m]))\n) * 100\nMeasures percentage of requests failing with 5xx server errors.',
            chips: ['RED Method', 'Error Rate'],
          },
          {
            h: '3. Node CPU Utilization Percentage',
            c: '100 - (\n  avg by (instance) (\n    rate(node_cpu_seconds_total{mode="idle"}[5m])\n  ) * 100\n)\nCalculates real CPU consumption by inverting idle mode time.',
            chips: ['USE Method', 'Hardware'],
          },
          {
            h: '4. Pod Memory Consumption vs Memory Limit',
            c: 'sum(container_memory_working_set_bytes{container!=""}) by (pod, namespace)\n/\nsum(kube_pod_container_resource_limits{resource="memory"}) by (pod, namespace) * 100\nIdentifies pods near OOMKilled risk.',
            chips: ['Kubernetes', 'OOM Prevention'],
          },
        ],
      },
      {
        t: 'p',
        c: 'When performing arithmetic operations between metrics with differing label sets, use the `on()` or `ignoring()` keyword with `group_left` (many-to-one) or `group_right` (one-to-many):',
      },
      {
        t: 'code',
        lang: 'bash',
        title: 'PromQL Vector Matching Example (Many-to-One)',
        c: `# Enrich raw container CPU metrics with Kubernetes deployment metadata labels:
rate(container_cpu_usage_seconds_total{container!=""}[5m])
  * on(pod, namespace) group_left(owner_name)
kube_pod_owner{owner_kind="Deployment"}`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 5: INTERACTIVE MOCK UI: PROMETHEUS EXPRESSION BROWSER
  // -------------------------------------------------------------
  {
    id: 'mock-ui-prometheus',
    group: 'promql',
    level: 'Advanced',
    title: '5. 🖥️ Interactive Mock UI: Prometheus Expression Browser',
    sectionNo: '05',
    body: [
      {
        t: 'p',
        c: 'Experience how the real Prometheus Web Console operates. Click through the query presets below to see live instantaneous vector evaluations, label sets, and interactive SVG time-series graphs:',
      },
      {
        t: 'html',
        html: `
<div class="panel rounded-2xl border-2 border-orange-500/40 bg-[#0f172a] text-slate-100 p-4 sm:p-6 my-6 shadow-2xl overflow-hidden font-sans">
  <!-- Prometheus Mock UI Header -->
  <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-slate-950 text-base shadow-sm">
        🔥
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span class="font-bold text-base tracking-tight text-white">Prometheus</span>
          <span class="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-orange-400 border border-slate-700">v2.54.1</span>
          <span class="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> TSDB Healthy
          </span>
        </div>
        <p class="text-xs text-slate-400 mt-0.5">Expression Browser &amp; Vector Evaluation Simulator</p>
      </div>
    </div>
    <div class="flex items-center gap-2 text-xs font-mono">
      <span class="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">Target Scrapes: 42/42 UP</span>
    </div>
  </div>

  <!-- Interactive Preset Selector -->
  <div class="my-4">
    <label class="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Select a PromQL Query Preset to Evaluate:</label>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2" id="prom-preset-grid">
      <button type="button" onclick="selectPromQuery(0)" id="btn-prom-0" class="text-left px-3.5 py-2.5 rounded-xl border border-orange-500 bg-orange-500/10 text-orange-300 text-xs font-mono transition hover:bg-orange-500/20 cursor-pointer">
        ⚡ 1. 5xx Error Rate (RED Method)
      </button>
      <button type="button" onclick="selectPromQuery(1)" id="btn-prom-1" class="text-left px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 text-xs font-mono transition hover:bg-slate-800 hover:border-slate-600 cursor-pointer">
        ⏱️ 2. P99 Latency (Histogram Quantile)
      </button>
      <button type="button" onclick="selectPromQuery(2)" id="btn-prom-2" class="text-left px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 text-xs font-mono transition hover:bg-slate-800 hover:border-slate-600 cursor-pointer">
        💻 3. Node CPU Consumption (%)
      </button>
      <button type="button" onclick="selectPromQuery(3)" id="btn-prom-3" class="text-left px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 text-xs font-mono transition hover:bg-slate-800 hover:border-slate-600 cursor-pointer">
        🚨 4. Pod Memory Saturation vs Limit
      </button>
    </div>
  </div>

  <!-- Expression Input Box -->
  <div class="bg-slate-900 rounded-xl p-3 border border-slate-700/80 mb-4 shadow-inner">
    <div class="flex items-center justify-between text-xs text-slate-400 font-mono mb-1.5">
      <span>Expression (PromQL)</span>
      <span class="text-emerald-400 font-semibold" id="prom-eval-time">Evaluation: 3.42ms</span>
    </div>
    <div class="flex gap-2">
      <input type="text" id="prom-expression-input" readonly value="sum(rate(http_requests_total{status=~&quot;5..&quot;}[5m])) by (service)" class="flex-1 bg-slate-950 px-3.5 py-2 rounded-lg border border-slate-700 text-orange-300 font-mono text-xs focus:outline-none focus:border-orange-500 selection:bg-orange-500 selection:text-slate-950" />
      <button type="button" onclick="runPromExecute()" class="px-5 py-2 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs rounded-lg font-mono transition cursor-pointer flex items-center gap-1.5 shadow-sm">
        <span>Execute</span> ↵
      </button>
    </div>
  </div>

  <!-- Tabs: Table View vs Graph View -->
  <div class="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
    <div class="flex gap-2 font-mono text-xs">
      <button type="button" onclick="switchPromTab('table')" id="tab-prom-table" class="px-3 py-1.5 rounded-lg bg-orange-500 text-slate-950 font-bold cursor-pointer transition">
        Table View (Instant Vector)
      </button>
      <button type="button" onclick="switchPromTab('graph')" id="tab-prom-graph" class="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition">
        Graph View (Time Series)
      </button>
    </div>
    <span class="text-xs font-mono text-slate-400" id="prom-series-count">4 series returned</span>
  </div>

  <!-- Result Container: Table View -->
  <div id="prom-view-table" class="space-y-2">
    <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
      <table class="w-full text-left font-mono text-xs text-slate-300">
        <thead class="bg-slate-900/90 text-slate-400 border-b border-slate-800">
          <tr>
            <th class="p-3 w-12 text-center">#</th>
            <th class="p-3">Time Series Element &amp; Labels</th>
            <th class="p-3 text-right w-36">Value</th>
          </tr>
        </thead>
        <tbody id="prom-table-body" class="divide-y divide-slate-800/60">
          <tr class="hover:bg-slate-900/50 transition">
            <td class="p-3 text-center text-slate-500">1</td>
            <td class="p-3"><span class="text-orange-400 font-semibold">{service="payment-api"}</span></td>
            <td class="p-3 text-right font-bold text-rose-400">14.82 req/s</td>
          </tr>
          <tr class="hover:bg-slate-900/50 transition">
            <td class="p-3 text-center text-slate-500">2</td>
            <td class="p-3"><span class="text-orange-400 font-semibold">{service="auth-service"}</span></td>
            <td class="p-3 text-right font-bold text-amber-400">2.15 req/s</td>
          </tr>
          <tr class="hover:bg-slate-900/50 transition">
            <td class="p-3 text-center text-slate-500">3</td>
            <td class="p-3"><span class="text-orange-400 font-semibold">{service="catalog-api"}</span></td>
            <td class="p-3 text-right font-bold text-emerald-400">0.02 req/s</td>
          </tr>
          <tr class="hover:bg-slate-900/50 transition">
            <td class="p-3 text-center text-slate-500">4</td>
            <td class="p-3"><span class="text-orange-400 font-semibold">{service="notification-worker"}</span></td>
            <td class="p-3 text-right font-bold text-emerald-400">0.00 req/s</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Result Container: Graph View (Simulated SVG Chart) -->
  <div id="prom-view-graph" class="hidden">
    <div class="p-4 rounded-xl border border-slate-800 bg-slate-950 relative">
      <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
        <span id="prom-graph-title">5xx HTTP Request Rate [Last 1 Hour]</span>
        <span class="text-slate-500">Step: 15s | Resolution: 240 pts</span>
      </div>
      <svg id="prom-svg-chart" viewBox="0 0 700 220" class="w-full h-56 overflow-visible">
        <!-- Grid lines -->
        <line x1="40" y1="20" x2="680" y2="20" stroke="#334155" stroke-dasharray="3,3" stroke-width="0.8"/>
        <line x1="40" y1="70" x2="680" y2="70" stroke="#334155" stroke-dasharray="3,3" stroke-width="0.8"/>
        <line x1="40" y1="120" x2="680" y2="120" stroke="#334155" stroke-dasharray="3,3" stroke-width="0.8"/>
        <line x1="40" y1="170" x2="680" y2="170" stroke="#334155" stroke-dasharray="3,3" stroke-width="0.8"/>
        <!-- Y-Axis labels -->
        <text x="35" y="24" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end" id="y-lbl-4">20.0</text>
        <text x="35" y="74" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end" id="y-lbl-3">15.0</text>
        <text x="35" y="124" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end" id="y-lbl-2">10.0</text>
        <text x="35" y="174" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end" id="y-lbl-1">0.0</text>
        <!-- X-Axis timeline labels -->
        <text x="50" y="200" fill="#64748b" font-size="10" font-family="monospace">14:00</text>
        <text x="250" y="200" fill="#64748b" font-size="10" font-family="monospace">14:20</text>
        <text x="450" y="200" fill="#64748b" font-size="10" font-family="monospace">14:40</text>
        <text x="660" y="200" fill="#64748b" font-size="10" font-family="monospace">15:00</text>
        <!-- Primary Curve (Red / Spike) -->
        <path id="prom-curve-1" d="M 50 170 C 150 170, 250 165, 350 120 C 400 60, 450 40, 520 45 C 600 50, 640 100, 680 50" fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Secondary Curve (Green / Stable) -->
        <path id="prom-curve-2" d="M 50 168 C 200 167, 350 169, 500 168 C 600 168, 650 167, 680 168" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <!-- Legend -->
      <div class="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-800 text-xs font-mono">
        <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-rose-500"></span><span id="prom-leg-1">payment-api (spiking)</span></div>
        <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-emerald-500"></span><span id="prom-leg-2">catalog-api (baseline)</span></div>
      </div>
    </div>
  </div>
</div>

<script>
  const promPresets = [
    {
      query: 'sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)',
      rows: [
        { label: '{service="payment-api"}', val: '14.82 req/s', tone: 'rose' },
        { label: '{service="auth-service"}', val: '2.15 req/s', tone: 'amber' },
        { label: '{service="catalog-api"}', val: '0.02 req/s', tone: 'emerald' },
        { label: '{service="notification-worker"}', val: '0.00 req/s', tone: 'emerald' },
      ],
      graphTitle: '5xx HTTP Request Rate [Last 1 Hour]',
      yLabels: ['20.0', '15.0', '10.0', '0.0'],
      curve1: 'M 50 170 C 150 170, 250 165, 350 120 C 400 60, 450 40, 520 45 C 600 50, 640 100, 680 50',
      stroke1: '#f43f5e',
      curve2: 'M 50 168 C 200 167, 350 169, 500 168 C 600 168, 650 167, 680 168',
      stroke2: '#10b981',
      leg1: 'payment-api (spiking at 14.8 req/s)',
      leg2: 'catalog-api (0.02 req/s)'
    },
    {
      query: 'histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))',
      rows: [
        { label: '{service="checkout-service"}', val: '1.42 s (1420ms)', tone: 'rose' },
        { label: '{service="payment-api"}', val: '0.85 s (850ms)', tone: 'amber' },
        { label: '{service="auth-service"}', val: '0.04 s (40ms)', tone: 'emerald' },
        { label: '{service="gateway"}', val: '0.01 s (10ms)', tone: 'emerald' },
      ],
      graphTitle: 'P99 Latency Histogram Quantile [Last 1 Hour]',
      yLabels: ['2.0s', '1.5s', '1.0s', '0.0s'],
      curve1: 'M 50 150 C 150 140, 280 145, 380 90 C 450 40, 550 35, 680 38',
      stroke1: '#f43f5e',
      curve2: 'M 50 165 C 200 166, 350 164, 500 165 C 600 165, 650 164, 680 165',
      stroke2: '#38bdf8',
      leg1: 'checkout-service (P99 = 1.42s SLA Breach)',
      leg2: 'auth-service (P99 = 40ms Healthy)'
    },
    {
      query: '100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)',
      rows: [
        { label: '{instance="node-worker-01:9100"}', val: '94.2 %', tone: 'rose' },
        { label: '{instance="node-worker-02:9100"}', val: '62.8 %', tone: 'amber' },
        { label: '{instance="node-worker-03:9100"}', val: '28.4 %', tone: 'emerald' },
        { label: '{instance="node-master-01:9100"}', val: '18.1 %', tone: 'emerald' },
      ],
      graphTitle: 'Host Node CPU Utilization % [Last 1 Hour]',
      yLabels: ['100%', '75%', '50%', '0%'],
      curve1: 'M 50 120 C 150 110, 250 80, 380 50 C 450 35, 550 30, 680 25',
      stroke1: '#fbbf24',
      curve2: 'M 50 150 C 200 152, 350 148, 500 150 C 600 145, 650 140, 680 135',
      stroke2: '#10b981',
      leg1: 'node-worker-01 (94.2% CPU Saturated)',
      leg2: 'node-worker-03 (28.4% CPU)'
    },
    {
      query: 'sum(container_memory_working_set_bytes) by (pod) / sum(kube_pod_container_resource_limits{resource="memory"}) by (pod) * 100',
      rows: [
        { label: '{pod="elasticsearch-data-0"}', val: '96.8 % (OOM Risk)', tone: 'rose' },
        { label: '{pod="redis-cache-master"}', val: '54.2 %', tone: 'amber' },
        { label: '{pod="nginx-ingress-controller-abc"}', val: '32.1 %', tone: 'emerald' },
      ],
      graphTitle: 'Pod Memory Usage vs Limit % [Last 1 Hour]',
      yLabels: ['100%', '80%', '50%', '0%'],
      curve1: 'M 50 100 C 150 90, 250 70, 350 50 C 480 35, 580 28, 680 22',
      stroke1: '#e11d48',
      curve2: 'M 50 140 C 200 138, 350 135, 500 130 C 600 132, 650 130, 680 128',
      stroke2: '#a855f7',
      leg1: 'elasticsearch-data-0 (96.8% Near OOMKilled)',
      leg2: 'redis-cache-master (54.2%)'
    }
  ];

  window.selectPromQuery = function(index) {
    const p = promPresets[index];
    if (!p) return;
    document.getElementById('prom-expression-input').value = p.query;
    document.getElementById('prom-eval-time').textContent = 'Evaluation: ' + (Math.random() * 2 + 1.2).toFixed(2) + 'ms';
    
    // Highlight buttons
    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById('btn-prom-' + i);
      if (i === index) {
        btn.className = 'text-left px-3.5 py-2.5 rounded-xl border border-orange-500 bg-orange-500/10 text-orange-300 text-xs font-mono transition hover:bg-orange-500/20 cursor-pointer';
      } else {
        btn.className = 'text-left px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 text-xs font-mono transition hover:bg-slate-800 hover:border-slate-600 cursor-pointer';
      }
    }

    // Populate table
    const tbody = document.getElementById('prom-table-body');
    tbody.innerHTML = p.rows.map((r, i) => {
      const colClass = r.tone === 'rose' ? 'text-rose-400' : r.tone === 'amber' ? 'text-amber-400' : 'text-emerald-400';
      return '<tr class="hover:bg-slate-900/50 transition"><td class="p-3 text-center text-slate-500">' + (i + 1) + '</td><td class="p-3"><span class="text-orange-400 font-semibold">' + r.label + '</span></td><td class="p-3 text-right font-bold ' + colClass + '">' + r.val + '</td></tr>';
    }).join('');

    document.getElementById('prom-series-count').textContent = p.rows.length + ' series returned';

    // Populate graph
    document.getElementById('prom-graph-title').textContent = p.graphTitle;
    document.getElementById('y-lbl-4').textContent = p.yLabels[0];
    document.getElementById('y-lbl-3').textContent = p.yLabels[1];
    document.getElementById('y-lbl-2').textContent = p.yLabels[2];
    document.getElementById('y-lbl-1').textContent = p.yLabels[3];
    document.getElementById('prom-curve-1').setAttribute('d', p.curve1);
    document.getElementById('prom-curve-1').setAttribute('stroke', p.stroke1);
    document.getElementById('prom-curve-2').setAttribute('d', p.curve2);
    document.getElementById('prom-curve-2').setAttribute('stroke', p.stroke2);
    document.getElementById('prom-leg-1').textContent = p.leg1;
    document.getElementById('prom-leg-2').textContent = p.leg2;
  };

  window.runPromExecute = function() {
    const timeEl = document.getElementById('prom-eval-time');
    timeEl.textContent = 'Evaluating...';
    setTimeout(() => {
      timeEl.textContent = 'Evaluation: ' + (Math.random() * 1.5 + 1.1).toFixed(2) + 'ms';
    }, 180);
  };

  window.switchPromTab = function(mode) {
    const tableBtn = document.getElementById('tab-prom-table');
    const graphBtn = document.getElementById('tab-prom-graph');
    const tableView = document.getElementById('prom-view-table');
    const graphView = document.getElementById('prom-view-graph');

    if (mode === 'table') {
      tableBtn.className = 'px-3 py-1.5 rounded-lg bg-orange-500 text-slate-950 font-bold cursor-pointer transition';
      graphBtn.className = 'px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition';
      tableView.classList.remove('hidden');
      graphView.classList.add('hidden');
    } else {
      graphBtn.className = 'px-3 py-1.5 rounded-lg bg-orange-500 text-slate-950 font-bold cursor-pointer transition';
      tableBtn.className = 'px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition';
      tableView.classList.add('hidden');
      graphView.classList.remove('hidden');
    }
  };
</script>
`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 6: Alertmanager & Production Alerting
  // -------------------------------------------------------------
  {
    id: 'alertmanager-rules',
    group: 'alerting_grafana',
    level: 'Intermediate',
    title: '6. Alertmanager Routing Trees, Deduplication & Alerts',
    sectionNo: '06',
    body: [
      {
        t: 'p',
        c: 'Prometheus calculates alert rules periodically during `evaluation_interval`. Once an expression evaluates to TRUE continuously for the duration specified in the `for` field, it moves from `PENDING` to `FIRING` and is dispatched to **Alertmanager**.',
      },
      {
        t: 'code',
        lang: 'yaml',
        title: 'alerting_rules.yml (High Error Rate Alert Definition)',
        c: `groups:
  - name: api_slo_alerts
    rules:
      - alert: HighHTTP5xxErrorRate
        expr: |
          (
            sum(rate(http_requests_total{status=~"5.."}[5m]))
            /
            sum(rate(http_requests_total[5m]))
          ) * 100 > 5
        for: 3m
        labels:
          severity: critical
          team: platform-sre
          tier: backend
        annotations:
          summary: "High HTTP 5xx error rate on {{ $labels.service }}"
          description: "Service {{ $labels.service }} is experiencing {{ $value | printf '%.2f' }}% HTTP 5xx errors (Threshold > 5%) for more than 3 minutes."
          runbook_url: "https://wiki.corp.internal/runbooks/high-error-rate"`,
      },
      {
        t: 'p',
        c: 'Alertmanager handles alert **Deduplication**, **Grouping**, **Inhibition**, and **Silences** before sending notifications to receivers (Slack, PagerDuty, Webhooks):',
      },
      {
        t: 'code',
        lang: 'yaml',
        title: 'alertmanager.yml (Routing Tree & Slack Receiver Config)',
        c: `global:
  resolve_timeout: 5m
  slack_api_url: "https://hooks.slack.com/services/T00/B00/XXXX"

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 30s        # Wait 30s to batch simultaneous alerts into one notification
  group_interval: 5m     # Wait 5m before sending update when new alerts join the group
  repeat_interval: 4h    # Re-send notification after 4h if alert is still continuously firing
  receiver: 'slack-default'

  routes:
    # Route critical alerts to PagerDuty on-call rotation
    - match:
        severity: critical
      receiver: 'pagerduty-urgent'
      continue: true  # Also continue down tree to send to Slack

    - match:
        severity: warning
      receiver: 'slack-warnings'

# Inhibition Rules: Mute Warning alerts if a Critical alert on the same node is already firing!
inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['instance', 'node']`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 7: Grafana Dashboard Architecture & Panel Optimizations
  // -------------------------------------------------------------
  {
    id: 'grafana-architecture',
    group: 'alerting_grafana',
    level: 'Intermediate',
    title: '7. Grafana Architecture: Variables, Panels & Performance',
    sectionNo: '07',
    body: [
      {
        t: 'p',
        c: 'Grafana is the industry-standard visualization layer for observability. A well-architected Grafana dashboard provides immediate executive status (SLOs) at the top, followed by drill-down panels (RED method), host metrics (USE method), and correlated log/trace streams.',
      },
      {
        t: 'cards',
        title: 'Grafana Performance Best Practices',
        items: [
          {
            h: '1. Use $__rate_interval',
            c: 'Always use `$__rate_interval` instead of hardcoded `[1m]` or `[5m]` in `rate()` queries. It automatically aligns with the panel step and time range, preventing missing data points or query execution timeouts.',
            chips: ['Step Alignment', 'No Timeouts'],
          },
          {
            h: '2. Chained Template Variables',
            c: 'Chain variables hierarchically: `$region` → `$cluster` (depends on region) → `$service` (depends on cluster). Use metadata label API `label_values()` rather than heavy metric queries.',
            chips: ['Fast Loading', 'Hierarchical'],
          },
          {
            h: '3. Pre-compute via Recording Rules',
            c: 'If a panel runs aggregations across hundreds of pods over 30 days, pre-calculate it with a Prometheus Recording Rule. Grafana loads in 15ms instead of 25s.',
            chips: ['Recording Rules', '100x Speed'],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 8: INTERACTIVE MOCK UI: GRAFANA PRODUCTION DASHBOARD
  // -------------------------------------------------------------
  {
    id: 'mock-ui-grafana',
    group: 'alerting_grafana',
    level: 'Advanced',
    title: '8. 📊 Interactive Mock UI: Production Grafana SRE Dashboard',
    sectionNo: '08',
    body: [
      {
        t: 'p',
        c: 'Below is an interactive simulation of an enterprise Grafana SRE Service Dashboard. You can toggle environments, services, and time ranges to observe live SLO metric cards, stacked traffic graphs, latency percentiles, and correlated Loki log streams:',
      },
      {
        t: 'html',
        html: `
<div class="panel rounded-2xl border-2 border-amber-500/50 bg-[#111217] text-slate-100 p-4 sm:p-6 my-6 shadow-2xl overflow-hidden font-sans select-none">
  <!-- Grafana Header Bar -->
  <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow">
        📈
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span class="font-bold text-sm text-slate-100">Production SRE / Golden Signals &amp; Service Health</span>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">Grafana v11.2</span>
        </div>
        <div class="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
          <span>Folder: Production Microservices</span>
          <span>•</span>
          <span class="text-emerald-400 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live Stream (5s)</span>
        </div>
      </div>
    </div>

    <!-- Time Picker & Actions -->
    <div class="flex items-center gap-2 text-xs font-mono">
      <div class="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-1.5 cursor-pointer hover:bg-slate-700 transition">
        <span>🕒</span>
        <span id="grafana-time-display">Last 1 hour</span>
      </div>
      <div class="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-1.5 cursor-pointer hover:bg-slate-700 transition">
        <span>🔄</span>
        <span>5s</span>
      </div>
    </div>
  </div>

  <!-- Dashboard Variables Toolbar -->
  <div class="flex flex-wrap items-center gap-3 py-3 px-3.5 my-3 bg-[#181b1f] rounded-xl border border-slate-800 text-xs font-mono">
    <div class="flex items-center gap-2">
      <span class="text-slate-400">Cluster:</span>
      <select id="var-cluster" onchange="updateGrafanaState()" class="bg-[#111217] border border-slate-700 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer">
        <option value="prod-us-east-1">k8s-prod-us-east-1</option>
        <option value="prod-eu-west-1">k8s-prod-eu-west-1</option>
      </select>
    </div>

    <div class="flex items-center gap-2">
      <span class="text-slate-400">Namespace:</span>
      <select id="var-namespace" onchange="updateGrafanaState()" class="bg-[#111217] border border-slate-700 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer">
        <option value="production">production</option>
        <option value="staging">staging</option>
      </select>
    </div>

    <div class="flex items-center gap-2">
      <span class="text-slate-400">Service:</span>
      <select id="var-service" onchange="updateGrafanaState()" class="bg-[#111217] border border-amber-500/80 rounded px-2.5 py-1 text-amber-300 font-semibold focus:outline-none focus:border-amber-400 cursor-pointer">
        <option value="payment-api">payment-api (Critical Tier)</option>
        <option value="auth-service">auth-service</option>
        <option value="catalog-api">catalog-api</option>
        <option value="order-processor">order-processor</option>
      </select>
    </div>
  </div>

  <!-- TOP ROW: Stat Panels & SLO Health -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
    <!-- Stat 1: Availability SLO -->
    <div class="p-3.5 rounded-xl bg-[#181b1f] border border-slate-800 flex flex-col justify-between">
      <span class="text-xs text-slate-400 font-mono">Availability SLO (30d)</span>
      <div class="my-1 flex items-baseline gap-2">
        <span class="text-2xl sm:text-3xl font-bold font-mono text-emerald-400" id="stat-avail">99.94%</span>
        <span class="text-[11px] font-mono text-slate-500">Target: 99.90%</span>
      </div>
      <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div class="bg-emerald-400 h-full w-[99.94%]"></div>
      </div>
    </div>

    <!-- Stat 2: Request Rate -->
    <div class="p-3.5 rounded-xl bg-[#181b1f] border border-slate-800 flex flex-col justify-between">
      <span class="text-xs text-slate-400 font-mono">Current Throughput</span>
      <div class="my-1 flex items-baseline gap-2">
        <span class="text-2xl sm:text-3xl font-bold font-mono text-slate-100" id="stat-rps">18.4k</span>
        <span class="text-[11px] font-mono text-emerald-400">req/sec</span>
      </div>
      <span class="text-[11px] text-slate-400 font-mono">14 Active Pod Replicas</span>
    </div>

    <!-- Stat 3: P99 Latency -->
    <div class="p-3.5 rounded-xl bg-[#181b1f] border border-slate-800 flex flex-col justify-between">
      <span class="text-xs text-slate-400 font-mono">P99 Request Latency</span>
      <div class="my-1 flex items-baseline gap-2">
        <span class="text-2xl sm:text-3xl font-bold font-mono text-amber-400" id="stat-p99">148 ms</span>
        <span class="text-[11px] font-mono text-amber-500/80">▲ +14ms</span>
      </div>
      <span class="text-[11px] text-slate-400 font-mono">P50: 18ms | P90: 62ms</span>
    </div>

    <!-- Stat 4: Error Budget Remaining -->
    <div class="p-3.5 rounded-xl bg-[#181b1f] border border-slate-800 flex flex-col justify-between">
      <span class="text-xs text-slate-400 font-mono">Error Budget Remaining</span>
      <div class="my-1 flex items-baseline gap-2">
        <span class="text-2xl sm:text-3xl font-bold font-mono text-emerald-400" id="stat-budget">65.8%</span>
        <span class="text-[11px] font-mono text-emerald-400">Burn: 0.8x</span>
      </div>
      <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div id="stat-budget-bar" class="bg-emerald-400 h-full w-[65.8%]"></div>
      </div>
    </div>
  </div>

  <!-- MIDDLE ROW: Time Series Graphs (RED Method) -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
    <!-- Graph 1: Request Rate by HTTP Status -->
    <div class="p-4 rounded-xl bg-[#181b1f] border border-slate-800">
      <div class="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
        <span class="font-bold flex items-center gap-1.5"><span class="text-amber-400">📈</span> Request Volume &amp; HTTP Status</span>
        <span class="text-slate-500 font-normal">sum by (status) (rate(http_requests_total[$__rate_interval]))</span>
      </div>
      <svg viewBox="0 0 450 160" class="w-full h-40 overflow-visible">
        <line x1="30" y1="20" x2="440" y2="20" stroke="#262c36" stroke-dasharray="2,2"/>
        <line x1="30" y1="70" x2="440" y2="70" stroke="#262c36" stroke-dasharray="2,2"/>
        <line x1="30" y1="120" x2="440" y2="120" stroke="#262c36" stroke-dasharray="2,2"/>
        <text x="25" y="24" fill="#64748b" font-size="9" font-family="monospace" text-anchor="end">20k</text>
        <text x="25" y="74" fill="#64748b" font-size="9" font-family="monospace" text-anchor="end">10k</text>
        <text x="25" y="124" fill="#64748b" font-size="9" font-family="monospace" text-anchor="end">0</text>
        <!-- Stacked area/curves -->
        <path id="g-area-2xx" d="M 30 120 C 120 70, 220 50, 320 60 C 380 40, 410 45, 440 40 L 440 120 L 30 120 Z" fill="rgba(16, 185, 129, 0.15)"/>
        <path id="g-line-2xx" d="M 30 120 C 120 70, 220 50, 320 60 C 380 40, 410 45, 440 40" fill="none" stroke="#10b981" stroke-width="2"/>
        <path id="g-line-5xx" d="M 30 120 C 150 120, 260 118, 330 100 C 380 90, 410 85, 440 95" fill="none" stroke="#f43f5e" stroke-width="1.8"/>
      </svg>
      <div class="flex items-center gap-4 mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
        <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>HTTP 2xx (Success)</span></div>
        <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span>HTTP 3xx (Redirect)</span></div>
        <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span>HTTP 5xx (Server Error)</span></div>
      </div>
    </div>

    <!-- Graph 2: Latency Quantiles (P50 / P90 / P99) -->
    <div class="p-4 rounded-xl bg-[#181b1f] border border-slate-800">
      <div class="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
        <span class="font-bold flex items-center gap-1.5"><span class="text-amber-400">⏱️</span> Latency Distribution (P50, P90, P99)</span>
        <span class="text-slate-500 font-normal">histogram_quantile(φ, rate(duration_bucket))</span>
      </div>
      <svg viewBox="0 0 450 160" class="w-full h-40 overflow-visible">
        <line x1="30" y1="20" x2="440" y2="20" stroke="#262c36" stroke-dasharray="2,2"/>
        <line x1="30" y1="70" x2="440" y2="70" stroke="#262c36" stroke-dasharray="2,2"/>
        <line x1="30" y1="120" x2="440" y2="120" stroke="#262c36" stroke-dasharray="2,2"/>
        <text x="25" y="24" fill="#64748b" font-size="9" font-family="monospace" text-anchor="end">300ms</text>
        <text x="25" y="74" fill="#64748b" font-size="9" font-family="monospace" text-anchor="end">150ms</text>
        <text x="25" y="124" fill="#64748b" font-size="9" font-family="monospace" text-anchor="end">0ms</text>
        <!-- P99 Line (Amber/Orange) -->
        <path id="g-line-p99" d="M 30 90 C 130 95, 230 85, 330 65 C 380 50, 410 55, 440 60" fill="none" stroke="#f59e0b" stroke-width="2"/>
        <!-- P90 Line (Sky Blue) -->
        <path id="g-line-p90" d="M 30 105 C 130 106, 230 102, 330 95 C 380 90, 410 88, 440 92" fill="none" stroke="#38bdf8" stroke-width="1.8"/>
        <!-- P50 Line (Green) -->
        <path id="g-line-p50" d="M 30 116 C 130 115, 230 116, 330 114 C 380 113, 410 114, 440 114" fill="none" stroke="#10b981" stroke-width="1.5"/>
      </svg>
      <div class="flex items-center gap-4 mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
        <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>P99 (148ms)</span></div>
        <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-sky-400"></span><span>P90 (62ms)</span></div>
        <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>P50 (18ms)</span></div>
      </div>
    </div>
  </div>

  <!-- BOTTOM ROW: Correlated Loki Log Stream Panel -->
  <div class="p-4 rounded-xl bg-[#181b1f] border border-slate-800">
    <div class="flex items-center justify-between text-xs font-mono text-slate-300 mb-2.5">
      <span class="font-bold flex items-center gap-1.5"><span class="text-amber-400">📋</span> Correlated Log Stream (Grafana Loki)</span>
      <span class="text-slate-500 font-normal">{service="payment-api", env="production"} |= "error"</span>
    </div>
    <div class="rounded-lg bg-[#0d0e11] p-3 font-mono text-xs text-slate-300 space-y-1.5 max-h-36 overflow-y-auto border border-slate-800/80 scrollbar-thin" id="loki-log-stream">
      <div class="flex items-start gap-2 text-slate-400">
        <span class="text-slate-600 shrink-0">14:58:12.102</span>
        <span class="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-semibold text-[10px]">INFO</span>
        <span class="truncate">payment-api-7984f8db4-q72pl: POST /v1/charge - 200 OK (duration=18.4ms trace_id=4a89fb71c9)</span>
      </div>
      <div class="flex items-start gap-2 text-rose-300 bg-rose-950/20 px-1 py-0.5 rounded">
        <span class="text-slate-600 shrink-0">14:58:14.491</span>
        <span class="px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 font-semibold text-[10px]">ERROR</span>
        <span class="truncate">payment-api-7984f8db4-q72pl: Database connection pool timeout after 5000ms [trace_id=9d18e472a1]</span>
      </div>
      <div class="flex items-start gap-2 text-amber-300 bg-amber-950/20 px-1 py-0.5 rounded">
        <span class="text-slate-600 shrink-0">14:58:15.012</span>
        <span class="px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 font-semibold text-[10px]">WARN</span>
        <span class="truncate">payment-api-7984f8db4-m82lx: Circuit breaker trip for upstream provider StripeGateway</span>
      </div>
      <div class="flex items-start gap-2 text-slate-400">
        <span class="text-slate-600 shrink-0">14:58:16.890</span>
        <span class="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-semibold text-[10px]">INFO</span>
        <span class="truncate">payment-api-7984f8db4-m82lx: Circuit breaker half-open probe succeeded</span>
      </div>
    </div>
  </div>
</div>

<script>
  window.updateGrafanaState = function() {
    const svc = document.getElementById('var-service').value;
    const availEl = document.getElementById('stat-avail');
    const rpsEl = document.getElementById('stat-rps');
    const p99El = document.getElementById('stat-p99');
    const budgetEl = document.getElementById('stat-budget');
    const budgetBar = document.getElementById('stat-budget-bar');
    const lokiStream = document.getElementById('loki-log-stream');

    if (svc === 'payment-api') {
      availEl.textContent = '99.94%';
      availEl.className = 'text-2xl sm:text-3xl font-bold font-mono text-emerald-400';
      rpsEl.textContent = '18.4k';
      p99El.textContent = '148 ms';
      p99El.className = 'text-2xl sm:text-3xl font-bold font-mono text-amber-400';
      budgetEl.textContent = '65.8%';
      budgetBar.style.width = '65.8%';
      budgetBar.className = 'bg-emerald-400 h-full';
      lokiStream.innerHTML = \`
        <div class="flex items-start gap-2 text-slate-400"><span class="text-slate-600 shrink-0">14:58:12.102</span><span class="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-semibold text-[10px]">INFO</span><span class="truncate">payment-api-7984f8db4-q72pl: POST /v1/charge - 200 OK (duration=18.4ms trace_id=4a89fb71c9)</span></div>
        <div class="flex items-start gap-2 text-rose-300 bg-rose-950/20 px-1 py-0.5 rounded"><span class="text-slate-600 shrink-0">14:58:14.491</span><span class="px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 font-semibold text-[10px]">ERROR</span><span class="truncate">payment-api-7984f8db4-q72pl: Database connection pool timeout after 5000ms [trace_id=9d18e472a1]</span></div>
        <div class="flex items-start gap-2 text-amber-300 bg-amber-950/20 px-1 py-0.5 rounded"><span class="text-slate-600 shrink-0">14:58:15.012</span><span class="px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 font-semibold text-[10px]">WARN</span><span class="truncate">payment-api-7984f8db4-m82lx: Circuit breaker trip for upstream provider StripeGateway</span></div>
      \`;
    } else if (svc === 'auth-service') {
      availEl.textContent = '99.99%';
      availEl.className = 'text-2xl sm:text-3xl font-bold font-mono text-emerald-400';
      rpsEl.textContent = '42.1k';
      p99El.textContent = '38 ms';
      p99El.className = 'text-2xl sm:text-3xl font-bold font-mono text-emerald-400';
      budgetEl.textContent = '94.2%';
      budgetBar.style.width = '94.2%';
      budgetBar.className = 'bg-emerald-400 h-full';
      lokiStream.innerHTML = \`
        <div class="flex items-start gap-2 text-slate-400"><span class="text-slate-600 shrink-0">14:58:10.881</span><span class="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-semibold text-[10px]">INFO</span><span class="truncate">auth-service-589db-281l: JWT Token verified for user uid_88294 (duration=1.8ms)</span></div>
        <div class="flex items-start gap-2 text-slate-400"><span class="text-slate-600 shrink-0">14:58:11.412</span><span class="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-semibold text-[10px]">INFO</span><span class="truncate">auth-service-589db-281l: OAuth2 token refresh issued for client webapp</span></div>
      \`;
    } else if (svc === 'order-processor') {
      availEl.textContent = '98.80%';
      availEl.className = 'text-2xl sm:text-3xl font-bold font-mono text-rose-400';
      rpsEl.textContent = '8.2k';
      p99El.textContent = '840 ms';
      p99El.className = 'text-2xl sm:text-3xl font-bold font-mono text-rose-400';
      budgetEl.textContent = '12.4%';
      budgetBar.style.width = '12.4%';
      budgetBar.className = 'bg-rose-500 h-full';
      lokiStream.innerHTML = \`
        <div class="flex items-start gap-2 text-rose-300 bg-rose-950/20 px-1 py-0.5 rounded"><span class="text-slate-600 shrink-0">14:58:01.992</span><span class="px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 font-semibold text-[10px]">ERROR</span><span class="truncate">order-processor-291fx: Kafka consumer group rebalance in progress, consumer lagging by 48,201 msgs</span></div>
        <div class="flex items-start gap-2 text-rose-300 bg-rose-950/20 px-1 py-0.5 rounded"><span class="text-slate-600 shrink-0">14:58:04.112</span><span class="px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 font-semibold text-[10px]">ERROR</span><span class="truncate">order-processor-291fx: Dead letter queue submission for corrupted order payload #88194</span></div>
      \`;
    } else {
      availEl.textContent = '99.98%';
      availEl.className = 'text-2xl sm:text-3xl font-bold font-mono text-emerald-400';
      rpsEl.textContent = '6.1k';
      p99El.textContent = '48 ms';
      p99El.className = 'text-2xl sm:text-3xl font-bold font-mono text-emerald-400';
      budgetEl.textContent = '88.5%';
      budgetBar.style.width = '88.5%';
      budgetBar.className = 'bg-emerald-400 h-full';
      lokiStream.innerHTML = \`
        <div class="flex items-start gap-2 text-slate-400"><span class="text-slate-600 shrink-0">14:58:08.419</span><span class="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-semibold text-[10px]">INFO</span><span class="truncate">catalog-api-88219-91kld: Redis cache hit for item_id=98812</span></div>
      \`;
    }
  };
</script>
`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 9: High-Cardinality Disasters & TSDB Optimization
  // -------------------------------------------------------------
  {
    id: 'high-cardinality',
    group: 'advanced_sre',
    level: 'Advanced',
    title: '9. High-Cardinality Disasters & TSDB Optimization',
    sectionNo: '09',
    body: [
      {
        t: 'p',
        c: 'Cardinality in Prometheus is the total number of unique time series. Total series = `metric_names × value_permutations(label_1) × value_permutations(label_2) × ...`. A single high-cardinality label (like `user_id` or `uuid`) can multiply series into millions, causing TSDB OOM crashes.',
      },
      {
        t: 'cards',
        title: 'Cardinality Danger Zones vs Safe Patterns',
        items: [
          {
            h: '❌ Cardinality Anti-Patterns (Dangerous)',
            c: '• Inserting UUIDs or Request IDs into labels: `{request_id="8f9a2-..."}`\n• Inserting Email / User IDs into labels: `{user="john@corp.com"}`\n• Dynamic URLs with query strings: `{path="/items?id=99281"}`\n• Unbounded error message strings: `{error="timeout at line 42"}`',
            chips: ['OOM Crash', 'Memory Leak'],
          },
          {
            h: '✅ Production Safe Patterns',
            c: '• Low-entropy finite enums: `{status="500", method="POST"}`\n• Sanitized route templates: `{route="/items/:id"}`\n• Put high-entropy data into **Loki Logs** or **OpenTelemetry Traces** instead of metric labels.\n• Use `promtool tsdb analyze` to find runaway series.',
            chips: ['Scalable', 'Best Practice'],
          },
        ],
      },
      {
        t: 'code',
        lang: 'bash',
        title: 'Diagnosing High-Cardinality Series with promtool',
        c: `# 1. Analyze TSDB disk directory to identify offending labels:
promtool tsdb analyze /var/prometheus/data

# 2. Check TSDB head series live in PromQL:
prometheus_tsdb_head_series

# 3. Strip high-cardinality labels at scrape time in prometheus.yml:
metric_relabel_configs:
  - regex: "user_id|session_token|request_id"
    action: labeldrop`,
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 10: Loki LogQL & OpenTelemetry Distributed Tracing
  // -------------------------------------------------------------
  {
    id: 'loki-opentelemetry',
    group: 'advanced_sre',
    level: 'Advanced',
    title: '10. Centralized Logging (Loki) & Distributed Tracing (OTel)',
    sectionNo: '10',
    body: [
      {
        t: 'p',
        c: '**Grafana Loki** is a horizontally scalable, multi-tenant log aggregation system designed on the Prometheus philosophy: index only labels, store compressed raw logs in S3. **OpenTelemetry** is the industry standard for vendor-neutral distributed tracing.',
      },
      {
        t: 'cards',
        title: 'LogQL & OpenTelemetry in Practice',
        items: [
          {
            h: 'LogQL Stream Filtering & Parsing',
            c: '{app="payment-api", env="prod"}\n  |= "error"\n  != "timeout_ignored"\n  | json\n  | status >= 500\nStreams logs matching labels and parses JSON attributes.',
            chips: ['LogQL', 'Grafana Loki'],
          },
          {
            h: 'Calculating Error Rates directly from Logs',
            c: 'sum by (cluster) (\n  rate({namespace="production"} |= "Exception" [5m])\n)\nConverts raw logs into Prometheus-compatible rate metrics.',
            chips: ['Log Metrics', 'Alerting'],
          },
          {
            h: 'OpenTelemetry (OTel) Context Propagation',
            c: 'Injects W3C `traceparent` headers (`00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`) across microservice boundaries for end-to-end distributed latency traces.',
            chips: ['Distributed Tracing', 'W3C Standard'],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 11: Production Troubleshooting Decision Tree
  // -------------------------------------------------------------
  {
    id: 'troubleshoot-wizard',
    group: 'advanced_sre',
    level: 'Advanced',
    title: '11. 🩺 Production Incident Troubleshooting Wizard',
    sectionNo: '11',
    body: [
      {
        t: 'p',
        c: 'Use this interactive decision tree to diagnose and remediate real-world Prometheus, Grafana, and Alertmanager production incidents:',
      },
      {
        t: 'wizard',
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 12: Interactive Quiz
  // -------------------------------------------------------------
  {
    id: 'interactive-quiz',
    group: 'advanced_sre',
    level: 'Advanced',
    title: '12. 🎯 Senior SRE & Observability Interview Quiz',
    sectionNo: '12',
    body: [
      {
        t: 'p',
        c: 'Test your understanding of Prometheus TSDB internals, PromQL mathematical functions, Alertmanager routing, and Grafana dashboard architecture with this interactive quiz:',
      },
      {
        t: 'quiz',
        questions: [
          {
            q: 'Why should you NEVER use rate() on a Prometheus Gauge metric?',
            options: [
              'rate() will throw a syntax error in PromQL',
              'rate() assumes the metric is a monotonically increasing counter and interprets any downward value drop as a process restart/reset, causing wild and false spikes',
              'Gauges do not support time range brackets like [5m]',
              'rate() only works with floating point numbers, whereas Gauges are integers',
            ],
            correct: 1,
            explain:
              'rate() is mathematically designed for Counters. Whenever a counter drops in value, rate() assumes the process restarted and adds the previous counter value back to compensate. If you run rate() on a Gauge that naturally fluctuates up and down, every downward drop will be falsely interpreted as a reset, corrupting your calculations.',
          },
          {
            q: 'What is the primary architectural difference between Prometheus relabel_configs and metric_relabel_configs?',
            options: [
              'relabel_configs is for Alertmanager, while metric_relabel_configs is for Prometheus',
              'relabel_configs operates before the HTTP scrape on discovery metadata (__meta_*); metric_relabel_configs operates after the scrape payload is received to modify or drop samples before TSDB storage',
              'relabel_configs can only rename metrics, while metric_relabel_configs can only rename labels',
              'There is no difference; they are aliases for the same configuration block',
            ],
            correct: 1,
            explain:
              'relabel_configs happens pre-scrape on target discovery metadata. metric_relabel_configs happens post-scrape on the incoming metrics payload before writing to the TSDB engine, making it ideal for stripping high-cardinality labels or dropping unwanted metric names.',
          },
          {
            q: 'How does Grafana Loki differ fundamentally from Elasticsearch for log aggregation?',
            options: [
              'Loki requires writing logs into MySQL tables',
              'Loki does not index the full text of logs; it only indexes metadata labels and compresses the raw log text into object storage (S3), drastically reducing RAM and disk costs',
              'Loki can only store JSON logs, while Elasticsearch only stores plain text',
              'Loki does not support querying logs older than 24 hours',
            ],
            correct: 1,
            explain:
              'Elasticsearch builds massive Lucene inverted indexes across every word in every log line. Loki only indexes label metadata (like Prometheus) and stores compressed chunks in cheap object storage (S3/GCS), cutting operational and infrastructure costs by up to 80%.',
          },
          {
            q: 'Which PromQL expression correctly calculates the 99th percentile request latency across multiple microservice pods?',
            options: [
              'avg(rate(http_request_duration_seconds[5m])) * 0.99',
              'histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))',
              'quantile_over_time(0.99, http_request_duration_seconds[5m])',
              'sum(rate(http_request_duration_seconds_count[5m])) / 0.99',
            ],
            correct: 1,
            explain:
              'histogram_quantile() calculates quantiles over cumulative histogram buckets. You must aggregate the rate of buckets with sum() by (le, ...) before feeding the result into histogram_quantile().',
          },
          {
            q: 'What happens during an Alertmanager Inhibition rule?',
            options: [
              'Alertmanager deletes the alert from the Prometheus TSDB',
              'Alertmanager mutes a target alert (e.g. Warning alert) if a matching source alert (e.g. Critical NodeDown alert) is already firing on the same instance',
              'Alertmanager forwards the alert directly to PagerDuty without deduplication',
              'Alertmanager disables all metric scraping across the cluster',
            ],
            correct: 1,
            explain:
              'Inhibition prevents alert spam by suppressing notifications for secondary symptoms (e.g. "InstanceDown" warning) when a root-cause alert (e.g. "NodeUnreachable" critical) is already actively firing.',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // MODULE 13: SRE & Observability Cheatsheet
  // -------------------------------------------------------------
  {
    id: 'observability-cheatsheet',
    group: 'advanced_sre',
    level: 'Intermediate',
    title: '13. 📋 PromQL & Observability Master Cheatsheet',
    sectionNo: '13',
    body: [
      {
        t: 'p',
        c: 'Quick reference guide of production PromQL functions, scrape relabeling actions, and SRE mathematical equations:',
      },
      {
        t: 'cheatsheet',
        items: [
          {
            term: 'rate(v[range])',
            def: 'Calculates the per-second average rate of increase of a Counter over the range window. Automatically handles counter resets and boundary extrapolation. Use for alerting and steady trends.',
          },
          {
            term: 'irate(v[range])',
            def: 'Instantaneous rate of increase based strictly on the last two data points in the range window. Highly responsive to sudden spikes. Best for live troubleshooting graphs (never for alerts).',
          },
          {
            term: 'increase(v[range])',
            def: 'Calculates the total increase of a counter over the range window (equivalent to rate(v[range]) * seconds_in_range).',
          },
          {
            term: 'histogram_quantile(φ, v)',
            def: 'Calculates the φ-quantile (0 ≤ φ ≤ 1, e.g. 0.95 or 0.99) from the buckets of a histogram metric. Must include the "le" label in aggregations.',
          },
          {
            term: 'sum by (label_1, label_2) (...)',
            def: 'Aggregates time series together while preserving the specified grouped labels in the output vector.',
          },
          {
            term: 'avg without (instance, pod) (...)',
            def: 'Aggregates time series together while dropping the specified labels from the output vector.',
          },
          {
            term: '$__rate_interval',
            def: 'Grafana built-in variable that calculates the optimal range window for rate() queries based on panel width, step, and scrape interval (at least 4x scrape interval).',
          },
          {
            term: 'promtool check config prometheus.yml',
            def: 'CLI command to validate prometheus.yml syntax and rule files before reloading or deploying.',
          },
          {
            term: 'curl -X POST http://localhost:9090/-/reload',
            def: 'Hot-reloads Prometheus configuration without restarting the process (requires --web.enable-lifecycle flag).',
          },
        ],
      },
    ],
  },
]
