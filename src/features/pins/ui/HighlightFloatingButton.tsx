import { useEffect, useRef, useState } from 'react'

interface HighlightFloatingButtonProps {
  onPin: (text: string) => void
}

interface Position {
  top: number
  left: number
}

export function HighlightFloatingButton({ onPin }: HighlightFloatingButtonProps) {
  const [selectedText, setSelectedText] = useState('')
  const [position, setPosition] = useState<Position | null>(null)
  const [justPinned, setJustPinned] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleSelectionChange = () => {
      // Small timeout to allow selection to settle
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed) {
        if (!justPinned) {
          setPosition(null)
          setSelectedText('')
        }
        return
      }

      const text = sel.toString().trim()
      if (text.length < 3) {
        if (!justPinned) {
          setPosition(null)
          setSelectedText('')
        }
        return
      }

      try {
        const range = sel.getRangeAt(0)
        const rect = range.getBoundingClientRect()

        // Verify rect is visible and within bounds
        if (rect.width === 0 || rect.height === 0) {
          return
        }

        // Calculate center position above selection
        const top = Math.max(10, rect.top - 48)
        const left = Math.max(10, Math.min(window.innerWidth - 140, rect.left + rect.width / 2 - 60))

        setSelectedText(text)
        setPosition({ top, left })
        setJustPinned(false)
      } catch {
        // Selection range may be invalidated
      }
    }

    const handlePointerUp = () => {
      setTimeout(handleSelectionChange, 20)
    }

    const handleScrollOrResize = () => {
      if (!justPinned) {
        setPosition(null)
      }
    }

    document.addEventListener('pointerup', handlePointerUp)
    document.addEventListener('keyup', handleSelectionChange)
    window.addEventListener('scroll', handleScrollOrResize, true)

    return () => {
      document.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('keyup', handleSelectionChange)
      window.removeEventListener('scroll', handleScrollOrResize, true)
    }
  }, [justPinned])

  if (!position || !selectedText) return null

  const handlePinClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    onPin(selectedText)
    setJustPinned(true)

    // Clear selection and close popover after short feedback
    setTimeout(() => {
      window.getSelection()?.removeAllRanges()
      setPosition(null)
      setSelectedText('')
      setJustPinned(false)
    }, 800)
  }

  return (
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
      }}
      className="fade-in animate-in zoom-in-95 duration-150 select-none"
    >
      <button
        type="button"
        onClick={handlePinClick}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold mono shadow-xl flex items-center gap-1.5 cursor-pointer transition-all border ${
          justPinned
            ? 'bg-emerald-500 text-slate-950 border-emerald-400 scale-105 shadow-emerald-500/25'
            : 'bg-[var(--panel)] text-[var(--accent)] border-[var(--accent)] hover:bg-[var(--panel2)] hover:scale-105 active:scale-95 shadow-black/50'
        }`}
      >
        <span>{justPinned ? '✓' : '📌'}</span>
        <span>{justPinned ? 'Pinned!' : 'Pin Snippet'}</span>
      </button>
    </div>
  )
}
