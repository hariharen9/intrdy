import { useMemo, useState } from 'react'
import {
  type CourseData,
  dockerCourse,
  type Topic,
} from '@/entities/docker'
import { QAAccordion } from '@/features/qa-accordion'
import { TopicBodyRenderer } from '@/widgets/docker-diagrams'

interface DockerCourseViewProps {
  course?: CourseData
  progress: Record<string, boolean>
  onToggleProgress: (id: string) => void
  searchQuery: string
  mobileOpen: boolean
  onCloseMobile: () => void
}

const DEFAULT_FALLBACK_TOPIC: Topic = {
  id: 'why',
  group: 'fund',
  level: 'Beginner',
  title: 'Overview',
  body: [],
}

export function DockerCourseView({
  course = dockerCourse,
  progress,
  onToggleProgress,
  searchQuery,
  mobileOpen,
  onCloseMobile,
}: DockerCourseViewProps) {
  const [activeTopicId, setActiveTopicId] = useState<string>(
    course.topics[0]?.id ?? DEFAULT_FALLBACK_TOPIC.id,
  )

  const filteredTopics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return course.topics
    return course.topics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        JSON.stringify(t.body).toLowerCase().includes(q),
    )
  }, [searchQuery, course.topics])

  const activeTopic = useMemo(() => {
    return (
      course.topics.find((t) => t.id === activeTopicId) ??
      course.topics[0] ??
      DEFAULT_FALLBACK_TOPIC
    )
  }, [activeTopicId, course.topics])

  const isDone = !!progress[activeTopic.id]

  const handleSelectTopic = (id: string) => {
    setActiveTopicId(id)
    onCloseMobile()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderNavItems = () => {
    if (searchQuery.trim()) {
      if (filteredTopics.length === 0) {
        return (
          <div className="px-4 py-6 text-sm text-[var(--muted)] text-center">
            No matching topics found for "{searchQuery}"
          </div>
        )
      }
      return (
        <div className="py-2 space-y-0.5">
          {filteredTopics.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleSelectTopic(t.id)}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition cursor-pointer border-l-2 ${
                t.id === activeTopic.id
                  ? 'text-[var(--accent)] border-l-[var(--accent)] bg-[var(--panel2)] font-medium'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--panel2)] border-l-transparent'
              }`}
            >
              <span className="truncate">{t.title}</span>
            </button>
          ))}
        </div>
      )
    }

    let counter = 0
    return course.groups.map((g) => {
      const groupTopics = course.topics.filter((t) => t.group === g.id)
      if (!groupTopics.length) return null

      return (
        <div key={g.id} className="mb-2">
          <div className="px-4 pt-3.5 pb-1 text-[11px] mono uppercase tracking-wider font-bold text-[var(--muted)]">
            {g.name}
          </div>
          <div className="space-y-0.5">
            {groupTopics.map((t) => {
              counter++
              const done = !!progress[t.id]
              const isInterview = g.id === 'interview'
              const isActive = t.id === activeTopic.id

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTopic(t.id)}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2.5 transition cursor-pointer border-l-2 ${
                    isActive
                      ? 'text-[var(--accent)] border-l-[var(--accent)] bg-[var(--panel2)] font-medium'
                      : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--panel2)] border-l-transparent'
                  }`}
                >
                  <span
                    className={`text-xs ${
                      done ? 'text-[var(--accent)]' : 'text-[var(--border)] opacity-80'
                    }`}
                  >
                    {done ? '●' : '○'}
                  </span>
                  {!isInterview && (
                    <span className="mono text-[11px] text-[var(--muted)] shrink-0">
                      {counter}.
                    </span>
                  )}
                  <span className="truncate">{t.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      )
    })
  }

  return (
    <div className="flex flex-1 max-w-[1440px] mx-auto w-full min-h-[calc(100vh-60px)]">
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:block w-72 lg:w-80 shrink-0 border-r border-[var(--border)] overflow-y-auto"
        style={{
          maxHeight: 'calc(100vh - 58px)',
          position: 'sticky',
          top: '58px',
        }}
      >
        <nav className="py-3 pr-1">{renderNavItems()}</nav>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 sm:w-80 panel z-50 transition-transform duration-200 md:hidden overflow-y-auto shadow-2xl border-r border-[var(--border)] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center px-4 py-3.5 border-b border-[var(--border)] sticky top-0 bg-[var(--panel)] z-10">
          <span className="mono font-bold text-sm text-[var(--text)] flex items-center gap-1.5">
            <span>{course.meta.icon}</span> {course.meta.title}
          </span>
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 rounded text-[var(--muted)] hover:text-[var(--text)]"
          >
            ✕
          </button>
        </div>
        <nav className="py-2">{renderNavItems()}</nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 max-w-4xl">
        <div className="fade-in">
          {activeTopic.id === 'interview-fund' ? (
            <div>
              <QAAccordion
                items={course.qaFundamentals}
                title="Interview Q&A — Fundamentals"
                subtitle={`High-impact candidate answers for first-round ${course.meta.slug} screening questions.`}
              />
            </div>
          ) : activeTopic.id === 'interview-adv' ? (
            <div>
              <QAAccordion
                items={course.qaAdvanced}
                title="Interview Q&A — Intermediate & Advanced"
                subtitle="Deep technical questions and scenario-based interview responses."
              />
            </div>
          ) : (
            <div>
              {/* Level Badge */}
              {activeTopic.level && (
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="badge mono text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[var(--accent)] text-[var(--accent)] bg-[var(--panel2)]">
                    {activeTopic.level}
                  </span>
                  {activeTopic.sectionNo && (
                    <span className="mono text-xs text-[var(--muted)] font-medium">
                      Module {activeTopic.sectionNo}
                    </span>
                  )}
                </div>
              )}

              {/* Title */}
              <h1 className="font-heading text-3xl sm:text-4xl md:text-[42px] font-semibold tracking-tight mb-6 text-[var(--text)] leading-[1.18]">
                {activeTopic.title}
              </h1>

              {/* Body */}
              <TopicBodyRenderer blocks={activeTopic.body} />

              {/* Completion Toggle */}
              <div className="mt-8 pt-6 border-t border-[var(--border)] mb-12 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onToggleProgress(activeTopic.id)}
                  className={`px-4.5 py-2 rounded-lg text-sm mono font-semibold border transition cursor-pointer flex items-center gap-2 ${
                    isDone
                      ? 'border-[var(--accent)] text-[var(--accent)] bg-teal-950/25 shadow-xs'
                      : 'border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--muted)] bg-[var(--panel2)]'
                  }`}
                >
                  {isDone ? (
                    <>
                      <span>✓</span> marked understood
                    </>
                  ) : (
                    <>
                      <span>○</span> mark as understood
                    </>
                  )}
                </button>

                <span className="text-xs text-[var(--muted)] mono">
                  {isDone ? 'Saved in local storage' : 'Click when finished'}
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
