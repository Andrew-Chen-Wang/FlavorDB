import { execFileSync } from "node:child_process"
import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

// Use the pre-review tracked data so this still works after applying verdicts.
const review = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(review, "../../..")
const baseline = process.argv[2] ?? "9333faf"
const git = (...args: string[]) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 128 * 1024 * 1024 })
const files = git("ls-tree", "-r", "--name-only", baseline, "packages/world-dishes/data")
  .trim()
  .split("\n")
  .filter((file) => /\/dishes-\d+\.jsonl$/.test(file))
  .toSorted()
if (!files.length) throw new Error(`No dish data found in baseline ${baseline}`)
const expected: Record<string, string[]> = { names: [], r: [] }
for (const file of files) {
  for (const line of git("show", `${baseline}:${file}`).trim().split("\n")) {
    const dish = JSON.parse(line) as { id: string; recipes: unknown[] }
    expected[dish.recipes.length ? "r" : "names"].push(dish.id)
  }
}
const actual: Record<string, { id: string; file: string; line: number }[]> = { names: [], r: [] }
for (const file of readdirSync(path.join(review, "verdicts")).toSorted()) {
  const match = /^(names|r)-\d+\.jsonl$/.exec(file)
  if (!match) continue
  const group = match[1]
  readFileSync(path.join(review, "verdicts", file), "utf8")
    .trimEnd()
    .split("\n")
    .forEach((line, index) => {
      const row = JSON.parse(line) as { id: string }
      actual[group].push({ id: row.id, file, line: index + 1 })
    })
}
function canonical(id: string, file: string): string {
  if (file === "r-225.jsonl" && id === "wikibooks-hu:libatepertő-1")
    return "wikibooks-hu:libatepertő"
  if (id.startsWith("howtocook:")) {
    const parts = id.split(":")
    if (parts.length >= 4 && parts.at(-1) === parts.at(-2)) parts.pop()
    return parts.join(":")
  }
  return id
}
let errors = 0
for (const group of ["names", "r"]) {
  const wanted = expected[group]
  const rows = actual[group]
  const counts = new Map<string, number>()
  for (const row of rows) {
    const id = canonical(row.id, row.file)
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }
  const expectedSet = new Set(wanted.map((id) => canonical(id, "")))
  const missing = [...expectedSet].filter((id) => !counts.has(id))
  const unexpected = [...counts.keys()].filter((id) => !expectedSet.has(id))
  const duplicates = [...counts].filter(([, count]) => count !== 1)
  let positional = 0
  const examples: string[] = []
  for (let index = 0; index < Math.max(wanted.length, rows.length); index++) {
    const row = rows[index]
    if (row && canonical(row.id, row.file) === canonical(wanted[index] ?? "", "")) continue
    positional++
    if (examples.length < 10)
      examples.push(
        `${row ? `${row.file}:${row.line}` : "missing row"}: expected ${wanted[index] ?? "end"}, found ${row?.id ?? "end"}`,
      )
  }
  console.log(
    `${group}: ${rows.length}/${wanted.length} baseline dishes; ${missing.length} missing, ${unexpected.length} unexpected, ${duplicates.length} duplicate IDs, ${positional} global positional mismatches.`,
  )
  for (const id of missing.slice(0, 10)) console.error(`Missing: ${id}`)
  for (const id of unexpected.slice(0, 10)) console.error(`Unexpected: ${id}`)
  for (const [id, count] of duplicates.slice(0, 10)) console.error(`Duplicate: ${id} (${count})`)
  for (const example of examples) console.error(example)
  errors += missing.length + unexpected.length + duplicates.length + positional
}
console.log(
  `Baseline ${baseline}: independent global data coverage/order only. Original recipe batch boundaries and absent raw sources are not reconstructed or validated.`,
)
process.exitCode = errors ? 1 : 0
