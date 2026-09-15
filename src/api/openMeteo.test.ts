// api/openMeteo.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchForecast, WeatherApiError } from './openMeteo'

const mockCity = { id: 'lp', name: 'La Paz', shortName: 'La Paz', department: 'La Paz', latitude: -16.5, longitude: -68.15 }


afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchForecast', () => {
  it('lanza WeatherApiError con el reason cuando la API responde 400', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: true, reason: 'Cannot initialize WeatherVariable...' }),
    }))

    await expect(fetchForecast(mockCity)).rejects.toThrow(WeatherApiError)
  })

  it('lanza WeatherApiError cuando falla la conexión', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network error')))

    await expect(fetchForecast(mockCity)).rejects.toThrow(
      'No se pudo conectar con Open-Meteo',
    )
  })

  it('parsea correctamente una respuesta válida', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          time: '2026-09-14T10:00',
          temperature_2m: 18,
          relative_humidity_2m: 40,
          apparent_temperature: 16,
          precipitation: 0,
          weather_code: 0,
          wind_speed_10m: 10,
          is_day: 1,
        },
        hourly: { time: [], temperature_2m: [], weather_code: [], is_day: [] },
        daily: { time: [], weather_code: [], temperature_2m_max: [], temperature_2m_min: [] },
      }),
    }))

    const result = await fetchForecast(mockCity)
    expect(result.current.temperature).toBe(18)
    expect(result.current.isDay).toBe(true)
  })
})
