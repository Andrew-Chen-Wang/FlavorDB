import { createHash } from "node:crypto"
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import path from "node:path"
import { DEFAULT_DATA_DIR, loadWorldDishes } from "../index"
import { applyVerdicts, loadVerdicts, REVIEW_DIR, verdictReport } from "./review"

const dataDir = DEFAULT_DATA_DIR
const verdictFiles = readdirSync(path.join(REVIEW_DIR, "verdicts"))
  .filter((f) => f.endsWith(".jsonl"))
  .toSorted()
const digest = (text: string) => createHash("sha256").update(text).digest("hex")
const verdictHash = digest(
  verdictFiles
    .map((file) => `${file}\n${readFileSync(path.join(REVIEW_DIR, "verdicts", file), "utf8")}`)
    .join("\n"),
)
const input = loadWorldDishes(dataDir)
const dataHash = (dishes: typeof input) =>
  digest(dishes.map((dish) => JSON.stringify(dish)).join("\n"))
const receiptPath = path.join(dataDir, "review-application.json")
if (existsSync(receiptPath)) {
  const receipt = JSON.parse(readFileSync(receiptPath, "utf8")) as {
    verdictHash: string
    outputHash: string
  }
  if (receipt.verdictHash === verdictHash && receipt.outputHash === dataHash(input)) {
    console.log(
      "These verdicts are already applied to these data shards; counts and files are unchanged.",
    )
    process.exit(0)
  }
  throw new Error(
    "Data or verdicts changed after the previous review application. Restore the original shards and reports before applying revised verdicts, or rebuild from the fetch cache.",
  )
}
const verdicts = loadVerdicts(input)
const { dishes, counts } = applyVerdicts(input, verdicts)
const section = verdictReport(
  counts,
  verdicts,
  "Applied directly to the checked-in data shards with `pnpm run review:apply`; `build-data` was not run for this application.",
)
const stripSection = (text: string) => text.split("## Per-dish review applied")[0].trimEnd()
const review = `${stripSection(readFileSync(path.join(dataDir, "REVIEW.md"), "utf8"))}\n\n${section}`
let stats = stripSection(readFileSync(path.join(dataDir, "STATS.md"), "utf8"))
const countries = new Map<string, number>()
for (const dish of dishes)
  for (const country of dish.countries) countries.set(country, (countries.get(country) ?? 0) + 1)
const totals = new Map([
  ["Dishes and foods", dishes.length],
  ["…with at least one full recipe", dishes.filter((d) => d.recipes.length > 0).length],
  [
    "…with an ingredient list (recipe or not)",
    dishes.filter((d) => d.ingredients.length > 0).length,
  ],
  ["…tied to at least one country", dishes.filter((d) => d.countries.length > 0).length],
  [
    "…with a Chinese name",
    dishes.filter((d) => !!d.names.zh || /\p{Script=Han}/u.test(d.name)).length,
  ],
  ["Full recipes", dishes.reduce((n, d) => n + d.recipes.length, 0)],
  ["Countries and territories", countries.size],
])
stats = stats
  .split("\n")
  .map((line) => {
    const label = line.split("|")[1]?.trim()
    return label && totals.has(label) ? `| ${label} | ${totals.get(label)} |` : line
  })
  .join("\n")
stats =
  stats.split("## Top 40 countries")[0].trimEnd() +
  "\n\n## Top 40 countries\n\n| Country | Dishes |\n|---|---:|\n" +
  [...countries]
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([country, count]) => `| ${country} | ${count} |`)
    .join("\n") +
  `\n\n${section}`
// Parse, validate, and construct every output before replacing any shard.
for (let i = 0; i < dishes.length; i += 2500) {
  writeFileSync(
    path.join(dataDir, `dishes-${String(i / 2500).padStart(2, "0")}.jsonl`),
    `${dishes
      .slice(i, i + 2500)
      .map((d) => JSON.stringify(d))
      .join("\n")}\n`,
  )
}
const shardCount = Math.ceil(dishes.length / 2500)
for (const file of readdirSync(dataDir).filter((f) => /^dishes-\d+\.jsonl$/.test(f))) {
  if (Number(file.slice(7, -6)) >= shardCount) rmSync(path.join(dataDir, file))
}
writeFileSync(path.join(dataDir, "REVIEW.md"), review)
writeFileSync(path.join(dataDir, "STATS.md"), stats)
writeFileSync(
  receiptPath,
  `${JSON.stringify({ verdictHash, outputHash: dataHash(dishes), counts }, null, 2)}\n`,
)
console.log(section)
