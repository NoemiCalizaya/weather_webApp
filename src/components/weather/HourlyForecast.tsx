import { useEffect, useRef, useState } from 'react'
import type { Forecast } from '../../api/openMeteo'
import { formatHour, formatWeekdayLong, currentLaPazTimeKey } from '../../lib/format'
import { formatDegrees, type UnitSystem } from '../../lib/units'
import { WeatherIcon } from '../common/WeatherIcon'

type HourlyForecastProps = {
  days: Forecast['daily']
  hours: Forecast['hourly']
  selectedDate: string
  units: UnitSystem
  onSelectDate: (date: string) => void
}

export function HourlyForecast({
  days,
  hours,
  selectedDate,
  units,
  onSelectDate,
}: HourlyForecastProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const [currentTimeKey, setCurrentTimeKey] = useState(() =>
    currentLaPazTimeKey(),
  )

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTimeKey(currentLaPazTimeKey())
    }

    updateCurrentTime()

    const intervalId = window.setInterval(updateCurrentTime, 60 * 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  
  const isToday = selectedDate === currentTimeKey.slice(0, 10)

  const dayHours = hours.filter((hour) => hour.time.startsWith(selectedDate))

  const currentHourKey = currentTimeKey.slice(0, 13)

  const upcomingHours = dayHours.filter(
    (hour) => !isToday || hour.time.slice(0, 13) >= currentHourKey,
  )

  const visibleHours = (upcomingHours.length > 0 ? upcomingHours : dayHours).slice(0, 8)

  return (
    <aside className="rounded-[20px] bg-neutral-800 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-neutral-0">Pronóstico por hora</h3>
        <div className="relative" ref={rootRef}>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-700 px-3 py-2 text-sm font-medium"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
          >
            {formatWeekdayLong(selectedDate)}
            <svg className="size-3" viewBox="0 0 12 8" fill="none" aria-hidden="true">
              <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          {open ? (
            <ul className="absolute right-0 z-10 mt-2 w-40 overflow-hidden rounded-xl bg-neutral-700 py-1 shadow-xl">
              {days.map((day) => (
                <li key={day.date}>
                  <button
                    type="button"
                    className={`block w-full px-3 py-2 text-left text-sm ${
                      day.date === selectedDate ? 'bg-neutral-600' : 'hover:bg-neutral-600'
                    }`}
                    onClick={() => {
                      onSelectDate(day.date)
                      setOpen(false)
                    }}
                  >
                    {formatWeekdayLong(day.date)}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <ul className="flex max-h-[540px] flex-col gap-3 overflow-auto pr-1">
        {visibleHours.map((hour) => (
          <li
            key={hour.time}
            className="flex items-center justify-between rounded-lg bg-neutral-700 px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <WeatherIcon code={hour.weatherCode} isDay={hour.isDay} className="size-10" />
              <span className="text-sm font-medium">{formatHour(hour.time)}</span>
            </div>
            <span className="font-medium">{formatDegrees(hour.temperature, units)}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}
