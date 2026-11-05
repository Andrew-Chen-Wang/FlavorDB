import { expect, test } from "vitest"
import { loadWorldDishes } from "./index"
import { assertDishCountries } from "./normalize/review"

test("every checked-in world dish has at least one country", () => {
  const dishes = loadWorldDishes()
  expect(dishes.length).toBeGreaterThan(0)
  assertDishCountries(dishes)
})
