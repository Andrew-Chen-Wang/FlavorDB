import {
  type Comparable,
  type Dish,
  categoryLabel,
  type Ingredient,
  type Place,
  dishes,
  dishesWithIngredient,
  ingredients,
  places,
  similarByMethod,
  similarByTaste,
} from "@flavor-db/seed-data"

export { dishes, ingredients, places }
export type { Dish, Ingredient, Place }

const placeMap = new Map(places.map((p) => [p.id, p]))
const ingredientMap = new Map(ingredients.map((i) => [i.id, i]))
const dishMap = new Map(dishes.map((d) => [d.slug, d]))

export const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  CN: "China",
  HK: "Hong Kong",
  MO: "Macau",
  TW: "Taiwan",
  JP: "Japan",
  KR: "South Korea",
  MX: "Mexico",
  GT: "Guatemala",
  SV: "El Salvador",
  MY: "Malaysia",
  SG: "Singapore",
  PT: "Portugal",
  DE: "Germany",
  GB: "United Kingdom",
}

export function getPlace(id: string): Place {
  const place = placeMap.get(id)
  if (!place) throw new Error(`Unknown place ${id}`)
  return place
}

export function getIngredient(id: string): Ingredient {
  const ingredient = ingredientMap.get(id)
  if (!ingredient) throw new Error(`Unknown ingredient ${id}`)
  return ingredient
}

export const findDish = (slug: string) => dishMap.get(slug)
export const findIngredient = (id: string) => ingredientMap.get(id)
export const findPlace = (id: string) => placeMap.get(id)

/** The country-level place for a country code, if one exists. */
export function countryPlace(code: string): Place | undefined {
  return (
    places.find((p) => p.country === code && p.kind === "country") ??
    places.find((p) => p.country === code && p.id === code.toLowerCase())
  )
}

export function countriesOf(dish: Dish): string[] {
  return [...new Set(dish.places.map((p) => getPlace(p.placeId).country))]
}

/** A short "Wuhan, Hubei +1" line, preferring specific places over whole countries. */
export function placeLine(dish: Dish, max = 2): string {
  const all = dish.places.map((p) => getPlace(p.placeId))
  const specific = all.filter((p) => p.kind !== "country")
  const shown = (specific.length ? specific : all).map((p) => p.name)
  const extra = all.length - Math.min(shown.length, max)
  return shown.slice(0, max).join(", ") + (extra > 0 ? ` +${extra}` : "")
}

/** Dishes that belong to a place. A country page includes every dish in that country. */
export function dishesForPlace(place: Place): Dish[] {
  if (place.kind === "country") {
    return dishes.filter((d) => d.places.some((p) => getPlace(p.placeId).country === place.country))
  }
  return dishes.filter(
    (d) =>
      d.places.some((p) => p.placeId === place.id) ||
      d.variations.some((v) => v.placeId === place.id),
  )
}

/** Places that have at least one dish, grouped by country. */
export function placesWithDishes(): {
  country: string
  name: string
  places: { place: Place; count: number }[]
}[] {
  const counts = new Map<string, number>()
  for (const d of dishes) {
    for (const id of new Set([
      ...d.places.map((p) => p.placeId),
      ...d.variations.map((v) => v.placeId),
    ])) {
      counts.set(id, (counts.get(id) ?? 0) + 1)
    }
  }
  const byCountry = new Map<string, { place: Place; count: number }[]>()
  for (const place of places) {
    const count =
      place.kind === "country" ? dishesForPlace(place).length : (counts.get(place.id) ?? 0)
    if (!count) continue
    const list = byCountry.get(place.country) ?? []
    list.push({ place, count })
    byCountry.set(place.country, list)
  }
  return [...byCountry.entries()]
    .map(([country, list]) => ({
      country,
      name: COUNTRY_NAMES[country] ?? country,
      places: list.toSorted((a, b) =>
        a.place.kind === "country" ? -1 : b.place.kind === "country" ? 1 : b.count - a.count,
      ),
    }))
    .toSorted((a, b) => b.places.length - a.places.length)
}

export function ingredientUseCount(id: string): number {
  return dishesWithIngredient(id).length
}

