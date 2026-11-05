import { BASE_GRAPH, type Base, FORM_GRAPH, type FormCategory } from "./categories"
import { graphSimilarity } from "./graph"
import { type Note, type Profile, type Step, profiles } from "./profiles"
import type { Dish, FlavorProfile } from "./types"
import type { WorldLink } from "./world-links"

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

/** Anything that can be compared: a curated dish, or a hand-profiled dish from the world collection. */
export type Comparable =
  | { kind: "dish"; id: string; name: string; flavor: FlavorProfile; profile: Profile; dish: Dish }
  | {
      kind: "world"
      id: string
      name: string
      flavor: FlavorProfile
      profile: Profile
      world: WorldLink
    }

export const fromDish = (dish: Dish): Comparable => ({
  kind: "dish",
  id: dish.slug,
  name: dish.name,
  flavor: dish.flavor,
  profile: profileOf(dish),
  dish,
})
export const fromWorld = (world: WorldLink): Comparable => ({
  kind: "world",
  id: world.id,
  name: world.name,
  flavor: world.flavor,
  profile: world.profile,
  world,
})

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

export type MethodMatch = {
  item: Comparable
  score: number
  /** The most specific look both share ("stir-fried noodles", "noodles", "wok-fried"). */
  form?: FormCategory
  steps: Step[]
}
export type TasteMatch = {
  item: Comparable
  score: number
  /** The most specific main ingredient both share ("rice noodles", "noodles", "pork"). */
  base?: Base
  tastes: BasicTaste[]
  notes: Note[]
}

/**
 * Scores two ways of being alike over a pool of dishes. Looks and main ingredients are compared on
 * category graphs (see categories.ts), so stir-fried rice noodles sit closest to other stir-fried
 * rice noodles, then to any stir-fried noodles, then to noodle soups and fried rice.
 */
export function createSimilarity(pool: Comparable[]) {
  const forms = graphSimilarity(
    FORM_GRAPH,
    pool.map((c) => [c.profile.form]),
  )
  const bases = graphSimilarity(
    BASE_GRAPH,
    pool.map((c) => c.profile.base),
  )
  const stepWeight = rarityWeight(pool.map((c) => c.profile.steps))
  const noteWeight = rarityWeight(pool.map((c) => c.profile.notes))

  /**
   * "Made the same way": what it looks like on the table and how it gets there, whatever it tastes
   * of. Half the look (on the form graph), a third the steps (which ones, weighted by rarity, and in
   * what order), and the rest the main ingredient, since flat rice noodles look like flat rice noodles.
   */
  function methodMatch(a: Comparable, b: Comparable): MethodMatch {
    const pa = a.profile
    const pb = b.profile
    const stepScore =
      0.6 * weightedJaccard(pa.steps, pb.steps, stepWeight) +
      0.4 * (lcs(pa.steps, pb.steps) / Math.max(pa.steps.length, pb.steps.length))
    const score =
      0.5 * forms.score([pa.form], [pb.form]) +
      0.35 * stepScore +
      0.15 * bases.score(pa.base, pb.base)
    const form = forms.shared([pa.form], [pb.form])
    return {
      item: b,
      score,
      ...(form ? { form } : {}),
      steps: pa.steps.filter((s) => pb.steps.includes(s)),
    }
  }

  /**
   * "Tastes alike": the main ingredient first (a noodle dish tastes most like other noodle dishes,
   * and a little more like ones on the same kind of noodle), then how the basic tastes activate (umami, heat, sour…), then the flavor notes (soy, chili,
   * sesame…), with a little for the look, since a stir-fried noodle eats differently from a soup.
   */
  function tasteMatch(a: Comparable, b: Comparable): TasteMatch {
    const pa = a.profile
    const pb = b.profile
    const base = bases.shared(pa.base, pb.base)
    return {
      item: b,
      score:
        0.2 * bases.sameFamily(pa.base, pb.base) +
        0.15 * bases.score(pa.base, pb.base) +
        0.35 * tasteSimilarity(a.flavor, b.flavor) +
        0.2 * weightedJaccard(pa.notes, pb.notes, noteWeight) +
        0.1 * forms.score([pa.form], [pb.form]),
      ...(base ? { base } : {}),
      tastes: BASIC_TASTES.filter((t) => a.flavor[t] >= 3 && b.flavor[t] >= 3),
      notes: pa.notes.filter((n) => pb.notes.includes(n)),
    }
  }

  const rank = <T extends { score: number; item: Comparable }>(
    item: Comparable,
    match: (a: Comparable, b: Comparable) => T,
    limit: number,
  ) =>
    pool
      .filter((c) => !(c.kind === item.kind && c.id === item.id))
      .map((c) => match(item, c))
      .filter((m) => m.score > 0)
      .toSorted((x, y) => y.score - x.score || x.item.name.localeCompare(y.item.name))
      .slice(0, limit)

  return {
    methodMatch,
    tasteMatch,
    similarByMethod: (item: Comparable, limit = 6) => rank(item, methodMatch, limit),
    similarByTaste: (item: Comparable, limit = 6) => rank(item, tasteMatch, limit),
  }
}
