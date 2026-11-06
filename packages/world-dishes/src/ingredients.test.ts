import { ingredients } from "@flavor-db/seed-data"
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, test } from "vitest"
import { DEFAULT_DATA_DIR, type IngredientMap, ingredientIdsOf, loadWorldDishes } from "./index"

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

  test("audited drift no longer substitutes unrelated ingredients", () => {
    expect(map.en["1 large sprinkle of paprika"]).toEqual(["paprika"])
    expect(map.en["1 large whole carrot, washed"]).toEqual(["carrot"])
    expect(map.en["1 lb (450 g) bacon slices"]).toEqual(["bacon"])
    expect(map.pl["500 g marchwi"]).toEqual(["carrot"])
    expect(map.ja["コリアンダーパウダー：小さじ2"]).toEqual(["coriander-powder"])
  })

  test("recipe context separates fresh coriander from the seed spice", () => {
    const dishes = loadWorldDishes()
    const salsa = dishes.find((d) => d.id === "wikibooks-ja:サルサ")!
    const tandoori = dishes.find((d) => d.id === "wikibooks-ja:タンドリーチキン")!
    expect(salsa.ingredientIds).toContain("cilantro")
    expect(salsa.ingredientIds).not.toContain("coriander-seed")
    expect(tandoori.ingredientIds).toContain("cilantro")
    expect(tandoori.ingredientIds).toContain("coriander-powder")
    expect(tandoori.ingredientIds).not.toContain("coriander-seed")
    expect(
      ingredientIdsOf(
        salsa,
        { labels: { コリアンダー: ["coriander-seed"] } },
        { labels: { コリアンダー: [] } },
      ),
    ).toEqual([])
  })

  test("prepared foods and unusual ingredients retain their own identities", () => {
    expect(map.pl["850 dag masy makowej"]).toEqual(["poppy-seed-filling"])
    expect(map.en["1 kuli kuli, ground"]).toEqual(["kuli-kuli"])
    expect(map.en["1 cup finely-ground pure cannabis"]).toEqual(["cannabis"])
    expect(ingredients.some((i) => i.id === "cockchafer")).toBe(true)
  })

  test("most imported dishes with ingredients get ingredient ids", () => {
    const withText = loadWorldDishes().filter((d) => d.ingredients.length || d.recipes.length)
    const mapped = withText.filter((d) => d.ingredientIds?.length)
    expect(mapped.length / withText.length).toBeGreaterThan(0.95)
  })
})
