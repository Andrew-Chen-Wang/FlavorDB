import { readFileSync } from "node:fs"
import path from "node:path"
import { expect, test } from "vitest"
import { appendAdditionalRecipes, type AdditionalRecipes } from "./additional-recipes"
import { DEFAULT_DATA_DIR, loadWorldDishes } from "./index"

const additions = JSON.parse(
  readFileSync(path.join(DEFAULT_DATA_DIR, "additional-recipes.json"), "utf8"),
) as AdditionalRecipes

test("same-page recipe alternatives survive loading and repeated application", () => {
  const dishes = new Map(loadWorldDishes().map((d) => [d.id, d]))
  for (const [id, recipes] of Object.entries(additions)) {
    const dish = dishes.get(id)!
    expect(dish, id).toBeDefined()
    expect(appendAdditionalRecipes(dish, additions)).toEqual(dish)
    for (const recipe of recipes) {
      expect(recipe.ingredients.length).toBeGreaterThan(0)
      expect(recipe.steps.length).toBeGreaterThan(0)
      expect(recipe.source.license).toBe("CC-BY-SA-4.0")
      expect(dish.sources.some((s) => s.url === recipe.source.url)).toBe(true)
    }
  }
  expect(dishes.get("Q2914862")!.recipes.filter((r) => r.lang === "pt")).toHaveLength(9)
  expect(dishes.get("Q3662049")!.recipes.filter((r) => r.lang === "it")).toHaveLength(2)
  expect(dishes.get("Q541392")!.recipes.filter((r) => r.lang === "pt")).toHaveLength(2)
})

test("conflicting alternatives cannot silently replace an existing reviewed recipe", () => {
  const dish = loadWorldDishes().find((d) => d.id === "Q2914862")!
  const recipe = additions[dish.id][0]
  expect(() =>
    appendAdditionalRecipes(dish, { [dish.id]: [{ ...recipe, steps: ["Changed method"] }] }),
  ).toThrow("Conflicting recipe")
})
