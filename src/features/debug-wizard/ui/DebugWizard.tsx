import { useState } from 'react'
import type { WizardNode } from '@/entities/topic'
import { DOCKER_WIZARD_TREE } from '@/entities/docker'
import { renderInline } from '@/shared'
import { CodeBlock } from '@/features/code-block'

interface DebugWizardProps {
  tree?: Record<string, WizardNode>
  title?: string
}

export function DebugWizard({ tree = DOCKER_WIZARD_TREE }: DebugWizardProps) {
  const [currentStep, setCurrentStep] = useState<string>('start')

  const node: WizardNode = tree[currentStep] || tree.start || { q: '', options: [] }

  return (
    <div className="panel2 rounded-xl border border-[var(--border)] p-4 sm:p-5 md:p-6 my-5 sm:my-6 w-full max-w-4xl min-w-0 shadow-sm transition-all">
      {node.options && node.options.length > 0 ? (
        <div className="fade-in">
          <div className="mono text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] mb-2">
            Interactive Triage
          </div>
          <p className="font-semibold text-[15px] sm:text-base md:text-lg mb-3.5 text-[var(--text)]">
            {node.q ? renderInline(node.q) : ''}
          </p>
          <div className="flex flex-col gap-2">
            {node.options.map((opt) => (
              <button
                key={opt.next}
                type="button"
                onClick={() => setCurrentStep(opt.next)}
                className="w-full text-left px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-lg border border-[var(--border)] bg-[var(--panel)] hover:border-[var(--accent)] active:bg-[var(--panel2)] transition flex justify-between items-center text-xs sm:text-sm font-medium text-[var(--text)] group cursor-pointer min-h-[44px]"
              >
                <span>{renderInline(opt.label)}</span>
                <span className="text-[var(--accent)] font-bold text-base transition-transform group-hover:translate-x-0.5 ml-2 shrink-0">
                  ›
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="fade-in">
          <div className="mono text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] mb-1">
            Diagnosis
          </div>
          <h3 className="text-xl md:text-2xl font-heading font-semibold mb-2 text-[var(--text)]">
            {node.title ? renderInline(node.title) : ''}
          </h3>
          <p className="text-sm leading-relaxed mb-4 text-[var(--muted)]">
            {node.body ? renderInline(node.body) : ''}
          </p>

          {node.cmds && node.cmds.length > 0 && (
            <CodeBlock
              code={node.cmds.join('\n')}
              lang="bash"
              title="recommended commands"
            />
          )}

          <div className="mt-4 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep('start')}
              className="text-xs mono px-3.5 py-1.5 rounded-md border border-[var(--border)] bg-[var(--panel)] hover:bg-[var(--panel2)] text-[var(--muted)] hover:text-[var(--text)] transition cursor-pointer"
            >
              ↺ start over
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
