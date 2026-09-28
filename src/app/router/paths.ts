export const ROUTES = {
  home: '/',
  docker: '/docker',
  kubernetes: '/kubernetes',
  jenkins: '/jenkins',
  git: '/git',
  ansible: '/ansible',
  artifactory: '/artifactory',
  terraform: '/terraform',
  ai: '/ai',
  observability: '/observability',
  dockerCrash: '/docker-crash',
  k8sCrash: '/k8s-crash',
  jenkinsCrash: '/jenkins-crash',
  gitCrash: '/git-crash',
  ansibleCrash: '/ansible-crash',
  artifactoryCrash: '/artifactory-crash',
  notFound: '*',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
