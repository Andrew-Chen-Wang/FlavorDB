import { catalogMapData } from "./map-data"

export type CountryCluster = {
  code: string
  name: string
  lng: number
  lat: number
  count: number
  dishes: string[]
}

/** Full catalog counts at country centers. */
export function countryClusters(): CountryCluster[] {
  const data = catalogMapData()
  const ids = new Map(data.dishes.map((d, i) => [d.slug, String(i)]))
  return data.countries.map(({ dishes, ...country }) => ({
    ...country,
    count: dishes.length,
    dishes: dishes.map((id) => ids.get(id)!),
  }))
}
