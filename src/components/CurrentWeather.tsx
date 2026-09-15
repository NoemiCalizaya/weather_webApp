import type { City } from '../data/cities'
import { formatLongDate } from '../lib/format'
import { formatDegrees, type UnitSystem } from '../lib/units'
import { describeWeather } from '../lib/weatherCodes'
import { WeatherIcon } from './WeatherIcon'

type CurrentWeatherProps = {
  city: City
  date: string
  temperature: number
  weatherCode: number
  isDay: boolean // nuevo
  units: UnitSystem
}

export function CurrentWeather({
  city,
  date,
  temperature,
  weatherCode,
  isDay, // nuevo
  units,
}: CurrentWeatherProps) {
  return (
    <section className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#4658d9_0%,#2b1b9a_100%)] px-6 py-10 text-left sm:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true">
        <div className="absolute left-[12%] top-[18%] size-1.5 rounded-full bg-white/80" />
        <div className="absolute left-[28%] top-[62%] size-1 rounded-full bg-orange-500" />
        <div className="absolute right-[22%] top-[24%] size-1 rounded-full bg-orange-500" />
        <div className="absolute right-[12%] bottom-[22%] size-1.5 rounded-full bg-white/70" />
        <div className="absolute left-[48%] top-[14%] size-1 rounded-full bg-white/60" />
      </div>
      <div className="relative flex flex-col items-center justify-between gap-8 sm:flex-row">
        <div>
          <h2 className="font-heading text-3xl font-bold text-neutral-0">
            {city.name}
          </h2>
          <p className="mt-2 text-neutral-200">
            {city.department}, Bolivia · {formatLongDate(date)}
          </p>
          <p className="mt-1 text-sm text-neutral-200">{describeWeather(weatherCode)}</p>
        </div>
        <div className="flex items-center gap-5">
          <WeatherIcon code={weatherCode} isDay={isDay} className="size-28" />
          <p className="font-heading text-7xl font-bold tracking-tight text-neutral-0 italic sm:text-8xl">
            {formatDegrees(temperature, units)}
          </p>
        </div>
      </div>
    </section>
  )
}
