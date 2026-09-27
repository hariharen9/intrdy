import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { ErrorBoundary, LoadingScreen } from '@/shared'

export function withPageBoundary(children: ReactNode) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
    </ErrorBoundary>
  )
}
