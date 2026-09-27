import { useState } from 'react'
import type { CourseData } from '@/entities/topic'
import { useProgress } from '@/features/progress-tracker'
import {
  CourseHeader,
  CourseView,
  GuideView,
  type ViewMode,
} from '@/widgets'

export interface CoursePageProps {
  course: CourseData
}

export function CoursePage({ course }: CoursePageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('app')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { progress, toggleTopic, total, completed, percent } = useProgress(
    course.meta.storageKey,
    course.topics,
  )

  return (
    <div className="h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-200 overflow-hidden">
      {/* Universal Course Header */}
      <div className="shrink-0">
        <CourseHeader
          meta={course.meta}
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

      {/* Main Viewport: Modular Course or Editorial Guide */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {viewMode === 'app' ? (
          <CourseView
            course={course}
            progress={progress}
            onToggleProgress={toggleTopic}
            searchQuery={searchQuery}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        ) : (
          <GuideView course={course} />
        )}
      </div>
    </div>
  )
}
