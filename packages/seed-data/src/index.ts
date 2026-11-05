import { centralChinaDishes, chinaDishes } from "./dishes/china"
import { michiganDishes } from "./dishes/michigan"
import { usDishes } from "./dishes/us"
import { ingredients } from "./ingredients"
import { places } from "./places"
import { type Comparable, createSimilarity, fromDish, fromWorld } from "./similarity"
import type { Dish } from "./types"
import { worldLinks } from "./world-links"

export * from "./types"
export * from "./profiles"
export {
  BASIC_TASTES,
  type BasicTaste,
  type Comparable,
  type MethodMatch,
  type TasteMatch,
  fromDish,
  fromWorld,
  profileOf,
  tasteSimilarity,
} from "./similarity"
export { BASE_GRAPH, FORM_GRAPH, categoryLabel, type FormCategory } from "./categories"
export { ancestors, graphSimilarity, type CategoryGraph } from "./graph"
export { worldLinks, type WorldLink } from "./world-links"
export { ingredients, places }

export const dishes: Dish[] = [
  ...usDishes,
  ...michiganDishes,
  ...chinaDishes,
  ...centralChinaDishes,
]

/** Every dish similar dishes are picked from: the curated dishes plus the profiled world dishes. */
export const comparables: Comparable[] = [...dishes.map(fromDish), ...worldLinks.map(fromWorld)]
const similarity = createSimilarity(comparables)

/** Dishes that look alike and are made with similar steps, e.g. zongzi and the tamale. */
export const similarByMethod = (dish: Dish, limit?: number) =>
  similarity.similarByMethod(fromDish(dish), limit)
/** Dishes built on the same main ingredient, whose basic tastes and flavor notes are alike. */
export const similarByTaste = (dish: Dish, limit?: number) =>
  similarity.similarByTaste(fromDish(dish), limit)
export const methodMatch = (a: Dish, b: Dish) => similarity.methodMatch(fromDish(a), fromDish(b))
export const tasteMatch = (a: Dish, b: Dish) => similarity.tasteMatch(fromDish(a), fromDish(b))

/** Every dish that uses an ingredient. */
export function dishesWithIngredient(ingredientId: string): Dish[] {
  return dishes.filter((d) => d.ingredients.includes(ingredientId))
}
