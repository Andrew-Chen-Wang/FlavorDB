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

  test("reviewed photos retain their Commons license and credit through the loader", () => {
    const verdicts = readFileSync(
      path.join(DEFAULT_DATA_DIR, "../review/photos/verdicts.jsonl"),
      "utf8",
    )
      .trim()
      .split("\n")
      .map(
        (line) =>
          JSON.parse(line) as {
            id: string
            image: string
            verdict: string
            license: string
            reason: string
          },
      )
    const accepted = verdicts.filter((v) => v.verdict === "keep")
    expect(new Set(accepted.map((v) => v.id)).size).toBe(accepted.length)
    for (const verdict of accepted) {
      const image = found[verdict.id]
      expect(image.image).toBe(verdict.image)
      expect(image.credit?.license).toBe(verdict.license)
      expect(image.credit?.license).toMatch(
        /^(CC BY(?:-SA)? (?:[1-4]\.0|2\.5)|CC0|Public domain|GFDL 1\.2)$/,
      )
      expect(image.credit?.author).toBeTruthy()
      expect(byId.get(verdict.id)?.imageCredit).toEqual(image.credit)
      expect(verdict.reason).toBeTruthy()
    }
  })

  test("every saved candidate has one review in candidate order", () => {
    const candidates = JSON.parse(
      readFileSync(path.join(DEFAULT_DATA_DIR, "../review/photos/candidates.json"), "utf8"),
    ) as { id: string; image: string }[]
    const verdicts = readFileSync(
      path.join(DEFAULT_DATA_DIR, "../review/photos/verdicts.jsonl"),
      "utf8",
    )
      .trim()
      .split("\n")
      .map(
        (line) =>
          JSON.parse(line) as {
            candidate: number
            id: string
            image: string
            verdict: string
            reason: string
          },
      )
    expect(verdicts.length).toBe(candidates.length)
    for (const [index, verdict] of verdicts.entries()) {
      expect(verdict.candidate).toBe(index)
      expect(verdict.id).toBe(candidates[index].id)
      expect(verdict.image).toBe(candidates[index].image)
      expect(["keep", "drop"]).toContain(verdict.verdict)
      expect(verdict.reason).toBeTruthy()
    }
  })
})
