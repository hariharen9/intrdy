import { lazy } from 'react'

export const HomePage = lazy(() =>
  import('@/pages/home').then((page) => ({ default: page.HomePage })),
)

export const DockerPage = lazy(() =>
  import('@/pages/docker').then((page) => ({ default: page.DockerPage })),
)

export const K8sPage = lazy(() =>
  import('@/pages/k8s').then((page) => ({ default: page.K8sPage })),
)

export const JenkinsPage = lazy(() =>
  import('@/pages/jenkins').then((page) => ({ default: page.JenkinsPage })),
)

export const GitPage = lazy(() =>
  import('@/pages/git').then((page) => ({ default: page.GitPage })),
)

export const NotFoundPage = lazy(() =>
  import('@/pages/not-found').then((page) => ({ default: page.NotFoundPage })),
)