/** Ingredients that appear alongside this one, most frequent first. */
export function pairedIngredients(id: string): { ingredient: Ingredient; count: number }[] {
  const counts = new Map<string, number>()
  for (const d of dishesWithIngredient(id)) {
    for (const other of d.ingredients) {
      if (other !== id) counts.set(other, (counts.get(other) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([other, count]) => ({ ingredient: getIngredient(other), count }))
    .toSorted(
      (a, b) =>
        b.count - a.count ||
        ingredientUseCount(b.ingredient.id) - ingredientUseCount(a.ingredient.id),
    )
}

/** A similar dish: one of ours, or a profiled dish from the world collection. */
export type SimilarEntry = {
  key: string
  href: string
  name: string
  localName?: string
  /** Where it's from */
  subtitle: string
  /** The imported dish this links to, if it isn't a hand-written one */
  worldId?: string
  score: number
  why: string[]
}

const FLAVOR_LABELS = [
  "sweet",
  "salty",
  "sour",
  "bitter",
  "umami",
  "spicy",
  "numbing",
  "smoky",
  "rich",
] as const

const STEP_LABELS: Partial<Record<string, string>> = {
  "make-dough": "dough",
  "make-batter": "batter",
  "cook-at-table": "cooked at the table",
}
const label = (s: string) => STEP_LABELS[s] ?? s.replaceAll("-", " ")

const regionNames = new Intl.DisplayNames(["en"], { type: "region" })
const countryLabel = (code: string) => COUNTRY_NAMES[code] ?? regionNames.of(code) ?? code

function entry(item: Comparable, score: number, why: string[]): SimilarEntry {
  if (item.kind === "dish") {
    const { dish } = item
    return {
      key: dish.slug,
      href: `/dishes/${dish.slug}`,
      name: dish.name,
      ...(dish.localName ? { localName: dish.localName.split(" / ")[0] } : {}),
      subtitle: placeLine(dish),
      score,
      why,
    }
  }
  const { world } = item
  return {
    key: world.id,
    worldId: world.id,
    href: `/dishes/${encodeURIComponent(world.id)}`,
    name: world.name,
    ...(world.localName ? { localName: world.localName } : {}),
    subtitle: world.countries.slice(0, 2).map(countryLabel).join(", "),
    score,
    why: [...new Set(why)],
  }
}

/**
 * Similar dishes, two ways, each with the reasons shown as tags:
 * - made the same way: the look both share on the category graph (stir-fried noodles, wok-fried…),
 *   then shared steps
 * - tastes alike: the main ingredient both are built on (noodles, rice noodles, pork…), then shared
 *   strong tastes and flavor notes
 */
export function similarDishes(dish: Dish): {
  byTechnique: SimilarEntry[]
  byFlavor: SimilarEntry[]
} {
  return {
    byTechnique: similarByMethod(dish, 8).map(({ item, score, form, steps }) =>
      entry(item, score, [...(form ? [categoryLabel(form)] : []), ...steps.map(label)]),
    ),
    byFlavor: similarByTaste(dish, 8).map(({ item, score, base, tastes, notes }) =>
      entry(item, score, [
        ...(base ? [categoryLabel(base)] : []),
        ...tastes.map((t) => (t === "spicy" ? "heat" : t)),
        ...notes.map(label),
      ]),
    ),
  }
}

export { FLAVOR_LABELS }

export const STAPLE_INGREDIENTS = new Set([
  "salt",
  "black-pepper",
  "white-pepper",
  "vegetable-oil",
  "water",
])

export const HOME_REGIONS = {
  central: [
    "hot-dry-noodles",
    "lotus-root-pork-rib-soup",
    "chongqing-hot-pot",
    "shangrao-chao-fen",
    "braised-pomelo-peel",
    "zongzi",
    "mapo-tofu",
    "doupi",
  ],
  michigan: [
    "detroit-style-pizza",
    "new-york-pizza",
    "mackinac-fudge",
    "coney-dog",
    "pasty",
    "tuna-noodle-casserole",
    "green-bean-casserole",
    "chili-con-carne",
  ],
}
