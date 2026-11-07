import type { Base, Form } from "./categories"

export type { Base, Form }

/**
 * What each dish looks like, how it's made step by step, and what it tastes of beyond the basic
 * tastes. These drive the two kinds of similar dishes:
 *
 * - "Made the same way": dishes that look alike on the table and go through similar steps.
 * - "Tastes alike": dishes whose basic tastes (sweet, salty, sour, bitter, umami, heat, numbing)
 *   activate alike, with shared flavor notes (soy, chili, sesame…) as a secondary signal.
 */

/** The steps that define how a dish is made, in order. */
export type Step =
  | "make-dough"
  | "make-batter"
  | "marinate"
  | "soak"
  | "boil"
  | "simmer"
  | "braise"
  | "stir-fry"
  | "deep-fry"
  | "pan-fry"
  | "griddle"
  | "steam"
  | "bake"
  | "roast"
  | "smoke"
  | "grill"
  | "fill"
  | "wrap"
  | "fold"
  | "toss"
  | "top"
  | "assemble"
  | "chill"
  | "pound"
  | "coat"
  | "glaze"
  | "thicken"
  | "caramelize"
  | "slice"
  | "cook-at-table"
  | "proof"
  | "whip"
  | "blend"
  | "shape"
  | "invert"
  | "drain"
  | "toast"
  | "roll-out"
  | "grate"
  | "make-mixture"
  | "pop"
  | "mash"
  | "layer"
  | "make-roux"
  | "pickle"
  | "clarify"
  | "laminate"
  | "cure"
  | "confit"
  | "microwave"
  | "emulsify"
  | "ferment"
  | "freeze"
  | "grind"
  | "whisk"
  | "poach"
  | "reduce"
  | "crisp"
  | "mince"
  | "crack"
  | "set"
  | "flambe"
  | "hot-oil-finish"
  | "scramble"

/** Flavors that come from specific ingredients or cooking, beyond the basic tastes. */
export type Note =
  | "soy"
  | "chili"
  | "garlic"
  | "ginger"
  | "scallion"
  | "sesame"
  | "sichuan-pepper"
  | "vinegar"
  | "sweet-glaze"
  | "star-anise"
  | "wok-hei"
  | "smoke"
  | "charred"
  | "cheese"
  | "butter"
  | "cream"
  | "tomato"
  | "pork-fat"
  | "fermented-bean"
  | "seafood"
  | "citrus"
  | "herbs"
  | "cumin"
  | "mustard"
  | "black-pepper"
  | "peanut"
  | "chocolate"
  | "warm-spice"
  | "fruit"
  | "corn"
  | "fried-crust"
  | "rice-wine"
  | "bread"
  | "broth"
  | "pickle"
  | "egg"
  | "funk"
  | "coffee"
  | "vanilla"
  | "caramel"
  | "olive-oil"
  | "cucumber"
  | "wine"
  | "roasted-pepper"
  | "whole-wheat"
  | "paprika"
  | "yogurt"
  | "saffron"
  | "olive"
  | "caper"
  | "walnut"
  | "mushroom"
  | "cherry"
  | "shallot"
  | "seaweed"
  | "wheat"
  | "onion"
  | "caraway"
  | "buckwheat"
  | "coconut"
  | "galangal"
  | "leek"
  | "anise"
  | "nuts"
  | "molasses"
  | "beer"
  | "carrot"
  | "spirits"
  | "yeast"
  | "mayonnaise"
  | "honey"
  | "red-bean"
  | "juniper"
  | "almond"
  | "rum"
  | "poppy-seed"
  | "offal"
  | "orange-blossom"
  | "alkaline"
  | "rhubarb"
  | "milk"
  | "sourdough"
  | "ginseng"
  | "toasted-grain"
  | "tea"
  | "brown-sugar"
  | "sherry"
  | "rosewater"
  | "white-pepper"
  | "palm-oil"

export type Profile = {
  form: Form
  /** The main ingredient(s) the dish is built on. For noodle dishes, only the noodle. */
  base: Base[]
  steps: Step[]
  notes: Note[]
}

