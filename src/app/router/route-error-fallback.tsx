export function RouteErrorFallback() {
  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <div className="flex max-w-md flex-col items-center gap-3 text-center">
        <p className="text-5xl font-semibold text-brand-600">Oops</p>
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-zinc-500">
          An unexpected error occurred while loading this page.
        </p>
        <a
          href="/"
          className="mt-2 text-sm font-medium text-brand-600 underline"
        >
          Back home
        </a>
      </div>
    </main>
  )
}
