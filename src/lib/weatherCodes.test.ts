// lib/weatherCodes.test.ts
import { describe, it, expect } from 'vitest'
import { describeWeather, weatherIconKind } from './weatherCodes'

describe('describeWeather', () => {
  it('devuelve "Despejado" para código 0', () => {
    expect(describeWeather(0)).toBe('Despejado')
  })
  it('devuelve "Tormenta" para códigos 95+', () => {
    expect(describeWeather(95)).toBe('Tormenta')
    expect(describeWeather(99)).toBe('Tormenta')
  })
})

describe('weatherIconKind', () => {
  it('devuelve "sun" de día y "moon" de noche para código 0', () => {
    expect(weatherIconKind(0, true)).toBe('sun')
    expect(weatherIconKind(0, false)).toBe('moon')
  })
  it('devuelve "rain" para lluvia y chubascos', () => {
    expect(weatherIconKind(61)).toBe('rain')
    expect(weatherIconKind(80)).toBe('rain')
  })
})
