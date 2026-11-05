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

export const worldCountries = () => load().countries
export const findWorldDish = (id: string) => load().byId.get(id)
/** Every world dish with its search text. */
export const worldIndex = () => load().all

export { commonsThumb } from "@website/components/site/dish-photo"
export const commonsPage = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(" ", "_"))}`

export const worldHref = (id: string) => `/dishes/${encodeURIComponent(id)}`
