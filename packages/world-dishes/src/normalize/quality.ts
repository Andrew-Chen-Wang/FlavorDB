import type { WorldDish, WorldRecipe } from "../types"
import { isDrink } from "./kinds"
import { nameKey } from "./merge"

/** Wiki markup that survived parsing: template braces, table syntax, bold quotes, HTML. */
const LEFTOVER_MARKUP = /\{\{|\}\}|\[\[|\]\]|'''|<\/?[a-z][^>]*>|__[A-Z]+__/g
const TABLE_LINE = /^(\{\||\|-|\|\}|!)/

/** A "step" that's only a cooking time, such as "45 - 60 min" or "2 Std." */
const TIME_ONLY =
  /^\s*(ca\.?\s*)?\d+([.,]\d+)?\s*([-–]\s*\d+([.,]\d+)?\s*)?(min|mins|minutes|minuten|minutos|minuti|perc|h|hrs?|hours?|std\.?|stunden|horas|ore|óra|分|分钟|分鐘|小时|時間)\.?\s*$/i

export function cleanText(text: string): string {
  return text.replaceAll(LEFTOVER_MARKUP, "").replaceAll(/\s+/g, " ").trim()
}

/** Removes markup and empty, time-only and repeated lines. Drops the recipe if nothing usable is left. */
export function cleanRecipe(recipe: WorldRecipe): WorldRecipe | undefined {
  // A "step" that repeats an ingredient line means the parser read the ingredient list twice.
  const ingredientLines = new Set(recipe.ingredients.map((i) => cleanText(i.item)))
  const steps: string[] = []
  for (const raw of recipe.steps) {
    if (TABLE_LINE.test(raw.trim())) continue
    const step = cleanText(raw)
    if (!step || TIME_ONLY.test(step) || steps.at(-1) === step || ingredientLines.has(step))
      continue
    steps.push(step)
  }
  const ingredients = recipe.ingredients
    .filter((i) => !TABLE_LINE.test(i.item.trim()))
    .map((i) => ({ ...i, item: cleanText(i.item) }))
    .filter((i) => i.item)
  if (steps.length === 0 || ingredients.length === 0) return undefined
  return { ...recipe, steps, ingredients }
}

/** Fast-food chains and packaged-food brands whose menu items and products Wikidata lists as foods. */
const CHAIN =
  /\b(mcdonald'?s|mcmuffin|mcplant|mcmelt|mcchicken|mcflurry|mcnuggets?|mcrib|mcdouble|mcspicy|big mac|burger king|whopper|kfc|kentucky fried|sugakiya|nissin|mos burger|lotteria|starbucks|subway|domino'?s|pizza hut|wendy'?s|taco bell|dunkin|krispy kreme|yoshinoya|sukiya|matsuya|coco ichibanya|chick-fil-a|popeyes|arby'?s|carl'?s jr|hardee'?s|jollibee|tim hortons|heinz|kraft|kellogg'?s|nestl[ée]|lay'?s|doritos|oreo|cadbury|hershey'?s|ferrero|kinder|haribo|lindt|glico|calbee|cup noodles?|maruchan|nongshim|pringles)\b/i

/** Wiki page titles that ended up as names: category, template and archive pages. */
const NON_DISH_PAGE =
  /^(category|kategorie|catégorie|categoría|kategoria|archive|template|vorlage|modèle|plantilla|file|datei):/i
/** Prefixes on otherwise good names, from items about cookbook pages. */
const COOKBOOK_PREFIX = /^(cookbook|resept|recipe|receta|recette|rezept|ricetta):\s*/i

/** Category items such as "tomato dish" or "Indian cuisine": groupings, not dishes. */
const GENERIC =
  /^([\p{L}'-]+\s){0,2}(dish|dishes|cuisine|foods?|meals?|specialt(y|ies)|recipes?)$/iu
const GENERIC_ALLOWED = new Set(["hot dish", "hotdish", "soul food", "comfort food", "street food"])

export type Rejection =
  | "brand or chain product"
  | "wiki page, not a dish"
  | "category, not a dish"
  | "caption or description, not a name"
  | "drink, not a dish"

/**
 * Real dishes that Wikidata gives a manufacturer, brand or owner anyway (a protected-origin cheese
 * owned by its consortium, a dish named after a maker). Found by reading every branded item that has
 * a Wikipedia article.
 */
const NOT_A_BRAND = new Set([
  "Q1240158", // Langres cheese
  "Q3531223", // Fresh Tomme
  "Q152526", // Berliner
  "Q867610", // Dundee cake
  "Q29933566", // Long egg
  "Q6894609", // Moin moin
  "Q17064676", // Popcorn chicken
  "Q842618", // Worcestershire sauce
])

/** Why a dish should be left out, or undefined if it's fine. Fixes cookbook prefixes in place. */
export function rejectDish(dish: WorldDish, branded: ReadonlySet<string>): Rejection | undefined {
  if (
    (branded.has(dish.id) && !NOT_A_BRAND.has(dish.id)) ||
    CHAIN.test(dish.name) ||
    CHAIN.test(dish.description ?? "")
  )
    return "brand or chain product"
  if (NON_DISH_PAGE.test(dish.name)) return "wiki page, not a dish"
  // HowToCook files drinks under "drink"; Wikidata drinks are already left out by type.
  if (dish.kinds.length > 0 && dish.kinds.every((k) => isDrink(k))) return "drink, not a dish"
  dish.name = dish.name.replace(COOKBOOK_PREFIX, "")
  if (
    dish.recipes.length === 0 &&
    GENERIC.test(dish.name) &&
    !GENERIC_ALLOWED.has(dish.name.toLowerCase())
  ) {
    return "category, not a dish"
  }
  // Names this long are photo captions, museum labels or trade classifications.
  if (
    dish.name.length > 60 &&
    dish.recipes.length === 0 &&
    Object.keys(dish.wikipedia).length === 0
  ) {
    return "caption or description, not a name"
  }
  if (dish.description && dish.description.trim().toLowerCase() === dish.name.toLowerCase())
    delete dish.description
  return undefined
}

const union = <T>(a: T[], b: T[]) => [...new Set([...a, ...b])]

/**
 * Wikidata sometimes has two items for one dish (two "feijoada"s). Folds same-named dishes together
 * when nothing says they're different: their countries overlap or one has none, and so do their kinds.
 */
export function mergeDuplicates(dishes: WorldDish[]): { dishes: WorldDish[]; merged: number } {
  const groups = new Map<string, WorldDish[]>()
  for (const d of dishes) {
    const key = nameKey(d.name)
    groups.set(key, [...(groups.get(key) ?? []), d])
  }
  const out: WorldDish[] = []
  let merged = 0
  for (const group of groups.values()) {
    // Richest first: it keeps its id.
    const sorted = group.toSorted(
      (a, b) =>
        b.recipes.length - a.recipes.length ||
        Object.keys(b.wikipedia).length - Object.keys(a.wikipedia).length ||
        b.ingredients.length - a.ingredients.length ||
        a.id.localeCompare(b.id),
    )
    const kept: WorldDish[] = []
    for (const d of sorted) {
      const target = kept.find(
        (k) =>
          (k.countries.length === 0 ||
            d.countries.length === 0 ||
            k.countries.some((c) => d.countries.includes(c))) &&
          (k.kinds.length === 0 ||
            d.kinds.length === 0 ||
            k.kinds.some((x) => d.kinds.includes(x))),
      )
      if (!target) {
        kept.push(d)
        continue
      }
      merged++
      target.countries = union(target.countries, d.countries).toSorted()
      target.cuisines = union(target.cuisines, d.cuisines)
      target.kinds = union(target.kinds, d.kinds)
      target.ingredients = target.ingredients.length ? target.ingredients : d.ingredients
      target.names = { ...d.names, ...target.names }
      target.wikipedia = { ...d.wikipedia, ...target.wikipedia }
      target.description ??= d.description
      target.image ??= d.image
      target.recipes.push(...d.recipes)
      target.sources.push(...d.sources)
    }
    out.push(...kept)
  }
  return { dishes: out, merged }
}

export type Review = {
  dishes: WorldDish[]
  rejected: Map<Rejection, WorldDish[]>
  recipesDropped: number
  recipesCleaned: number
  merged: number
}

/** Runs every check over every dish. */
export function reviewDishes(input: WorldDish[], branded: ReadonlySet<string>): Review {
  const rejected = new Map<Rejection, WorldDish[]>()
  let recipesDropped = 0
  let recipesCleaned = 0
  const kept: WorldDish[] = []
  for (const dish of input) {
    const recipes: WorldRecipe[] = []
    for (const r of dish.recipes) {
      const cleaned = cleanRecipe(r)
      if (!cleaned) recipesDropped++
      else {
        if (
          cleaned.steps.length !== r.steps.length ||
          cleaned.steps.some((s, i) => s !== r.steps[i])
        )
          recipesCleaned++
        recipes.push(cleaned)
      }
    }
    dish.recipes = recipes
    const reason = rejectDish(dish, branded)
    if (reason) rejected.set(reason, [...(rejected.get(reason) ?? []), dish])
    else kept.push(dish)
  }
  const { dishes, merged } = mergeDuplicates(kept)
  return { dishes, rejected, recipesDropped, recipesCleaned, merged }
}
