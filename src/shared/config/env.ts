const env = import.meta.env

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const appConfig = {
  name: env.VITE_APP_NAME ?? 'INTRDY',
  mode: env.VITE_APP_ENV ?? 'development',
  apiBaseUrl: env.VITE_API_BASE_URL ?? '/api',
  isDev: env.DEV,
  isProd: env.PROD,
  requireEnv: required,
} as const

export type AppConfig = typeof appConfig
