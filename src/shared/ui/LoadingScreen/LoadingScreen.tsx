export function LoadingScreen({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="grid min-h-dvh place-items-center">
      <div className="flex flex-col items-center gap-3">
        <span className="size-8 animate-spin rounded-full border-2 border-zinc-300 border-t-brand-600" />
        <span className="text-sm text-zinc-500">{label}</span>
      </div>
    </div>
  )
}
