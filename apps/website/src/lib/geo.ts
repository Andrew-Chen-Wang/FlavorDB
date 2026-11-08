import { catalogMapData } from "./map-data"

export type CountryCluster = {
  code: string
  name: string
  lng: number
  lat: number
  representative?: { name: string; image?: string }
  count: number
  dishes: string[]
}

/** Full catalog counts at country centers. */
export function countryClusters(): CountryCluster[] {
  const data = catalogMapData()
  const ids = new Map(data.dishes.map((d, i) => [d.slug, String(i)]))
  const byId = new Map(data.dishes.map((d) => [d.slug, d]))
  return data.countries.map(({ dishes, ...country }) => {
    const candidates = dishes.map((id) => byId.get(id)!)
    const representative = candidates.find((d) => d.image) ?? candidates[0]
    return {
      ...country,
      count: dishes.length,
      representative: representative
        ? { name: representative.name, image: representative.image }
        : undefined,
      dishes: dishes.map((id) => ids.get(id)!),
    }
  })
}
