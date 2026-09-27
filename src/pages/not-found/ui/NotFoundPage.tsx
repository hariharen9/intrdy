import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-6xl font-semibold tracking-tight text-brand-600">404</p>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-zinc-500">The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          Back home
        </Link>
      </div>
    </main>
  )
}
