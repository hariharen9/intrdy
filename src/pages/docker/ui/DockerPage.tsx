import { useState } from 'react'
import { dockerCourse } from '@/entities/topic'
import { useProgress } from '@/features/progress-tracker'
import {
  DockerCourseView,
  DockerGuideView,
  DockerHeader,
  type ViewMode,
} from '@/widgets'

export function DockerPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('app')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { progress, toggleTopic, total, completed, percent } = useProgress(
    dockerCourse.meta.storageKey,
    dockerCourse.topics,
  )

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      {/* Sticky Header with view toggler, search, progress, and theme switcher */}
      <DockerHeader
        meta={dockerCourse.meta}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        completedCount={completed}
        totalCount={total}
        progressPercent={percent}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* Main Viewport: Modular Course or Editorial Single-Pass Guide */}
      <div className="flex-1 flex flex-col">
        {viewMode === 'app' ? (
          <DockerCourseView
            course={dockerCourse}
            progress={progress}
            onToggleProgress={toggleTopic}
            searchQuery={searchQuery}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        ) : (
          <DockerGuideView course={dockerCourse} />
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-xs py-7 border-t border-[var(--border)] mono text-[var(--muted)] px-4 bg-[var(--panel)]">
        {dockerCourse.meta.footerText}
      </footer>
    </div>
  )
}
