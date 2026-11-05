import "server-only"
import { dishImages } from "@flavor-db/seed-data"
import { type PantryDish, bucketByMissing, scoreDishes } from "@website/app/pantry/match"
import { curatedSlugFor } from "@website/lib/catalog"
import { dishes } from "@website/lib/data"
import { worldIndex } from "@website/lib/world"

/**
 * Every dish the pantry can match: the hand-written ones and every imported dish whose ingredients
 * are known as ids (two or more, so a dish isn't "ready" from one ingredient).
 */
let pool: PantryDish[] | undefined
export function pantryDishes(): PantryDish[] {
  pool ??= [
    ...dishes.map((d) => ({
      key: d.slug,
      href: `/dishes/${d.slug}`,
      name: d.name,
      localName: d.localName?.split(" / ")[0] ?? "",
      ingredients: d.ingredients,
      hasRecipe: d.recipes.length > 0,
      ...(dishImages[d.slug] ? { image: dishImages[d.slug] } : {}),
    })),
    ...worldIndex()
      .map(({ dish }) => dish)
      .filter((d) => (d.ingredientIds?.length ?? 0) >= 2 && !curatedSlugFor(d.id))
      .map((d) => {
        const zh = d.names.zh && d.names.zh !== d.name ? d.names.zh : ""
        const image = d.image ?? d.imageUrl
        return {
          key: d.id,
          href: `/dishes/${encodeURIComponent(d.id)}`,
          name: d.name,
          localName: zh,
          ingredients: d.ingredientIds ?? [],
          hasRecipe: d.recipes.length > 0,
          ...(image ? { image } : {}),
        }
      }),
  ]
  return pool
}

/** How many dishes each bucket shows; the rest are counted. */
export const PER_BUCKET = 30

export function matchPantry(have: readonly string[], staples: readonly string[]) {
  const all = pantryDishes()
  const buckets = bucketByMissing(scoreDishes(all, new Set(have), new Set(staples)), 3)
  const shown = buckets.reduce((n, b) => n + b.dishes.length, 0)
  return {
    total: all.length,
    rest: all.length - shown,
    buckets: buckets.map((b) => ({
      missing: b.missing,
      count: b.dishes.length,
      dishes: b.dishes.slice(0, PER_BUCKET),
    })),
  }
}
export type PantryResult = ReturnType<typeof matchPantry>
