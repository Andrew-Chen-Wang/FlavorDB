import { describe, expect, test } from "vitest"
import {
  dishes,
  dishesWithIngredient,
  ingredients,
  places,
  similarByFlavor,
  similarByTechnique,
} from "./index"

const placeIds = new Set(places.map((p) => p.id))
const ingredientIds = new Set(ingredients.map((i) => i.id))

describe("seed data", () => {
  test("ids are unique", () => {
    expect(new Set(dishes.map((d) => d.slug)).size).toBe(dishes.length)
    expect(placeIds.size).toBe(places.length)
    expect(ingredientIds.size).toBe(ingredients.length)
  })

  test.each(dishes.map((d) => [d.slug, d] as const))(
    "%s references known places and ingredients",
    (_, dish) => {
      expect(dish.places.length).toBeGreaterThan(0)
      for (const p of dish.places) expect(placeIds).toContain(p.placeId)
      for (const v of dish.variations) expect(placeIds).toContain(v.placeId)
      expect(dish.ingredients.length).toBeGreaterThan(0)
      for (const id of dish.ingredients) expect(ingredientIds).toContain(id)
      for (const recipe of dish.recipes) {
        for (const ri of recipe.ingredients) expect(ingredientIds).toContain(ri.ingredientId)
      }
    },
  )

  test("tamale and zongzi are linked by recipe fundamentals", () => {
    const zongzi = dishes.find((d) => d.slug === "zongzi")!
    expect(similarByTechnique(zongzi).map((s) => s.dish.slug)).toContain("tamale")
  })

  test("mapo tofu tastes like other mala dishes", () => {
    const mapo = dishes.find((d) => d.slug === "mapo-tofu")!
    const slugs = similarByFlavor(mapo, 4).map((s) => s.dish.slug)
    expect(slugs).toContain("chongqing-hot-pot")
  })

  test("ingredient graph finds every dish using lotus root", () => {
    const slugs = dishesWithIngredient("lotus-root").map((d) => d.slug)
    expect(slugs).toEqual(expect.arrayContaining(["lotus-root-pork-rib-soup", "chongqing-hot-pot"]))
  })
})
