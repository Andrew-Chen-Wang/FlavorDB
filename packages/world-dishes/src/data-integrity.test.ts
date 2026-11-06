import { worldLinks, sameAs } from "@flavor-db/seed-data"
import { expect, test } from "vitest"
import { loadWorldDishes } from "./index"
import { assertDishCountries } from "./normalize/review"

test("every checked-in world dish has at least one country", () => {
  const dishes = loadWorldDishes()
  expect(dishes.length).toBeGreaterThan(0)
  assertDishCountries(dishes)
})

test("every similarity profile links to a real imported dish without curated duplicates", () => {
  const ids = new Set(loadWorldDishes().map((d) => d.id))
  const duplicates = new Set(Object.values(sameAs).flat())
  expect(worldLinks.filter((w) => !ids.has(w.id)).map((w) => w.id)).toEqual([])
  expect(worldLinks.filter((w) => duplicates.has(w.id)).map((w) => w.id)).toEqual([])
})
