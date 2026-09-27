import { useEffect, useState } from 'react'
import {
  type CourseData,
  dockerCourse,
} from '@/entities/topic'
import { QAAccordion } from '@/features/qa-accordion'
import { TopicBodyRenderer } from '@/widgets/docker-diagrams'

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 70
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

interface DockerGuideViewProps {
  course?: CourseData
}

export function DockerGuideView({ course = dockerCourse }: DockerGuideViewProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(
    course.topics[0]?.id ?? 'why',
  )
  const [scrollProgress, setScrollProgress] = useState<number>(0)

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement
      const winHeight = el.scrollHeight - el.clientHeight
      const current = el.scrollTop
      const pct =
        winHeight > 0 ? Math.min(100, Math.max(0, (current / winHeight) * 100)) : 0
      setScrollProgress(pct)

      // Determine active section based on scroll position
      const sections = course.topics
        .map((t) => document.getElementById(t.id))
        .filter(Boolean) as HTMLElement[]

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i]
        if (!sec) continue
        const rect = sec.getBoundingClientRect()
        if (rect.top <= 140) {
          setActiveSectionId(sec.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [course.topics])

  const [mobileTocOpen, setMobileTocOpen] = useState(false)

  return (
    <div className="w-full relative">
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-[var(--accent)] z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-[1240px] mx-auto px-3.5 sm:px-8 py-8 md:py-14">
        {/* Editorial Hero Banner */}
        <section className="pb-10 md:pb-12 border-b border-[var(--border)]">
          <div className="grid md:grid-cols-[1.6fr_.9fr] gap-8 md:gap-10 items-end">
            <div>
              <div className="mono text-xs font-bold text-[var(--accent)] uppercase tracking-widest">
                {course.meta.badgeText}
              </div>
              <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl leading-[1.1] tracking-tight mt-3 text-[var(--text)]">
                {course.meta.title}.<br />
                <span className="italic opacity-90">{course.meta.tagline}</span>
              </h1>
              <p className="text-[15px] sm:text-lg text-[var(--muted)] leading-relaxed mt-4 sm:mt-5 max-w-2xl">
                {course.meta.description}
              </p>
            </div>

            <div className="border-l border-[var(--border)] pl-4 sm:pl-6 pb-1">
              <div className="text-[11px] uppercase tracking-widest text-[var(--muted)] font-bold mono">
                Guiding Principle
              </div>
              <div className="mt-2.5 font-editorial text-lg sm:text-2xl leading-snug text-[var(--text)] italic">
                {course.meta.quote}
              </div>
              <p className="text-xs sm:text-sm text-[var(--muted)] mt-2.5 leading-relaxed">
                {course.meta.quoteContext}
              </p>
            </div>
          </div>

          {/* Parts Grid */}
          {course.meta.parts && course.meta.parts.length > 0 && (
            <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {course.meta.parts.map((p, pi) => (
                <div key={pi} className="panel rounded-xl p-3.5 sm:p-4 border border-[var(--border)] shadow-xs">
                  <div className="text-[11px] mono text-[var(--accent)] font-bold">{p.partNo}</div>
                  <div className="font-semibold text-sm mt-1 text-[var(--text)]">{p.title}</div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">{p.subtitle}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Mobile Quick TOC Toggle Banner */}
        <div className="lg:hidden mt-6 mb-2">
          <button
            type="button"
            onClick={() => setMobileTocOpen(!mobileTocOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--panel)] text-xs mono font-semibold text-[var(--text)] cursor-pointer hover:border-[var(--accent)] transition shadow-xs"
          >
            <span className="flex items-center gap-2">
              <span className="text-[var(--accent)]">📑</span>
              <span>Jump to Section ({course.topics.length} topics)</span>
            </span>
            <span className="text-[var(--muted)]">
              {mobileTocOpen ? '▲ close' : '▼ browse'}
            </span>
          </button>

          {mobileTocOpen && (
            <div className="mt-2 p-3 rounded-xl border border-[var(--border)] bg-[var(--panel)] max-h-72 overflow-y-auto space-y-1 fade-in shadow-xl">
              {course.topics.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    scrollToSection(t.id)
                    setMobileTocOpen(false)
                  }}
                  className={`w-full text-left py-2 px-2.5 rounded-lg text-xs flex items-center gap-2 transition cursor-pointer ${
                    activeSectionId === t.id
                      ? 'text-[var(--accent)] font-bold bg-[var(--panel2)]'
                      : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--panel2)]'
                  }`}
                >
                  <span className="mono text-[10px] opacity-70 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="truncate">{t.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Layout: Sticky TOC + All Sections */}
        <div className="grid lg:grid-cols-[220px_1fr] gap-8 lg:gap-14 mt-8 lg:mt-12 items-start">
          {/* Table of Contents (Desktop) */}
          <aside className="hidden lg:block sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-3 pb-8">
            <div className="text-[11px] uppercase tracking-widest text-[var(--muted)] font-bold mb-3 mono">
              Table of Contents
            </div>
            <nav className="space-y-1 text-xs mono">
              {course.topics.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => scrollToSection(t.id)}
                  className={`w-full text-left py-1.5 px-2 rounded-md transition flex items-center gap-2 cursor-pointer ${
                    activeSectionId === t.id
                      ? 'text-[var(--accent)] font-bold bg-[var(--panel2)]'
                      : 'text-[var(--muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <span className="opacity-60 text-[10px]">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="truncate font-sans font-normal text-xs">{t.title}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Continuous Guide Sections */}
          <article className="min-w-0 space-y-16">
            {course.topics.map((topic) => {
              if (topic.id === 'interview-fund') {
                return (
                  <section
                    key={topic.id}
                    id={topic.id}
                    className="grid md:grid-cols-[140px_1fr] gap-6 md:gap-8 pt-8 border-t border-[var(--border)]"
                  >
                    <div className="mono text-xs uppercase tracking-widest text-[var(--muted)] font-bold">
                      {topic.sectionNo || '21'} / {topic.category || 'Prep'}
                    </div>
                    <div>
                      <div className="mono text-[11px] uppercase font-bold text-[var(--accent)]">
                        Interview Bank
                      </div>
                      <h2 className="font-editorial text-3xl md:text-4xl tracking-tight mt-1 text-[var(--text)]">
                        {topic.title}
                      </h2>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        Click any prompt to reveal the high-impact candidate answer.
                      </p>
                      <QAAccordion items={course.qaFundamentals} />
                    </div>
                  </section>
                )
              }

              if (topic.id === 'interview-adv') {
                return (
                  <section
                    key={topic.id}
                    id={topic.id}
                    className="grid md:grid-cols-[140px_1fr] gap-6 md:gap-8 pt-8 pb-14 border-t border-[var(--border)]"
                  >
                    <div className="mono text-xs uppercase tracking-widest text-[var(--muted)] font-bold">
                      {topic.sectionNo || '22'} / {topic.category || 'Deep Dive'}
                    </div>
                    <div>
                      <div className="mono text-[11px] uppercase font-bold text-[var(--accent)]">
                        Interview Bank
                      </div>
                      <h2 className="font-editorial text-3xl md:text-4xl tracking-tight mt-1 text-[var(--text)]">
                        {topic.title}
                      </h2>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        Technical and scenario-based interview questions with expected signals.
                      </p>
                      <QAAccordion items={course.qaAdvanced} />
                    </div>
                  </section>
                )
              }

              return (
                <section
                  key={topic.id}
                  id={topic.id}
                  className="grid md:grid-cols-[140px_1fr] gap-6 md:gap-8 pt-10 border-t border-[var(--border)]"
                >
                  {/* Left Section Label */}
                  <div className="mono text-xs uppercase tracking-widest text-[var(--muted)] font-bold">
                    {topic.sectionNo} / {topic.category || 'Topic'}
                  </div>

                  {/* Main Content Body */}
                  <div>
                    {topic.level && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge mono text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[var(--accent)] text-[var(--accent)] bg-[var(--panel2)]">
                          {topic.level}
                        </span>
                      </div>
                    )}

                    <h2 className="font-editorial text-3xl md:text-4xl tracking-tight text-[var(--text)] mb-5">
                      {topic.title}
                    </h2>

                    <TopicBodyRenderer blocks={topic.body} />
                  </div>
                </section>
              )
            })}
          </article>
        </div>
      </div>
    </div>
  )
}
