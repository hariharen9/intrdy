import { Link } from 'react-router-dom'
import { dockerCourse } from '@/entities/docker'
import { useProgress } from '@/features/progress-tracker'
import { ThemeToggle } from '@/features/theme-toggle'

export function HomePage() {
  const { completed, total, percent } = useProgress(
    dockerCourse.meta.storageKey,
    dockerCourse.topics,
  )

  const upcomingCourses = [
    {
      id: 'kubernetes',
      icon: '☸️',
      title: 'Kubernetes: Production & Fleet',
      tagline: 'Pod lifecycles, service meshes, cluster scheduler & incident triage.',
      status: 'Coming Soon',
      modulesCount: '20 modules',
    },
    {
      id: 'linux',
      icon: '🐧',
      title: 'Linux Internals & Performance',
      tagline: 'Syscalls, eBPF, namespaces, cgroups, virtual memory & profiling.',
      status: 'Coming Soon',
      modulesCount: '16 modules',
    },
    {
      id: 'git',
      icon: '🌿',
      title: 'Git & Trunk-Based CI/CD',
      tagline: 'DAG internals, fast-forward rebasing, artifact caching & deployment.',
      status: 'Coming Soon',
      modulesCount: '12 modules',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      {/* Top Navigation */}
      <header className="panel border-b border-[var(--border)] sticky top-0 z-40 backdrop-blur-md bg-[var(--panel)]/95 shadow-xs">
        <div className="flex items-center justify-between px-3.5 sm:px-8 py-3 max-w-[1280px] mx-auto w-full">
          <Link to="/" className="flex items-center gap-2 select-none group">
            <span className="mono font-bold tracking-tight text-base sm:text-lg text-[var(--text)]">
              INT<span className="accent-text">RDY</span>
            </span>
            <span className="text-[10px] sm:text-[11px] mono px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--muted)] bg-[var(--panel2)]">
              v1.0
            </span>
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/docker"
              className="text-xs mono font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--panel2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition text-[var(--muted)]"
            >
              🐳 Docker Track
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-[1280px] mx-auto w-full px-3.5 sm:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-3xl">
          <div className="mono text-[11px] sm:text-xs font-bold text-[var(--accent)] uppercase tracking-widest mb-2.5">
            Zero to Hero Curriculum & Interview Prep
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] text-[var(--text)] mb-4 sm:mb-5">
            Master production systems from first principles.
          </h1>
          <p className="text-[15px] sm:text-lg text-[var(--muted)] leading-relaxed mb-8 sm:mb-10">
            Interactive, deep technical whitepaper guides built to take you from curious to senior interview-ready.
            Featuring visual memory stacks, execution timelines, troubleshooting decision trees, and curated Q&A banks.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 sm:mb-5">
            <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] font-bold mono">
              Available & Upcoming Tracks
            </h2>
            <span className="text-xs mono text-[var(--muted)]">
              {completed > 0 ? `${completed}/${total} topics understood (${percent}%)` : '1 active track'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Active Track: Docker */}
            <div className="panel rounded-2xl border-2 border-[var(--accent)]/50 bg-[var(--panel)] p-5 sm:p-7 shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-[var(--accent)] transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-4xl p-2 sm:p-2.5 rounded-xl bg-[var(--panel2)] border border-[var(--border)] shrink-0">
                      {dockerCourse.meta.icon}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="badge mono text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border border-[var(--accent)] text-[var(--accent)] bg-teal-950/20">
                          Ready to Learn
                        </span>
                        <span className="text-[11px] sm:text-xs mono text-[var(--muted)]">
                          17 Modules + 23 Scenarios
                        </span>
                      </div>
                      <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--text)] mt-1">
                        {dockerCourse.meta.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[var(--muted)] leading-relaxed mt-2 mb-6">
                  {dockerCourse.meta.description}
                </p>

                {/* Progress bar preview */}
                <div className="panel2 rounded-xl border border-[var(--border)] p-3.5 mb-6">
                  <div className="flex justify-between text-xs mono mb-1.5">
                    <span className="text-[var(--text)] font-medium">Your Progress</span>
                    <span className="text-[var(--accent)] font-semibold">
                      {completed}/{total} understood ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden bg-[var(--panel)] border border-[var(--border)]">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${percent}%`,
                        background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[var(--border)]">
                <Link
                  to="/docker"
                  className="flex-1 text-center py-2.5 px-4 rounded-xl text-xs sm:text-sm mono font-bold bg-[var(--accent)] text-slate-950 hover:opacity-90 transition shadow-xs"
                >
                  Open Interactive Course →
                </Link>
              </div>
            </div>

            {/* Upcoming Track Placeholders */}
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
        INTRDY — Container Curious to Senior Interview Ready
      </footer>
    </div>
  )
}
