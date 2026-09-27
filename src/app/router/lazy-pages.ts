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

export const AnsiblePage = lazy(() =>
  import('@/pages/ansible').then((page) => ({ default: page.AnsiblePage })),
)

export const ArtifactoryPage = lazy(() =>
  import('@/pages/artifactory').then((page) => ({ default: page.ArtifactoryPage })),
)

export const TerraformPage = lazy(() =>
  import('@/pages/terraform').then((page) => ({ default: page.TerraformPage })),
)

export const NotFoundPage = lazy(() =>
  import('@/pages/not-found').then((page) => ({ default: page.NotFoundPage })),
)
