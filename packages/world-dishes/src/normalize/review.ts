import { existsSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import type { WorldDish } from "../types"

export const REVIEW_DIR = path.join(import.meta.dirname, "..", "..", "review")

type RecipeVerdict = {
  source: string
  status: "ok" | "fixed" | "drop"
  ingredients?: string[]
  steps?: string[]
}
export type DishVerdict = {
  id: string
  verdict: "keep" | "remove"
  name?: string
  countries?: string[]
  recipes?: RecipeVerdict[]
  reason?: string
}
export type Verdicts = {
  dishes: Map<string, DishVerdict>
  files: number
  batchesUnavailable: string[]
  positionsPersisted?: boolean
}

function unduplicate(id: string): string {
  const parts = id.split(":")
  if (parts.length > 3 && parts.at(-1) === parts.at(-2)) parts.pop()
  return parts.join(":")
}

/** Only the two documented reviewer ID mistakes are accepted. */
export function equivalentReviewId(actual: string, reviewed: string, batch: string): boolean {
  if (actual === reviewed) return true
  if (batch === "r-225" && actual === "wikibooks-hu:libatepertő" && reviewed === `${actual}-1`)
    return true
  if (!actual.startsWith("howtocook:") || !reviewed.startsWith("howtocook:")) return false
  return unduplicate(actual) === unduplicate(reviewed)
}

function strings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}

