import "server-only"
import { dishImages, sameAs } from "@flavor-db/seed-data"
import {
  COUNTRY_NAMES,
  countriesOf,
  type Dish,
  dishes,
  getIngredient,
  getPlace,
} from "@website/lib/data"
import { countryName, findWorldDish, worldHref, worldIndex } from "@website/lib/world"

/**
 * One list of every dish on the site: the hand-written dishes and the imported ones, searched,
 * filtered and paged together. An imported dish that is the same as a hand-written one (see
 * `sameAs`) is shown once, as the hand-written page.
 */
export type CatalogEntry = {
  key: string
  href: string
  name: string
  localName?: string
  countries: string[]
  description?: string
  /** A Wikimedia Commons file name, or a full URL */
  image?: string
  hasRecipe: boolean
  haystack: string
}

/** World dish id → the hand-written dish that stands in for it. */
const curatedFor = new Map(
  Object.entries(sameAs).flatMap(([slug, ids]) => ids.map((id) => [id, slug] as const)),
)
export const curatedSlugFor = (worldId: string) => curatedFor.get(worldId)

/** The imported dishes that are the same as a hand-written one, for their recipes and sources. */
export const sameAsWorldDishes = (slug: string) =>
  (sameAs[slug] ?? []).map((id) => findWorldDish(id)).filter((d) => d !== undefined)

/** A hand-written dish's photo. */
export const dishImage = (dish: Dish): string | undefined => dishImages[dish.slug]

const nameOf = (code: string) => COUNTRY_NAMES[code] ?? countryName(code)

function curatedEntry(d: Dish): CatalogEntry {
  const countries = countriesOf(d)
  const image = dishImage(d)
  return {
    key: d.slug,
    href: `/dishes/${d.slug}`,
    name: d.name,
    ...(d.localName ? { localName: d.localName.split(" / ")[0] } : {}),
    countries,
    description: d.summary,
    ...(image ? { image } : {}),
    hasRecipe: d.recipes.length > 0 || sameAsWorldDishes(d.slug).some((w) => w.recipes.length),
    haystack: [
      d.name,
      d.localName ?? "",
      d.summary,
      ...countries.map(nameOf),
      ...d.places.map((p) => getPlace(p.placeId).name),
      ...d.variations.map((v) => `${v.name} ${getPlace(v.placeId).name}`),
      ...d.ingredients.map((i) => {
        const ing = getIngredient(i)
        return [ing.name, ...(ing.aliases ?? [])].join(" ")
      }),
    ]
      .join(" ")
      .toLowerCase(),
  }
}

let catalog:
  | { all: CatalogEntry[]; countries: { code: string; name: string; count: number }[] }
  | undefined

function load() {
  if (catalog) return catalog
  const all: CatalogEntry[] = [
    ...dishes.map(curatedEntry),
    ...worldIndex()
      .filter(({ dish }) => !curatedFor.has(dish.id))
      .map(({ dish, haystack }) => {
        const zh = dish.names.zh && dish.names.zh !== dish.name ? dish.names.zh : undefined
        return {
          key: dish.id,
          href: worldHref(dish.id),
          name: dish.name,
          ...(zh ? { localName: zh } : {}),
          countries: dish.countries,
          ...(dish.description ? { description: dish.description } : {}),
          ...(dish.image || dish.imageUrl ? { image: dish.image ?? dish.imageUrl } : {}),
          hasRecipe: dish.recipes.length > 0,
          haystack,
        }
      }),
  ]
  const counts = new Map<string, number>()
  for (const e of all) for (const c of e.countries) counts.set(c, (counts.get(c) ?? 0) + 1)
  catalog = {
    all,
    countries: [...counts.entries()]
      .map(([code, count]) => ({ code, name: nameOf(code), count }))
      .toSorted((a, b) => a.name.localeCompare(b.name)),
  }
  return catalog
}

export const catalogCountries = () => load().countries
export function catalogStats() {
  const { all, countries } = load()
  return {
    dishes: all.length,
    withRecipe: all.filter((e) => e.hasRecipe).length,
    countries: countries.length,
  }
}

export type CatalogQuery = { q?: string; country?: string; recipe?: boolean; page?: number }
export const PAGE_SIZE = 48

export function searchCatalog({ q, country, recipe, page = 1 }: CatalogQuery) {
  const words = (q ?? "").trim().toLowerCase().split(/\s+/).filter(Boolean)
  const hits = load()
    .all.filter(
      (e) =>
        (!country || e.countries.includes(country)) &&
        (!recipe || e.hasRecipe) &&
        words.every((w) => e.haystack.includes(w)),
    )
    // Dishes with recipes and photos first: they make the best first page. A name match beats a
    // match somewhere in the description.
    .toSorted(
      (a, b) =>
        Number(words.length > 0 && words.every((w) => b.name.toLowerCase().includes(w))) -
          Number(words.length > 0 && words.every((w) => a.name.toLowerCase().includes(w))) ||
        Number(b.hasRecipe) - Number(a.hasRecipe) ||
        Number(!!b.image) - Number(!!a.image) ||
        a.name.localeCompare(b.name),
    )
  return { total: hits.length, results: hits.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) }
}
