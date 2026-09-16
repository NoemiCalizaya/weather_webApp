type ErrorStateProps = {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center rounded-2xl bg-neutral-800 px-6 py-12 text-center">
      <p className="text-4xl" aria-hidden="true">
        ⚠️
      </p>
      <h2 className="mt-4 font-heading text-3xl font-bold text-neutral-0">
        Algo salió mal
      </h2>
      <p className="mt-3 text-neutral-300">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-lg bg-blue-500 px-5 py-2.5 font-medium text-neutral-0 hover:bg-blue-500/90"
      >
        Reintentar
      </button>
    </section>
  )
}

export function WeatherSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_350px]" aria-hidden="true">
      <div className="space-y-6">
        <div className="h-52 animate-pulse rounded-[20px] bg-neutral-800" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl bg-neutral-800" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 lg:grid-cols-7">
          {Array.from({ length: 7 }, (_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-xl bg-neutral-800" />
          ))}
        </div>
      </div>
      <div className="h-[540px] animate-pulse rounded-[20px] bg-neutral-800" />
    </div>
  )
}
