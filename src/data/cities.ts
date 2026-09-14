export type City = {
  id: string
  name: string
  shortName: string
  department: string
  latitude: number
  longitude: number
}

export const cities: City[] = [
  {
    id: 'sucre',
    name: 'Sucre',
    shortName: 'Sucre',
    department: 'Chuquisaca',
    latitude: -19.0478,
    longitude: -65.2596,
  },
  {
    id: 'la-paz',
    name: 'La Paz',
    shortName: 'La Paz',
    department: 'La Paz',
    latitude: -16.5,
    longitude: -68.15,
  },
  {
    id: 'cochabamba',
    name: 'Cochabamba',
    shortName: 'Cochabamba',
    department: 'Cochabamba',
    latitude: -17.3895,
    longitude: -66.1568,
  },
  {
    id: 'oruro',
    name: 'Oruro',
    shortName: 'Oruro',
    department: 'Oruro',
    latitude: -17.9833,
    longitude: -67.15,
  },
  {
    id: 'potosi',
    name: 'Potosí',
    shortName: 'Potosí',
    department: 'Potosí',
    latitude: -19.5836,
    longitude: -65.7531,
  },
  {
    id: 'tarija',
    name: 'Tarija',
    shortName: 'Tarija',
    department: 'Tarija',
    latitude: -21.5355,
    longitude: -64.7296,
  },
  {
    id: 'santa-cruz',
    name: 'Santa Cruz de la Sierra',
    shortName: 'Santa Cruz',
    department: 'Santa Cruz',
    latitude: -17.7833,
    longitude: -63.1821,
  },
  {
    id: 'trinidad',
    name: 'Trinidad',
    shortName: 'Trinidad',
    department: 'Beni',
    latitude: -14.8333,
    longitude: -64.9,
  },
  {
    id: 'cobija',
    name: 'Cobija',
    shortName: 'Cobija',
    department: 'Pando',
    latitude: -11.0267,
    longitude: -68.7692,
  },
]

export const defaultCityId = 'la-paz'
