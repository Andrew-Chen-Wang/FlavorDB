import { COUNTRY_NAMES, countriesOf, countryPlace, dishes } from "./data"

export type CountryCluster = { code: string; name: string; lng: number; lat: number; count: number }

/** Dish counts per country, placed at the country's center, for the zoomed-out map. */
export function countryClusters(): CountryCluster[] {
  const counts = new Map<string, number>()
  for (const d of dishes) for (const c of countriesOf(d)) counts.set(c, (counts.get(c) ?? 0) + 1)
  return [...counts.entries()].flatMap(([code, count]) => {
    const place = countryPlace(code)
    if (!place) return []
    return [{ code, name: COUNTRY_NAMES[code] ?? code, lng: place.lng, lat: place.lat, count }]
  })
}
