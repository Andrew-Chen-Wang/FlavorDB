import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, test } from "vitest"
import { DEFAULT_DATA_DIR, type FoundImage, loadWorldDishes } from "./index"

const found = JSON.parse(
  readFileSync(path.join(DEFAULT_DATA_DIR, "images.json"), "utf8"),
) as Record<string, FoundImage>

describe("found photos", () => {
  const byId = new Map(loadWorldDishes().map((d) => [d.id, d]))

  test("every photo belongs to a dish and says where it was found", () => {
    for (const [id, image] of Object.entries(found)) {
      expect(byId.has(id)).toBe(true)
      expect(image.from).toMatch(/^https:\/\//)
      expect(Boolean(image.image) !== Boolean(image.imageUrl)).toBe(true)
    }
  })

  test("the loader attaches them to dishes that had no photo", () => {
    const [id, image] = Object.entries(found)[0]
    const dish = byId.get(id)!
    expect(dish.image ?? dish.imageUrl).toBe(image.image ?? image.imageUrl)
    expect(dish.imageFrom).toBe(image.from)
  })
})