/** Top-level dish headers only; source pages may contain misleading headers inside fences. */
export function readBatchIds(text: string): string[] {
  const ids: string[] = []
  let fence: string | undefined
  for (const line of text.split("\n")) {
    const marker = /^(`{3,}|~{3,})/.exec(line)?.[1]
    if (marker) {
      if (!fence) fence = marker
      else if (marker.startsWith(fence[0]) && marker.length >= fence.length) fence = undefined
      continue
    }
    if (!fence && line.startsWith("## DISH ")) ids.push(line.slice(8).trim())
  }
  return ids
}

/** Parse and validate data only; all editorial decisions live in the reviewed JSONL files. */
export function loadVerdicts(input: WorldDish[], reviewDir = REVIEW_DIR): Verdicts {
  const result: Verdicts = { dishes: new Map(), files: 0, batchesUnavailable: [] }
  const ids = new Set(input.map((dish) => dish.id))
  const manifestPath = path.join(reviewDir, "batch-ids.json")
  const manifest = existsSync(manifestPath)
    ? (JSON.parse(readFileSync(manifestPath, "utf8")) as { batches: Record<string, string[]> })
    : undefined
  result.positionsPersisted = !!manifest
  for (const file of readdirSync(path.join(reviewDir, "verdicts"))
    .filter((f) => f.endsWith(".jsonl"))
    .toSorted()) {
    const batch = file.slice(0, -6)
    const batchPath = path.join(reviewDir, "batches", `${batch}.md`)
    const originalIds = existsSync(batchPath)
      ? readBatchIds(readFileSync(batchPath, "utf8"))
      : undefined
    if (!originalIds) result.batchesUnavailable.push(batch)
    const batchIds = manifest ? manifest.batches[batch] : originalIds
    if (manifest && !strings(batchIds))
      throw new Error(`${file}: batch missing from position manifest`)
    if (
      manifest &&
      originalIds &&
      (originalIds.length !== batchIds!.length ||
        originalIds.some((id, i) => !equivalentReviewId(batchIds![i], id, batch)))
    )
      throw new Error(`${file}: original batch differs from position manifest`)
    const lines = readFileSync(path.join(reviewDir, "verdicts", file), "utf8")
      .trimEnd()
      .split("\n")
    if (batchIds && batchIds.length !== lines.length)
      throw new Error(`${file}: expected ${batchIds.length} verdicts, found ${lines.length}`)
    for (const [position, line] of lines.entries()) {
      const verdict = JSON.parse(line) as DishVerdict
      const location = `${file}:${position + 1}`
      if (typeof verdict.id !== "string" || !["keep", "remove"].includes(verdict.verdict))
        throw new Error(`${location}: invalid dish verdict`)
      if (verdict.name !== undefined && (typeof verdict.name !== "string" || !verdict.name.trim()))
        throw new Error(`${location}: invalid name`)
      if (
        verdict.countries !== undefined &&
        (!strings(verdict.countries) || verdict.countries.some((c) => !/^[A-Z]{2}$/.test(c)))
      )
        throw new Error(`${location}: invalid countries`)
      if (verdict.recipes !== undefined) {
        if (!Array.isArray(verdict.recipes)) throw new Error(`${location}: invalid recipes`)
        const sources = new Set<string>()
        for (const recipe of verdict.recipes) {
          if (
            typeof recipe.source !== "string" ||
            sources.has(recipe.source) ||
            !["ok", "fixed", "drop"].includes(recipe.status)
          )
            throw new Error(`${location}: invalid or duplicate recipe source/status`)
          sources.add(recipe.source)
          if (
            recipe.status === "fixed" &&
            (!strings(recipe.ingredients) ||
              !strings(recipe.steps) ||
              !recipe.ingredients.length ||
              !recipe.steps.length)
          )
            throw new Error(`${location}: fixed recipe needs ingredients and steps`)
        }
      }
      let id = batchIds?.[position] ?? verdict.id
      if (!equivalentReviewId(id, verdict.id, batch))
        throw new Error(`${location}: expected ${id}, found ${verdict.id}`)
      if (!ids.has(id)) {
        const candidates = [...ids].filter((candidate) =>
          equivalentReviewId(candidate, verdict.id, batch),
        )
        if (candidates.length === 1) id = candidates[0]
        else if (candidates.length > 1) throw new Error(`${location}: ambiguous ID ${id}`)
        else throw new Error(`${location}: verdict ID not found in input: ${id}`)
      }
      if (result.dishes.has(id)) throw new Error(`${location}: duplicate verdict for ${id}`)
      result.dishes.set(id, verdict)
    }
    result.files++
  }
  return result
}

export type ReviewCounts = {
  removed: number
  emptied: number
  renamed: number
  countriesChanged: number
  recipesFixed: number
  recipesDropped: number
}

/** Validate the complete output, including dishes without a review override. */
export function assertDishCountries(dishes: WorldDish[]): void {
  const missing = dishes.filter((dish) => dish.countries.length === 0)
  if (missing.length)
    throw new Error(
      `Every output dish must have at least one country: ${missing.length} missing (${missing
        .slice(0, 10)
        .map((dish) => dish.id)
        .join(", ")}${missing.length > 10 ? ", …" : ""})`,
    )
}

export function applyVerdicts(
  input: WorldDish[],
  verdicts: Verdicts,
): { dishes: WorldDish[]; counts: ReviewCounts } {
  const counts: ReviewCounts = {
    removed: 0,
    emptied: 0,
    renamed: 0,
    countriesChanged: 0,
    recipesFixed: 0,
    recipesDropped: 0,
  }
  const dishes: WorldDish[] = []
  for (const original of input) {
    const verdict = verdicts.dishes.get(original.id)
    if (!verdict) {
      dishes.push(original)
      continue
    }
    if (verdict.verdict === "remove") {
      counts.removed++
      continue
    }
    const dish = { ...original, recipes: [...original.recipes] }
    if (verdict.name !== undefined && verdict.name !== dish.name) {
      dish.name = verdict.name
      counts.renamed++
    }
    if (
      verdict.countries !== undefined &&
      JSON.stringify(dish.countries.toSorted()) !== JSON.stringify(verdict.countries.toSorted())
    ) {
      dish.countries = [...verdict.countries]
      counts.countriesChanged++
    }
    for (const recipeVerdict of verdict.recipes ?? []) {
      const index = dish.recipes.findIndex((recipe) => recipe.source.url === recipeVerdict.source)
      if (index < 0) {
        // A previous application may already have removed this recipe.
        if (recipeVerdict.status === "drop") continue
        throw new Error(`${dish.id}: recipe source not found: ${recipeVerdict.source}`)
      }
      if (recipeVerdict.status === "drop") {
        dish.recipes.splice(index, 1)
        counts.recipesDropped++
      }
      if (recipeVerdict.status === "fixed") {
        const recipe = dish.recipes[index]
        const ingredients = recipeVerdict.ingredients!.map((item) => ({ item }))
        const steps = recipeVerdict.steps!
        if (
          JSON.stringify(recipe.ingredients) !== JSON.stringify(ingredients) ||
          JSON.stringify(recipe.steps) !== JSON.stringify(steps)
        ) {
          dish.recipes[index] = { ...recipe, ingredients, steps: [...steps] }
          counts.recipesFixed++
        }
      }
    }
    if (
      original.recipes.length > 0 &&
      dish.recipes.length === 0 &&
      !/^Q\d+$/.test(dish.id) &&
      !dish.sources.some((source) => source.name === "Wikidata")
    ) {
      counts.removed++
      counts.emptied++
    } else dishes.push(dish)
  }
  assertDishCountries(dishes)
  return { dishes, counts }
}

export function verdictReport(counts: ReviewCounts, verdicts: Verdicts, mode: string): string {
  return [
    "## Per-dish review applied",
    "",
    mode,
    "",
    `Loaded ${verdicts.dishes.size} dish verdicts from ${verdicts.files} files.`,
    "",
    "| Review change | Count |",
    "|---|---:|",
    `| Dishes removed | ${counts.removed} |`,
    `| …because their last recipe was dropped and they have no Wikidata ID | ${counts.emptied} |`,
    `| Dishes renamed | ${counts.renamed} |`,
    `| Countries changed | ${counts.countriesChanged} |`,
    `| Recipes fixed | ${counts.recipesFixed} |`,
    `| Recipes dropped | ${counts.recipesDropped} |`,
    "",
    verdicts.batchesUnavailable.length === 0
      ? `All ${verdicts.files} verdict files were matched to original batch positions${verdicts.positionsPersisted ? " and checked against persisted positions" : ""}.`
      : verdicts.positionsPersisted
        ? `All ${verdicts.files} verdict files were matched by persisted batch position. ${verdicts.files - verdicts.batchesUnavailable.length} original batch inputs were checked directly. ${verdicts.batchesUnavailable.length} original inputs were unavailable; their positions were independently checked against baseline global data order. Their original raw pages and batch boundaries were not recovered.`
        : `${verdicts.files - verdicts.batchesUnavailable.length} verdict files were matched to original batch positions. ${verdicts.batchesUnavailable.length} original inputs were unavailable and used the documented ID fallback.`,
    "",
    "Follow-ups: import the additional recipes on pages such as brigadeiro, Castagnaccio and Bacalhau à Brás. Raw sources were truncated at 6,000 characters, so long pages were only partly checked.",
    "",
  ].join("\n")
}
