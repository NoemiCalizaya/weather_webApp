import { useEffect, useRef, useState } from 'react'
import type { UnitSystem } from '../lib/units'

type UnitsMenuProps = {
  units: UnitSystem
  onChange: (units: UnitSystem) => void
}

export function UnitsMenu({ units, onChange }: UnitsMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 px-3 py-2 text-sm font-medium text-neutral-0 hover:bg-neutral-700"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 2v2M8 12v2M2 8h2M12 8h2M3.8 3.8l1.4 1.4M10.8 10.8l1.4 1.4M3.8 12.2l1.4-1.4M10.8 5.2l1.4-1.4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        Unidades
        <svg className="size-3" viewBox="0 0 12 8" fill="none" aria-hidden="true">
          <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-56 rounded-xl bg-neutral-800 p-2 shadow-xl ring-1 ring-neutral-600"
        >
          <p className="px-3 py-2 text-xs text-neutral-300">Sistema</p>
          <button
            type="button"
            role="menuitem"
            className={`flex w-full rounded-lg px-3 py-2 text-left text-sm ${units === 'metric' ? 'bg-neutral-700' : 'hover:bg-neutral-700'}`}
            onClick={() => {
              onChange('metric')
              setOpen(false)
            }}
          >
            Métrico (°C, km/h, mm)
          </button>
          <button
            type="button"
            role="menuitem"
            className={`flex w-full rounded-lg px-3 py-2 text-left text-sm ${units === 'imperial' ? 'bg-neutral-700' : 'hover:bg-neutral-700'}`}
            onClick={() => {
              onChange('imperial')
              setOpen(false)
            }}
          >
            Imperial (°F, mph, in)
          </button>
        </div>
      ) : null}
    </div>
  )
}
