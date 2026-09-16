const dateFormatter = new Intl.DateTimeFormat('es-BO', {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
  timeZone: 'America/La_Paz',
})

const weekdayShort = new Intl.DateTimeFormat('es-BO', {
  weekday: 'short',
  timeZone: 'America/La_Paz',
})

const weekdayLong = new Intl.DateTimeFormat('es-BO', {
  weekday: 'long',
  timeZone: 'America/La_Paz',
})

const hourFormatter = new Intl.DateTimeFormat('es-BO', {
  hour: 'numeric',
  hour12: true,
  timeZone: 'America/La_Paz',
})

function parseIsoDate(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00-04:00`)
}

export function formatLongDate(isoDate: string): string {
  const formatted = dateFormatter.format(parseIsoDate(isoDate))
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function formatWeekdayShort(isoDate: string): string {
  const value = weekdayShort.format(parseIsoDate(isoDate)).replace('.', '')
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatWeekdayLong(isoDate: string): string {
  const value = weekdayLong.format(parseIsoDate(isoDate))
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatHour(isoTime: string): string {
  return hourFormatter.format(new Date(isoTime)).toLowerCase()
}

export function dateKeyFromTime(isoTime: string): string {
  return isoTime.slice(0, 10)
}

export function currentLaPazTimeKey(): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/La_Paz',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  )

  return `${values.year}-${values.month}-${values.day}T${values.hour}`
}
