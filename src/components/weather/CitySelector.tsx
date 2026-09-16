import type { City } from '../../data/cities'

type CitySelectorProps = {
  cities: City[]
  selectedId: string
  onSelect: (id: string) => void
}

export function CitySelector({ cities, selectedId, onSelect }: CitySelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {cities.map((city) => {
        const selected = city.id === selectedId
        return (
          <button
            key={city.id}
            type="button"
            onClick={() => onSelect(city.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selected
                ? 'bg-blue-500 text-neutral-0'
                : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
            }`}
            aria-pressed={selected}
          >
            {city.shortName}
          </button>
        )
      })}
    </div>
  )
}
