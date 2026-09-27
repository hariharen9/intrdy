export const ROUTES = {
  home: '/',
  docker: '/docker',
  kubernetes: '/kubernetes',
  jenkins: '/jenkins',
  git: '/git',
  notFound: '*',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
