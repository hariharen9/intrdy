export const ROUTES = {
  home: '/',
  docker: '/docker',
  kubernetes: '/kubernetes',
  jenkins: '/jenkins',
  git: '/git',
  ansible: '/ansible',
  notFound: '*',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
