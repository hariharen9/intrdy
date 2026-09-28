import type { QAItem } from '@/entities/topic'

export const OBSERVABILITY_QA_FUND: QAItem[] = [
  [
    'What are the Three Pillars of Observability, and what are the limitations of this traditional model?',
    'The traditional 3 pillars are Metrics (numeric aggregations over time), Logs (timestamped discrete event records with context), and Traces (end-to-end request journeys across distributed microservices). The limitation of thinking in "pillars" is that they are often siloed in different tools with no correlation. Modern observability unifies them using shared metadata (trace ID injection into logs, metric exemplar links to traces, and standardized OpenTelemetry semantic conventions) allowing an engineer to click from a latency spike in Grafana directly into the trace and exact error logs.',
  ],
  [
    'Explain the 4 Golden Signals of SRE and how you would measure each in Prometheus.',
    'The 4 Golden Signals (from Google SRE book) are:\n1. Latency: Time taken to service a request (e.g. histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))).\n2. Traffic: Demand placed on your system, measured as requests per second (e.g. sum(rate(http_requests_total[5m]))).\n3. Errors: Rate of requests failing explicitly (e.g. HTTP 500s) or implicitly (e.g. HTTP 200 with wrong body). (sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100).\n4. Saturation: How full your service or infrastructure is (e.g. memory usage vs limit, queue depth, thread pool exhaustion).',
  ],
  [
    'What is the difference between Prometheus Push vs Pull model, and why does Prometheus prefer Pull?',
    'In a Pull model (Prometheus default), Prometheus reaches out to target /metrics endpoints over HTTP at periodic intervals (scrape_interval). In a Push model (e.g. CloudWatch, StatsD), applications push metrics to a centralized ingest gateway. Prometheus prefers Pull because:\n1. Health Detection: If a target cannot be scraped, Prometheus immediately knows it is DOWN (up == 0).\n2. Load Protection: The monitoring server controls scrape rate and concurrency, preventing a traffic surge from overwhelming the monitoring pipeline.\n3. Simplicity & Decoupling: Targets do not need to know where the Prometheus server lives.\nFor short-lived batch jobs that exit before a scrape occurs, Prometheus uses the Pushgateway as an intermediary buffer.',
  ],
  [
    'What are the four core Prometheus Metric Types, and when do you use each?',
    '1. Counter: A cumulative metric that only ever increases or resets to zero upon process restart (e.g. http_requests_total, errors_total). Used with rate(), irate(), or increase().\n2. Gauge: A numerical value that can arbitrarily go up or down (e.g. memory_usage_bytes, cpu_temperature, active_connections). Used with avg_over_time() or max_over_time(). Never use rate() on a gauge.\n3. Histogram: Samples observations (usually request durations or response sizes) and counts them in configurable buckets (le labels) plus calculates sum and count. Allows calculating percentiles (P90, P99) across distributed nodes using histogram_quantile().\n4. Summary: Calculates configurable quantiles (e.g. P50, P99) directly on the client side over a sliding time window. More accurate on a single instance, but cannot be aggregated across multiple instances or pods.',
  ],
  [
    'What is the difference between rate() and irate() in PromQL, and when should each be used?',
    'Both functions calculate per-second rate of increase of a Counter over a time window:\n• rate(v[5m]): Calculates the average per-second rate over the entire specified time window (e.g. 5 minutes). It automatically accounts for counter resets (spikes back to 0) and extrapolates across window boundaries. Best for: Alerting rules, dashboards with steady trends, and SLO calculations.\n• irate(v[5m]): "Instant rate" calculates the per-second rate based only on the last two data points within the range window. It is highly responsive to instantaneous spikes and drops. Best for: Fast-changing diagnostic graphs during live incident troubleshooting. (Never use irate for alerting rules as it is too volatile).',
  ],
  [
    'What is Prometheus relabel_configs vs metric_relabel_configs?',
    'Both transform labels using regex, but occur at different stages of the scrape pipeline:\n• relabel_configs: Happens BEFORE the scrape occurs. It operates on target discovery metadata labels (starting with `__meta_`) to decide WHICH targets to scrape, build the `__address__` and `__metrics_path__`, and assign static labels (like environment, cluster).\n• metric_relabel_configs: Happens AFTER the scrape HTTP payload is received, but BEFORE samples are written to the TSDB storage engine. It is used to drop unwanted metrics, strip high-cardinality labels, or rename metric series to save disk and memory.',
  ],
  [
    'How does Prometheus Store Time Series Data internally (TSDB Architecture)?',
    'Prometheus TSDB writes incoming samples into an in-memory Head Block, append-only Write-Ahead Log (WAL) on disk for crash durability, and Memory-Mapped (mmap) Chunk files. Every 2 hours, the in-memory Head block is compacted and flushed to disk as an immutable 2-hour Block directory containing:\n1. /chunks/: Compressed time-series samples (using Gorilla/XOR float compression and delta-of-delta timestamp compression).\n2. index: Inverted index mapping metric names and label pairs to Series IDs (posting lists).\n3. meta.json: Block metadata and time boundaries (minTime / maxTime).\nOlder 2-hour blocks are progressively compacted into larger 6-hour, 14-hour blocks to reduce disk read overhead.',
  ],
  [
    'What is a Prometheus Recording Rule and why is it critical for Grafana performance?',
    'A Recording Rule pre-computes frequently needed or computationally expensive PromQL expressions (e.g. calculating 5-minute rates of millions of requests aggregated across 500 pods) and saves the result as a brand new time-series metric into TSDB at regular intervals. When a Grafana dashboard loads, instead of evaluating raw queries across millions of raw data points on every refresh (which times out), it queries the lightweight pre-computed metric in milliseconds.',
  ],
]

