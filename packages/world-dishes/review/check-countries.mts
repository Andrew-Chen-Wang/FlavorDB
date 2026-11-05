import { existsSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { equivalentReviewId } from "../src/normalize/review"

type Target = { batch: string; position: number; id: string }
type Decision = Target & { verdict: "keep" | "remove"; countries?: string[]; reason?: string }
type Snapshot = {
  baseline: string
  batches: Record<string, Omit<Target, "batch">[]>
  groups: Record<string, { batches: string[]; targets: number; extraTargets?: Target[] }>
}
const review = import.meta.dirname
const snapshot = JSON.parse(
  readFileSync(path.join(review, "country-targets.json"), "utf8"),
) as Snapshot
const dataOnly = process.argv.includes("--data")
const countries = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every((code) => typeof code === "string" && /^[A-Z]{2}$/.test(code)) &&
  new Set(value).size === value.length
const sameCountries = (a: string[] = [], b: string[] = []) =>
  a.length === b.length && a.toSorted().every((code, i) => code === b.toSorted()[i])
let errors = 0
const issue = (message: string) => {
  errors++
  if (errors <= 30) console.error(message)
}
function rows(file: string): unknown[] {
  const content = readFileSync(file, "utf8").trimEnd()
  if (!content) return []
  return content.split(/\r?\n/).map((line, index) => {
    try {
      return JSON.parse(line) as unknown
    } catch {
      issue(`${path.basename(file)}:${index + 1}: invalid JSON`)
      return null
    }
  })
}
if (dataOnly) {
  const data = path.join(review, "../data")
  let count = 0
  for (const file of readdirSync(data).filter((name) => /^dishes-\d+\.jsonl$/.test(name))) {
    for (const row of rows(path.join(data, file))) {
      const dish = row as { id?: string; countries?: unknown } | null
      count++
      if (!dish || !countries(dish.countries))
        issue(`${file}: ${dish?.id ?? "invalid dish"} lacks valid nonempty countries`)
    }
  }
  if (!count) issue("No applied dish rows found")
  console.log(`Applied dataset: ${count} dishes; ${errors} country errors.`)
} else {
  const verdicts = new Map<string, Decision[]>()
  const seenTargets = new Set<string>()
  let total = 0
  let firstTotal = 0
  let secondTotal = 0
  let firstComplete = 0
  let secondComplete = 0
  let unresolved = 0
  for (const [group, assignment] of Object.entries(snapshot.groups).toSorted(([a], [b]) =>
    a.localeCompare(b),
  )) {
    const expected = assignment.extraTargets ?? assignment.batches.flatMap((batch) =>
      (snapshot.batches[batch] ?? []).map((target) => ({ batch, ...target })),
    )
    total += expected.length
    if (expected.length !== assignment.targets)
      issue(
        `Group ${group}: snapshot count ${assignment.targets} differs from ${expected.length} targets`,
      )
    const decisions: Record<string, Map<string, Decision>> = {}
    const statuses: string[] = []
    for (const phase of ["first", "second"]) {
      const file = path.join(review, "audits", `countries-${phase}-${group}.jsonl`)
      const ledger = existsSync(file) ? rows(file) : []
      const byTarget = new Map<string, Decision>()
      let valid = true
      ledger.forEach((value, index) => {
        const row = value as Decision | null
        const target = expected[index]
        if (
          !row ||
          !target ||
          row.batch !== target.batch ||
          row.position !== target.position ||
          row.id !== target.id
        ) {
          issue(
            `${path.basename(file)}:${index + 1}: target ID/batch/position differs from snapshot order`,
          )
          valid = false
          return
        }
        const key = `${row.batch}:${row.position}`
        if (byTarget.has(key)) {
          issue(`${path.basename(file)}:${index + 1}: duplicate target`)
          valid = false
        }
        if (
          (row.verdict !== "keep" && row.verdict !== "remove") ||
          (row.verdict === "keep" && !countries(row.countries)) ||
          typeof row.reason !== "string" ||
          !row.reason.trim()
        ) {
          issue(
            `${path.basename(file)}:${index + 1}: decision needs keep/nonempty countries or remove, plus reason`,
          )
          valid = false
        }
        byTarget.set(key, row)
      })
      decisions[phase] = byTarget
      const complete = valid && ledger.length === expected.length
      statuses.push(
        `${phase} ${ledger.length}/${expected.length}${complete ? " complete" : ledger.length ? " partial" : " pending"}`,
      )
      if (phase === "first") {
        firstTotal += byTarget.size
        if (complete) firstComplete++
      } else {
        secondTotal += byTarget.size
        if (complete) secondComplete++
      }
    }
    for (const target of expected) {
      const key = `${target.batch}:${target.position}`
      if (seenTargets.has(key)) issue(`${key}: duplicate group assignment`)
      seenTargets.add(key)
      if (!verdicts.has(target.batch))
        verdicts.set(
          target.batch,
          rows(path.join(review, "verdicts", `${target.batch}.jsonl`)) as Decision[],
        )
      const verdict = verdicts.get(target.batch)![target.position - 1]
      if (!verdict || !equivalentReviewId(target.id, verdict.id, target.batch)) {
        issue(`${key}: current verdict does not match target ID`)
        continue
      }
      if (
        verdict.verdict === "keep"
          ? !countries(verdict.countries)
          : verdict.verdict !== "remove" || !verdict.reason?.trim()
      )
        unresolved++
      const final = decisions.second.get(key)
      if (
        final &&
        (final.verdict !== verdict.verdict ||
          (final.verdict === "keep" && !sameCountries(final.countries, verdict.countries)))
      )
        issue(`${key}: current verdict differs from second ledger final decision`)
    }
    console.log(`Group ${group}: ${statuses.join("; ")}`)
  }
  const snapshotTotal = Object.values(snapshot.batches).reduce((sum, list) => sum + list.length, 0)
  if (seenTargets.size !== snapshotTotal)
    issue(`Snapshot assignment covers ${seenTargets.size}/${snapshotTotal} targets`)
  console.log(
    `Baseline ${snapshot.baseline}: ${snapshotTotal} targets in ${Object.keys(snapshot.batches).length} batches; ${Object.keys(snapshot.groups).length} groups.`,
  )
  console.log(
    `First ledger coverage ${firstTotal}/${total}, ${firstComplete} groups complete; second ${secondTotal}/${total}, ${secondComplete} groups complete.`,
  )
  console.log(
    `Current target verdicts unresolved: ${unresolved}; structural/consistency errors: ${errors}.`,
  )
  if (
    firstComplete !== Object.keys(snapshot.groups).length ||
    secondComplete !== Object.keys(snapshot.groups).length ||
    unresolved
  )
    process.exitCode = 1
}
if (errors) process.exitCode = 1
