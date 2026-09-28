import type { RouteObject } from 'react-router-dom'
import {
  AnsibleCrashPage,
  AnsiblePage,
  ArtifactoryCrashPage,
  ArtifactoryPage,
  DockerCrashPage,
  DockerPage,
  GitCrashPage,
  GitPage,
  HomePage,
  JenkinsCrashPage,
  JenkinsPage,
  K8sCrashPage,
  K8sPage,
  NotFoundPage,
  TerraformPage,
  AiPage,
} from './lazy-pages'
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
    path: ROUTES.terraform,
    element: withPageBoundary(<TerraformPage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: ROUTES.ai,
    element: withPageBoundary(<AiPage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: ROUTES.dockerCrash,
    element: withPageBoundary(<DockerCrashPage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: ROUTES.k8sCrash,
    element: withPageBoundary(<K8sCrashPage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: ROUTES.jenkinsCrash,
    element: withPageBoundary(<JenkinsCrashPage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: ROUTES.gitCrash,
    element: withPageBoundary(<GitCrashPage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: ROUTES.ansibleCrash,
    element: withPageBoundary(<AnsibleCrashPage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: ROUTES.artifactoryCrash,
    element: withPageBoundary(<ArtifactoryCrashPage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: ROUTES.notFound,
    element: withPageBoundary(<NotFoundPage />),
  },
]
