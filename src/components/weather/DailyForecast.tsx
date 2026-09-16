import type { Forecast } from '../../api/openMeteo'
import { formatWeekdayShort } from '../../lib/format'
import { formatDegrees, type UnitSystem } from '../../lib/units'
import { describeWeather } from '../../lib/weatherCodes'
import { WeatherIcon } from '../common/WeatherIcon'

type DailyForecastProps = {
  days: Forecast['daily']
  selectedDate: string
  units: UnitSystem
  onSelect: (date: string) => void
}

export function DailyForecast({
  days,
  selectedDate,
  units,
  onSelect,
}: DailyForecastProps) {
  return (
    <section>
      <h3 className="mb-4 text-left text-lg font-semibold text-neutral-0">
        Pronóstico de 7 días
      </h3>
      <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((day) => {
          const selected = day.date === selectedDate
          return (
            <li key={day.date}>
              <button
                type="button"
                onClick={() => onSelect(day.date)}
                className={`flex w-full flex-col items-center rounded-xl bg-neutral-800 px-2 py-3 ring-offset-2 ring-offset-neutral-900 ${
                  selected ? 'ring-2 ring-blue-500' : 'hover:bg-neutral-700'
                }`}
                aria-pressed={selected}
                aria-label={`${formatWeekdayShort(day.date)}: ${describeWeather(day.weatherCode)}, máxima ${formatDegrees(day.temperatureMax, units)}, mínima ${formatDegrees(day.temperatureMin, units)}`}
              >
                <p className="text-sm font-medium text-neutral-0">
                  {formatWeekdayShort(day.date)}
                </p>
                <WeatherIcon code={day.weatherCode} className="my-3 size-14" />
                <p className="min-h-8 px-1 text-center text-[11px] leading-tight text-neutral-300">
                  {describeWeather(day.weatherCode)}
                </p>
                <div className="mt-3 flex w-full justify-between px-1 text-sm">
                  <span className="flex items-center gap-1 font-medium text-neutral-0">
                    <span className="text-[10px] uppercase text-neutral-400" aria-hidden="true">
                      Máx
                    </span>
                    {formatDegrees(day.temperatureMax, units)}
                  </span>
                  <span className="flex items-center gap-1 text-neutral-300">
                    <span className="text-[10px] uppercase text-neutral-500" aria-hidden="true">
                      Mín
                    </span>
                    {formatDegrees(day.temperatureMin, units)}
                  </span>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
