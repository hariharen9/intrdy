import type { CourseMetadata } from '@/entities/topic'

export const OBSERVABILITY_METADATA: CourseMetadata = {
  id: 'observability',
  title: 'Prometheus, Grafana & SRE Observability',
  slug: 'observability',
  icon: '📊',
  badgeText: 'Deep Dive Track',
  tagline: 'Master metrics collection, PromQL, Alertmanager, TSDB internals, high-cardinality tuning & Grafana dashboards',
  description:
    'The complete production guide to enterprise observability. Learn the 4 Golden Signals, Prometheus TSDB architecture, PromQL vector matching, Alertmanager routing trees, high-cardinality disaster recovery, Loki log correlation, and build production-grade Grafana dashboards with interactive mock UIs.',
  quote:
    '"Monitoring tells you when something is broken. Observability lets you understand why something you never expected is broken."',
  quoteContext: 'Charity Majors — Observability Engineering.',
  footerText:
    'Production SRE & Observability Curriculum — 13 comprehensive modules · TSDB internals · PromQL mastery · Interactive Mock UIs · Troubleshooting wizard',
  storageKey: 'observability_progress',
  parts: [
    {
      partNo: 'PART 1',
      title: 'Foundations & Metrics Architecture',
      subtitle: 'The 4 Golden Signals, Prometheus TSDB internals & Kubernetes service discovery',
    },
    {
      partNo: 'PART 2',
      title: 'PromQL Mastery & Interactive Query UI',
      subtitle: 'Vector math, rate vs irate, histogram quantiles & live Prometheus UI simulation',
    },
    {
      partNo: 'PART 3',
      title: 'Alerting, Grafana Dashboards & Mock UI',
      subtitle: 'Alertmanager trees, Grafana dashboard architecture & interactive production dashboard UI',
    },
    {
      partNo: 'PART 4',
      title: 'Advanced SRE, Incident Wizard & Interview Drills',
      subtitle: 'High cardinality disasters, Loki, OpenTelemetry, debug wizard, quiz & Q&A bank',
    },
  ],
}
