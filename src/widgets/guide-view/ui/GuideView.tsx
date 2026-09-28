import { useCallback, useEffect, useRef, useState } from 'react'
import type { CourseData } from '@/entities/topic'
import { QAAccordion } from '@/features/qa-accordion'
import { HighlightFloatingButton } from '@/features/pins'
import { TopicBodyRenderer } from '@/widgets/diagram-renderers'

export interface GuideViewProps {
  course: CourseData
  selectedTopicId?: string
  onPin?: (item: { topicId: string; topicTitle: string; text: string; sectionNo?: string }) => void
}

export function GuideView({ course, selectedTopicId, onPin }: GuideViewProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(
    selectedTopicId ?? course.topics[0]?.id ?? 'why',
  )
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const guideContentRef = useRef<HTMLDivElement>(null)

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    const container = guideContentRef.current
    if (el && container) {
      const containerTop = container.getBoundingClientRect().top
      const elTop = el.getBoundingClientRect().top
      const scrollOffset = elTop - containerTop + container.scrollTop - 20
      container.scrollTo({ top: scrollOffset, behavior: 'smooth' })
    }
  }, [guideContentRef])

  // Scroll to target section if selectedTopicId changes externally
  useEffect(() => {
    if (selectedTopicId) {
      scrollToSection(selectedTopicId)
    }
  }, [selectedTopicId, scrollToSection])

  useEffect(() => {
    const container = guideContentRef.current
    if (!container) return

    const handleScroll = () => {
      const winHeight = container.scrollHeight - container.clientHeight
      const current = container.scrollTop
      const pct =
        winHeight > 0 ? Math.min(100, Math.max(0, (current / winHeight) * 100)) : 0
      setScrollProgress(pct)

      // Determine active section based on scroll position within container
      const containerTop = container.getBoundingClientRect().top
      const sections = course.topics
        .map((t) => document.getElementById(t.id))
        .filter(Boolean) as HTMLElement[]

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i]
        if (!sec) continue
        const rect = sec.getBoundingClientRect()
        if (rect.top - containerTop <= 140) {
          setActiveSectionId(sec.id)
          break
        }
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [course.topics, guideContentRef])

  return (
    <div className="flex flex-1 w-full h-full min-h-0 overflow-hidden relative">
      {/* Top Reading Progress Bar */}
      <div
        className="absolute top-0 left-0 h-[3px] bg-[var(--accent)] z-30 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Desktop Table of Contents: 100% Fixed & Untruncated */}
      <aside className="hidden lg:block w-72 lg:w-80 h-full overflow-y-auto shrink-0 border-r border-[var(--border)] py-4 px-3">
        <div className="px-3 pb-3 text-[11px] uppercase tracking-widest text-[var(--muted)] font-bold mono">
          Table of Contents
        </div>
        <nav className="space-y-1 mono text-xs">
          {course.topics.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => scrollToSection(t.id)}
              className={`w-full text-left py-2 px-3 rounded-lg transition flex items-start gap-2.5 cursor-pointer border-l-2 ${
                activeSectionId === t.id
                  ? 'text-[var(--accent)] font-semibold bg-[var(--panel2)] border-l-[var(--accent)] shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--panel2)] border-l-transparent'
              }`}
            >
              <span className="mono text-[10px] opacity-60 shrink-0 mt-0.5">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="font-sans font-normal text-xs leading-snug flex-1 text-left">
                {t.title}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Right Guide Content Area: Independent Scroll Container */}
      <main
        ref={guideContentRef}
        className="flex-1 h-full overflow-y-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8 sm:py-10"
      >
        <div className="max-w-5xl xl:max-w-6xl mx-auto w-full min-w-0">
          {/* Editorial Hero Banner */}
          <section className="pb-10 md:pb-12 border-b border-[var(--border)] w-full min-w-0 max-w-full">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.6fr)_minmax(0,.9fr)] gap-8 md:gap-10 items-end w-full min-w-0">
              <div className="min-w-0">
                <div className="mono text-xs font-bold text-[var(--accent)] uppercase tracking-widest">
                  {course.meta.badgeText}
                </div>
                <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl leading-[1.1] tracking-tight mt-3 text-[var(--text)] break-words">
                  {course.meta.title}.<br />
                  <span className="italic opacity-90">{course.meta.tagline}</span>
                </h1>
                <p className="text-[15px] sm:text-lg text-[var(--muted)] leading-relaxed mt-4 sm:mt-5 max-w-2xl break-words">
                  {course.meta.description}
                </p>
              </div>

              <div className="border-l border-[var(--border)] pl-4 sm:pl-6 pb-1 min-w-0">
                <div className="text-[11px] uppercase tracking-widest text-[var(--muted)] font-bold mono">
                  Guiding Principle
                </div>
                <div className="mt-2.5 font-editorial text-lg sm:text-2xl leading-snug text-[var(--text)] italic break-words">
                  {course.meta.quote}
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted)] mt-2.5 leading-relaxed break-words">
                  {course.meta.quoteContext}
                </p>
              </div>
            </div>

            {/* Parts Grid */}
            {course.meta.parts && course.meta.parts.length > 0 && (
              <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full min-w-0">
                {course.meta.parts.map((p, pi) => (
                  <div key={pi} className="panel rounded-xl p-3.5 sm:p-4 border border-[var(--border)] shadow-xs min-w-0">
                    <div className="text-[11px] mono text-[var(--accent)] font-bold">{p.partNo}</div>
                    <div className="font-semibold text-sm mt-1 text-[var(--text)] truncate">{p.title}</div>
                    <div className="text-xs text-[var(--muted)] mt-0.5 break-words">{p.subtitle}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Mobile Quick TOC Toggle Banner */}
          <div className="lg:hidden mt-6 mb-4 w-full min-w-0">
            <button
              type="button"
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--panel)] text-xs mono font-semibold text-[var(--text)] cursor-pointer hover:border-[var(--accent)] transition shadow-xs min-w-0"
            >
              <span className="flex items-center gap-2 truncate pr-2">
                <span className="text-[var(--accent)] shrink-0">📑</span>
                <span className="truncate">Jump to Section ({course.topics.length} topics)</span>
              </span>
              <span className="text-[var(--muted)] shrink-0">
                {mobileTocOpen ? '▲ close' : '▼ browse'}
              </span>
            </button>

            {mobileTocOpen && (
              <div className="mt-2 p-3 rounded-xl border border-[var(--border)] bg-[var(--panel)] max-h-72 overflow-y-auto space-y-1 fade-in shadow-xl w-full min-w-0">
                {course.topics.map((t, idx) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      scrollToSection(t.id)
                      setMobileTocOpen(false)
                    }}
                    className={`w-full text-left py-2 px-2.5 rounded-lg text-xs flex items-start gap-2 transition cursor-pointer min-w-0 ${
                      activeSectionId === t.id
                        ? 'text-[var(--accent)] font-bold bg-[var(--panel2)]'
                        : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--panel2)]'
                    }`}
                  >
                    <span className="mono text-[10px] opacity-70 shrink-0 mt-0.5">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-left leading-snug break-words min-w-0">{t.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main Continuous Guide Sections */}
          <article className="w-full max-w-full min-w-0 space-y-16 mt-8">
            {course.topics.map((topic) => {
              if (topic.id === 'interview-fund') {
                return (
                  <section
                    key={topic.id}
                    id={topic.id}
                    className="grid grid-cols-1 md:grid-cols-[140px_minmax(0,1fr)] gap-6 md:gap-8 pt-8 border-t border-[var(--border)] w-full max-w-full min-w-0"
                  >
                    <div className="mono text-xs uppercase tracking-widest text-[var(--muted)] font-bold min-w-0">
                      {topic.sectionNo || '21'} / {topic.category || 'Prep'}
                    </div>
                    <div className="min-w-0 w-full max-w-full">
                      <div className="mono text-[11px] uppercase font-bold text-[var(--accent)]">
                        Interview Bank
                      </div>
                      <h2 className="font-editorial text-3xl md:text-4xl tracking-tight mt-1 text-[var(--text)] break-words">
                        {topic.title}
                      </h2>
                      <p className="mt-2 text-sm text-[var(--muted)] break-words">
                        Click any prompt to reveal the high-impact candidate answer.
                      </p>
                      <div className="mt-4 w-full min-w-0">
                        <QAAccordion items={course.qaFundamentals} />
                      </div>
                    </div>
                  </section>
                )
              }

              if (topic.id === 'interview-adv') {
                return (
                  <section
                    key={topic.id}
                    id={topic.id}
                    className="grid grid-cols-1 md:grid-cols-[140px_minmax(0,1fr)] gap-6 md:gap-8 pt-8 pb-14 border-t border-[var(--border)] w-full max-w-full min-w-0"
                  >
                    <div className="mono text-xs uppercase tracking-widest text-[var(--muted)] font-bold min-w-0">
                      {topic.sectionNo || '22'} / {topic.category || 'Deep Dive'}
                    </div>
                    <div className="min-w-0 w-full max-w-full">
                      <div className="mono text-[11px] uppercase font-bold text-[var(--accent)]">
                        Interview Bank
                      </div>
                      <h2 className="font-editorial text-3xl md:text-4xl tracking-tight mt-1 text-[var(--text)] break-words">
                        {topic.title}
                      </h2>
                      <p className="mt-2 text-sm text-[var(--muted)] break-words">
                        Technical and scenario-based interview questions with expected signals.
                      </p>
                      <div className="mt-4 w-full min-w-0">
                        <QAAccordion items={course.qaAdvanced} />
                      </div>
                    </div>
                  </section>
                )
              }

              return (
                <section
                  key={topic.id}
                  id={topic.id}
                  className="grid grid-cols-1 md:grid-cols-[140px_minmax(0,1fr)] gap-6 md:gap-8 pt-10 border-t border-[var(--border)] w-full max-w-full min-w-0"
                >
                  {/* Left Section Label */}
                  <div className="mono text-xs uppercase tracking-widest text-[var(--muted)] font-bold min-w-0">
                    {topic.sectionNo} / {topic.category || 'Topic'}
                  </div>

                  {/* Main Content Body */}
                  <div className="min-w-0 w-full max-w-full overflow-hidden">
                    {topic.level && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge mono text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[var(--accent)] text-[var(--accent)] bg-[var(--panel2)]">
                          {topic.level}
                        </span>
                      </div>
                    )}

                    <h2 className="font-editorial text-3xl md:text-4xl tracking-tight text-[var(--text)] mb-5 break-words">
                      {topic.title}
                    </h2>

                    <TopicBodyRenderer blocks={topic.body} wizardTree={course.wizardTree} />
                  </div>
                </section>
              )
            })}
          </article>

          {/* Guide View Footer */}
          <footer className="mt-16 text-center text-xs py-7 border-t border-[var(--border)] mono text-[var(--muted)] px-4">
            {course.meta.footerText}
          </footer>
        </div>
      </main>

      {/* Floating Pin Button for Text Highlights */}
      {onPin && (
        <HighlightFloatingButton
          onPin={(text) => {
            const activeTopic =
              course.topics.find((t) => t.id === activeSectionId) || course.topics[0]
            if (activeTopic) {
              onPin({
                topicId: activeTopic.id,
                topicTitle: activeTopic.title,
                sectionNo: activeTopic.sectionNo,
                text,
              })
            }
          }}
        />
      )}
    </div>
  )
}
