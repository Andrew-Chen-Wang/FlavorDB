import type { WorldDish } from "../types"

/** Lowercase, drop punctuation and spacing so "Pad thai" matches "Pad Thai". */
export const nameKey = (name: string) =>
  name
    .normalize("NFKC")
    .toLowerCase()
    .replaceAll(/[\s\p{P}\p{S}]+/gu, "")

const union = (a: string[], b: string[]) => [...new Set([...a, ...b])]

/**
 * Folds recipe sources into the Wikidata dishes they describe, matched by English name or by
 * Chinese name. Recipes that match nothing become dishes of their own.
 */
export function mergeDishes(base: WorldDish[], extras: WorldDish[]): WorldDish[] {
  const byKey = new Map<string, WorldDish>()
  for (const dish of base) {
    for (const n of [dish.name, ...Object.values(dish.names)]) {
      const key = nameKey(n)
      if (key && !byKey.has(key)) byKey.set(key, dish)
    }
  }
  const out = [...base]
  for (const extra of extras) {
    const match = [extra.name, ...Object.values(extra.names)]
      .map((n) => byKey.get(nameKey(n)))
      .find(Boolean)
    if (!match) {
      out.push(extra)
      byKey.set(nameKey(extra.name), extra)
      continue
    }
    match.recipes.push(...extra.recipes)
    match.sources.push(...extra.sources)
    match.countries = union(match.countries, extra.countries).toSorted()
    match.cuisines = union(match.cuisines, extra.cuisines)
    match.kinds = union(match.kinds, extra.kinds)
    if (match.ingredients.length === 0) match.ingredients = extra.ingredients
    match.description ??= extra.description
  }
  return out
}
