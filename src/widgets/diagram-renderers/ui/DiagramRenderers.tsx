import { useState, useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-groovy'
import type {
  FlowStepItem,
  StackLayerItem,
  TopicBlock,
  WizardNode,
  QuizQuestion,
  CheatsheetItem,
  TroubleshootItem,
} from '@/entities/topic'
import { renderInline } from '@/shared'
import { CodeBlock } from '@/features/code-block'
import { DebugWizard } from '@/features/debug-wizard'

export function SingleChip({
  step,
  toneOverride,
}: {
  step: FlowStepItem
  toneOverride?: 'good' | 'bad' | 'default'
}) {
  const tone = step.tone || toneOverride
  const borderClass =
    tone === 'bad'
      ? 'border-[var(--danger)] bg-red-950/20'
      : tone === 'good'
        ? 'border-[var(--accent)] bg-teal-950/20'
        : 'border-[var(--border)] bg-[var(--panel)]'

  return (
    <div
      className={`shrink-0 rounded-lg border px-3 py-2 text-center min-w-[104px] ${borderClass}`}
    >
      <div className="text-sm font-medium leading-tight text-[var(--text)]">
        {renderInline(step.label)}
      </div>
      {step.sub && (
        <div className="text-[11px] mono mt-0.5 text-[var(--muted)]">
          {renderInline(step.sub)}
        </div>
      )}
    </div>
  )
}

export function FlowBlock({
  steps,
  edges = [],
  heading,
  tone,
  note,
}: {
  steps: FlowStepItem[]
  edges?: string[]
  heading?: string
  tone?: 'good' | 'bad' | 'default'
  note?: string
}) {
  const headingColor =
    tone === 'bad'
      ? 'text-[var(--danger)]'
      : tone === 'good'
        ? 'text-[var(--accent)]'
        : 'text-[var(--accent)]'

  return (
    <div className="my-5 w-full max-w-full min-w-0">
      {heading && (
        <div className={`text-xs font-bold mono mb-2.5 ${headingColor}`}>
          {renderInline(heading)}
        </div>
      )}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 pt-1 scrollbar-thin">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 shrink-0">
            {s.group ? (
              <div className="flex flex-col gap-2 shrink-0">
                {s.group.map((g, gi) => (
                  <SingleChip key={gi} step={g} toneOverride={tone} />
                ))}
              </div>
            ) : (
              <SingleChip step={s} toneOverride={tone} />
            )}

            {i < steps.length - 1 && (
              <div className="flex flex-col items-center px-1 shrink-0 min-w-[28px] sm:min-w-[50px]">
                {edges[i] && (
                  <span className="text-[10px] mono mb-0.5 text-center leading-tight text-[var(--muted)] max-w-[70px] truncate">
                    {renderInline(edges[i])}
                  </span>
                )}
                <span className="text-[var(--muted)] text-base font-bold">→</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {note && (
        <p className="text-xs mt-2 text-[var(--muted)] max-w-2xl leading-relaxed">
          {renderInline(note)}
        </p>
      )}
    </div>
  )
}

export function StackColumn({
  title,
  layers,
}: {
  title?: string
  layers: StackLayerItem[]
}) {
  return (
    <div className="flex-1 min-w-0 sm:min-w-[180px]">
      {title && (
        <p className="text-sm font-semibold mb-2.5 text-[var(--text)]">
          {renderInline(title)}
        </p>
      )}
      <div className="flex flex-col-reverse gap-1.5">
        {layers.map((layer, idx) => {
          const isWritable = layer.tone === 'writable'
          return (
            <div
              key={idx}
              className={`rounded-lg p-3 transition border ${
                isWritable
                  ? 'border-2 border-dashed border-[var(--accent2)] bg-[var(--panel2)]'
                  : 'border-[var(--border)] bg-[var(--panel2)]'
              }`}
            >
              <div
                className={`text-sm font-medium ${
                  isWritable ? 'text-[var(--accent2)]' : 'text-[var(--text)]'
                }`}
              >
                {renderInline(layer.label)}
              </div>
              {layer.sub && (
                <div className="text-[11px] mono mt-0.5 text-[var(--muted)]">
                  {renderInline(layer.sub)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function TopicBodyRenderer({
  blocks,
  wizardTree,
}: {
  blocks: TopicBlock[]
  wizardTree?: Record<string, WizardNode>
}) {
  return (
    <div className="space-y-4">
      {blocks.map((b, idx) => {
        if (b.t === 'p') {
          if (b.c.startsWith('### ')) {
            const lines = b.c.split('\n')
            const title = lines[0]?.replace('### ', '') ?? ''
            const rest = lines.slice(1).join('\n')
            return (
              <div key={idx} className="my-5 max-w-3xl">
                <h3 className="font-heading text-xl sm:text-2xl font-semibold text-[var(--text)] tracking-tight mb-2">
                  {renderInline(title)}
                </h3>
                {rest && (
                  <p className="leading-relaxed text-[15px] sm:text-[16px] text-[var(--text)] opacity-95">
                    {renderInline(rest)}
                  </p>
                )}
              </div>
            )
          }

          return (
            <p
              key={idx}
              className="leading-relaxed text-[15px] sm:text-[16px] text-[var(--text)] opacity-95 max-w-3xl whitespace-pre-line"
            >
              {renderInline(b.c)}
            </p>
          )
        }

        if (b.t === 'ul') {
          return (
            <ul
              key={idx}
              className="list-disc pl-5 my-3 space-y-2 text-[14px] sm:text-[15px] text-[var(--muted)] max-w-3xl leading-relaxed"
            >
              {b.c.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          )
        }

        if (b.t === 'ol') {
          return (
            <ol
              key={idx}
              className="list-decimal pl-5 my-3 space-y-2 text-[14px] sm:text-[15px] text-[var(--muted)] max-w-3xl leading-relaxed"
            >
              {b.c.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {renderInline(item)}
                </li>
              ))}
            </ol>
          )
        }

        if (b.t === 'code') {
          return <CodeBlock key={idx} code={b.c} lang={b.lang} />
        }

        if (b.t === 'note') {
          const isWarn = b.kind === 'warn'
          return (
            <div
              key={idx}
              className={`my-4 rounded-xl px-4.5 py-3.5 border-l-4 max-w-3xl ${
                isWarn
                  ? 'bg-amber-950/20 border-l-[var(--danger)] text-amber-200'
                  : 'bg-teal-950/20 border-l-[var(--accent)] text-teal-200'
              }`}
            >
              <span
                className="mono text-[11px] font-bold tracking-wider"
                style={{
                  color: isWarn ? 'var(--danger)' : 'var(--accent)',
                }}
              >
                {isWarn ? 'WATCH OUT' : 'TIP'}
              </span>
              <p className="mt-1 leading-relaxed text-sm text-[var(--text)] opacity-95">
                {renderInline(b.c)}
              </p>
            </div>
          )
        }

        if (b.t === 'analogy') {
          return (
            <div
              key={idx}
              className="my-4 rounded-xl px-4.5 py-3.5 border-l-4 border-l-[var(--accent2)] bg-amber-950/15 max-w-3xl"
            >
              <span className="mono text-[11px] font-bold tracking-wider text-[var(--accent2)]">
                📦 ANALOGY
              </span>
              <p className="mt-1 leading-relaxed text-sm text-[var(--text)] opacity-95">
                {renderInline(b.c)}
              </p>
            </div>
          )
        }

        if (b.t === 'bars') {
          const max = Math.max(...b.data.map((d) => d.value), 1)
          return (
            <div
              key={idx}
              className="panel rounded-xl border border-[var(--border)] p-4.5 my-4 max-w-2xl"
            >
              {b.title && (
                <p className="text-xs uppercase tracking-widest text-[var(--muted)] font-bold mb-3">
                  {renderInline(b.title)}
                </p>
              )}
              <div className="space-y-3">
                {b.data.map((d, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mono mb-1">
                      <span className="text-[var(--text)] font-medium">
                        {renderInline(d.label)}
                      </span>
                      <span className="text-[var(--muted)]">{d.unit || ''}</span>
                    </div>
                    <div className="h-3 w-full bg-[var(--panel2)] border border-[var(--border)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(2, (d.value / max) * 100)}%`,
                          background:
                            i === 0
                              ? 'var(--accent)'
                              : 'linear-gradient(90deg, var(--accent2), var(--danger))',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        if (b.t === 'cards') {
          return (
            <div key={idx} className="my-5">
              {b.title && (
                <p className="text-sm font-semibold mb-3 text-[var(--text)]">
                  {renderInline(b.title)}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {b.items.map((it, i) => (
                  <div
                    key={i}
                    className="panel2 rounded-xl p-4 border border-[var(--border)] shadow-sm"
                  >
                    <p className="font-bold text-sm mb-1 text-[var(--accent)]">
                      {renderInline(it.h)}
                    </p>
                    <p className="text-sm leading-relaxed text-[var(--muted)]">
                      {renderInline(it.c)}
                    </p>
                    {it.chips && it.chips.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {it.chips.map((chip, ci) => (
                          <span
                            key={ci}
                            className="text-[11px] mono px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--muted)] bg-[var(--panel)]"
                          >
                            {renderInline(chip)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        }

        if (b.t === 'flow') {
          return (
            <FlowBlock
              key={idx}
              steps={b.steps}
              edges={b.edges}
              heading={b.heading}
              tone={b.tone}
              note={b.note}
            />
          )
        }

        if (b.t === 'stack') {
          return (
            <div key={idx} className="my-5 max-w-md">
              <StackColumn title={b.title} layers={b.layers} />
            </div>
          )
        }

        if (b.t === 'stackCompare') {
          return (
            <div
              key={idx}
              className="panel rounded-xl border border-[var(--border)] p-5 my-5 shadow-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <StackColumn
                  title={b.left.title}
                  layers={b.left.layers}
                />
                <StackColumn
                  title={b.right.title}
                  layers={b.right.layers}
                />
              </div>
            </div>
          )
        }

        if (b.t === 'timeline') {
          return (
            <div
              key={idx}
              className="panel rounded-xl border border-[var(--border)] p-5 my-5 max-w-2xl"
            >
              <div className="relative pl-6 space-y-3.5">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border)]" />
                {b.events.map((e, i) => {
                  const statusColor =
                    e.status === 'fail'
                      ? 'bg-[var(--danger)] text-[var(--danger)]'
                      : e.status === 'ok'
                        ? 'bg-[var(--accent)] text-[var(--accent)]'
                        : 'bg-[var(--muted)] text-[var(--text)]'

                  return (
                    <div key={i} className="relative">
                      <div
                        className={`absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full ${
                          e.status === 'fail'
                            ? 'bg-[var(--danger)]'
                            : e.status === 'ok'
                              ? 'bg-[var(--accent)]'
                              : 'bg-[var(--muted)]'
                        }`}
                      />
                      <div className="text-[11px] mono text-[var(--muted)]">
                        {renderInline(e.time)}
                      </div>
                      <div className={`text-sm font-medium leading-snug ${statusColor}`}>
                        {renderInline(e.label)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }

        if (b.t === 'wizard') {
          return <DebugWizard key={idx} tree={wizardTree} />
        }

        if (b.t === 'html') {
          return <HtmlContentBlock key={idx} html={b.html} />
        }

        if (b.t === 'quiz') {
          return <InteractiveQuizBlock key={idx} questions={b.questions} />
        }

        if (b.t === 'cheatsheet') {
          return <InteractiveCheatsheetBlock key={idx} items={b.items} />
        }

        if (b.t === 'troubleshoot') {
          return <InteractiveTroubleshootBlock key={idx} items={b.items} />
        }

        return null
      })}
    </div>
  )
}

function highlightElementWithPrism(codeEl: HTMLElement) {
  let lang = 'bash'
  const className = codeEl.className || ''
  const langMatch = className.match(/language-([a-zA-Z0-9_-]+)/)
  if (langMatch && langMatch[1]) {
    lang = langMatch[1].toLowerCase()
  } else {
    const parentBlock = codeEl.closest('.code-block')
    const cbLang = parentBlock?.querySelector('.cb-lang')?.textContent?.toLowerCase() || ''
    if (cbLang.includes('groovy') || cbLang.includes('jenkinsfile')) lang = 'groovy'
    else if (cbLang.includes('bash') || cbLang.includes('sh')) lang = 'bash'
    else if (cbLang.includes('yaml') || cbLang.includes('yml')) lang = 'yaml'
    else if (cbLang.includes('docker')) lang = 'docker'
    else if (cbLang.includes('json')) lang = 'json'
    else if (cbLang.includes('diagram') || cbLang.includes('plaintext')) lang = 'plaintext'
  }

  if (lang === 'plaintext') {
    codeEl.classList.add('language-plaintext')
    return
  }

  const grammar =
    lang === 'groovy' || lang === 'jenkinsfile'
      ? Prism.languages.groovy
      : lang === 'yaml' || lang === 'yml'
        ? Prism.languages.yaml
        : lang === 'docker' || lang === 'dockerfile'
          ? Prism.languages.docker
          : lang === 'json'
            ? Prism.languages.json
            : Prism.languages.bash

  if (grammar) {
    const rawText = codeEl.textContent || ''
    try {
      codeEl.innerHTML = Prism.highlight(rawText, grammar, lang)
    } catch {
      // fallback
    }
  }
}

export function HtmlContentBlock({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const codeElements = el.querySelectorAll<HTMLElement>('pre code')
    codeElements.forEach((codeEl) => {
      highlightElementWithPrism(codeEl)
    })

    const handleCopy = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.classList.contains('cb-copy')) return
      const codeEl = target.closest('.code-block')?.querySelector('code')
      if (codeEl) {
        const text = codeEl.innerText
        navigator.clipboard?.writeText(text).then(() => {
          const orig = target.textContent
          target.textContent = 'Copied ✓'
          setTimeout(() => {
            target.textContent = orig || 'Copy'
          }, 1400)
        })
      }
    }

    el.addEventListener('click', handleCopy)
    return () => el.removeEventListener('click', handleCopy)
  })

  return (
    <div
      ref={containerRef}
      className="topic-content my-4 w-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export function InteractiveQuizBlock({ questions }: { questions: QuizQuestion[] }) {
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)

  if (!questions || questions.length === 0) return null

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    let verdict = 'Solid foundation — revisit the modules where you missed questions.'
    if (pct >= 90) verdict = 'Interview-ready. You clearly know this cold.'
    else if (pct >= 70)
      verdict = 'Good grasp overall — a quick pass over the missed topics will close the gaps.'

    return (
      <div className="fade-in my-6">
        <span className="pill mb-3">🎯 Interview prep</span>
        <h2 className="font-heading font-semibold my-4 text-2xl">Quiz complete</h2>
        <div className="panel p-6 sm:p-8 rounded-xl border border-[var(--border)] text-center max-w-xl mx-auto shadow-sm">
          <div className="font-heading font-bold text-5xl text-[var(--accent)]">
            {score}/{questions.length}
          </div>
          <div className="text-sm mt-1.5 text-[var(--muted)]">{pct}% correct</div>
          <p className="mt-4 text-[var(--text)] max-w-md mx-auto leading-relaxed">{verdict}</p>
          <button
            onClick={() => {
              setIdx(0)
              setScore(0)
              setAnswered(false)
              setSelected(null)
              setFinished(false)
            }}
            className="mt-6 px-6 py-2.5 rounded-lg font-semibold text-sm bg-[var(--accent)] text-slate-950 hover:opacity-90 transition-opacity"
          >
            Retake quiz
          </button>
        </div>
      </div>
    )
  }

  const q = questions[idx]
  if (!q) return null

  const letters = ['A', 'B', 'C', 'D']

  const handleAnswer = (i: number) => {
    if (answered) return
    setAnswered(true)
    setSelected(i)
    if (i === q.correct) {
      setScore((s) => s + 1)
    }
  }

  const handleNext = () => {
    if (idx + 1 < questions.length) {
      setIdx((i) => i + 1)
      setAnswered(false)
      setSelected(null)
    } else {
      setFinished(true)
    }
  }

  const isCorrect = selected === q.correct

  return (
    <div className="fade-in my-6 max-w-2xl">
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="pill">
          🎯 Question {idx + 1} / {questions.length}
        </span>
        <span className="font-mono text-[var(--muted)]">Score: {score}</span>
      </div>
      <div className="w-full h-1.5 rounded-full overflow-hidden bg-[var(--panel2)] mb-6 border border-[var(--border)]">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${(idx / questions.length) * 100}%` }}
        />
      </div>
      <h3 className="font-heading font-semibold text-lg sm:text-xl leading-snug mb-5 text-[var(--text)]">
        {q.q}
      </h3>
      <div className="flex flex-col gap-2.5">
        {q.options.map((opt, i) => {
          let btnClass =
            'quiz-opt text-left px-4 py-3 rounded-lg text-sm flex items-start gap-3 text-[var(--text)] cursor-pointer'
          if (answered) {
            if (i === q.correct) btnClass += ' correct'
            else if (i === selected) btnClass += ' wrong'
          }
          return (
            <button key={i} onClick={() => handleAnswer(i)} className={btnClass}>
              <span className="font-mono font-semibold text-[var(--muted)] shrink-0">
                {letters[i]}
              </span>
              <span>{opt}</span>
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="mt-5 fade-in">
          <div className={`topic-content callout ${isCorrect ? 'good' : 'danger'}`}>
            <p>
              <strong>{isCorrect ? 'Correct.' : 'Not quite.'}</strong> {q.explain}
            </p>
          </div>
          <button
            onClick={handleNext}
            className="mt-3 px-5 py-2.5 rounded-lg font-semibold text-sm bg-[var(--accent)] text-slate-950 hover:opacity-90 transition-opacity"
          >
            {idx + 1 < questions.length ? 'Next question →' : 'See results →'}
          </button>
        </div>
      )}
    </div>
  )
}

export function InteractiveCheatsheetBlock({ items }: { items: CheatsheetItem[] }) {
  const [openMap, setOpenMap] = useState<Record<number, boolean>>({})

  const toggle = (i: number) => {
    setOpenMap((prev) => ({ ...prev, [i]: !prev[i] }))
  }

  const expandAll = () => {
    const all: Record<number, boolean> = {}
    items.forEach((_, i) => (all[i] = true))
    setOpenMap(all)
  }

  const collapseAll = () => {
    setOpenMap({})
  }

  return (
    <div className="fade-in my-6 max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-[var(--muted)]">Tap any term to reveal the key definition.</p>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="text-xs px-2.5 py-1 rounded border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            Expand all
          </button>
          <button
            onClick={collapseAll}
            className="text-xs px-2.5 py-1 rounded border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            Collapse all
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((it, i) => {
          const isOpen = !!openMap[i]
          return (
            <div
              key={i}
              className="rounded-lg border border-[var(--border)] bg-[var(--panel)] overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-[var(--panel2)]/40 transition-colors"
              >
                <span className="font-mono text-sm font-medium text-[var(--text)]">{it.term}</span>
                <span className="text-sm font-mono text-[var(--muted)] shrink-0">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div className="px-4 pb-3.5 pt-1 text-sm leading-relaxed text-[var(--muted)] border-t border-[var(--border)]/50 bg-[var(--panel2)]/20 fade-in">
                  <p>{it.def}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function InteractiveTroubleshootBlock({ items }: { items: TroubleshootItem[] }) {
  return (
    <div className="fade-in my-6 max-w-3xl flex flex-col gap-4">
      {items.map((it, i) => (
        <div
          key={i}
          className="p-4 sm:p-5 rounded-xl border border-[var(--border)] bg-[var(--panel)] shadow-sm"
        >
          <div className="text-sm font-semibold mb-2 text-[var(--text)] flex items-start gap-2">
            <span>🩺</span>
            <span>{it.scenario}</span>
          </div>
          <div className="text-sm mb-2 pl-6">
            <span className="text-[var(--accent2)] font-semibold">Likely cause: </span>
            <span className="text-[var(--muted)]">{it.diagnosis}</span>
          </div>
          <div className="text-sm pl-6">
            <span className="text-[var(--accent)] font-semibold">Fix: </span>
            <span className="text-[var(--muted)]">{it.fix}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

