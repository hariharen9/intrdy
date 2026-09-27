import type { QAItem } from '@/entities/topic'
import { renderInline } from '@/shared'

interface QAAccordionProps {
  items: QAItem[]
  title?: string
  subtitle?: string
}

export function QAAccordion({ items, title, subtitle }: QAAccordionProps) {
  return (
    <div className="space-y-3 my-5 sm:my-6">
      {title && (
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-semibold text-[var(--text)]">{title}</h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {items.map(([question, answer], idx) => (
        <details
          key={idx}
          className="group panel rounded-xl px-3.5 sm:px-4.5 py-3 sm:py-3.5 border border-[var(--border)] transition-colors hover:border-[var(--muted)]"
        >
          <summary className="cursor-pointer flex items-center justify-between gap-3 list-none font-medium leading-snug text-[var(--text)] select-none">
            <span className="text-[13px] sm:text-[15px]">{renderInline(question)}</span>
            <span className="mono shrink-0 text-[var(--accent)] font-bold text-base sm:text-lg transition-transform duration-200 group-open:rotate-90">
              ▸
            </span>
          </summary>
          <div className="mt-3 pt-3 border-t border-[var(--border)] leading-relaxed text-[13px] sm:text-sm text-[var(--muted)]">
            {renderInline(answer)}
          </div>
        </details>
      ))}
    </div>
  )
}
