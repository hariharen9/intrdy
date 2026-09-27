import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/features/theme-toggle'
import { ProgressBar } from '@/features/progress-tracker'
import type { CourseMetadata } from '@/entities/topic'

export type ViewMode = 'app' | 'editorial'

interface DockerHeaderProps {
  meta?: CourseMetadata
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  completedCount: number
  totalCount: number
  progressPercent: number
  onToggleMobileMenu?: () => void
}

export function DockerHeader({
  meta,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  completedCount,
  totalCount,
  progressPercent,
  onToggleMobileMenu,
}: DockerHeaderProps) {
  const icon = meta?.icon || '🐳'
  const slug = meta?.slug || 'docker'

  return (
    <header className="panel border-b border-[var(--border)] sticky top-0 z-40 backdrop-blur-md bg-[var(--panel)]/95 shadow-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 max-w-[1440px] mx-auto w-full">
        {/* Left: Mobile Menu Toggle + Logo + Home Link */}
        <div className="flex items-center gap-3 shrink-0">
          {viewMode === 'app' && onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 rounded-md hover:bg-[var(--panel2)] text-[var(--muted)] hover:text-[var(--text)] transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          )}

          <Link
            to="/"
            className="flex items-center gap-2 select-none hover:opacity-85 transition group"
            title="Back to Topic Hub"
          >
            <span className="text-2xl transition-transform group-hover:scale-110">{icon}</span>
            <div className="flex flex-col">
              <span className="mono font-bold tracking-tight text-[15px] sm:text-[16px] text-[var(--text)]">
                {slug}
                <span className="accent-text font-normal">://</span>
                zero-to-hero
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search input */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={`Search ${slug} topics… (e.g. volumes, CMD, networking)`}
              className="w-full px-3.5 py-1.5 pl-9 rounded-lg text-sm panel2 border border-[var(--border)] outline-none text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] transition"
            />
            <svg
              className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--muted)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2 text-xs text-[var(--muted)] hover:text-[var(--text)]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: Mode Switcher, Progress, Theme */}
        <div className="flex items-center gap-3 shrink-0">
          {/* View Mode Toggle Switch */}
          <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--panel2)] p-0.5 text-xs mono">
            <button
              type="button"
              onClick={() => onViewModeChange('app')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                viewMode === 'app'
                  ? 'bg-[var(--accent)] text-slate-950 font-bold shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
              title="Interactive modular course layout (Sidebar & Modules)"
            >
              Course
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('editorial')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                viewMode === 'editorial'
                  ? 'bg-[var(--accent)] text-slate-950 font-bold shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
              title="Single-pass editorial reader guide (Continuous document)"
            >
              Guide
            </button>
          </div>

          {/* Progress (in app mode) */}
          <div className="hidden lg:flex items-center">
            <ProgressBar
              completed={completedCount}
              total={totalCount}
              percent={progressPercent}
            />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Search input */}
      <div className="sm:hidden px-4 pb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Search ${slug} topics…`}
          className="w-full px-3 py-1.5 rounded-lg text-xs panel2 border border-[var(--border)] outline-none text-[var(--text)] placeholder-[var(--muted)]"
        />
      </div>
    </header>
  )
}
