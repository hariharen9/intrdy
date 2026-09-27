import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/features/theme-toggle'
import { ProgressBar } from '@/features/progress-tracker'
import type { CourseMetadata } from '@/entities/topic'

export type ViewMode = 'app' | 'editorial'

export interface CourseHeaderProps {
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

export function CourseHeader({
  meta,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  completedCount,
  totalCount,
  progressPercent,
  onToggleMobileMenu,
}: CourseHeaderProps) {
  const slug = meta?.slug || 'course'

  return (
    <header className="panel border-b border-[var(--border)] sticky top-0 z-40 backdrop-blur-md bg-[var(--panel)]/95 shadow-xs w-full max-w-full">
      <div className="flex items-center justify-between gap-1.5 sm:gap-3 px-2.5 sm:px-5 py-2 sm:py-3 max-w-[1440px] mx-auto w-full min-w-0">
        {/* Left: Mobile Menu Toggle + Logo + Home Link */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
          {viewMode === 'app' && onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-[var(--panel2)] active:bg-[var(--panel2)] text-[var(--muted)] hover:text-[var(--text)] transition cursor-pointer min-w-[34px] min-h-[34px] flex items-center justify-center shrink-0"
              aria-label="Open topics navigation"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          )}

          <Link
            to="/"
            className="flex items-center gap-1.5 sm:gap-2 select-none hover:opacity-85 transition group min-w-0"
            title="Back to Topic Hub"
          >
            <img src="/favicon.svg" alt="INTRDY Logo" className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg shadow-xs shrink-0 transition-transform group-hover:scale-105" />
            <div className="flex items-center min-w-0">
              <span className="mono font-bold tracking-tight text-[13px] sm:text-[15px] md:text-[16px] text-[var(--text)] truncate">
                {meta?.icon && <span className="mr-1 inline-block">{meta.icon}</span>}
                {slug}
                <span className="accent-text font-normal">://</span>
                <span className="hidden sm:inline">zero-to-hero</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search input (Desktop/Tablet) */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={`Search ${slug} topics… (e.g. volumes, debug)`}
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
                className="absolute right-2.5 top-2 text-xs text-[var(--muted)] hover:text-[var(--text)] p-0.5"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: Mode Switcher, Progress, Theme */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* View Mode Toggle Switch */}
          <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--panel2)] p-0.5 text-xs mono">
            <button
              type="button"
              onClick={() => onViewModeChange('app')}
              className={`px-2 sm:px-2.5 py-1 rounded-md transition cursor-pointer text-[11px] sm:text-xs ${
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
              className={`px-2 sm:px-2.5 py-1 rounded-md transition cursor-pointer text-[11px] sm:text-xs ${
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

      {/* Mobile Search input & Progress pill */}
      <div className="sm:hidden px-3.5 pb-2.5 pt-0.5 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search ${slug} topics…`}
            className="w-full px-3 py-1.5 pl-8 rounded-lg text-xs panel2 border border-[var(--border)] outline-none text-[var(--text)] placeholder-[var(--muted)]"
          />
          <svg
            className="absolute left-2.5 top-2 w-3 h-3 text-[var(--muted)]"
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
              className="absolute right-2 top-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)] px-1"
            >
              ✕
            </button>
          )}
        </div>
        <div className="mono text-[11px] font-semibold text-[var(--accent)] px-2 py-1 rounded-md bg-[var(--panel2)] border border-[var(--border)] shrink-0">
          {completedCount}/{totalCount}
        </div>
      </div>
    </header>
  )
}
