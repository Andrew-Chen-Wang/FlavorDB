import { execFileSync } from "node:child_process"
import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"

// Structural inventory only: recorded IDs and explicit completion statements do not prove review quality.
const review = import.meta.dirname
const root = path.resolve(review, "../../..")
const baseline = process.argv[2] ?? "8476ba36310a158ed08ca7b4d5655d7ef05afe08"
const git = (...args: string[]) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 128 * 1024 * 1024 })
const batches = execFileSync("tar", ["tzf", path.join(review, "original-batches.tgz")], {
  encoding: "utf8",
})
  .trim()
  .split("\n")
  .map((name) => path.basename(name))
  .filter((name) => /^(names|r)-\d+\.md$/.test(name))
  .map((name) => name.slice(0, -3))
  .toSorted()
const ledgers = readdirSync(path.join(review, "audits"))
  .filter((name) => /^original-.*\.md$/.test(name))
  .map((name) => ({ name, text: readFileSync(path.join(review, "audits", name), "utf8") }))
const text = ledgers.map((ledger) => ledger.text).join("\n")
// IDs may be in prose lists followed by commas or full stops, not just table cells.
const recorded = new Set([...text.matchAll(/\bQ\d+\b/g)].map((match) => match[0]))
const hasRecordedId = (id: string) => {
  if (/^Q\d+$/.test(id)) return recorded.has(id)
  // Some ledgers record the complete unique slug beside its batch/position instead of repeating the namespace.
  return [id, id.slice(id.indexOf(":") + 1)].some((value) => {
    const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    return new RegExp(`(?:^|[\\s\x60|,])${escaped}(?=[\\s\x60|,.;:]|$)`, "m").test(text)
  })
}

type Row = { id: string; verdict: string; name?: string; countries?: string[] }
const flagged = (row: Row) =>
  row.verdict === "remove" || row.name !== undefined || row.countries !== undefined
let targets = 0
let missing = 0
let coveredBatches = 0
const zeroTargetBatches: string[] = []
for (const batch of batches) {
  const file = `packages/world-dishes/review/verdicts/${batch}.jsonl`
  const before = git("show", `${baseline}:${file}`)
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as Row)
  // Freeze this historical original-input audit before the separate country-completeness pass.
  const after = git("show", `a1898bb:${file}`)
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as Row)
  const required = new Set(before.filter(flagged).map((row) => row.id))
  after.forEach((row, index) => {
    if (flagged(row) || JSON.stringify(row) !== JSON.stringify(before[index])) required.add(row.id)
  })
  targets += required.size
  const absent = [...required].filter((id) => !hasRecordedId(id))
  missing += absent.length
  if (absent.length)
    console.log(
      `${batch}: ${absent.length}/${required.size} missing ledger IDs: ${absent.join(", ")}`,
    )
  if (required.size === 0) zeroTargetBatches.push(batch)
  else if (absent.length === 0) coveredBatches++
}
console.log(
  `${batches.length} recovered original batches; ${targets} target IDs; ${missing} absent from original audit ledgers.`,
)
console.log(
  `Baseline ${baseline}; targets include baseline flags plus current flags and changed rows.`,
)
console.log(
  `${coveredBatches} batches have every target ID recorded; ${zeroTargetBatches.length} zero-target batches: ${zeroTargetBatches.join(", ")}`,
)
console.log(
  "This checks recorded ID inventory only; final reviewer reports establish manual completion; it does not judge dishes or verify the quality of manual reading.",
)
process.exitCode = missing ? 1 : 0
