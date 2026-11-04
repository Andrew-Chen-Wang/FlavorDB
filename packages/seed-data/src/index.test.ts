import { describe, expect, test } from "vitest"
import {
  dishes,
  dishesWithIngredient,
  ingredients,
  places,
  profiles,
  similarByMethod,
  similarByTaste,
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

  test("every dish has a profile, and every profile a dish", () => {
    expect(Object.keys(profiles).toSorted()).toEqual(dishes.map((d) => d.slug).toSorted())
  })

  const find = (slug: string) => dishes.find((d) => d.slug === slug)!
  const top = (list: { dish: { slug: string } }[], n: number) =>
    list.slice(0, n).map((s) => s.dish.slug)

  test("tamale and zongzi are made the same way", () => {
    expect(top(similarByMethod(find("zongzi")), 1)).toEqual(["tamale"])
  })

  test("Shangrao chao fen is made like other stir-fried staples and noodles, not like chili", () => {
    const method = top(similarByMethod(find("shangrao-chao-fen")), 3)
    expect(method).toContain("yangzhou-fried-rice")
    const taste = top(similarByTaste(find("shangrao-chao-fen")), 5)
    expect(taste).not.toContain("jambalaya")
    expect(taste).not.toContain("coney-dog")
  })

  test("pizzas look and are made alike", () => {
    expect(top(similarByMethod(find("detroit-style-pizza")), 2).toSorted()).toEqual([
      "deep-dish-pizza",
      "new-york-pizza",
    ])
  })

  test("mapo tofu tastes like other mala dishes", () => {
    const mapo = dishes.find((d) => d.slug === "mapo-tofu")!
    expect(top(similarByTaste(mapo), 1)).toEqual(["chongqing-hot-pot"])
  })

  test("ingredient graph finds every dish using lotus root", () => {
    const slugs = dishesWithIngredient("lotus-root").map((d) => d.slug)
    expect(slugs).toEqual(expect.arrayContaining(["lotus-root-pork-rib-soup", "chongqing-hot-pot"]))
  })
})
