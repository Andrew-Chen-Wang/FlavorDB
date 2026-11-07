import type { CatalogEntry } from "./catalog"

export const PLACE_PAGE_SIZE = 48

/** Stable country membership, recipe/photo priority and bounded pagination. */
export function countryCatalogPage(
  entries: CatalogEntry[],
  country: string,
  requested?: string | string[],
) {
  const hits = entries
    .filter((e) => e.countries.includes(country))
    .toSorted(
      (a, b) =>
        Number(b.hasRecipe) - Number(a.hasRecipe) ||
        Number(!!b.image) - Number(!!a.image) ||
        a.name.localeCompare(b.name) ||
        a.key.localeCompare(b.key),
    )
  const pages = Math.max(1, Math.ceil(hits.length / PLACE_PAGE_SIZE))
  const number = Number(Array.isArray(requested) ? requested[0] : requested)
  const page = Math.min(pages, Number.isSafeInteger(number) && number > 0 ? number : 1)
  return {
    total: hits.length,
    withRecipe: hits.filter((e) => e.hasRecipe).length,
    pages,
    page,
    results: hits.slice((page - 1) * PLACE_PAGE_SIZE, page * PLACE_PAGE_SIZE),
  }
}
