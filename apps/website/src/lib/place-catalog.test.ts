import { expect, test } from "vitest"
import type { CatalogEntry } from "./catalog"
import { countryCatalogPage } from "./place-catalog"

const entry = (
  key: string,
  countries: string[],
  hasRecipe = false,
  image?: string,
): CatalogEntry => ({
  key,
  href: `/dishes/${key}`,
  name: key,
  countries,
  hasRecipe,
  image,
  ingredientIds: [],
  haystack: key,
})

test("country membership keeps shared origins and prioritizes useful entries", () => {
  const entries = [
    entry("text", ["BR"]),
    entry("photo", ["BR"], false, "dish.jpg"),
    entry("recipe", ["BR"], true),
    entry("both", ["BR", "PT"], true, "dish.jpg"),
    entry("elsewhere", ["US"], true),
  ]
  expect(countryCatalogPage(entries, "BR").results.map((e) => e.key)).toEqual([
    "both",
    "recipe",
    "photo",
    "text",
  ])
  expect(countryCatalogPage(entries, "PT").results.map((e) => e.key)).toEqual(["both"])
})

test("pagination has no overlaps and bounds malformed or out-of-range requests", () => {
  const entries = Array.from({ length: 100 }, (_, i) => entry(String(i).padStart(3, "0"), ["BR"]))
  const first = countryCatalogPage(entries, "BR")
  const second = countryCatalogPage(entries, "BR", "2")
  expect(first.results).toHaveLength(48)
  expect(second.results).toHaveLength(48)
  expect(second.results.some((e) => first.results.includes(e))).toBe(false)
  expect(countryCatalogPage(entries, "BR", "999").results).toHaveLength(4)
  for (const value of ["-1", "NaN", "Infinity", "1.5", "0"])
    expect(countryCatalogPage(entries, "BR", value).page).toBe(1)
  expect(countryCatalogPage(entries, "XX", "2")).toMatchObject({
    total: 0,
    pages: 1,
    page: 1,
    results: [],
  })
})
