import type { RouteObject } from 'react-router-dom'
import { AnsiblePage, ArtifactoryPage, DockerPage, GitPage, HomePage, JenkinsPage, K8sPage, NotFoundPage } from './lazy-pages'
import { ROUTES } from './paths'
import { RouteErrorFallback } from './route-error-fallback'
import { withPageBoundary } from './with-page-boundary'

export const routes: RouteObject[] = [
  {
    path: ROUTES.home,
    element: withPageBoundary(<HomePage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: ROUTES.docker,
    element: withPageBoundary(<DockerPage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: ROUTES.kubernetes,
    element: withPageBoundary(<K8sPage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: ROUTES.jenkins,
    element: withPageBoundary(<JenkinsPage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: ROUTES.git,
    element: withPageBoundary(<GitPage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: ROUTES.ansible,
    element: withPageBoundary(<AnsiblePage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: ROUTES.artifactory,
    element: withPageBoundary(<ArtifactoryPage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: ROUTES.notFound,
    element: withPageBoundary(<NotFoundPage />),
  },
]
