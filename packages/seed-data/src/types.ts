/** A place a dish belongs to. Countries, regions within them, and cities all live here. */
export type Place = {
  id: string
  name: string
  /** ISO 3166-1 alpha-2 code of the country or territory the place is in */
  country: string
  kind: "country" | "region" | "city"
  lat: number
  lng: number
}

export type IngredientCategory =
  | "protein"
  | "seafood"
  | "vegetable"
  | "fruit"
  | "grain"
  | "dairy"
  | "legume"
  | "spice"
  | "herb"
  | "sauce"
  | "fat"
  | "sweetener"
  | "other"

export type Ingredient = {
  id: string
  name: string
  category: IngredientCategory
  /** Other names, such as the name in the language of the places it is used most */
  aliases?: string[]
}

/** 0 = absent, 5 = dominant */
export type FlavorProfile = {
  sweet: number
  salty: number
  sour: number
  bitter: number
  umami: number
  spicy: number
  numbing: number
  smoky: number
  rich: number
}

/**
 * The basic way a dish is made, independent of flavor. Dishes sharing several of these
 * are linked as "made the same way", like the tamale and zongzi (wrapped + leaf + steamed).
 */
export type Technique =
  | "wrapped"
  | "leaf-wrapped"
  | "stuffed"
  | "dumpling"
  | "noodles"
  | "hand-pulled"
  | "soup"
  | "stew"
  | "braised"
  | "red-braised"
  | "roasted"
  | "barbecued"
  | "smoked"
  | "grilled"
  | "deep-fried"
  | "pan-fried"
  | "stir-fried"
  | "steamed"
  | "boiled"
  | "baked"
  | "raw"
  | "cured"
  | "fermented"
  | "sandwich"
  | "flatbread"
  | "pastry"
  | "pie"
  | "rice"
  | "porridge"
  | "batter"
  | "roux"
  | "sauced"
  | "communal"
  | "street-food"
  | "confection"

export type DishCategory =
  | "main"
  | "soup"
  | "noodles"
  | "dumplings"
  | "street food"
  | "bread"
  | "dessert"
  | "snack"
  | "breakfast"
  | "side"
  | "rice"

export type DishPlace = {
  placeId: string
  /** Why the dish belongs here, e.g. "Claimed birthplace" or "Popular since the 1950s" */
  note?: string
}

export type Variation = {
  name: string
  localName?: string
  placeId: string
  description: string
}

export type RecipeIngredient = {
  ingredientId: string
  amount: string
  note?: string
}

export type Recipe = {
  title: string
  serves: number
  /** Total time in minutes */
  minutes: number
  ingredients: RecipeIngredient[]
  steps: string[]
}

export type Dish = {
  slug: string
  name: string
  /** Name in the local language and script, when it differs from the English name */
  localName?: string
  category: DishCategory
  summary: string
  history: string[]
  /** Every place the dish belongs to. Order carries no meaning: Flavor DB doesn't rank origin claims. */
  places: DishPlace[]
  variations: Variation[]
  /** Ingredient IDs. Always present, even when there is no recipe. */
  ingredients: string[]
  recipes: Recipe[]
  flavor: FlavorProfile
  techniques: Technique[]
}
