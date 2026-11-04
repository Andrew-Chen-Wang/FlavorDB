import { centralChinaDishes, chinaDishes } from "./dishes/china"
import { michiganDishes } from "./dishes/michigan"
import { usDishes } from "./dishes/us"
import { ingredients } from "./ingredients"
import { places } from "./places"
import { createSimilarity } from "./similarity"
import type { Dish } from "./types"

export * from "./types"
export * from "./profiles"
export {
  BASIC_TASTES,
  type BasicTaste,
  type MethodMatch,
  type TasteMatch,
  profileOf,
  tasteSimilarity,
} from "./similarity"
export { ingredients, places }

export const dishes: Dish[] = [
  ...usDishes,
  ...michiganDishes,
  ...chinaDishes,
  ...centralChinaDishes,
]

const similarity = createSimilarity(dishes)

/** Dishes that look alike and are made with similar steps, e.g. zongzi and the tamale. */
export const similarByMethod = similarity.similarByMethod
/** Dishes whose basic tastes (and, secondarily, flavor notes) are alike. */
export const similarByTaste = similarity.similarByTaste
export const methodMatch = similarity.methodMatch
export const tasteMatch = similarity.tasteMatch

/** Every dish that uses an ingredient. */
export function dishesWithIngredient(ingredientId: string): Dish[] {
  return dishes.filter((d) => d.ingredients.includes(ingredientId))
}
