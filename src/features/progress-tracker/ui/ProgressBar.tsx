interface ProgressBarProps {
  completed: number
  total: number
  percent: number
  className?: string
}

export function ProgressBar({ completed, total, percent, className = '' }: ProgressBarProps) {
  return (
    <div className={`flex items-center gap-2.5 text-xs mono text-[var(--muted)] ${className}`}>
      <div className="w-24 sm:w-28 h-2 rounded-full overflow-hidden bg-[var(--panel2)] border border-[var(--border)]">
        <div
          className="h-full transition-all duration-300 rounded-full"
          style={{
            width: `${percent}%`,
            background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
          }}
        />
      </div>
      <span className="font-semibold text-[var(--text)]">
        {completed}/{total}
      </span>
    </div>
  )
}
