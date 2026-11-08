import { expect, test, vi } from "vitest"
vi.mock("server-only", () => ({}))
import { catalogEntries, catalogCountries } from "./catalog"
import { catalogMapData } from "./map-data"
import { countryClusters } from "./geo"

test("both maps cover every catalog country and each imported dish at both zoom levels", () => {
  const data = catalogMapData()
  expect(data.dishes).toHaveLength(catalogEntries().length)
  expect(data.countries.map((c) => c.code).toSorted()).toEqual(
    catalogCountries()
      .map((c) => c.code)
      .toSorted(),
  )
  const beijing = data.places.filter((p) => p.name.startsWith("Beijing"))
  expect(beijing).toHaveLength(1)
  expect(beijing[0].name).toContain("local and country-level")
  expect(beijing[0].dishes.length).toBeGreaterThan(1000)
  for (const origins of Object.values(data.placeDishOrigins))
    expect(data.places.some((p) => p.id === origins[0])).toBe(true)
  const pins = new Set(data.places.flatMap((p) => p.dishes))
  for (const dish of catalogEntries()) {
    expect(pins.has(dish.key)).toBe(true)
    for (const code of dish.countries)
      expect(data.countries.find((c) => c.code === code)?.dishes).toContain(dish.key)
  }
  expect(countryClusters().find((c) => c.code === "BR")?.count).toBe(
    data.countries.find((c) => c.code === "BR")?.dishes.length,
  )
  const brazil = data.places.find((p) => p.id === "country-BR")!
  expect(brazil.name).toContain("Brasília")
  expect(brazil.lat).toBeCloseTo(-15.78, 1)
  expect(brazil.lng).toBeCloseTo(-47.93, 1)
  expect(brazil.dishes.length).toBeGreaterThan(500)
  expect(data.places.find((p) => p.id === "us-detroit")?.dishes).toContain("detroit-style-pizza")
})
