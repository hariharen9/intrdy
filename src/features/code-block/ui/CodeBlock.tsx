import { useMemo, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-json'

interface CodeBlockProps {
  code: string
  lang?: string
  title?: string
  className?: string
}

function getGrammar(lang?: string) {
  if (!lang) return Prism.languages.bash
  const normalized = lang.toLowerCase().trim()
  if (normalized === 'dockerfile' || normalized === 'docker') {
    return Prism.languages.docker || Prism.languages.bash
  }
  if (normalized === 'yaml' || normalized === 'yml') {
    return Prism.languages.yaml || Prism.languages.bash
  }
  if (normalized === 'json') {
    return Prism.languages.json || Prism.languages.bash
  }
  if (normalized === 'sh' || normalized === 'bash' || normalized === 'shell') {
    return Prism.languages.bash
  }
  return Prism.languages[normalized] || Prism.languages.bash
}

export function CodeBlock({
  code,
  lang = 'bash',
  title,
  className = '',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const highlightedHtml = useMemo(() => {
    try {
      const grammar = getGrammar(lang)
      const langKey = lang === 'dockerfile' ? 'docker' : (lang || 'bash')
      if (grammar) {
        return Prism.highlight(code, grammar, langKey)
      }
    } catch {
      // fallback
    }
    return null
  }, [code, lang])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // fallback
    }
  }

  return (
    <div
      className={`code-block relative group my-4 max-w-full overflow-hidden border border-[var(--border)] rounded-lg sm:rounded-xl shadow-xs ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[var(--panel2)] border-b border-[var(--border)] text-[11px] sm:text-xs text-[var(--muted)] mono select-none pr-16 sm:pr-20">
          <span className="truncate pr-2 font-medium">{title}</span>
          {lang && (
            <span className="uppercase text-[10px] tracking-wider opacity-75 font-semibold shrink-0">
              {lang}
            </span>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className="copy-btn absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 text-[11px] mono px-2.5 py-1 rounded-md bg-[var(--panel2)] hover:bg-[var(--panel)] active:scale-95 text-[var(--muted)] hover:text-[var(--text)] border border-[var(--border)] transition shadow-xs cursor-pointer select-none min-h-[28px]"
        aria-label="Copy code"
      >
        {copied ? (
          <span className="flex items-center gap-1 text-[var(--accent)] font-medium">
            ✓ copied
          </span>
        ) : (
          <span>copy</span>
        )}
      </button>
      <pre className="mono text-[12px] sm:text-[13px] leading-relaxed p-3.5 sm:p-4 pr-16 sm:pr-20 overflow-x-auto text-[var(--text)] m-0 scrollbar-thin">
        {highlightedHtml ? (
          <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
        ) : (
          <code>{code}</code>
        )}
      </pre>
    </div>
  )
}
