import { useState } from 'react'
import type { PinItem } from '@/entities/topic'

interface PinsDrawerProps {
  isOpen: boolean
  onClose: () => void
  pins: PinItem[]
  pinsByTopic: Record<string, { topicTitle: string; sectionNo?: string; items: PinItem[] }>
  onRemovePin: (id: string) => void
  onClearAll: () => void
  onExportMarkdown: () => void
  onJumpToTopic: (topicId: string) => void
  courseTitle: string
}

export function PinsDrawer({
  isOpen,
  onClose,
  pins,
  pinsByTopic,
  onRemovePin,
  onClearAll,
  onExportMarkdown,
  onJumpToTopic,
  courseTitle,
}: PinsDrawerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  if (!isOpen) return null

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const topicCount = Object.keys(pinsByTopic).length

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-[var(--panel)] border-l border-[var(--border)] h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border)] flex items-center justify-between gap-3 bg-[var(--panel)]/80 backdrop-blur-sm shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">📌</span>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-[var(--text)] tracking-tight truncate">
                Revision Pins
              </h2>
              <span className="mono text-xs px-2 py-0.5 rounded-full font-semibold bg-[var(--panel2)] border border-[var(--border)] text-[var(--accent)]">
                {pins.length}
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] mt-0.5 truncate">
              {topicCount > 0
                ? `${pins.length} saved snippet${pins.length === 1 ? '' : 's'} across ${topicCount} topic${topicCount === 1 ? '' : 's'}`
                : `Quick revision cheatsheet for ${courseTitle}`}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {pins.length > 0 && (
              <button
                type="button"
                onClick={onExportMarkdown}
                className="px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--panel2)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-xs mono font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                title="Download your revision notes as a Markdown cheatsheet"
              >
                <span>📥</span>
                <span className="hidden xs:inline">Export .md</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--panel2)] transition cursor-pointer"
              aria-label="Close revision pins"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {pins.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto">
              <div className="w-16 h-16 rounded-2xl bg-[var(--panel2)] border border-[var(--border)] flex items-center justify-center text-3xl mb-4 shadow-inner">
                📌
              </div>
              <h3 className="font-heading text-lg font-semibold text-[var(--text)]">
                No pinned snippets yet
              </h3>
              <p className="text-xs sm:text-sm text-[var(--muted)] mt-2 max-w-xs leading-relaxed">
                Highlight any sentence or code while reading to pin key concepts here for quick interview refresher sessions.
              </p>
              <div className="mt-5 text-[11px] mono text-[var(--accent)] bg-[var(--panel2)] border border-[var(--border)] px-3 py-1.5 rounded-lg">
                💡 Tip: Select text on any topic → click "Pin Snippet"
              </div>
            </div>
          ) : (
            Object.entries(pinsByTopic).map(([topicId, group]) => (
              <div key={topicId} className="space-y-3">
                {/* Group Heading */}
                <div className="flex items-center justify-between gap-2 pb-1 border-b border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => {
                      onJumpToTopic(topicId)
                      onClose()
                    }}
                    className="flex items-center gap-2 group text-left min-w-0 cursor-pointer"
                  >
                    {group.sectionNo && (
                      <span className="mono text-[10px] uppercase font-bold text-[var(--muted)] shrink-0">
                        Mod {group.sectionNo}
                      </span>
                    )}
                    <h4 className="font-semibold text-xs sm:text-sm text-[var(--text)] group-hover:text-[var(--accent)] transition truncate">
                      {group.topicTitle}
                    </h4>
                    <span className="text-xs text-[var(--muted)] opacity-0 group-hover:opacity-100 transition">
                      →
                    </span>
                  </button>

                  <span className="text-[10px] mono text-[var(--muted)] px-1.5 py-0.5 rounded bg-[var(--panel2)] shrink-0">
                    {group.items.length}
                  </span>
                </div>

                {/* Snippets for this topic */}
                <div className="space-y-2.5">
                  {group.items.map((pin) => (
                    <div
                      key={pin.id}
                      className="panel2 rounded-xl p-3.5 border border-[var(--border)] hover:border-[var(--muted)] transition group/pin shadow-xs"
                    >
                      {/* Quote Body */}
                      <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed italic border-l-2 border-l-[var(--accent)] pl-3 whitespace-pre-line">
                        "{pin.text}"
                      </p>

                      {/* Card Footer Actions */}
                      <div className="mt-3 pt-2.5 border-t border-[var(--border)]/60 flex items-center justify-between text-[11px] mono text-[var(--muted)]">
                        <button
                          type="button"
                          onClick={() => {
                            onJumpToTopic(pin.topicId)
                            onClose()
                          }}
                          className="hover:text-[var(--accent)] transition cursor-pointer flex items-center gap-1 font-medium"
                        >
                          <span>Go to lesson</span>
                          <span>↗</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopy(pin.id, pin.text)}
                            className="hover:text-[var(--text)] transition cursor-pointer px-1.5 py-0.5 rounded hover:bg-[var(--panel)]"
                            title="Copy snippet"
                          >
                            {copiedId === pin.id ? '✓ copied' : 'copy'}
                          </button>

                          <button
                            type="button"
                            onClick={() => onRemovePin(pin.id)}
                            className="hover:text-[var(--danger)] transition cursor-pointer px-1.5 py-0.5 rounded hover:bg-[var(--panel)] text-[var(--muted)]"
                            title="Unpin snippet"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Actions */}
        {pins.length > 0 && (
          <div className="p-3 sm:p-4 border-t border-[var(--border)] bg-[var(--panel)] shrink-0 flex items-center justify-between gap-3">
            {confirmClear ? (
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-[var(--danger)] mono">Clear all pins?</span>
                <button
                  type="button"
                  onClick={() => {
                    onClearAll()
                    setConfirmClear(false)
                  }}
                  className="px-2.5 py-1 rounded bg-[var(--danger)] text-white text-xs font-bold transition cursor-pointer"
                >
                  Yes, clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-1 text-xs text-[var(--muted)] hover:text-[var(--text)] transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="text-xs text-[var(--muted)] hover:text-[var(--danger)] mono transition cursor-pointer"
                >
                  Clear all pins
                </button>
                <button
                  type="button"
                  onClick={onExportMarkdown}
                  className="px-3 py-1.5 rounded-lg border border-[var(--accent)] bg-[var(--accent)] text-slate-950 font-bold text-xs mono transition cursor-pointer shadow-xs"
                >
                  Download Cheatsheet (.md)
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
