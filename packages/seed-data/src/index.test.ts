import { describe, expect, test } from "vitest"
import {
  BASE_GRAPH,
  FORM_GRAPH,
  ancestors,
  dishes,
  dishesWithIngredient,
  ingredients,
  places,
  profiles,
  similarByMethod,
  similarByTaste,
  worldLinks,
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
  const top = (list: { item: { id: string } }[], n: number) =>
    list.slice(0, n).map((s) => s.item.id)

  test("world links have unique ids and a profile on the graphs", () => {
    expect(new Set(worldLinks.map((w) => w.id)).size).toBe(worldLinks.length)
    for (const w of worldLinks) {
      expect(FORM_GRAPH[w.profile.form].length).toBeGreaterThan(0)
      for (const b of w.profile.base) expect(BASE_GRAPH).toHaveProperty(b)
    }
  })

  test("the category graph links stir-fried noodles to noodles and to wok-fried dishes", () => {
    expect([...ancestors(FORM_GRAPH, ["fried-noodles"])].toSorted()).toEqual([
      "fried-noodles",
      "noodle-dish",
      "wok-fried",
    ])
    expect(ancestors(BASE_GRAPH, ["round-rice-noodles"])).toContain("noodles")
  })

  test("tamale and zongzi are made the same way", () => {
    expect(top(similarByMethod(find("zongzi")), 1)).toEqual(["tamale"])
  })

  test("Shangrao chao fen is made like other cultures' stir-fried noodles", () => {
    const method = similarByMethod(find("shangrao-chao-fen"))
    expect(method.map((m) => m.item.profile.form)).toEqual(method.map(() => "fried-noodles"))
    expect(top(method, 3)).toEqual(expect.arrayContaining(["Q730298"])) // pad thai
    expect(method.some((m) => m.item.kind === "world")).toBe(true)
  })

  test("Shangrao chao fen tastes like spicy noodles, including other Chinese noodles", () => {
    const taste = similarByTaste(find("shangrao-chao-fen"), 8)
    for (const m of taste) expect(m.base).toBeDefined()
    expect(taste.every((m) => m.item.flavor.salty >= 3)).toBe(true)
    expect(top(taste, 8)).toEqual(expect.arrayContaining(["nanchang-rice-noodles", "Q5309357"]))
    expect(top(taste, 8)).not.toContain("jambalaya")
  })

  test("noodle dishes taste most like other noodle dishes", () => {
    for (const slug of ["hot-dry-noodles", "dan-dan-noodles", "lanzhou-beef-noodles"]) {
      for (const m of similarByTaste(find(slug)))
        expect(m.item.profile.base.some((b) => ancestors(BASE_GRAPH, [b]).has("noodles"))).toBe(
          true,
        )
    }
  })

  test("pizzas look and are made alike", () => {
    expect(top(similarByMethod(find("detroit-style-pizza")), 2).toSorted()).toEqual([
      "deep-dish-pizza",
      "new-york-pizza",
    ])
  })

  test("mapo tofu tastes like other mala dishes", () => {
    expect(top(similarByTaste(find("mapo-tofu")), 2)).toContain("chongqing-hot-pot")
  })

  test("ingredient graph finds every dish using lotus root", () => {
    const slugs = dishesWithIngredient("lotus-root").map((d) => d.slug)
    expect(slugs).toEqual(expect.arrayContaining(["lotus-root-pork-rib-soup", "chongqing-hot-pot"]))
  })
})
