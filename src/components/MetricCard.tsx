type MetricCardProps = {
  label: string
  value: string
}

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <article className="rounded-xl bg-neutral-800 px-4 py-4 text-left">
      <p className="text-sm text-neutral-300">{label}</p>
      <p className="mt-4 text-3xl font-light text-neutral-0">{value}</p>
    </article>
  )
}
