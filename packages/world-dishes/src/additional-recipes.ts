import type { WorldDish, WorldRecipe } from "./types"

export type AdditionalRecipes = Record<string, WorldRecipe[]>

/** Reviewed alternatives from multi-recipe pages; keep variants sharing one source URL. */
export function appendAdditionalRecipes(dish: WorldDish, additions: AdditionalRecipes): WorldDish {
  const extra = additions[dish.id]
  if (!extra?.length) return dish
  const recipes = [...dish.recipes]
  for (const recipe of extra) {
    const existing = recipes.find(
      (r) =>
        r.source.url === recipe.source.url && r.lang === recipe.lang && r.title === recipe.title,
    )
    if (existing) {
      if (JSON.stringify(existing) !== JSON.stringify(recipe))
        throw new Error(`Conflicting recipe: ${dish.id}: ${recipe.title}`)
      continue
    }
    recipes.push(recipe)
  }
  return { ...dish, recipes }
}
