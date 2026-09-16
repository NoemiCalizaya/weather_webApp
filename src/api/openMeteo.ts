import type { City } from '../data/cities'

export type Forecast = {
  current: {
    time: string
    temperature: number
    apparentTemperature: number
    humidity: number
    precipitation: number
    weatherCode: number
    windSpeed: number
    isDay: boolean
  }
  daily: Array<{
    date: string
    weatherCode: number
    temperatureMax: number
    temperatureMin: number
  }>
  hourly: Array<{
    time: string
    temperature: number
    weatherCode: number
    isDay: boolean // nuevo
  }>
}

type OpenMeteoResponse = {
  current?: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
    is_day: number
  }
  hourly?: {
    time: string[]
    temperature_2m: number[]
    weather_code: number[]
    is_day: number[]
  }
  daily?: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
  }
  error?: boolean
  reason?: string
}

// URL configurable por variable de entorno, con fallback por si falta el .env
const FORECAST_URL =
  import.meta.env.VITE_OPEN_METEO_URL || 'https://api.open-meteo.com/v1/forecast'

export class WeatherApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WeatherApiError'
  }
}

function parseForecast(data: OpenMeteoResponse): Forecast {
  const { current, hourly, daily } = data

  if (!current || !hourly || !daily) {
    throw new WeatherApiError('La API devolvió una respuesta incompleta.')
  }

  const days = daily.time.map((date, index) => ({
    date,
    weatherCode: daily.weather_code[index] ?? 0,
    temperatureMax: daily.temperature_2m_max[index] ?? 0,
    temperatureMin: daily.temperature_2m_min[index] ?? 0,
  }))

  const hours = hourly.time.map((time, index) => ({
    time,
    temperature: hourly.temperature_2m[index] ?? 0,
    weatherCode: hourly.weather_code[index] ?? 0,
    isDay: hourly.is_day[index] === 1, // nuevo
  }))

  return {
    current: {
      time: current.time,
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      precipitation: current.precipitation,
      weatherCode: current.weather_code,
      windSpeed: current.wind_speed_10m,
      isDay: current.is_day === 1,
    },
    daily: days.slice(0, 7),
    hourly: hours,
  }
}

export async function fetchForecast(
  city: City,
  signal?: AbortSignal,
): Promise<Forecast> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    timezone: 'America/La_Paz',
    forecast_days: '7',
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'is_day'
    ].join(','),
    hourly: 'temperature_2m,weather_code,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
  })

  let response: Response
  try {
    response = await fetch(`${FORECAST_URL}?${params}`, { signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    throw new WeatherApiError(
      'No se pudo conectar con Open-Meteo. Revisa tu conexión e inténtalo de nuevo.',
    )
  }

  if (!response.ok) {
    let body: OpenMeteoResponse | null = null
    try {
      body = (await response.json()) as OpenMeteoResponse
    } catch {
      // el body no era JSON válido, seguimos con el mensaje genérico de abajo
    }

    if (response.status === 400 && body?.reason) {
      throw new WeatherApiError(`Solicitud inválida: ${body.reason}`)
    }
    if (response.status === 404) {
      throw new WeatherApiError(
        'El endpoint solicitado no existe. Verifica la URL configurada en las variables de entorno.',
      )
    }
    if (response.status >= 500) {
      throw new WeatherApiError('El servicio de clima no está disponible. Intenta más tarde.')
    }
    throw new WeatherApiError(
      `Open-Meteo respondió con el código ${response.status}. Inténtalo de nuevo en unos momentos.`,
    )
  }

  let data: OpenMeteoResponse
  try {
    data = (await response.json()) as OpenMeteoResponse
  } catch {
    throw new WeatherApiError('No se pudo interpretar la respuesta de la API.')
  }

  return parseForecast(data)

}
