import "server-only"
import { curatedSlugFor } from "@website/lib/catalog"
import { dishesWithIngredient } from "@flavor-db/seed-data"
import { type WorldDish, worldIndex } from "@website/lib/world"

/** Imported dishes by ingredient id, recipes and photos first. Hand-written duplicates are left out. */
let byIngredient: Map<string, WorldDish[]> | undefined
function index() {
  if (byIngredient) return byIngredient
  byIngredient = new Map()
  const dishes = worldIndex()
    .map(({ dish }) => dish)
    .filter((d) => d.ingredientIds?.length && !curatedSlugFor(d.id))
    .toSorted(
      (a, b) =>
        Number(b.recipes.length > 0) - Number(a.recipes.length > 0) ||
        Number(Boolean(b.image ?? b.imageUrl)) - Number(Boolean(a.image ?? a.imageUrl)) ||
        a.name.localeCompare(b.name),
    )
  for (const dish of dishes)
    for (const id of dish.ingredientIds ?? []) {
      const list = byIngredient.get(id)
      if (list) list.push(dish)
      else byIngredient.set(id, [dish])
    }
  return byIngredient
}

export const worldDishesWithIngredient = (id: string): WorldDish[] => index().get(id) ?? []

/** Every dish that uses an ingredient, hand-written and imported. */
export const ingredientDishCount = (id: string) =>
  dishesWithIngredient(id).length + worldDishesWithIngredient(id).length
