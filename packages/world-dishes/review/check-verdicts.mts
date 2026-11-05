import { existsSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const review = path.dirname(fileURLToPath(import.meta.url))
const batchDir = path.resolve(process.argv[2] ?? path.join(review, "batches"))
const verdictDir = path.resolve(process.argv[3] ?? path.join(review, "verdicts"))

const duplicated = (id: string) => `${id}:${id.slice(id.lastIndexOf(":") + 1)}`

/** Only the documented repeated final HowToCook name and r-225 suffix are equivalent. */
export function matchesId(batch: string, expected: string, actual: string): boolean {
  if (expected === actual) return true
  if (batch === "r-225" && expected === "wikibooks-hu:libatepertő")
    return actual === `${expected}-1`
  if (!expected.startsWith("howtocook:") || !actual.startsWith("howtocook:")) return false
  return duplicated(expected) === actual || duplicated(actual) === expected
}

function dishIds(markdown: string): string[] {
  const ids: string[] = []
  let fence = ""
  for (const line of markdown.split(/\r?\n/)) {
    const marker = /^\s*(`{3,}|~{3,})/.exec(line)
    if (marker) {
      if (!fence) fence = marker[1]!
      else if (marker[1].startsWith(fence[0]) && marker[1].length >= fence.length) fence = ""
      continue
    }
    if (!fence && line.startsWith("## DISH ")) ids.push(line.slice(8).trim())
  }
  return ids
}

const errors: string[] = []
const manifestPath = path.join(review, "batch-ids.json")
const manifest = existsSync(manifestPath)
  ? (JSON.parse(readFileSync(manifestPath, "utf8")) as {
      batches: Record<string, string[]>
      originalsUnavailable: string[]
    })
  : undefined
const batches = new Map(
  (existsSync(batchDir) ? readdirSync(batchDir) : [])
    .filter((name) => name.endsWith(".md"))
    .map((name) => [name.slice(0, -3), dishIds(readFileSync(path.join(batchDir, name), "utf8"))]),
)
for (const [name, ids] of Object.entries(manifest?.batches ?? {})) {
  const original = batches.get(name)
  if (
    original &&
    (original.length !== ids.length ||
      original.some((id, index) => !matchesId(name, ids[index], id)))
  )
    errors.push(`${name}: original batch differs from persisted positional manifest`)
  if (!original) batches.set(name, ids)
}
let parsedFiles = 0
let parsedVerdicts = 0
let checkedFiles = 0
const unavailable: string[] = []
const verdictFiles = readdirSync(verdictDir)
  .filter((name) => name.endsWith(".jsonl"))
  .toSorted()
for (const file of verdictFiles) {
  const name = file.slice(0, -6)
  const content = readFileSync(path.join(verdictDir, file), "utf8")
  const lines = content.split(/\r?\n/)
  if (lines.at(-1) === "") lines.pop()
  const expected = batches.get(name)
  if (expected) {
    checkedFiles++
    if (lines.length !== expected.length)
      errors.push(`${file}: expected ${expected.length} verdict lines, found ${lines.length}`)
  } else unavailable.push(name)
  let valid = true
  lines.forEach((line, index) => {
    let verdict: {
      id?: unknown
      verdict?: unknown
      name?: unknown
      countries?: unknown
      recipes?: unknown
      reason?: unknown
    }
    try {
      verdict = JSON.parse(line) as { id?: unknown }
      if (!verdict || typeof verdict !== "object" || Array.isArray(verdict))
        throw new Error("expected a JSON object")
    } catch (error) {
      errors.push(`${file}:${index + 1}: ${String(error)}`)
      valid = false
      return
    }
    parsedVerdicts++
    if (typeof verdict.id !== "string" || !["keep", "remove"].includes(String(verdict.verdict))) {
      errors.push(`${file}:${index + 1}: requires string id and keep/remove verdict`)
      valid = false
    }
    if (verdict.name !== undefined && (typeof verdict.name !== "string" || !verdict.name.trim()))
      errors.push(`${file}:${index + 1}: name must be a nonempty string`)
    if (
      verdict.countries !== undefined &&
      (!Array.isArray(verdict.countries) ||
        !verdict.countries.every(
          (code: unknown) => typeof code === "string" && /^[A-Z]{2}$/.test(code),
        ))
    )
      errors.push(`${file}:${index + 1}: countries must contain alpha-2 codes`)
    if (
      (verdict.verdict === "remove" ||
        verdict.name !== undefined ||
        verdict.countries !== undefined) &&
      (typeof verdict.reason !== "string" || !verdict.reason.trim())
    )
      errors.push(`${file}:${index + 1}: removal or metadata change requires a reason`)
    if (verdict.recipes !== undefined) {
      if (!Array.isArray(verdict.recipes))
        errors.push(`${file}:${index + 1}: recipes must be an array`)
      else
        for (const value of verdict.recipes as unknown[]) {
          const recipe = value as {
            source?: unknown
            status?: unknown
            ingredients?: unknown
            steps?: unknown
          } | null
          if (
            !recipe ||
            typeof recipe.source !== "string" ||
            !["ok", "fixed", "drop"].includes(String(recipe.status))
          )
            errors.push(`${file}:${index + 1}: invalid recipe source/status`)
          else if (
            recipe.status === "fixed" &&
            [recipe.ingredients, recipe.steps].some(
              (items) =>
                !Array.isArray(items) ||
                !items.length ||
                !items.every((item: unknown) => typeof item === "string" && !!item.trim()),
            )
          )
            errors.push(
              `${file}:${index + 1}: fixed recipe requires nonempty ingredients and steps`,
            )
        }
    }
    const id = expected?.[index]
    if (id && typeof verdict.id === "string" && !matchesId(name, id, verdict.id))
      errors.push(`${file}:${index + 1}: expected ${id}, found ${verdict.id}`)
  })
  if (valid) parsedFiles++
}
for (const name of batches.keys()) {
  if (!existsSync(path.join(verdictDir, `${name}.jsonl`)))
    errors.push(`${name}: missing verdict file`)
}
console.log(
  `Parsed ${parsedVerdicts} verdicts; ${parsedFiles}/${verdictFiles.length} files have valid JSON objects and required fields.`,
)
console.log(
  `Checked positional IDs and counts against ${checkedFiles}/${batches.size} available batch inputs.`,
)
if (unavailable.length)
  console.log(
    `UNVERIFIED: ${unavailable.length} verdict files have no batch input: ${unavailable.join(", ")}`,
  )
for (const error of errors) console.error(error)
console.log(`${errors.length} validation errors; ${unavailable.length} files lack batch inputs.`)
if (manifest)
  console.log(
    `Persisted positions cover ${Object.keys(manifest.batches).length} batches. ${manifest.originalsUnavailable.length} original source batches remain unavailable; their boundaries were verified against baseline global order, not original raw pages.`,
  )
process.exitCode = errors.length || unavailable.length ? 1 : 0
