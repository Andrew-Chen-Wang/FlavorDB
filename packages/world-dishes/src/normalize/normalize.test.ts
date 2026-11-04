import { describe, expect, test } from "vitest"
import type { WorldDish } from "../types"
import { countriesForCuisine } from "./demonyms"
import { parseCookbookPage } from "./cookbooks"
import { parseHowToCook } from "./howtocook"
import { mergeDishes } from "./merge"
import { parseWikibooksPage } from "./wikibooks"

const HOWTOCOOK = `# 番茄炒蛋的做法

番茄炒蛋是中国家常菜。

预估烹饪难度：★

## 必备原料和工具

* 番茄
* 鸡蛋
* 盐

## 计算

- 番茄 2 个
- 鸡蛋 3 个
- 盐 2g

## 操作

1. 番茄切块
2. 鸡蛋打散，炒熟盛出
3. 炒番茄，加入鸡蛋和盐
`

const WIKIBOOKS = `{{Recipe summary
| Cuisine = Albanian
| Servings = 4 servings
}}
{{recipe}}

Turli perimesh is a dish of vegetables cut into pieces and cooked together slowly.

==Ingredients==
*2 [[Cookbook:Pound|lbs]] of [[Cookbook:Eggplant|eggplant]]
*1 [[Cookbook:Cup|cup]] [[Cookbook:Chopping|chopped]] [[Cookbook:Onion|onion]]

==Procedure==
# [[Cookbook:Saute|Sauté]] the vegetables.
# Simmer until '''soft'''.
`

describe("HowToCook", () => {
  test("parses name, ingredients with amounts, and steps", () => {
    const dish = parseHowToCook(HOWTOCOOK, "vegetable_dish/番茄炒蛋.md")!
    expect(dish.name).toBe("番茄炒蛋")
    expect(dish.countries).toEqual(["CN"])
    expect(dish.kinds).toEqual(["vegetable dish"])
    expect(dish.recipes[0].ingredients).toEqual([
      { item: "番茄", amount: "2 个" },
      { item: "鸡蛋", amount: "3 个" },
      { item: "盐", amount: "2g" },
    ])
    expect(dish.recipes[0].steps).toHaveLength(3)
    expect(dish.sources[0].license).toBe("Unlicense")
  })

  test("skips templates", () => {
    expect(parseHowToCook(HOWTOCOOK, "template/示例菜.md")).toBeUndefined()
  })
})

describe("Wikibooks", () => {
  test("parses cuisine, ingredients and steps, and strips markup", () => {
    const dish = parseWikibooksPage({
      title: "Cookbook:Albanian Mixed Vegetables",
      content: WIKIBOOKS,
      categories: ["Category:Albanian recipes", "Category:Side dish recipes"],
    })!
    expect(dish.name).toBe("Albanian Mixed Vegetables")
    expect(dish.countries).toEqual(["AL"])
    expect(dish.kinds).toEqual(["side dish"])
    expect(dish.ingredients).toEqual(["Eggplant", "Onion"])
    expect(dish.recipes[0].ingredients[1].item).toBe("1 cup chopped onion")
    expect(dish.recipes[0].steps).toEqual(["Sauté the vegetables.", "Simmer until soft."])
    expect(dish.recipes[0].serves).toBe("4 servings")
  })

  test("skips pages without steps", () => {
    expect(
      parseWikibooksPage({ title: "Cookbook:Salt", content: "Salt is salty.", categories: [] }),
    ).toBeUndefined()
  })
})

test("cuisine names map to countries", () => {
  expect(countriesForCuisine("Thai")).toEqual(["TH"])
  expect(countriesForCuisine("Cuisine of the Philippines")).toEqual([])
  expect(countriesForCuisine("Sichuan cuisine")).toEqual(["CN"])
})

describe("merge", () => {
  const base = (over: Partial<WorldDish>): WorldDish => ({
    id: "Q1",
    name: "Tomato and egg",
    names: { zh: "番茄炒蛋" },
    countries: ["CN"],
    cuisines: [],
    kinds: [],
    ingredients: [],
    wikipedia: {},
    recipes: [],
    sources: [],
    ...over,
  })

  test("attaches a recipe to the Wikidata dish with the same Chinese name", () => {
    const howtocook = parseHowToCook(HOWTOCOOK, "vegetable_dish/番茄炒蛋.md")!
    const merged = mergeDishes([base({})], [howtocook])
    expect(merged).toHaveLength(1)
    expect(merged[0].recipes).toHaveLength(1)
    expect(merged[0].ingredients).toEqual(["番茄", "鸡蛋", "盐"])
  })

  test("keeps unmatched recipes as their own dishes", () => {
    const howtocook = parseHowToCook(HOWTOCOOK, "vegetable_dish/番茄炒蛋.md")!
    expect(mergeDishes([base({ names: {}, name: "Pizza" })], [howtocook])).toHaveLength(2)
  })
})

describe("Wikibooks cookbooks in other languages", () => {
  test("French: prefers Préparation over a Recette heading that wraps the whole recipe", () => {
    const text = `== Recette 1 ==
=== Ingrédients ===
* 6 belles {{i|pomme}}s,
* 60 g de {{i|beurre}},
=== Préparation ===
# Faire fondre le beurre.
# Ajouter les pommes.`
    const dish = parseCookbookPage({ title: "Livre de cuisine/Tarte Tatin", text }, "fr")!
    expect(dish.recipes[0].steps).toEqual(["Faire fondre le beurre.", "Ajouter les pommes."])
    expect(dish.ingredients).toEqual(["pomme", "beurre"])
  })

  test("German: paragraphs under bullet sub-headings are the steps", () => {
    const text = `== Zutaten ==
* 250g Mehl
* 100g Zucker
== Zubereitung ==
* Kuchenboden
Die Eier und den Zucker schaumig rühren, dann den Quark unterrühren.
* Streusel
Butter und Zucker verkneten und nach und nach das Mehl hinzugeben.`
    const dish = parseCookbookPage({ title: "Kochbuch/ Streuselkuchen", text }, "de")!
    expect(dish.recipes[0].steps).toHaveLength(2)
    expect(dish.recipes[0].steps[0]).toMatch(/^Die Eier/)
  })

  test("Polish and Dutch link templates keep the ingredient name", () => {
    const pl = parseCookbookPage(
      {
        title: "Książka kucharska/Tokań",
        text: "== Składniki ==\n* {{lpg|pomidor|p=y}} – 60 g\n== Przygotowanie ==\n# Mięso pokroić.",
      },
      "pl",
    )!
    expect(pl.recipes[0].ingredients[0].item).toBe("pomidory – 60 g")
    const nl = parseCookbookPage(
      {
        title: "Kookboek/Caesarsalade",
        text: "== Ingrediënten ==\n* 2 {{Kb|p=ei|eieren}}\n== Bereiding ==\n# Meng alles.",
      },
      "nl",
    )!
    expect(nl.recipes[0].ingredients[0].item).toBe("2 eieren")
  })
})
