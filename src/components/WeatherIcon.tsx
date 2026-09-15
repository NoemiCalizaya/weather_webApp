import type { ReactNode } from 'react'
import { weatherIconKind, type WeatherIconKind } from '../lib/weatherCodes'

type WeatherIconProps = {
  code: number
  isDay?: boolean // nuevo, default true
  className?: string
}

function Sun({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="14" fill="#FFC14A" />
      <g stroke="#FFC14A" strokeWidth="3" strokeLinecap="round">
        <path d="M32 6v8M32 50v8M6 32h8M50 32h8M13 13l6 6M45 45l6 6M13 51l6-6M45 19l6-6" />
      </g>
    </svg>
  )
}

function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d="M22 46h24c6 0 10-4 10-9s-4-9-10-9c-1-8-8-13-15-13-8 0-14 6-15 13-5 0-10 4-10 9s5 9 10 9h6z"
        fill="#E6E6F0"
      />
      <path
        d="M20 44h24c5 0 8-3.5 8-8s-3-8-8-8c-1-6.5-6.5-11-13-11-7 0-12 5-13 11-4 0-8 3.5-8 8s4 8 8 8h2z"
        fill="#B8B8C9"
      />
    </svg>
  )
}

function Moon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d="M40 8a24 24 0 1 0 16 42A20 20 0 0 1 40 8z"
        fill="#D8D8F0"
      />
    </svg>
  )
}

const icons: Record<WeatherIconKind, (props: { className?: string }) => ReactNode> = {
  sun: Sun,
  moon: Moon, // nuevo
  sunCloud: ({ className }) => (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="40" cy="22" r="10" fill="#FFC14A" />
      <path
        d="M20 50h26c5.5 0 10-4 10-9s-4.5-9-10-9c-1-7-7-12-14-12-8 0-14 6-15 13-5 0-9 4-9 8.5S13 50 18 50h2z"
        fill="#E6E6F0"
      />
    </svg>
  ),
  moonCloud: ({ className }) => ( // nuevo
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M42 20a10 10 0 1 0 6 18 8 8 0 0 1-6-18z" fill="#D8D8F0" />
      <path
        d="M20 50h26c5.5 0 10-4 10-9s-4.5-9-10-9c-1-7-7-12-14-12-8 0-14 6-15 13-5 0-9 4-9 8.5S13 50 18 50h2z"
        fill="#B8B8C9"
      />
    </svg>
  ),
  cloud: Cloud,
  fog: ({ className }) => (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M18 34h28c4 0 8-3 8-7s-3.5-7-8-7c-1-6-6-10-12-10s-12 5-13 11c-4 0-8 3-8 6.5S13 34 18 34z" fill="#C9C9D6" />
      <g stroke="#A8A8BB" strokeWidth="3" strokeLinecap="round">
        <path d="M14 42h36M18 50h28" />
      </g>
    </svg>
  ),
  drizzle: ({ className }) => (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M20 34h26c5 0 9-4 9-8.5S51 17 46 17c-1-7-7-12-14-12-8 0-14 6-15 13-4.5 0-9 3.5-9 8s4 8 9 8h3z" fill="#E6E6F0" />
      <g stroke="#5B8DEF" strokeWidth="3" strokeLinecap="round">
        <path d="M24 42v6M32 44v6M40 42v6" />
      </g>
    </svg>
  ),
  rain: ({ className }) => (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M20 32h26c5 0 9-4 9-8.5S51 15 46 15c-1-7-7-12-14-12-8 0-14 6-15 13-4.5 0-9 3.5-9 8s4 8 9 8h3z" fill="#B8B8C9" />
      <g stroke="#4C7DFF" strokeWidth="3" strokeLinecap="round">
        <path d="M22 40l-4 10M32 40l-4 10M42 40l-4 10" />
      </g>
    </svg>
  ),
  snow: ({ className }) => (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M20 32h26c5 0 9-4 9-8.5S51 15 46 15c-1-7-7-12-14-12-8 0-14 6-15 13-4.5 0-9 3.5-9 8s4 8 9 8h3z" fill="#E6E6F0" />
      <g fill="#DCEBFF" stroke="#9EC5FF" strokeWidth="1.5">
        <circle cx="24" cy="46" r="3" />
        <circle cx="34" cy="42" r="3" />
        <circle cx="42" cy="48" r="3" />
      </g>
    </svg>
  ),
  storm: ({ className }) => (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M18 30h26c5 0 9-4 9-8.5S49 13 44 13c-1-7-7-12-14-12-8 0-14 6-15 13-4.5 0-9 3.5-9 8s4 8 9 8h3z" fill="#8B8BA3" />
      <path d="M30 32l-8 14h8l-4 12 16-18h-8l6-8z" fill="#FFC14A" />
    </svg>
  ),
}

export function WeatherIcon({ code,  isDay = true, className = 'size-16' }: WeatherIconProps) {
   const Icon = icons[weatherIconKind(code, isDay)]
  return <Icon className={className} />
}
