/**
 * A category graph: each category lists its parents, so a category can sit under more than one
 * (stir-fried noodles are both noodle dishes and wok-fried dishes). Dishes attach to one or more
 * categories, and two dishes are as similar as the categories they share, counting rare categories
 * for more than common ones.
 */
export type CategoryGraph<K extends string> = Readonly<Record<K, readonly K[]>>

/** A category and everything above it. */
export function ancestors<K extends string>(graph: CategoryGraph<K>, nodes: readonly K[]): Set<K> {
  const seen = new Set<K>()
  const stack = [...nodes]
  while (stack.length) {
    const node = stack.pop()!
    if (seen.has(node)) continue
    seen.add(node)
    stack.push(...graph[node])
  }
  return seen
}

/**
 * The broad family a category belongs to: follow the first parent up to the top. Rice noodles are
 * noodles (not grain), pork is meat. The first parent is the one that says what a thing *is*.
 */
export function family<K extends string>(graph: CategoryGraph<K>, node: K): K {
  let current = node
  while (graph[current].length) current = graph[current][0]
  return current
}

export type GraphSimilarity<K extends string> = {
  /** 0 to 1: shared ancestry, weighted by how specific (rare) each shared category is. */
  score: (a: readonly K[], b: readonly K[]) => number
  /** 0 to 1: the share of the two dishes' broad families (noodles, meat, seafood…) they have in common. */
  sameFamily: (a: readonly K[], b: readonly K[]) => number
  /** The most specific category two dishes share, if any is specific enough to mention. */
  shared: (a: readonly K[], b: readonly K[]) => K | undefined
}

/**
 * Similarity over a category graph. Each category weighs its information content in the pool,
 * -log(share of items under it): "noodle dish" says little when half the pool is noodles, while
 * "stir-fried noodles" says a lot. The score is a weighted Jaccard over the two ancestor sets.
 */
export function graphSimilarity<K extends string>(
  graph: CategoryGraph<K>,
  pool: readonly (readonly K[])[],
): GraphSimilarity<K> {
  const counts = new Map<K, number>()
  for (const item of pool)
    for (const node of ancestors(graph, item)) counts.set(node, (counts.get(node) ?? 0) + 1)
  const weight = (node: K) => Math.log((pool.length + 1) / ((counts.get(node) ?? 0) + 1))
  const closure = new Map<string, Set<K>>()
  const closureOf = (nodes: readonly K[]) => {
    const key = nodes.join("|")
    let set = closure.get(key)
    if (!set) closure.set(key, (set = ancestors(graph, nodes)))
    return set
  }

  return {
    score(a, b) {
      const setA = closureOf(a)
      const setB = closureOf(b)
      let shared = 0
      let union = 0
      for (const node of new Set([...setA, ...setB])) {
        const w = weight(node)
        union += w
        if (setA.has(node) && setB.has(node)) shared += w
      }
      return union ? shared / union : 0
    },
    sameFamily(a, b) {
      const fa = new Set(a.map((n) => family(graph, n)))
      const fb = new Set(b.map((n) => family(graph, n)))
      const shared = [...fa].filter((f) => fb.has(f)).length
      return shared / new Set([...fa, ...fb]).size
    },
    shared(a, b) {
      const setB = closureOf(b)
      let best: K | undefined
      for (const node of closureOf(a))
        if (setB.has(node) && weight(node) > 0.5 && (!best || weight(node) > weight(best)))
          best = node
      return best
    },
  }
}
