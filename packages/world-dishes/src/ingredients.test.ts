import { ingredients } from "@flavor-db/seed-data"
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, test } from "vitest"
import { DEFAULT_DATA_DIR, type IngredientMap, loadWorldDishes } from "./index"

const map = JSON.parse(
  readFileSync(path.join(DEFAULT_DATA_DIR, "ingredient-map.json"), "utf8"),
) as IngredientMap

describe("ingredient map", () => {
  test("every mapped id is on the shared ingredient list", () => {
    const known = new Set(ingredients.map((i) => i.id))
    const unknown = new Set<string>()
    for (const byText of Object.values(map))
      for (const ids of Object.values(byText))
        for (const id of ids) if (!known.has(id)) unknown.add(id)
    expect([...unknown]).toEqual([])
  })

  test("most imported dishes with ingredients get ingredient ids", () => {
    const withText = loadWorldDishes().filter((d) => d.ingredients.length || d.recipes.length)
    const mapped = withText.filter((d) => d.ingredientIds?.length)
    expect(mapped.length / withText.length).toBeGreaterThan(0.95)
  })
})
