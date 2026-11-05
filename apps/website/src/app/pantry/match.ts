export type PantryDish = {
  key: string
  href: string
  name: string
  localName: string
  ingredients: string[]
  hasRecipe: boolean
  /** A Commons file name or a full URL */
  image?: string
}

export type ScoredDish = PantryDish & { missing: string[]; have: number; needed: number }

/**
 * Scores every dish against what's in the kitchen. Staples, when assumed, never count as missing
 * and don't count toward the total either.
 */
export function scoreDishes(
  dishes: PantryDish[],
  have: ReadonlySet<string>,
  staples: ReadonlySet<string>,
): ScoredDish[] {
  return dishes.map((d) => {
    const needed = d.ingredients.filter((i) => !staples.has(i))
    const missing = needed.filter((i) => !have.has(i))
    return { ...d, missing, have: needed.length - missing.length, needed: needed.length }
  })
}

/**
 * Groups dishes by how many ingredients are missing: 0, 1, 2, … up to `max`, best matches first.
 * Dishes you have none of the ingredients for are left out: they aren't a useful suggestion.
 */
export function bucketByMissing(
  scored: ScoredDish[],
  max = 3,
): { missing: number; dishes: ScoredDish[] }[] {
  return Array.from({ length: max + 1 }, (_, k) => ({
    missing: k,
    dishes: scored
      .filter((d) => d.missing.length === k && (k === 0 || d.have > 0))
      .toSorted(
        (a, b) =>
          Number(b.hasRecipe) - Number(a.hasRecipe) ||
          b.have / Math.max(b.needed, 1) - a.have / Math.max(a.needed, 1) ||
          b.have - a.have,
      ),
  }))
}
