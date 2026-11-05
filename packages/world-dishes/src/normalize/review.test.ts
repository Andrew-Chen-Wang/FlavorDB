import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { describe, expect, test } from "vitest"
import type { WorldDish, WorldRecipe } from "../types"
import {
  applyVerdicts,
  assertDishCountries,
  equivalentReviewId,
  loadVerdicts,
  type DishVerdict,
  type Verdicts,
} from "./review"

const recipe = (url: string): WorldRecipe => ({
  title: "Soup",
  lang: "en",
  ingredients: [{ item: "water" }],
  steps: ["Boil."],
  source: { name: "Wikibooks Cookbook", url, license: "CC-BY-SA-4.0" },
})
const dish = (id: string): WorldDish => ({
  id,
  name: "Soup",
  names: {},
  countries: ["GB"],
  cuisines: [],
  kinds: [],
  ingredients: [],
  wikipedia: {},
  recipes: [recipe("first"), recipe("second")],
  sources: [],
})
const verdicts = (...entries: DishVerdict[]): Verdicts => ({
  dishes: new Map(entries.map((entry) => [entry.id, entry])),
  files: 1,
  batchesUnavailable: [],
})

describe("per-dish review application", () => {
  test("requires countries for reviewed and unreviewed output dishes", () => {
    const empty = { ...dish("Q1"), countries: [] }
    expect(() => applyVerdicts([empty], verdicts())).toThrow("1 missing (Q1)")
    expect(() =>
      applyVerdicts([dish("Q1")], verdicts({ id: "Q1", verdict: "keep", countries: [] })),
    ).toThrow("1 missing (Q1)")
    expect(
      applyVerdicts([empty], verdicts({ id: "Q1", verdict: "keep", countries: ["HU"] })).dishes[0]
        .countries,
    ).toEqual(["HU"])
  })

  test("validates countries after removals and last-recipe drops", () => {
    const empty = { ...dish("wikibooks-en:soup"), countries: [] }
    expect(applyVerdicts([empty], verdicts({ id: empty.id, verdict: "remove" })).dishes).toEqual([])
    const drops: DishVerdict = {
      id: empty.id,
      verdict: "keep",
      recipes: [
        { source: "first", status: "drop" },
        { source: "second", status: "drop" },
      ],
    }
    expect(applyVerdicts([empty], verdicts(drops)).dishes).toEqual([])
    const wikidata = { ...empty, id: "Q1" }
    expect(() => applyVerdicts([wikidata], verdicts({ ...drops, id: "Q1" }))).toThrow(
      "1 missing (Q1)",
    )
  })

  test("rejects countryless already-applied output when validating a receipt", () => {
    expect(() => assertDishCountries([{ ...dish("Q1"), countries: [] }])).toThrow("Q1")
    expect(() => assertDishCountries([dish("Q1")])).not.toThrow()
  })
  test("matches recipes by URL, applies overrides, and leaves inputs unchanged", () => {
    const input = dish("Q1")
    const result = applyVerdicts(
      [input],
      verdicts({
        id: "Q1",
        verdict: "keep",
        name: "Broth",
        countries: ["FR", "GB"],
        recipes: [
          { source: "second", status: "fixed", ingredients: ["2 l water"], steps: ["Simmer."] },
          { source: "first", status: "drop" },
        ],
      }),
    )
    expect(result.counts).toEqual({
      removed: 0,
      emptied: 0,
      renamed: 1,
      countriesChanged: 1,
      recipesFixed: 1,
      recipesDropped: 1,
    })
    expect(result.dishes[0].recipes).toEqual([
      { ...recipe("second"), ingredients: [{ item: "2 l water" }], steps: ["Simmer."] },
    ])
    expect(input.name).toBe("Soup")
    expect(input.recipes).toHaveLength(2)
  })

  test("removes recipe-only dishes emptied by drops while retaining Wikidata dishes", () => {
    const entries = [dish("wikibooks-en:soup"), dish("Q1")]
    const review = verdicts(
      ...entries.map(
        (entry): DishVerdict => ({
          id: entry.id,
          verdict: "keep",
          recipes: [
            { source: "first", status: "drop" },
            { source: "second", status: "drop" },
          ],
        }),
      ),
    )
    const result = applyVerdicts(entries, review)
    expect(result.dishes.map((entry) => entry.id)).toEqual(["Q1"])
    expect(result.counts).toMatchObject({ removed: 1, emptied: 1, recipesDropped: 4 })
    expect(applyVerdicts(result.dishes, review).counts).toEqual({
      removed: 0,
      emptied: 0,
      renamed: 0,
      countriesChanged: 0,
      recipesFixed: 0,
      recipesDropped: 0,
    })
  })

  test("rejects missing sources for fixes instead of silently losing a correction", () => {
    expect(() =>
      applyVerdicts(
        [dish("Q1")],
        verdicts({
          id: "Q1",
          verdict: "keep",
          recipes: [
            { source: "missing", status: "fixed", ingredients: ["water"], steps: ["Boil."] },
          ],
        }),
      ),
    ).toThrow("recipe source not found")
  })

  test("accepts only the documented ID variants", () => {
    expect(equivalentReviewId("howtocook:soup:米粥", "howtocook:soup:米粥:米粥", "r-300")).toBe(
      true,
    )
    expect(
      equivalentReviewId("wikibooks-hu:libatepertő", "wikibooks-hu:libatepertő-1", "r-225"),
    ).toBe(true)
    expect(
      equivalentReviewId("wikibooks-hu:libatepertő", "wikibooks-hu:libatepertő-1", "r-224"),
    ).toBe(false)
    expect(equivalentReviewId("Q1", "Q2", "r-300")).toBe(false)
  })

  test("validates positional order and completeness when batch inputs are available", () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "world-review-"))
    try {
      mkdirSync(path.join(root, "batches"))
      mkdirSync(path.join(root, "verdicts"))
      writeFileSync(path.join(root, "batches", "r-001.md"), "## DISH Q1\n## DISH Q2\n")
      const file = path.join(root, "verdicts", "r-001.jsonl")
      writeFileSync(file, '{"id":"Q2","verdict":"keep"}\n{"id":"Q1","verdict":"keep"}\n')
      expect(() => loadVerdicts([dish("Q1"), dish("Q2")], root)).toThrow("expected Q1, found Q2")
      writeFileSync(file, '{"id":"Q1","verdict":"keep"}\n')
      expect(() => loadVerdicts([dish("Q1"), dish("Q2")], root)).toThrow(
        "expected 2 verdicts, found 1",
      )
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
  test("uses persisted positions without source batches and rejects reordered verdicts", () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "world-review-"))
    try {
      mkdirSync(path.join(root, "verdicts"))
      writeFileSync(
        path.join(root, "batch-ids.json"),
        JSON.stringify({ batches: { "r-001": ["Q1", "Q2"] } }),
      )
      const file = path.join(root, "verdicts", "r-001.jsonl")
      writeFileSync(file, '{"id":"Q1","verdict":"keep"}\n{"id":"Q2","verdict":"keep"}\n')
      const loaded = loadVerdicts([dish("Q1"), dish("Q2")], root)
      expect([...loaded.dishes.keys()]).toEqual(["Q1", "Q2"])
      expect(loaded.batchesUnavailable).toEqual(["r-001"])
      writeFileSync(file, '{"id":"Q2","verdict":"keep"}\n{"id":"Q1","verdict":"keep"}\n')
      expect(() => loadVerdicts([dish("Q1"), dish("Q2")], root)).toThrow("expected Q1, found Q2")
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})
