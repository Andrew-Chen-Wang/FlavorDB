import { dishesWithIngredient } from "@flavor-db/seed-data"
import { STAPLE_INGREDIENTS, getIngredient, type Ingredient } from "@website/lib/data"

export type GraphNode = {
  id: string
  label: string
  href: string
  kind: "center" | "dish" | "ingredient" | "far"
  x: number
  y: number
}
export type GraphEdge = { from: string; to: string; far: boolean; main: boolean }
export type Graph = {
  nodes: GraphNode[]
  edges: GraphEdge[]
  width: number
  height: number
  hiddenDishes: number
}

const MAX_DISHES = 10
const INGREDIENTS_PER_DISH = 4

/**
 * Lays out an ingredient's neighborhood radially: the ingredient in the middle, the dishes that use
 * it around it, each dish's most distinctive other ingredients beyond that, and (one step further)
 * another dish that uses each of those ingredients.
 */
export function layoutIngredientGraph(center: Ingredient): Graph {
  const width = 1176
  const height = 680
  const cx = width / 2
  const cy = height / 2
  const allDishes = dishesWithIngredient(center.id)
  const ringDishes = allDishes.slice(0, MAX_DISHES)
  const nodes: GraphNode[] = [
    {
      id: `i:${center.id}`,
      label: center.name,
      href: `/ingredients/${center.id}`,
      kind: "center",
      x: cx,
      y: cy,
    },
  ]
  const edges: GraphEdge[] = []
  const used = new Set([center.id])
  const usedDishes = new Set(ringDishes.map((d) => d.slug))
  const ell = (r: number, a: number) => ({ x: cx + Math.cos(a) * r * 1.5, y: cy + Math.sin(a) * r })

  // Rare ingredients say more about a dish than salt or soy sauce does.
  const rarity = (id: string) => dishesWithIngredient(id).length

  ringDishes.forEach((dish, i) => {
    const a =
      -Math.PI / 2 +
      (i * 2 * Math.PI) / ringDishes.length +
      (ringDishes.length === 2 ? Math.PI / 2 : 0)
    const p = ell(150, a)
    const dishId = `d:${dish.slug}`
    nodes.push({ id: dishId, label: dish.name, href: `/dishes/${dish.slug}`, kind: "dish", ...p })
    edges.push({ from: `i:${center.id}`, to: dishId, far: false, main: true })

    const picks = dish.ingredients
      .filter((id) => !used.has(id) && !STAPLE_INGREDIENTS.has(id))
      .toSorted((x, y) => rarity(x) - rarity(y))
      .slice(
        0,
        Math.max(2, Math.floor(INGREDIENTS_PER_DISH * (6 / Math.max(ringDishes.length, 6)))),
      )
    const spread = Math.min(2.2, (2 * Math.PI) / ringDishes.length) * 0.75
    picks.forEach((id, j) => {
      used.add(id)
      const aj = a + (picks.length === 1 ? 0 : -spread / 2 + (j * spread) / (picks.length - 1))
      const q = ell(250, aj)
      const ingId = `i:${id}`
      nodes.push({
        id: ingId,
        label: getIngredient(id).name,
        href: `/ingredients/${id}`,
        kind: "ingredient",
        ...q,
      })
      edges.push({ from: dishId, to: ingId, far: false, main: false })

      const further = dishesWithIngredient(id).find((d) => !usedDishes.has(d.slug))
      if (further) {
        usedDishes.add(further.slug)
        const r = ell(315, aj + (aj > a ? 0.12 : -0.12))
        const farId = `f:${further.slug}`
        nodes.push({
          id: farId,
          label: further.name,
          href: `/dishes/${further.slug}`,
          kind: "far",
          ...r,
        })
        edges.push({ from: ingId, to: farId, far: true, main: false })
      }
    })
  })

  // Keep nodes inside the frame.
  for (const n of nodes) {
    const half = (n.label.length * 7.4 + 28) / 2
    n.x = Math.min(width - half - 4, Math.max(half + 4, n.x))
    n.y = Math.min(height - 22, Math.max(22, n.y))
  }
  return { nodes, edges, width, height, hiddenDishes: allDishes.length - ringDishes.length }
}
