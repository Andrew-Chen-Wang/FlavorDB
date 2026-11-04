import { describe, expect, test } from "vitest"
import type { WorldDish, WorldRecipe } from "../types"
import { cleanRecipe, mergeDuplicates, rejectDish } from "./quality"

const source = {
  name: "Wikidata",
  url: "https://www.wikidata.org/wiki/Q1",
  license: "CC0-1.0",
} as const
const dish = (over: Partial<WorldDish>): WorldDish => ({
  id: "Q1",
  name: "Feijoada",
  names: {},
  countries: [],
  cuisines: [],
  kinds: [],
  ingredients: [],
  wikipedia: {},
  recipes: [],
  sources: [source],
  ...over,
})
const recipe = (steps: string[], ingredients = ["1 egg", "salt"]): WorldRecipe => ({
  title: "x",
  lang: "en",
  steps,
  ingredients: ingredients.map((item) => ({ item })),
  source,
})

describe("cleanRecipe", () => {
  test("strips leftover template braces and table rows, drops time-only and repeated steps", () => {
    const cleaned = cleanRecipe(
      recipe([
        "45 - 60 min",
        "Boil the beans.",
        "Boil the beans.",
        '{| class="wikitable"',
        "Serve hot.}}",
      ]),
    )
    expect(cleaned?.steps).toEqual(["Boil the beans.", "Serve hot."])
  })

  test("drops a recipe with nothing usable left", () => {
    expect(cleanRecipe(recipe(["30 Minuten"]))).toBeUndefined()
  })
})

describe("rejectDish", () => {
  const none = new Set<string>()
  test("drops chain menu items and branded products", () => {
    expect(rejectDish(dish({ name: "Yasai Ramen (Sugakiya)" }), none)).toBe(
      "brand or chain product",
    )
    expect(rejectDish(dish({ name: "McPlant" }), none)).toBe("brand or chain product")
    expect(rejectDish(dish({ id: "Q9", name: "Brago" }), new Set(["Q9"]))).toBe(
      "brand or chain product",
    )
  })

  test("keeps dishes whose names only look like brands", () => {
    expect(rejectDish(dish({ name: "McIntosh apple pie" }), none)).toBeUndefined()
  })

  test("drops category pages and categories, keeps real dishes with generic-sounding names", () => {
    expect(rejectDish(dish({ name: "Category:Pizza romana" }), none)).toBe("wiki page, not a dish")
    expect(rejectDish(dish({ name: "tomato dish" }), none)).toBe("category, not a dish")
    expect(rejectDish(dish({ name: "hot dish" }), none)).toBeUndefined()
  })

  test("strips cookbook prefixes", () => {
    const d = dish({ name: "Cookbook:Ukrainian Borscht" })
    expect(rejectDish(d, none)).toBeUndefined()
    expect(d.name).toBe("Ukrainian Borscht")
  })

  test("drops captions masquerading as names", () => {
    const name =
      "Piece of sorghum bread contained in basket S. 283, from the grave goods of child mummy S. 278"
    expect(rejectDish(dish({ name }), none)).toBe("caption or description, not a name")
  })
})

describe("mergeDuplicates", () => {
  test("folds two items for the same dish", () => {
    const { dishes, merged } = mergeDuplicates([
      dish({ id: "Q1", countries: ["BR"], wikipedia: { en: "x" } }),
      dish({ id: "Q2", countries: [], image: "Feijoada.jpg" }),
    ])
    expect(merged).toBe(1)
    expect(dishes).toHaveLength(1)
    expect(dishes[0]).toMatchObject({ id: "Q1", image: "Feijoada.jpg" })
  })

  test("keeps same-named dishes from different countries apart", () => {
    const { dishes } = mergeDuplicates([
      dish({ id: "Q1", name: "Bika", countries: ["PH"] }),
      dish({ id: "Q2", name: "bika", countries: ["NG"] }),
    ])
    expect(dishes).toHaveLength(2)
  })
})
