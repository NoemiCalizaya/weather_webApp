import { useEffect, useState } from 'react'
import { fetchForecast, WeatherApiError, type Forecast } from '../api/openMeteo'
import { dateKeyFromTime } from '../lib/format'
import type { City } from '../data/cities'

const forecastCache = new Map<string, Forecast>()

type Status = 'loading' | 'ready' | 'error'

type UseForecastResult = {
  forecast: Forecast | null
  selectedDate: string | null
  setSelectedDate: (date: string) => void
  status: Status
  errorMessage: string
  retry: () => void
}

export function useForecast(city: City): UseForecastResult {
  const [forecast, setForecast] = useState<Forecast | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    void (async () => {
      const cached = forecastCache.get(city.id)
      if (cached) {
        setForecast(cached)
        setSelectedDate(cached.daily[0]?.date ?? dateKeyFromTime(cached.current.time))
        setStatus('ready')
        return
      }

      setStatus('loading')
      setErrorMessage('')

      try {
        const data = await fetchForecast(city, controller.signal)
        forecastCache.set(city.id, data)
        setForecast(data)
        setSelectedDate(data.daily[0]?.date ?? dateKeyFromTime(data.current.time))
        setStatus('ready')
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setErrorMessage(
          error instanceof WeatherApiError
            ? error.message
            : 'Ocurrió un error inesperado al obtener el clima.',
        )
        setForecast(null)
        setStatus('error')
      }
    })()

    return () => controller.abort()
  }, [city, retryToken])

  function retry() {
    forecastCache.delete(city.id)
    setRetryToken((value) => value + 1)
  }

  return { forecast, selectedDate, setSelectedDate, status, errorMessage, retry }
}
