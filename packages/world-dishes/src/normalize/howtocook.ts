import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import type { WorldDish } from "../types"

const KINDS: Record<string, string> = {
  aquatic: "seafood",
  breakfast: "breakfast",
  condiment: "condiment",
  dessert: "dessert",
  drink: "drink",
  meat_dish: "meat dish",
  "semi-finished": "semi-prepared food",
  soup: "soup",
  staple: "staple",
  vegetable_dish: "vegetable dish",
}

/** HowToCook lists tools alongside ingredients; these aren't food. */
const TOOL =
  /(锅|刀|机|碗|盘|铲|筷|砧板|烤箱|微波炉|蒸笼|蒸架|保鲜膜|量杯|厨房秤|电子秤|模具|锡纸|油纸|吸油纸|勺子|汤勺|盆|漏勺|擀面杖|裱花袋|温度计|手套|容器|密封罐|瓶|杯)$/

/** "芝士片（可选）" → "芝士片" */
const cleanName = (s: string) =>
  s
    .replaceAll(/[（(][^）)]*[）)]/g, "")
    .replace(/[：:，,。].*$/, "")
    .trim()

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : name.endsWith(".md") ? [full] : []
  })
}

/** Lines of the markdown section whose heading includes `heading`, up to the next `##` heading. */
function section(lines: string[], heading: string): string[] {
  const start = lines.findIndex((l) => /^##\s/.test(l) && l.includes(heading))
  if (start === -1) return []
  const rest = lines.slice(start + 1)
  const end = rest.findIndex((l) => /^##\s/.test(l))
  return end === -1 ? rest : rest.slice(0, end)
}

const listItems = (lines: string[]) =>
  lines
    .map((l) => /^\s*(?:[-*+]|\d+[.)、])\s+(.*)$/.exec(l)?.[1]?.trim())
    .filter((l): l is string => !!l)
    .map((l) =>
      l
        .replaceAll(/\*\*|`/g, "")
        .replaceAll(/!\[[^\]]*\]\([^)]*\)/g, "")
        .trim(),
    )
    .filter(Boolean)

/** Parses one HowToCook recipe file. Returns undefined for files that aren't recipes. */
export function parseHowToCook(markdown: string, relPath: string): WorldDish | undefined {
  const lines = markdown.split(/\r?\n/)
  const title = lines
    .find((l) => /^#\s/.test(l))
    ?.replace(/^#\s+/, "")
    .trim()
  if (!title) return undefined
  const name = title.replace(/的(做法|制作方法|制作)$/, "").trim()
  const top = relPath.split("/")[0] ?? ""
  if (top === "template") return undefined

  const firstHeading = lines.findIndex((l) => /^##\s/.test(l))
  const intro = lines
    .slice(1, firstHeading === -1 ? undefined : firstHeading)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("!") && !l.startsWith("预估") && !l.startsWith(">"))
  const description = intro[0]

  const ingredientNames = [
    ...new Set(
      listItems(section(lines, "必备原料"))
        .map(cleanName)
        .filter((n) => n && !TOOL.test(n)),
    ),
  ]
  const amounts = listItems(section(lines, "计算"))
  const steps = listItems(section(lines, "操作"))
  if (steps.length === 0) return undefined

  const amountFor = new Map<string, string>()
  for (const line of amounts) {
    const m = /^(\S+?)\s+(.+)$/.exec(line)
    if (m?.[1] && m[2]) amountFor.set(cleanName(m[1]), m[2])
  }
  const ingredients = ingredientNames.map((item) => ({ item, amount: amountFor.get(item) }))

  const url = `https://github.com/Anduin2017/HowToCook/blob/master/dishes/${relPath}`
  const source = { name: "HowToCook", url, license: "Unlicense" } as const
  return {
    id: `howtocook:${relPath.replace(/\.md$/, "").replaceAll("/", ":")}`,
    name,
    names: { zh: name },
    description,
    countries: ["CN"],
    cuisines: ["Chinese cuisine"],
    kinds: [KINDS[top] ?? top],
    ingredients: ingredientNames,
    wikipedia: {},
    recipes: [
      {
        title: name,
        lang: "zh",
        ingredients: ingredients.map((i) =>
          i.amount ? { item: i.item, amount: i.amount } : { item: i.item },
        ),
        steps,
        source,
      },
    ],
    sources: [source],
  }
}

export function loadHowToCook(cacheDir: string): WorldDish[] {
  const root = path.join(cacheDir, "howtocook", "dishes")
  return walk(root).flatMap((file) => {
    const dish = parseHowToCook(
      readFileSync(file, "utf8"),
      path.relative(root, file).split(path.sep).join("/"),
    )
    return dish ? [dish] : []
  })
}
