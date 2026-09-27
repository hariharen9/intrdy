import { lazy } from 'react'

export const HomePage = lazy(() =>
  import('@/pages/home').then((page) => ({ default: page.HomePage })),
)

export const DockerPage = lazy(() =>
  import('@/pages/docker').then((page) => ({ default: page.DockerPage })),
)

export const NotFoundPage = lazy(() =>
  import('@/pages/not-found').then((page) => ({ default: page.NotFoundPage })),
)

