import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { equivalentReviewId, readBatchIds } from "../src/normalize/review"

// Persist positions against immutable pre-review data; never infer decisions.
const review = import.meta.dirname
const root = path.resolve(review, "../../..")
const baseline = process.argv[2] ?? "9333faf"
const git = (...args: string[]) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 128 * 1024 * 1024 })
const expected: Record<string, string[]> = { names: [], r: [] }
for (const file of git("ls-tree", "-r", "--name-only", baseline, "packages/world-dishes/data")
  .trim()
  .split("\n")
  .filter((file) => /\/dishes-\d+\.jsonl$/.test(file))
  .toSorted()) {
  for (const line of git("show", `${baseline}:${file}`).trim().split("\n")) {
    const dish = JSON.parse(line) as { id: string; recipes: unknown[] }
    expected[dish.recipes.length ? "r" : "names"].push(dish.id)
  }
}
if (!expected.names.length || !expected.r.length) throw new Error("Baseline dish data unavailable")
const positions: Record<string, number> = { names: 0, r: 0 }
const batches: Record<string, string[]> = {}
const originalsUnavailable: string[] = []
for (const file of readdirSync(path.join(review, "verdicts")).toSorted()) {
  const match = /^(names|r)-\d+\.jsonl$/.exec(file)
  if (!match) continue
  const group = match[1]
  const batch = file.slice(0, -6)
  const rows = readFileSync(path.join(review, "verdicts", file), "utf8")
    .trimEnd()
    .split("\n")
    .map((line) => JSON.parse(line) as { id: string })
  const original = path.join(review, "batches", `${batch}.md`)
  const originalIds = existsSync(original)
    ? readBatchIds(readFileSync(original, "utf8"))
    : undefined
  if (!originalIds) originalsUnavailable.push(batch)
  if (originalIds && originalIds.length !== rows.length)
    throw new Error(`${batch}: incomplete verdicts`)
  batches[batch] = rows.map((row, index) => {
    const id = expected[group][positions[group]]
    positions[group]++
    if (!id || !equivalentReviewId(id, row.id, batch))
      throw new Error(`${batch}:${index + 1}: baseline expected ${id}, found ${row.id}`)
    if (originalIds && !equivalentReviewId(id, originalIds[index], batch))
      throw new Error(`${batch}:${index + 1}: original batch position differs from baseline`)
    return id
  })
}
for (const group of ["names", "r"])
  if (positions[group] !== expected[group].length)
    throw new Error(`${group}: reviewed ${positions[group]}/${expected[group].length}`)
writeFileSync(
  path.join(review, "batch-ids.json"),
  JSON.stringify(
    {
      baseline,
      note: "Original batch IDs where available, otherwise boundaries from verdict file counts verified against independent baseline global order. Missing raw sources are not reconstructed.",
      originalsUnavailable,
      batches,
    },
    null,
    2,
  ) + "\n",
)
console.log(
  `Wrote ${Object.keys(batches).length} batch positions; ${originalsUnavailable.length} original source batches unavailable.`,
)
