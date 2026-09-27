export const ROUTES = {
  home: '/',
  docker: '/docker',
  notFound: '*',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
