import { useEffect, useMemo, useState } from 'react'
import { fetchForecast, WeatherApiError, type Forecast } from './api/openMeteo'
import { CitySelector } from './components/CitySelector'
import { CurrentWeather } from './components/CurrentWeather'
import { DailyForecast } from './components/DailyForecast'
import { ErrorState, WeatherSkeleton } from './components/ErrorState'
import { HourlyForecast } from './components/HourlyForecast'
import { MetricCard } from './components/MetricCard'
import { UnitsMenu } from './components/UnitsMenu'
import { WeatherIcon } from './components/WeatherIcon'
import { cities, defaultCityId } from './data/cities'
import { dateKeyFromTime } from './lib/format'
import {
  formatDegrees,
  formatPrecipitation,
  formatWind,
  type UnitSystem,
} from './lib/units'

const forecastCache = new Map<string, Forecast>()

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <WeatherIcon code={0} className="size-8" />
      <span className="font-heading text-xl font-bold text-neutral-0">Clima Bolivia</span>
    </div>
  )
}

export default function App() {
  const [selectedCityId, setSelectedCityId] = useState(defaultCityId)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [forecast, setForecast] = useState<Forecast | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [retryToken, setRetryToken] = useState(0)
  const [units, setUnits] = useState<UnitSystem>('metric')

  const city = useMemo(
    () => cities.find((item) => item.id === selectedCityId) ?? cities[0],
    [selectedCityId],
  )

  useEffect(() => {
    const controller = new AbortController()

    void (async () => {
      await Promise.resolve()
      const cached = forecastCache.get(city.id)
      if (!cached) {
        setStatus('loading')
        setErrorMessage('')
      }

      try {
        const data = cached ?? (await fetchForecast(city, controller.signal))
        forecastCache.set(city.id, data)
        setForecast(data)
        setSelectedDate(data.daily[0]?.date ?? dateKeyFromTime(data.current.time))
        setStatus('ready')
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        const message =
          error instanceof WeatherApiError
            ? error.message
            : 'Ocurrió un error inesperado al obtener el clima.'
        setErrorMessage(message)
        setForecast(null)
        setStatus('error')
      }
    })()

    return () => controller.abort()
  }, [city, retryToken])

  const activeDate = selectedDate ?? forecast?.daily[0]?.date ?? ''

  return (
    <div className="min-h-svh bg-neutral-900 px-4 py-6 text-neutral-0 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1216px]">
        <header className="mb-12 flex items-center justify-between">
          <Logo />
          <UnitsMenu units={units} onChange={setUnits} />
        </header>

        <section className="mb-12 text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            ¿Cómo se ve el cielo hoy?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-300">
            Pronóstico de 7 días para las 9 capitales departamentales de Bolivia.
          </p>
          <div className="mt-8">
            <CitySelector
              cities={cities}
              selectedId={city.id}
              onSelect={(id) => {
                setSelectedCityId(id)
                const cached = forecastCache.get(id)
                if (cached) {
                  setForecast(cached)
                  setSelectedDate(
                    cached.daily[0]?.date ?? dateKeyFromTime(cached.current.time),
                  )
                  setStatus('ready')
                } else {
                  setStatus('loading')
                }
              }}
            />
          </div>
        </section>

        {status === 'loading' ? <WeatherSkeleton /> : null}

        {status === 'error' ? (
          <ErrorState
            message={errorMessage}
            onRetry={() => {
              forecastCache.delete(city.id)
              setRetryToken((value) => value + 1)
            }}
          />
        ) : null}

        {status === 'ready' && forecast ? (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
            <div className="space-y-8">
              <CurrentWeather
                city={city}
                date={dateKeyFromTime(forecast.current.time)}
                temperature={forecast.current.temperature}
                weatherCode={forecast.current.weatherCode}
                units={units}
              />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <MetricCard
                  label="Sensación térmica"
                  value={formatDegrees(forecast.current.apparentTemperature, units)}
                />
                <MetricCard label="Humedad" value={`${forecast.current.humidity}%`} />
                <MetricCard
                  label="Viento"
                  value={formatWind(forecast.current.windSpeed, units)}
                />
                <MetricCard
                  label="Precipitación"
                  value={formatPrecipitation(forecast.current.precipitation, units)}
                />
              </div>
              <DailyForecast
                days={forecast.daily}
                selectedDate={activeDate}
                units={units}
                onSelect={setSelectedDate}
              />
            </div>
            <HourlyForecast
              days={forecast.daily}
              hours={forecast.hourly}
              selectedDate={activeDate}
              currentTime={forecast.current.time}
              units={units}
              onSelectDate={setSelectedDate}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
