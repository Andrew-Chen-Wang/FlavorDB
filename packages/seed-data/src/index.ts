import { centralChinaDishes, chinaDishes } from "./dishes/china"
import { michiganDishes } from "./dishes/michigan"
import { usDishes } from "./dishes/us"
import { ingredients } from "./ingredients"
import { places } from "./places"
import type { Dish, FlavorProfile, Technique } from "./types"

export * from "./types"
export { ingredients, places }

export const dishes: Dish[] = [
  ...usDishes,
  ...michiganDishes,
  ...chinaDishes,
  ...centralChinaDishes,
]

const flavorKeys = Object.keys(dishes[0]?.flavor ?? {}) as (keyof FlavorProfile)[]

/** The average dish. Profiles are compared after subtracting it, so "savory" alone doesn't make dishes alike. */
const meanFlavor = Object.fromEntries(
  flavorKeys.map((key) => [key, dishes.reduce((sum, d) => sum + d.flavor[key], 0) / dishes.length]),
) as FlavorProfile

/** Centered cosine similarity of two flavor profiles, from -1 (opposites) to 1 (same character). */
export function flavorSimilarity(a: FlavorProfile, b: FlavorProfile): number {
  let dot = 0
  let normA = 0
  let normB = 0
  for (const key of flavorKeys) {
    const x = a[key] - meanFlavor[key]
    const y = b[key] - meanFlavor[key]
    dot += x * y
    normA += x ** 2
    normB += y ** 2
  }
  return normA && normB ? dot / Math.sqrt(normA * normB) : 0
}

/** Rare techniques say more than common ones: sharing "leaf-wrapped" matters more than sharing "baked". */
const techniqueWeight = (() => {
  const counts = new Map<Technique, number>()
  for (const d of dishes) for (const t of d.techniques) counts.set(t, (counts.get(t) ?? 0) + 1)
  return (t: Technique) => Math.log((dishes.length + 1) / (counts.get(t) ?? 1))
})()

/** Weighted Jaccard similarity of two dishes' techniques, from 0 to 1. */
export function techniqueSimilarity(a: Dish, b: Dish): number {
  const setA = new Set(a.techniques)
  const setB = new Set(b.techniques)
  let shared = 0
  let union = 0
  for (const t of new Set([...setA, ...setB])) {
    const w = techniqueWeight(t)
    union += w
    if (setA.has(t) && setB.has(t)) shared += w
  }
  return union ? shared / union : 0
}

/** The techniques two dishes have in common, to explain why they're linked. */
export function sharedTechniques(a: Dish, b: Dish): Technique[] {
  return a.techniques.filter((t) => b.techniques.includes(t))
}

export type SimilarDish = { dish: Dish; score: number }

export function similarByFlavor(dish: Dish, limit = 6): SimilarDish[] {
  return dishes
    .filter((d) => d.slug !== dish.slug)
    .map((d) => ({ dish: d, score: flavorSimilarity(dish.flavor, d.flavor) }))
    .toSorted((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function similarByTechnique(dish: Dish, limit = 6): SimilarDish[] {
  return dishes
    .filter((d) => d.slug !== dish.slug)
    .map((d) => ({ dish: d, score: techniqueSimilarity(dish, d) }))
    .filter((s) => s.score > 0)
    .toSorted((a, b) => b.score - a.score)
    .slice(0, limit)
}

/** Every dish that uses an ingredient. */
export function dishesWithIngredient(ingredientId: string): Dish[] {
  return dishes.filter((d) => d.ingredients.includes(ingredientId))
}
