import type { QAItem } from '@/entities/topic'
import { renderInline } from '@/shared'

interface QAAccordionProps {
  items: QAItem[]
  title?: string
  subtitle?: string
}

export function QAAccordion({ items, title, subtitle }: QAAccordionProps) {
  return (
    <div className="space-y-3.5 my-6">
      {title && (
        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-[var(--text)]">{title}</h2>
          {subtitle && (
            <p className="text-sm text-[var(--muted)] mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {items.map(([question, answer], idx) => (
        <details
          key={idx}
          className="group panel rounded-xl px-4.5 py-3.5 border border-[var(--border)] transition-colors hover:border-[var(--muted)]"
        >
          <summary className="cursor-pointer flex items-center justify-between gap-3 list-none font-medium leading-snug text-[var(--text)] select-none">
            <span className="text-sm sm:text-base">{renderInline(question)}</span>
            <span className="mono shrink-0 text-[var(--accent)] font-bold text-lg transition-transform duration-200 group-open:rotate-90">
              ▸
            </span>
          </summary>
          <div className="mt-3.5 pt-3.5 border-t border-[var(--border)] leading-relaxed text-sm text-[var(--muted)]">
            {renderInline(answer)}
          </div>
        </details>
      ))}
    </div>
  )
}
