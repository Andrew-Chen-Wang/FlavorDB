import "server-only"
import { catalogCountries, catalogEntries, curatedSlugFor } from "./catalog"
import { countryPlace, findDish, placesWithDishes } from "./data"
import { countryCatalogPage } from "./place-catalog"

export function countryForPlaceId(id: string) {
  return catalogCountries().find((c) => c.code.toLowerCase() === id)
}

/** Imported records already represented by a curated page are excluded by the shared catalog. */
export function importedCountryPage(country: string, page?: string | string[]) {
  return countryCatalogPage(
    catalogEntries().filter((e) => !findDish(e.key) && !curatedSlugFor(e.key)),
    country,
    page,
  )
}

export function placeCatalogGroups() {
  const local = new Map(placesWithDishes().map((g) => [g.country, g]))
  return catalogCountries().map((c) => ({
    ...c,
    href: `/places/${countryPlace(c.code)?.id ?? c.code.toLowerCase()}`,
    places: (local.get(c.code)?.places ?? []).filter(
      ({ place }) => place.id !== countryPlace(c.code)?.id,
    ),
  }))
}

export function countryPlaceStats(country: string) {
  const { total, withRecipe } = countryCatalogPage(catalogEntries(), country)
  return { total, withRecipe }
}
