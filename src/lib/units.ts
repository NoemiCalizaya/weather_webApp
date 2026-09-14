export type UnitSystem = 'metric' | 'imperial'

export function convertTemperature(celsius: number, units: UnitSystem): number {
  if (units === 'imperial') return (celsius * 9) / 5 + 32
  return celsius
}

export function convertWind(kmh: number, units: UnitSystem): number {
  if (units === 'imperial') return kmh * 0.621371
  return kmh
}

export function convertPrecipitation(mm: number, units: UnitSystem): number {
  if (units === 'imperial') return mm / 25.4
  return mm
}

export function temperatureSymbol(units: UnitSystem): string {
  return units === 'imperial' ? '°F' : '°C'
}

export function windLabel(units: UnitSystem): string {
  return units === 'imperial' ? 'mph' : 'km/h'
}

export function precipitationLabel(units: UnitSystem): string {
  return units === 'imperial' ? 'in' : 'mm'
}

export function formatDegrees(value: number, units: UnitSystem): string {
  return `${Math.round(convertTemperature(value, units))}°`
}

export function formatWind(value: number, units: UnitSystem): string {
  return `${Math.round(convertWind(value, units))} ${windLabel(units)}`
}

export function formatPrecipitation(value: number, units: UnitSystem): string {
  const converted = convertPrecipitation(value, units)
  const digits = units === 'imperial' ? 2 : 0
  return `${converted.toFixed(digits)} ${precipitationLabel(units)}`
}
