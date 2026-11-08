import { catalogMapData } from "./map-data"

export type CountryCluster = { code: string; name: string; lng: number; lat: number; count: number }

/** Full catalog counts at country centers. */
export function countryClusters(): CountryCluster[] {
  return catalogMapData().countries.map(({ dishes, ...country }) => ({
    ...country,
    count: dishes.length,
  }))
}
