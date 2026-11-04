import { FORM_FAMILIES, type Form, type Note, type Profile, type Step, profiles } from "./profiles"
import type { Dish, FlavorProfile } from "./types"

/**
 * The tastes the tongue (and mouth) register directly. "Rich" and "smoky" are left out on purpose:
 * they're aroma and texture, and they're covered by flavor notes instead.
 */
export const BASIC_TASTES = [
  "sweet",
  "salty",
  "sour",
  "bitter",
  "umami",
  "spicy",
  "numbing",
] as const
export type BasicTaste = (typeof BASIC_TASTES)[number]

export function profileOf(dish: Dish): Profile {
  const profile = profiles[dish.slug]
  if (!profile) throw new Error(`No profile for ${dish.slug}`)
  return profile
}

/**
 * How alike two dishes' basic tastes are, from 0 to 1. Weighted Jaccard over intensities: two dishes
 * that are both strongly umami and spicy score high; a mild dish and a fiery one score low even if
 * the same tastes are present.
 */
export function tasteSimilarity(a: FlavorProfile, b: FlavorProfile): number {
  let min = 0
  let max = 0
  for (const t of BASIC_TASTES) {
    min += Math.min(a[t], b[t])
    max += Math.max(a[t], b[t])
  }
  return max ? min / max : 1
}

/** Weighted Jaccard over sets, with rarer items counting for more. */
function weightedJaccard<T>(a: readonly T[], b: readonly T[], weight: (item: T) => number): number {
  const setA = new Set(a)
  const setB = new Set(b)
  let shared = 0
  let union = 0
  for (const item of new Set([...setA, ...setB])) {
    const w = weight(item)
    union += w
    if (setA.has(item) && setB.has(item)) shared += w
  }
  return union ? shared / union : 0
}

/** Length of the longest common subsequence: rewards doing the same steps in the same order. */
function lcs<T>(a: readonly T[], b: readonly T[]): number {
  const dp = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0))
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }
  return dp[a.length][b.length]
}

function rarityWeight<T>(lists: T[][]): (item: T) => number {
  const counts = new Map<T, number>()
  for (const list of lists)
    for (const item of new Set(list)) counts.set(item, (counts.get(item) ?? 0) + 1)
  return (item) => Math.log((lists.length + 1) / (counts.get(item) ?? 1))
}

export function formSimilarity(a: Form, b: Form): "same" | "related" | undefined {
  if (a === b) return "same"
  return FORM_FAMILIES.some((family) => family.includes(a) && family.includes(b))
    ? "related"
    : undefined
}

export type MethodMatch = { dish: Dish; score: number; form?: "same" | "related"; steps: Step[] }
export type TasteMatch = { dish: Dish; score: number; tastes: BasicTaste[]; notes: Note[] }

export function createSimilarity(dishes: Dish[]) {
  const stepWeight = rarityWeight(dishes.map((d) => profileOf(d).steps))
  const noteWeight = rarityWeight(dishes.map((d) => profileOf(d).notes))

  /**
   * "Made the same way": half what it looks like on the table, half the steps it goes through
   * (which steps, weighted by rarity, and in what order).
   */
  function methodMatch(a: Dish, b: Dish): MethodMatch {
    const pa = profileOf(a)
    const pb = profileOf(b)
    const form = formSimilarity(pa.form, pb.form)
    const formScore = form === "same" ? 1 : form === "related" ? 0.5 : 0
    const stepScore =
      0.6 * weightedJaccard(pa.steps, pb.steps, stepWeight) +
      0.4 * (lcs(pa.steps, pb.steps) / Math.max(pa.steps.length, pb.steps.length))
    // Dishes that look nothing alike only count as "made the same way" at a discount.
    const score = 0.5 * formScore + 0.5 * stepScore
    return {
      dish: b,
      score: form ? score : score * 0.6,
      ...(form ? { form } : {}),
      steps: pa.steps.filter((s) => pb.steps.includes(s)),
    }
  }

  /**
   * "Tastes alike": mostly the basic tastes, then the flavor notes (soy, chili, sesame…) that tell two
   * equally salty-umami dishes apart.
   */
  function tasteMatch(a: Dish, b: Dish): TasteMatch {
    const pa = profileOf(a)
    const pb = profileOf(b)
    return {
      dish: b,
      score:
        0.55 * tasteSimilarity(a.flavor, b.flavor) +
        0.45 * weightedJaccard(pa.notes, pb.notes, noteWeight),
      tastes: BASIC_TASTES.filter((t) => a.flavor[t] >= 3 && b.flavor[t] >= 3),
      notes: pa.notes.filter((n) => pb.notes.includes(n)),
    }
  }

  const rank = <T extends { score: number; dish: Dish }>(
    dish: Dish,
    match: (a: Dish, b: Dish) => T,
    limit: number,
  ) =>
    dishes
      .filter((d) => d.slug !== dish.slug)
      .map((d) => match(dish, d))
      .filter((m) => m.score > 0)
      .toSorted((x, y) => y.score - x.score || x.dish.name.localeCompare(y.dish.name))
      .slice(0, limit)

  return {
    methodMatch,
    tasteMatch,
    similarByMethod: (dish: Dish, limit = 5) => rank(dish, methodMatch, limit),
    similarByTaste: (dish: Dish, limit = 5) => rank(dish, tasteMatch, limit),
  }
}
