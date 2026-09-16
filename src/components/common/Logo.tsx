import { WeatherIcon } from './WeatherIcon'

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <WeatherIcon code={0} className="size-8" />
      <span className="font-heading text-xl font-bold text-neutral-0">Clima Bolivia</span>
    </div>
  )
}