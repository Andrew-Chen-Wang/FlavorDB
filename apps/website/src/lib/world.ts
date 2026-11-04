import "server-only"
import { existsSync } from "node:fs"
import path from "node:path"
import { DEFAULT_DATA_DIR, type WorldDish, loadWorldDishes } from "@flavor-db/world-dishes"

export type { WorldDish }

/**
 * The data files sit in packages/world-dishes/data. Next bundles the package's code, so find the
 * folder from the working directory (apps/website locally and on Vercel), falling back to the
 * package's own location.
 */
function dataDir(): string {
  const candidates = [
    path.join(process.cwd(), "..", "..", "packages", "world-dishes", "data"),
    path.join(process.cwd(), "packages", "world-dishes", "data"),
    DEFAULT_DATA_DIR,
  ]
  return candidates.find((dir) => existsSync(dir)) ?? DEFAULT_DATA_DIR
}

type Indexed = { dish: WorldDish; haystack: string }

let index:
  | {
      all: Indexed[]
      byId: Map<string, WorldDish>
      countries: { code: string; name: string; count: number }[]
    }
  | undefined

const regionNames = new Intl.DisplayNames(["en"], { type: "region" })
export function countryName(code: string): string {
  try {
    return regionNames.of(code) ?? code
  } catch {
    return code
  }
}

function load() {
  if (index) return index
  const dishes = loadWorldDishes(dataDir())
  const counts = new Map<string, number>()
  for (const d of dishes) for (const c of d.countries) counts.set(c, (counts.get(c) ?? 0) + 1)
  index = {
    all: dishes.map((dish) => ({
      dish,
      haystack: [
        dish.name,
        ...Object.values(dish.names),
        dish.description ?? "",
        ...dish.cuisines,
        ...dish.kinds,
        ...dish.ingredients,
        ...dish.countries.map(countryName),
      ]
        .join(" ")
        .toLowerCase(),
    })),
    byId: new Map(dishes.map((d) => [d.id, d])),
    countries: [...counts.entries()]
      .map(([code, count]) => ({ code, name: countryName(code), count }))
      .toSorted((a, b) => a.name.localeCompare(b.name)),
  }
  return index
}

export function worldStats() {
  const { all, countries } = load()
  return {
    dishes: all.length,
    withRecipe: all.filter((i) => i.dish.recipes.length > 0).length,
    countries: countries.length,
  }
}

export const worldCountries = () => load().countries
export const findWorldDish = (id: string) => load().byId.get(id)

export type WorldQuery = { q?: string; country?: string; recipe?: boolean; page?: number }
export const PAGE_SIZE = 48

export function searchWorld({ q, country, recipe, page = 1 }: WorldQuery) {
  const words = (q ?? "").trim().toLowerCase().split(/\s+/).filter(Boolean)
  const hits = load()
    .all.filter(
      ({ dish, haystack }) =>
        (!country || dish.countries.includes(country)) &&
        (!recipe || dish.recipes.length > 0) &&
        words.every((w) => haystack.includes(w)),
    )
    .map((i) => i.dish)
    // Dishes with recipes and pictures first: they make the best first page.
    .toSorted(
      (a, b) =>
        Number(b.recipes.length > 0) - Number(a.recipes.length > 0) ||
        Number(!!b.image) - Number(!!a.image) ||
        a.name.localeCompare(b.name),
    )
  return { total: hits.length, results: hits.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) }
}

/** A small thumbnail from Wikimedia Commons. */
export const commonsThumb = (file: string, width = 480) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`
export const commonsPage = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(" ", "_"))}`

export const worldHref = (id: string) => `/world/${encodeURIComponent(id)}`
