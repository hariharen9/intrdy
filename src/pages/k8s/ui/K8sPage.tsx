import { useState } from 'react'
import { k8sCourse } from '@/entities/k8s'
import { useProgress } from '@/features/progress-tracker'
import {
  DockerCourseView,
  DockerGuideView,
  DockerHeader,
  type ViewMode,
} from '@/widgets'

export function K8sPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('app')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { progress, toggleTopic, total, completed, percent } = useProgress(
    k8sCourse.meta.storageKey,
    k8sCourse.topics,
  )

  return (
    <div className="h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-200 overflow-hidden">
      {/* Header with view toggler, search, progress, and theme switcher */}
      <div className="shrink-0">
        <DockerHeader
          meta={k8sCourse.meta}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          completedCount={completed}
          totalCount={total}
          progressPercent={percent}
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        />
      </div>

      {/* Main Viewport: Modular Course or Editorial Guide (both with independent pane scrolling) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {viewMode === 'app' ? (
          <DockerCourseView
            course={k8sCourse}
            progress={progress}
            onToggleProgress={toggleTopic}
            searchQuery={searchQuery}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        ) : (
          <DockerGuideView course={k8sCourse} />
        )}
      </div>
    </div>
  )
}