export const profiles: Record<string, Profile> = {
  // United States
  hamburger: {
    form: "sandwich",
    base: ["beef", "bread"],
    steps: ["grill", "assemble"],
    notes: ["charred", "cheese", "bread", "pickle", "mustard"],
  },
  "hot-dog": {
    form: "sandwich",
    base: ["sausage", "bread"],
    steps: ["boil", "grill", "assemble"],
    notes: ["mustard", "pickle", "bread", "smoke"],
  },
  "buffalo-wings": {
    form: "fried-pieces",
    base: ["chicken"],
    steps: ["deep-fry", "toss"],
    notes: ["chili", "vinegar", "butter", "fried-crust"],
  },
  "new-england-clam-chowder": {
    form: "creamy-soup",
    base: ["shellfish", "potato"],
    steps: ["simmer", "thicken"],
    notes: ["seafood", "cream", "pork-fat", "herbs"],
  },
  gumbo: {
    form: "thick-stew",
    base: ["shellfish", "sausage"],
    steps: ["thicken", "simmer"],
    notes: ["smoke", "herbs", "chili", "seafood", "broth"],
  },
  jambalaya: {
    form: "mixed-rice",
    base: ["rice", "sausage"],
    steps: ["pan-fry", "simmer"],
    notes: ["smoke", "chili", "tomato", "herbs"],
  },
  "texas-brisket": {
    form: "roast-sliced",
    base: ["beef"],
    steps: ["smoke", "slice"],
    notes: ["smoke", "black-pepper", "charred"],
  },
  "deep-dish-pizza": {
    form: "topped-flatbread",
    base: ["bread", "cheese"],
    steps: ["make-dough", "fill", "top", "bake"],
    notes: ["cheese", "tomato", "butter", "bread"],
  },
  "new-york-pizza": {
    form: "topped-flatbread",
    base: ["bread", "cheese"],
    steps: ["make-dough", "top", "bake"],
    notes: ["cheese", "tomato", "bread", "charred"],
  },
  "philly-cheesesteak": {
    form: "sandwich",
    base: ["beef", "bread"],
    steps: ["griddle", "assemble"],
    notes: ["cheese", "bread", "charred"],
  },
  "macaroni-and-cheese": {
    form: "noodle-casserole",
    base: ["pasta"],
    steps: ["boil", "thicken", "bake"],
    notes: ["cheese", "butter", "cream"],
  },
  "southern-fried-chicken": {
    form: "fried-pieces",
    base: ["chicken"],
    steps: ["marinate", "coat", "deep-fry"],
    notes: ["fried-crust", "black-pepper"],
  },
  "biscuits-and-gravy": {
    form: "quick-bread",
    base: ["bread", "pork"],
    steps: ["make-dough", "bake", "thicken", "top"],
    notes: ["butter", "cream", "black-pepper", "pork-fat", "bread"],
  },
  "shrimp-and-grits": {
    form: "porridge",
    base: ["shellfish", "corn"],
    steps: ["simmer", "pan-fry", "top"],
    notes: ["seafood", "butter", "cheese", "corn"],
  },
  "lobster-roll": {
    form: "sandwich",
    base: ["shellfish", "bread"],
    steps: ["boil", "toss", "assemble"],
    notes: ["seafood", "butter", "bread", "citrus"],
  },
  "apple-pie": {
    form: "pie",
    base: ["pastry", "fruit"],
    steps: ["make-dough", "fill", "bake"],
    notes: ["fruit", "warm-spice", "butter"],
  },
  "key-lime-pie": {
    form: "pie",
    base: ["fruit", "dairy"],
    steps: ["fill", "bake", "chill"],
    notes: ["citrus", "cream"],
  },
  "chili-con-carne": {
    form: "thick-stew",
    base: ["beef", "beans"],
    steps: ["pan-fry", "simmer"],
    notes: ["chili", "cumin", "tomato", "garlic"],
  },
  cornbread: {
    form: "quick-bread",
    base: ["corn"],
    steps: ["make-batter", "bake"],
    notes: ["corn", "butter"],
  },
  poke: {
    form: "raw-cubes",
    base: ["fish"],
    steps: ["slice", "marinate", "toss"],
    notes: ["soy", "sesame", "seafood", "scallion"],
  },
  "chop-suey": {
    form: "stir-fried-pieces",
    base: ["pork", "vegetable"],
    steps: ["stir-fry", "thicken"],
    notes: ["soy", "wok-hei", "garlic"],
  },
  "general-tsos-chicken": {
    form: "fried-pieces",
    base: ["chicken"],
    steps: ["coat", "deep-fry", "glaze"],
    notes: ["sweet-glaze", "chili", "soy", "vinegar", "fried-crust", "ginger"],
  },
  tamale: {
    form: "leaf-parcel",
    base: ["corn", "pork"],
    steps: ["make-dough", "fill", "wrap", "steam"],
    notes: ["corn", "chili", "pork-fat"],
  },

  // Michigan
  "detroit-style-pizza": {
    form: "topped-flatbread",
    base: ["bread", "cheese"],
    steps: ["make-dough", "top", "bake"],
    notes: ["cheese", "tomato", "bread", "charred"],
  },
  "mackinac-fudge": {
    form: "confection",
    base: ["chocolate", "sugar"],
    steps: ["boil", "caramelize", "chill"],
    notes: ["chocolate", "butter", "cream"],
  },
  "coney-dog": {
    form: "sandwich",
    base: ["sausage", "bread"],
    steps: ["grill", "simmer", "assemble"],
    notes: ["chili", "cumin", "mustard", "bread"],
  },
  pasty: {
    form: "hand-pie",
    base: ["pastry", "beef", "potato"],
    steps: ["make-dough", "fill", "fold", "bake"],
    notes: ["black-pepper", "pork-fat", "bread"],
  },
  "tuna-noodle-casserole": {
    form: "noodle-casserole",
    base: ["egg-noodles"],
    steps: ["boil", "thicken", "bake"],
    notes: ["seafood", "cream", "cheese"],
  },
  "green-bean-casserole": {
    form: "casserole",
    base: ["green-beans"],
    steps: ["boil", "thicken", "top", "bake"],
    notes: ["cream", "fried-crust"],
  },

  // China
  "peking-duck": {
    form: "roast-sliced",
    base: ["duck"],
    steps: ["glaze", "roast", "slice", "wrap"],
    notes: ["sweet-glaze", "scallion", "fermented-bean", "charred"],
  },
  xiaolongbao: {
    form: "dumplings",
    base: ["dumpling-wrapper", "pork"],
    steps: ["make-dough", "fill", "fold", "steam"],
    notes: ["broth", "ginger", "rice-wine", "vinegar"],
  },
  jiaozi: {
    form: "dumplings",
    base: ["dumpling-wrapper", "pork"],
    steps: ["make-dough", "fill", "fold", "boil"],
    notes: ["ginger", "scallion", "vinegar", "soy"],
  },
  "char-siu": {
    form: "roast-sliced",
    base: ["pork"],
    steps: ["marinate", "roast", "glaze", "slice"],
    notes: ["sweet-glaze", "soy", "star-anise", "charred", "fermented-bean"],
  },
  "siu-mai": {
    form: "dumplings",
    base: ["dumpling-wrapper", "pork", "shellfish"],
    steps: ["fill", "fold", "steam"],
    notes: ["seafood", "soy", "sesame"],
  },
  "lanzhou-beef-noodles": {
    form: "noodle-soup",
    base: ["hand-pulled-noodles"],
    steps: ["simmer", "make-dough", "boil", "assemble"],
    notes: ["broth", "chili", "herbs", "star-anise"],
  },
  roujiamo: {
    form: "sandwich",
    base: ["bread", "pork"],
    steps: ["braise", "make-dough", "griddle", "assemble"],
    notes: ["star-anise", "soy", "pork-fat", "bread"],
  },
  "red-braised-pork": {
    form: "braised-chunks",
    base: ["pork"],
    steps: ["boil", "caramelize", "braise"],
    notes: ["soy", "sweet-glaze", "star-anise", "rice-wine", "pork-fat"],
  },
  "sweet-and-sour-pork": {
    form: "fried-pieces",
    base: ["pork"],
    steps: ["coat", "deep-fry", "stir-fry", "glaze"],
    notes: ["sweet-glaze", "vinegar", "fruit", "fried-crust", "tomato"],
  },
  mooncake: {
    form: "filled-pastry",
    base: ["pastry", "sugar"],
    steps: ["make-dough", "fill", "bake"],
    notes: ["egg", "fruit"],
  },
  tangyuan: {
    form: "sweet-balls",
    base: ["sticky-rice", "sugar"],
    steps: ["make-dough", "fill", "boil"],
    notes: ["sesame", "ginger"],
  },
  congee: { form: "porridge", base: ["rice"], steps: ["simmer"], notes: ["ginger", "scallion"] },
  jianbing: {
    form: "crepe",
    base: ["wheat", "egg"],
    steps: ["make-batter", "griddle", "fill", "fold"],
    notes: ["egg", "fermented-bean", "scallion", "chili", "fried-crust"],
  },
  "yangzhou-fried-rice": {
    form: "fried-rice",
    base: ["rice", "egg"],
    steps: ["boil", "stir-fry"],
    notes: ["egg", "wok-hei", "seafood", "scallion"],
  },
  "stinky-tofu": {
    form: "fried-pieces",
    base: ["tofu"],
    steps: ["deep-fry", "top"],
    notes: ["funk", "chili", "garlic", "pickle", "fried-crust"],
  },
  wonton: {
    form: "dumplings",
    base: ["dumpling-wrapper", "pork"],
    steps: ["fill", "fold", "boil"],
    notes: ["broth", "seafood", "ginger", "sesame"],
  },
  "egg-tart": {
    form: "tart",
    base: ["pastry", "egg"],
    steps: ["make-dough", "fill", "bake"],
    notes: ["egg", "butter", "cream"],
  },
  mochi: {
    form: "rice-cake",
    base: ["sticky-rice"],
    steps: ["steam", "pound", "fill"],
    notes: ["peanut"],
  },

  // Wuhan, Hubei
  "hot-dry-noodles": {
    form: "dry-noodles",
    base: ["alkaline-noodles"],
    steps: ["boil", "toss"],
    notes: ["sesame", "soy", "chili", "pickle", "scallion"],
  },
  "lotus-root-pork-rib-soup": {
    form: "clear-soup",
    base: ["pork", "lotus-root"],
    steps: ["boil", "simmer"],
    notes: ["broth", "ginger", "pork-fat"],
  },
  doupi: {
    form: "crepe",
    base: ["sticky-rice", "egg"],
    steps: ["steam", "make-batter", "griddle", "fold", "pan-fry"],
    notes: ["egg", "soy", "pork-fat", "fried-crust"],
  },
  "wuchang-fish": {
    form: "whole-fish",
    base: ["fish"],
    steps: ["steam", "top"],
    notes: ["seafood", "ginger", "scallion", "soy"],
  },
  "spicy-duck-neck": {
    form: "braised-chunks",
    base: ["duck"],
    steps: ["marinate", "braise", "chill"],
    notes: ["chili", "sichuan-pepper", "star-anise", "soy", "sweet-glaze"],
  },

  // Sichuan and Chongqing
  "mapo-tofu": {
    form: "pieces-in-sauce",
    base: ["tofu"],
    steps: ["pan-fry", "braise", "thicken"],
    notes: ["chili", "sichuan-pepper", "fermented-bean", "garlic"],
  },
  "kung-pao-chicken": {
    form: "stir-fried-pieces",
    base: ["chicken"],
    steps: ["marinate", "stir-fry", "glaze"],
    notes: ["chili", "sichuan-pepper", "peanut", "vinegar", "sweet-glaze", "wok-hei"],
  },
  "dan-dan-noodles": {
    form: "dry-noodles",
    base: ["wheat-noodles"],
    steps: ["pan-fry", "boil", "toss"],
    notes: ["chili", "sichuan-pepper", "sesame", "pickle", "soy"],
  },
  "chongqing-hot-pot": {
    form: "hot-pot",
    base: ["beef", "offal"],
    steps: ["simmer", "cook-at-table"],
    notes: ["chili", "sichuan-pepper", "fermented-bean", "broth", "garlic"],
  },
  "twice-cooked-pork": {
    form: "stir-fried-pieces",
    base: ["pork"],
    steps: ["boil", "slice", "stir-fry"],
    notes: ["fermented-bean", "chili", "pork-fat", "garlic", "wok-hei"],
  },
  "fuqi-feipian": {
    form: "cold-sliced",
    base: ["beef", "offal"],
    steps: ["simmer", "slice", "chill", "toss"],
    notes: ["chili", "sichuan-pepper", "peanut", "soy", "herbs"],
  },

  // Shangrao and Jiangxi
  "shangrao-chao-fen": {
    form: "fried-noodles",
    base: ["round-rice-noodles"],
    steps: ["soak", "stir-fry"],
    notes: ["chili", "soy", "garlic", "wok-hei", "pork-fat"],
  },
  "nanchang-rice-noodles": {
    form: "dry-noodles",
    base: ["round-rice-noodles"],
    steps: ["boil", "toss"],
    notes: ["chili", "soy", "pickle", "peanut", "scallion"],
  },
  "nanchang-clay-pot-soup": {
    form: "clear-soup",
    base: ["pork"],
    steps: ["simmer", "steam"],
    notes: ["broth", "ginger", "fruit"],
  },
  "braised-pomelo-peel": {
    form: "braised-chunks",
    base: ["citrus-peel"],
    steps: ["boil", "soak", "braise"],
    notes: ["soy", "chili", "garlic", "seafood", "pork-fat"],
  },
  zongzi: {
    form: "leaf-parcel",
    base: ["sticky-rice", "pork"],
    steps: ["soak", "fill", "wrap", "boil"],
    notes: ["soy", "pork-fat", "egg", "rice-wine"],
  },
}