export const OBSERVABILITY_QA_ADV: QAItem[] = [
  [
    'What is a Cardinality Explosion in Prometheus, how do you detect it, and how do you resolve it in production?',
    'High cardinality occurs when time-series labels contain unbounded or high-entropy values (e.g. user_id, uuid, email, IP address, exact URL with query params). Each unique combination of label keys and values creates a distinct time-series in RAM (each series costs ~1.5KB to 3KB of memory in the Head block).\n• Detection: Run `prometheus_tsdb_head_series` or inspect Prometheus /api/v1/status/tsdb to see top label names with highest cardinality. Use `promtool tsdb analyze /data`.\n• Resolution:\n1. Update application instrumentation to sanitize labels (replace dynamic IDs with route templates like `/users/:id`).\n2. Add `metric_relabel_configs` with `action: labeldrop` or `regex` drops in prometheus.yml to strip offending labels before TSDB write.\n3. Drop unused metrics entirely via `action: drop`.',
  ],
  [
    'Explain how histogram_quantile() works mathematically and why calculating percentiles over aggregated histograms can introduce errors.',
    'Prometheus histograms count observations into cumulative upper-bounded buckets (labeled `le="0.1"`, `le="0.5"`, `le="+Inf"`). When calculating `histogram_quantile(0.99, sum(rate(...)) by (le))`:\n1. Prometheus finds the bucket where the 99th percentile rank falls.\n2. It assumes observations are evenly distributed within that bucket and uses linear interpolation to estimate the quantile value.\n• Potential Inaccuracies: If bucket boundaries are too wide (e.g., jump from 100ms straight to 10s), linear interpolation will be inaccurate. Also, percentiles cannot be mathematically averaged—however, histogram bucket counts are linear and CAN be safely summed with `sum() by (le)` before calling `histogram_quantile()`.',
  ],
  [
    'Explain the lifecycle of an Alert in Prometheus & Alertmanager (Inactive → Pending → Firing).',
    '1. Inactive: The alert expression (e.g. error rate > 5%) evaluates to FALSE.\n2. Pending: The alert expression evaluates to TRUE for the first time. Prometheus starts a timer. The alert stays in Pending state for the duration specified in the `for: 5m` clause. (This prevents alerting on transient 5-second blips).\n3. Firing: The expression has remained TRUE continuously for the full `for` duration. Prometheus sends the alert payload to Alertmanager.\n4. Alertmanager Processing: Alertmanager applies Deduplication, Grouping (`group_by` batches related alerts into 1 notification), Inhibition (mutes warning alerts if a critical alert for the same host is firing), and Silences before dispatching to receivers (PagerDuty, Slack, Webhooks).',
  ],
  [
    'How do you achieve High Availability and Long-Term Storage (LTS) for Prometheus at scale?',
    'A single Prometheus server is stateful and designed as a local monitoring node. For HA and scalable multi-cluster setups, industry standard architectures include:\n1. Redundant Pairs: Run two identical Prometheus servers scraping the exact same targets. Alertmanager handles deduplicating the alert notifications.\n2. Thanos: Adds a Thanos Sidecar to each Prometheus instance to upload 2-hour blocks to Object Storage (S3/GCS), and uses Thanos Querier for global querying across clusters with deduplication and downsampling (5m and 1h resolutions).\n3. Grafana Mimir / Cortex: Horizontally scalable, multi-tenant TSDB architecture using Prometheus remote_write to push metrics into a distributed cluster with persistent object storage.\n4. Prometheus Agent Mode: Lightweight scraper with zero local TSDB querying, only buffering and forwarding metrics via `remote_write`.',
  ],
  [
    'What is LogQL in Grafana Loki, and how does Loki differ fundamentally from Elasticsearch/ELK?',
    '• Architecture Difference: Elasticsearch indexes the full-text content of every log message using Lucene inverted indexes, which requires massive RAM and disk storage. Grafana Loki ONLY indexes the metadata labels (like `app="checkout"`, `namespace="prod"`, `cluster="us-east-1"`), keeping the raw log payload compressed in chunks stored directly in cheap Object Storage (S3).\n• LogQL: Loki\'s Prometheus-inspired query language. It allows stream selection (`{app="checkout", env="prod"}`), line filtering (`|= "error"`, `!= "healthcheck"`), pattern extraction (`| json` or `| pattern`), and metric generation from logs (e.g., `rate({app="checkout"} |= "timeout" [5m])`).',
  ],
  [
    'How does OpenTelemetry (OTel) integrate with Prometheus and Grafana?',
    'OpenTelemetry is the CNCF standard for vendor-agnostic telemetry generation (APIs, SDKs, and OTel Collector). In production:\n1. Applications instrumented with OpenTelemetry SDKs emit traces, metrics, and logs via OTLP (gRPC/HTTP).\n2. The OTel Collector receives telemetry, batches and enriches it with Kubernetes metadata, and exports metrics to Prometheus (via Prometheus scrape exporter or OTLP remote_write), traces to Tempo/Jaeger, and logs to Loki.\n3. Grafana connects to Prometheus and Tempo, allowing seamless Exemplar navigation: clicking a slow point on a Prometheus response time graph immediately jumps to the exact OpenTelemetry Trace ID in Grafana Tempo.',
  ],
]
