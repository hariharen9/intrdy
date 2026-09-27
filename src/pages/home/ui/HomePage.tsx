import { Link } from 'react-router-dom'
import { dockerCourse } from '@/entities/docker'
import { k8sCourse } from '@/entities/k8s'
import { jenkinsCourse } from '@/entities/jenkins'
import { gitCourse } from '@/entities/git'
import { ansibleCourse } from '@/entities/ansible'
import { artifactoryCourse } from '@/entities/artifactory'
import { terraformCourse } from '@/entities/terraform'
import { dockerCrashCourse } from '@/entities/docker-crash'
import { useProgress } from '@/features/progress-tracker'
import { ThemeToggle } from '@/features/theme-toggle'

export function HomePage() {
  const docker = useProgress(dockerCourse.meta.storageKey, dockerCourse.topics)
  const k8s = useProgress(k8sCourse.meta.storageKey, k8sCourse.topics)
  const jenkins = useProgress(jenkinsCourse.meta.storageKey, jenkinsCourse.topics)
  const git = useProgress(gitCourse.meta.storageKey, gitCourse.topics)
  const ansible = useProgress(ansibleCourse.meta.storageKey, ansibleCourse.topics)
  const artifactory = useProgress(artifactoryCourse.meta.storageKey, artifactoryCourse.topics)
  const terraform = useProgress(terraformCourse.meta.storageKey, terraformCourse.topics)
  const dockerCrash = useProgress(dockerCrashCourse.meta.storageKey, dockerCrashCourse.topics)

  const upcomingCourses = [
    {
      id: 'linux',
      icon: '🐧',
      title: 'Linux Internals & Performance',
      tagline: 'Syscalls, eBPF, namespaces, cgroups, virtual memory & profiling.',
      status: 'Coming Soon',
      modulesCount: '16 modules',
    },
    {
      id: 'observability',
      icon: '📊',
      title: 'Prometheus, Grafana & OpenTelemetry',
      tagline: 'Metrics collection, PromQL, Alertmanager, Loki logs & distributed tracing.',
      status: 'Coming Soon',
      modulesCount: '15 modules',
    },
  ]

  const deepDiveCourses = [
    {
      course: dockerCourse,
      progress: docker,
      href: '/docker',
      label: '17 Modules + 23 Scenarios',
      badge: 'Deep Dive Track',
    },
    {
      course: k8sCourse,
      progress: k8s,
      href: '/kubernetes',
      label: '20 Modules + 23 Scenarios',
      badge: 'Deep Dive Track',
    },
    {
      course: jenkinsCourse,
      progress: jenkins,
      href: '/jenkins',
      label: '23 Modules + 20 Q&As',
      badge: 'Deep Dive Track',
    },
    {
      course: gitCourse,
      progress: git,
      href: '/git',
      label: '24 Modules + 20 Q&As',
      badge: 'Deep Dive Track',
    },
    {
      course: ansibleCourse,
      progress: ansible,
      href: '/ansible',
      label: '24 Modules + 20 Q&As',
      badge: 'Deep Dive Track',
    },
    {
      course: artifactoryCourse,
      progress: artifactory,
      href: '/artifactory',
      label: '27 Modules + 25 Q&As',
      badge: 'Deep Dive Track',
    },
  ]

  const crashCourses = [
    {
      course: dockerCrashCourse,
      progress: dockerCrash,
      href: '/docker-crash',
      label: '11 Focused Modules · ~40 min',
      badge: '⚡ Fast-Track Crash Course',
      highlight: 'Ultra-clear mental models: container vs VM, core commands, multi-stage builds, port mapping, named volumes & Docker Compose.',
    },
    {
      course: terraformCourse,
      progress: terraform,
      href: '/terraform',
      label: '12 Focused Modules · ~45 min',
      badge: '⚡ Fast-Track Crash Course',
      highlight: 'Lightweight & beginner-friendly: core HCL syntax, init/plan/apply workflow, remote state locking & modular IaC without cognitive overload.',
    },
  ]

  const allActive = [...deepDiveCourses, ...crashCourses]

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      {/* Top Navigation */}
      <header className="panel border-b border-[var(--border)] sticky top-0 z-40 backdrop-blur-md bg-[var(--panel)]/95 shadow-xs">
        <div className="flex items-center justify-between px-3.5 sm:px-8 py-3 max-w-[1280px] mx-auto w-full">
          <Link to="/" className="flex items-center gap-2.5 select-none group">
            <img src="/favicon.svg" alt="INTRDY Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shadow-xs transition-transform group-hover:scale-105" />
            <span className="mono font-bold tracking-tight text-base sm:text-lg text-[var(--text)]">
              INT<span className="accent-text">RDY</span>
            </span>
            <span className="text-[10px] sm:text-[11px] mono px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--muted)] bg-[var(--panel2)]">
              v1.0
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              to="/docker"
              className="text-xs mono font-semibold px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--panel2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition text-[var(--muted)]"
            >
              🐳 Docker
            </Link>
            <Link
              to="/kubernetes"
              className="text-xs mono font-semibold px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--panel2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition text-[var(--muted)]"
            >
              ☸️ K8s
            </Link>
            <Link
              to="/jenkins"
              className="text-xs mono font-semibold px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--panel2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition text-[var(--muted)]"
            >
              ⚙️ Jenkins
            </Link>
            <Link
              to="/git"
              className="text-xs mono font-semibold px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--panel2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition text-[var(--muted)]"
            >
              🌿 Git
            </Link>
            <Link
              to="/ansible"
              className="text-xs mono font-semibold px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--panel2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition text-[var(--muted)]"
            >
              ⚡ Ansible
            </Link>
            <Link
              to="/artifactory"
              className="text-xs mono font-semibold px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--panel2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition text-[var(--muted)]"
            >
              📦 Artifactory
            </Link>
            <Link
              to="/terraform"
              className="text-xs mono font-semibold px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--panel2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition text-[var(--muted)]"
            >
              🌍 Terraform
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-[1280px] mx-auto w-full px-3.5 sm:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-3xl">
          <div className="mono text-[11px] sm:text-xs font-bold text-[var(--accent)] uppercase tracking-widest mb-2.5">
            Zero to Hero Curriculum &amp; Interview Prep
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] text-[var(--text)] mb-4 sm:mb-5">
            Master production systems from first principles.
          </h1>
          <p className="text-[15px] sm:text-lg text-[var(--muted)] leading-relaxed mb-8 sm:mb-10">
            Interactive, deep technical whitepaper guides and fast-track crash courses built to take you from curious to senior interview-ready.
            Featuring visual memory stacks, execution timelines, troubleshooting decision trees, and curated Q&amp;A banks.
          </p>
        </div>

        {/* SECTION 1: Deep Dive Tracks */}
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 sm:mb-5">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] font-bold mono">
                Deep Dive Master Tracks
              </h2>
              <p className="text-xs text-[var(--muted)] mt-0.5">Comprehensive, end-to-end architectures &amp; advanced production operations</p>
            </div>
            <span className="text-xs mono text-[var(--muted)]">
              {allActive.reduce((a, c) => a + c.progress.completed, 0)} topics understood across all tracks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-12">
            {deepDiveCourses.map(({ course, progress, href, label, badge }) => (
              <div
                key={course.meta.id}
                className="panel rounded-2xl border-2 border-[var(--accent)]/50 bg-[var(--panel)] p-5 sm:p-7 shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-[var(--accent)] transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-full blur-2xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl sm:text-4xl p-2 sm:p-2.5 rounded-xl bg-[var(--panel2)] border border-[var(--border)] shrink-0">
                        {course.meta.icon}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="badge mono text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border border-[var(--accent)] text-[var(--accent)] bg-teal-950/20">
                            {badge}
                          </span>
                          <span className="text-[11px] sm:text-xs mono text-[var(--muted)]">
                            {label}
                          </span>
                        </div>
                        <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--text)] mt-1">
                          {course.meta.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--muted)] leading-relaxed mt-2 mb-6">
                    {course.meta.description}
                  </p>

                  {/* Progress bar preview */}
                  <div className="panel2 rounded-xl border border-[var(--border)] p-3.5 mb-6">
                    <div className="flex justify-between text-xs mono mb-1.5">
                      <span className="text-[var(--text)] font-medium">Your Progress</span>
                      <span className="text-[var(--accent)] font-semibold">
                        {progress.completed}/{progress.total} understood ({progress.percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden bg-[var(--panel)] border border-[var(--border)]">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${progress.percent}%`,
                          background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[var(--border)]">
                  <Link
                    to={href}
                    className="flex-1 text-center py-2.5 px-4 rounded-xl text-xs sm:text-sm mono font-bold bg-[var(--accent)] text-slate-950 hover:opacity-90 transition shadow-xs"
                  >
                    Open Interactive Course →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* SECTION 2: Crash Courses & Fundamentals */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 sm:mb-5 pt-4 border-t border-[var(--border)]">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-[var(--accent)] font-bold mono flex items-center gap-2">
                <span>⚡</span> Fast-Track Crash Courses
              </h2>
              <p className="text-xs text-[var(--muted)] mt-0.5">Lighter, high-speed foundational modules designed for quick onboarding without information overload</p>
            </div>
            <span className="text-xs mono px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--panel2)] text-[var(--muted)]">
              Lightweight Track
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-12">
            {crashCourses.map(({ course, progress, href, label, badge, highlight }) => (
              <div
                key={course.meta.id}
                className="panel rounded-2xl border-2 border-amber-500/40 bg-[var(--panel)] p-5 sm:p-7 shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-amber-500 transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl sm:text-4xl p-2 sm:p-2.5 rounded-xl bg-[var(--panel2)] border border-[var(--border)] shrink-0">
                        {course.meta.icon}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="badge mono text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border border-amber-500 text-amber-500 bg-amber-950/20">
                            {badge}
                          </span>
                          <span className="text-[11px] sm:text-xs mono text-[var(--muted)]">
                            {label}
                          </span>
                        </div>
                        <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--text)] mt-1">
                          {course.meta.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--muted)] leading-relaxed mt-2 mb-3">
                    {course.meta.description}
                  </p>

                  <div className="p-3 rounded-xl bg-[var(--panel2)]/80 border border-[var(--border)] text-xs text-[var(--text)] mb-6 leading-relaxed">
                    <span className="font-semibold text-amber-400 mr-1.5">⚡ Fast-Track Focus:</span>
                    {highlight}
                  </div>

                  {/* Progress bar preview */}
                  <div className="panel2 rounded-xl border border-[var(--border)] p-3.5 mb-6">
                    <div className="flex justify-between text-xs mono mb-1.5">
                      <span className="text-[var(--text)] font-medium">Your Progress</span>
                      <span className="text-amber-400 font-semibold">
                        {progress.completed}/{progress.total} understood ({progress.percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden bg-[var(--panel)] border border-[var(--border)]">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${progress.percent}%`,
                          background: 'linear-gradient(90deg, #F0B45A, #E8A33D)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[var(--border)]">
                  <Link
                    to={href}
                    className="flex-1 text-center py-2.5 px-4 rounded-xl text-xs sm:text-sm mono font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition shadow-xs"
                  >
                    Start Crash Course →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* SECTION 3: Upcoming Tracks */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 sm:mb-5 pt-4 border-t border-[var(--border)]">
            <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] font-bold mono">
              Upcoming Tracks
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {upcomingCourses.map((course) => (
              <div
                key={course.id}
                className="panel rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 sm:p-7 shadow-xs flex flex-col justify-between opacity-85 hover:opacity-100 transition-opacity"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl sm:text-4xl p-2.5 rounded-xl bg-[var(--panel2)] border border-[var(--border)] opacity-80">
                      {course.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] mono px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--muted)] bg-[var(--panel2)] font-semibold">
                          {course.status}
                        </span>
                        <span className="text-xs mono text-[var(--muted)]">
                          {course.modulesCount}
                        </span>
                      </div>
                      <h3 className="font-heading text-xl sm:text-2xl font-semibold text-[var(--text)] mt-1">
                        {course.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mt-2 mb-6">
                    {course.tagline}
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--border)]">
                  <span className="text-xs mono text-[var(--muted)] font-medium">
                    Curriculum under active development
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs py-7 border-t border-[var(--border)] mono text-[var(--muted)] px-4 bg-[var(--panel)]">
        INTRDY — Container Curious to Senior DevOps Interview Ready
      </footer>
    </div>
  )
}
