import type { ReactNode } from 'react'

export function renderInline(text: string): ReactNode[] {
  if (!text) return []

  // Tokenize bold, inline code, and plain text
  const parts: ReactNode[] = []
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g
  const splits = text.split(regex)

  splits.forEach((part, idx) => {
    if (!part) return

    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2)
      parts.push(
        <strong key={idx} className="font-semibold text-[var(--text)]">
          {inner}
        </strong>,
      )
    } else if (part.startsWith('`') && part.endsWith('`')) {
      const inner = part.slice(1, -1)
      parts.push(
        <code
          key={idx}
          className="mono px-1.5 py-0.5 rounded text-[13px] font-medium bg-[var(--panel2)] text-[var(--accent)] border border-[var(--border)]"
        >
          {inner}
        </code>,
      )
    } else if (part.startsWith('*') && part.endsWith('*')) {
      const inner = part.slice(1, -1)
      parts.push(
        <em key={idx} className="italic text-[var(--text)]">
          {inner}
        </em>,
      )
    } else {
      parts.push(part)
    }
  })

  return parts
}
