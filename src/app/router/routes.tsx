import type { RouteObject } from 'react-router-dom'
import { DockerPage, HomePage, NotFoundPage } from './lazy-pages'
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
    path: ROUTES.notFound,
    element: withPageBoundary(<NotFoundPage />),
  },
]

