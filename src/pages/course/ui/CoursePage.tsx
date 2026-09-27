import { useState } from 'react'
import type { CourseData } from '@/entities/topic'
import { useProgress } from '@/features/progress-tracker'
import { usePins, PinsDrawer } from '@/features/pins'
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
  const [pinsDrawerOpen, setPinsDrawerOpen] = useState(false)
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>(undefined)

  const { progress, toggleTopic, total, completed, percent } = useProgress(
    course.meta.storageKey,
    course.topics,
  )

  const {
    pins,
    pinsCount,
    pinsByTopic,
    addPin,
    removePin,
    clearPins,
    exportPinsAsMarkdown,
  } = usePins(course.meta.storageKey)

  const handleJumpToTopic = (topicId: string) => {
    setSelectedTopicId(topicId)
    setPinsDrawerOpen(false)
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-200 overflow-hidden">
      {/* Universal Course Header with Pins Badge */}
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
          pinsCount={pinsCount}
          onOpenPins={() => setPinsDrawerOpen(true)}
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
            selectedTopicId={selectedTopicId}
            onPin={addPin}
          />
        ) : (
          <GuideView
            course={course}
            selectedTopicId={selectedTopicId}
            onPin={addPin}
          />
        )}
      </div>

      {/* Slide-over Revision Pins Drawer */}
      <PinsDrawer
        isOpen={pinsDrawerOpen}
        onClose={() => setPinsDrawerOpen(false)}
        pins={pins}
        pinsByTopic={pinsByTopic}
        onRemovePin={removePin}
        onClearAll={clearPins}
        onExportMarkdown={() => exportPinsAsMarkdown(course.meta.title)}
        onJumpToTopic={handleJumpToTopic}
        courseTitle={course.meta.title}
      />
    </div>
  )
}
