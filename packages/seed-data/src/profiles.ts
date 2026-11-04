/**
 * What each dish looks like, how it's made step by step, and what it tastes of beyond the basic
 * tastes. These drive the two kinds of similar dishes:
 *
 * - "Made the same way": dishes that look alike on the table and go through similar steps.
 * - "Tastes alike": dishes whose basic tastes (sweet, salty, sour, bitter, umami, heat, numbing)
 *   activate alike, with shared flavor notes (soy, chili, sesame…) as a secondary signal.
 */

/** What you see when the dish is served. */
export type Form =
  | "dry-noodles" // noodles tossed in sauce, no broth
  | "fried-noodles" // noodles stir-fried with meat and vegetables
  | "noodle-soup"
  | "clear-soup" // broth with chunks in it
  | "creamy-soup"
  | "thick-stew" // spoonable stew, often over rice
  | "hot-pot" // a pot of broth at the table
  | "pieces-in-sauce" // bite-size pieces in a glossy sauce
  | "braised-chunks" // dark, glossy braised chunks
  | "fried-pieces" // crisp fried pieces, maybe glazed
  | "roast-sliced" // roasted or smoked meat, sliced
  | "whole-fish"
  | "cold-sliced" // thin slices dressed and served cold
  | "raw-cubes"
  | "mixed-rice" // rice cooked or fried with other things
  | "porridge"
  | "leaf-parcel" // filling wrapped in leaves or husks
  | "dumplings"
  | "sandwich" // filling inside bread or a bun
  | "hand-pie" // filling sealed in pastry
  | "topped-flatbread" // pizza and the like
  | "pie"
  | "tart"
  | "casserole" // baked in a dish, served by the spoonful
  | "quick-bread"
  | "crepe" // a thin griddled sheet, filled or layered
  | "sweet-balls"
  | "rice-cake"
  | "filled-pastry"
  | "confection"

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

export type Profile = { form: Form; steps: Step[]; notes: Note[] }

/** Forms that look related, for partial credit: a noodle soup looks more like dry noodles than a pie. */
export const FORM_FAMILIES: Form[][] = [
  ["dry-noodles", "fried-noodles", "noodle-soup"],
  ["clear-soup", "creamy-soup", "noodle-soup", "hot-pot", "thick-stew"],
  ["pieces-in-sauce", "braised-chunks", "thick-stew"],
  ["fried-pieces", "pieces-in-sauce"],
  ["roast-sliced", "cold-sliced", "braised-chunks"],
  ["mixed-rice", "porridge"],
  ["fried-noodles", "mixed-rice"],
  ["leaf-parcel", "dumplings", "hand-pie", "filled-pastry"],
  ["sandwich", "hand-pie"],
  ["topped-flatbread", "pie", "tart", "casserole"],
  ["pie", "tart", "filled-pastry"],
  ["quick-bread", "crepe"],
  ["sweet-balls", "rice-cake", "dumplings"],
  ["confection", "rice-cake"],
]

export const profiles: Record<string, Profile> = {
  // United States
  hamburger: {
    form: "sandwich",
    steps: ["grill", "assemble"],
    notes: ["charred", "cheese", "bread", "pickle", "mustard"],
  },
  "hot-dog": {
    form: "sandwich",
    steps: ["boil", "grill", "assemble"],
    notes: ["mustard", "pickle", "bread", "smoke"],
  },
  "buffalo-wings": {
    form: "fried-pieces",
    steps: ["deep-fry", "toss"],
    notes: ["chili", "vinegar", "butter", "fried-crust"],
  },
  "new-england-clam-chowder": {
    form: "creamy-soup",
    steps: ["simmer", "thicken"],
    notes: ["seafood", "cream", "pork-fat", "herbs"],
  },
  gumbo: {
    form: "thick-stew",
    steps: ["thicken", "simmer"],
    notes: ["smoke", "herbs", "chili", "seafood", "broth"],
  },
  jambalaya: {
    form: "mixed-rice",
    steps: ["pan-fry", "simmer"],
    notes: ["smoke", "chili", "tomato", "herbs"],
  },
  "texas-brisket": {
    form: "roast-sliced",
    steps: ["smoke", "slice"],
    notes: ["smoke", "black-pepper", "charred"],
  },
  "deep-dish-pizza": {
    form: "topped-flatbread",
    steps: ["make-dough", "fill", "top", "bake"],
    notes: ["cheese", "tomato", "butter", "bread"],
  },
  "new-york-pizza": {
    form: "topped-flatbread",
    steps: ["make-dough", "top", "bake"],
    notes: ["cheese", "tomato", "bread", "charred"],
  },
  "philly-cheesesteak": {
    form: "sandwich",
    steps: ["griddle", "assemble"],
    notes: ["cheese", "bread", "charred"],
  },
  "macaroni-and-cheese": {
    form: "casserole",
    steps: ["boil", "thicken", "bake"],
    notes: ["cheese", "butter", "cream"],
  },
  "southern-fried-chicken": {
    form: "fried-pieces",
    steps: ["marinate", "coat", "deep-fry"],
    notes: ["fried-crust", "black-pepper"],
  },
  "biscuits-and-gravy": {
    form: "quick-bread",
    steps: ["make-dough", "bake", "thicken", "top"],
    notes: ["butter", "cream", "black-pepper", "pork-fat", "bread"],
  },
  "shrimp-and-grits": {
    form: "porridge",
    steps: ["simmer", "pan-fry", "top"],
    notes: ["seafood", "butter", "cheese", "corn"],
  },
  "lobster-roll": {
    form: "sandwich",
    steps: ["boil", "toss", "assemble"],
    notes: ["seafood", "butter", "bread", "citrus"],
  },
  "apple-pie": {
    form: "pie",
    steps: ["make-dough", "fill", "bake"],
    notes: ["fruit", "warm-spice", "butter"],
  },
  "key-lime-pie": { form: "pie", steps: ["fill", "bake", "chill"], notes: ["citrus", "cream"] },
  "chili-con-carne": {
    form: "thick-stew",
    steps: ["pan-fry", "simmer"],
    notes: ["chili", "cumin", "tomato", "garlic"],
  },
  cornbread: { form: "quick-bread", steps: ["make-batter", "bake"], notes: ["corn", "butter"] },
  poke: {
    form: "raw-cubes",
    steps: ["slice", "marinate", "toss"],
    notes: ["soy", "sesame", "seafood", "scallion"],
  },
  "chop-suey": {
    form: "pieces-in-sauce",
    steps: ["stir-fry", "thicken"],
    notes: ["soy", "wok-hei", "garlic"],
  },
  "general-tsos-chicken": {
    form: "fried-pieces",
    steps: ["coat", "deep-fry", "glaze"],
    notes: ["sweet-glaze", "chili", "soy", "vinegar", "fried-crust", "ginger"],
  },
  tamale: {
    form: "leaf-parcel",
    steps: ["make-dough", "fill", "wrap", "steam"],
    notes: ["corn", "chili", "pork-fat"],
  },

  // Michigan
  "detroit-style-pizza": {
    form: "topped-flatbread",
    steps: ["make-dough", "top", "bake"],
    notes: ["cheese", "tomato", "bread", "charred"],
  },
  "mackinac-fudge": {
    form: "confection",
    steps: ["boil", "caramelize", "chill"],
    notes: ["chocolate", "butter", "cream"],
  },
  "coney-dog": {
    form: "sandwich",
    steps: ["grill", "simmer", "assemble"],
    notes: ["chili", "cumin", "mustard", "bread"],
  },
  pasty: {
    form: "hand-pie",
    steps: ["make-dough", "fill", "fold", "bake"],
    notes: ["black-pepper", "pork-fat", "bread"],
  },
  "tuna-noodle-casserole": {
    form: "casserole",
    steps: ["boil", "thicken", "bake"],
    notes: ["seafood", "cream", "cheese"],
  },
  "green-bean-casserole": {
    form: "casserole",
    steps: ["boil", "thicken", "top", "bake"],
    notes: ["cream", "fried-crust"],
  },

  // China
  "peking-duck": {
    form: "roast-sliced",
    steps: ["glaze", "roast", "slice", "wrap"],
    notes: ["sweet-glaze", "scallion", "fermented-bean", "charred"],
  },
  xiaolongbao: {
    form: "dumplings",
    steps: ["make-dough", "fill", "fold", "steam"],
    notes: ["broth", "ginger", "rice-wine", "vinegar"],
  },
  jiaozi: {
    form: "dumplings",
    steps: ["make-dough", "fill", "fold", "boil"],
    notes: ["ginger", "scallion", "vinegar", "soy"],
  },
  "char-siu": {
    form: "roast-sliced",
    steps: ["marinate", "roast", "glaze", "slice"],
    notes: ["sweet-glaze", "soy", "star-anise", "charred", "fermented-bean"],
  },
  "siu-mai": {
    form: "dumplings",
    steps: ["fill", "fold", "steam"],
    notes: ["seafood", "soy", "sesame"],
  },
  "lanzhou-beef-noodles": {
    form: "noodle-soup",
    steps: ["simmer", "make-dough", "boil", "assemble"],
    notes: ["broth", "chili", "herbs", "star-anise"],
  },
  roujiamo: {
    form: "sandwich",
    steps: ["braise", "make-dough", "griddle", "assemble"],
    notes: ["star-anise", "soy", "pork-fat", "bread"],
  },
  "red-braised-pork": {
    form: "braised-chunks",
    steps: ["boil", "caramelize", "braise"],
    notes: ["soy", "sweet-glaze", "star-anise", "rice-wine", "pork-fat"],
  },
  "sweet-and-sour-pork": {
    form: "fried-pieces",
    steps: ["coat", "deep-fry", "stir-fry", "glaze"],
    notes: ["sweet-glaze", "vinegar", "fruit", "fried-crust", "tomato"],
  },
  mooncake: {
    form: "filled-pastry",
    steps: ["make-dough", "fill", "bake"],
    notes: ["egg", "fruit"],
  },
  tangyuan: {
    form: "sweet-balls",
    steps: ["make-dough", "fill", "boil"],
    notes: ["sesame", "ginger"],
  },
  congee: { form: "porridge", steps: ["simmer"], notes: ["ginger", "scallion"] },
  jianbing: {
    form: "crepe",
    steps: ["make-batter", "griddle", "fill", "fold"],
    notes: ["egg", "fermented-bean", "scallion", "chili", "fried-crust"],
  },
  "yangzhou-fried-rice": {
    form: "mixed-rice",
    steps: ["boil", "stir-fry"],
    notes: ["egg", "wok-hei", "seafood", "scallion"],
  },
  "stinky-tofu": {
    form: "fried-pieces",
    steps: ["deep-fry", "top"],
    notes: ["funk", "chili", "garlic", "pickle", "fried-crust"],
  },
  wonton: {
    form: "dumplings",
    steps: ["fill", "fold", "boil"],
    notes: ["broth", "seafood", "ginger", "sesame"],
  },
  "egg-tart": {
    form: "tart",
    steps: ["make-dough", "fill", "bake"],
    notes: ["egg", "butter", "cream"],
  },
  mochi: { form: "rice-cake", steps: ["steam", "pound", "fill"], notes: ["peanut"] },

  // Wuhan, Hubei
  "hot-dry-noodles": {
    form: "dry-noodles",
    steps: ["boil", "toss"],
    notes: ["sesame", "soy", "chili", "pickle", "scallion"],
  },
  "lotus-root-pork-rib-soup": {
    form: "clear-soup",
    steps: ["boil", "simmer"],
    notes: ["broth", "ginger", "pork-fat"],
  },
  doupi: {
    form: "crepe",
    steps: ["steam", "make-batter", "griddle", "fold", "pan-fry"],
    notes: ["egg", "soy", "pork-fat", "fried-crust"],
  },
  "wuchang-fish": {
    form: "whole-fish",
    steps: ["steam", "top"],
    notes: ["seafood", "ginger", "scallion", "soy"],
  },
  "spicy-duck-neck": {
    form: "braised-chunks",
    steps: ["marinate", "braise", "chill"],
    notes: ["chili", "sichuan-pepper", "star-anise", "soy", "sweet-glaze"],
  },

  // Sichuan and Chongqing
  "mapo-tofu": {
    form: "pieces-in-sauce",
    steps: ["pan-fry", "braise", "thicken"],
    notes: ["chili", "sichuan-pepper", "fermented-bean", "garlic"],
  },
  "kung-pao-chicken": {
    form: "pieces-in-sauce",
    steps: ["marinate", "stir-fry", "glaze"],
    notes: ["chili", "sichuan-pepper", "peanut", "vinegar", "sweet-glaze", "wok-hei"],
  },
  "dan-dan-noodles": {
    form: "dry-noodles",
    steps: ["pan-fry", "boil", "toss"],
    notes: ["chili", "sichuan-pepper", "sesame", "pickle", "soy"],
  },
  "chongqing-hot-pot": {
    form: "hot-pot",
    steps: ["simmer", "cook-at-table"],
    notes: ["chili", "sichuan-pepper", "fermented-bean", "broth", "garlic"],
  },
  "twice-cooked-pork": {
    form: "pieces-in-sauce",
    steps: ["boil", "slice", "stir-fry"],
    notes: ["fermented-bean", "chili", "pork-fat", "garlic", "wok-hei"],
  },
  "fuqi-feipian": {
    form: "cold-sliced",
    steps: ["simmer", "slice", "chill", "toss"],
    notes: ["chili", "sichuan-pepper", "peanut", "soy", "herbs"],
  },

  // Shangrao and Jiangxi
  "shangrao-chao-fen": {
    form: "fried-noodles",
    steps: ["soak", "stir-fry"],
    notes: ["chili", "soy", "garlic", "wok-hei", "pork-fat"],
  },
  "nanchang-rice-noodles": {
    form: "dry-noodles",
    steps: ["boil", "toss"],
    notes: ["chili", "soy", "pickle", "peanut", "scallion"],
  },
  "nanchang-clay-pot-soup": {
    form: "clear-soup",
    steps: ["simmer", "steam"],
    notes: ["broth", "ginger", "fruit"],
  },
  "braised-pomelo-peel": {
    form: "braised-chunks",
    steps: ["boil", "soak", "braise"],
    notes: ["soy", "chili", "garlic", "seafood", "pork-fat"],
  },
  zongzi: {
    form: "leaf-parcel",
    steps: ["soak", "fill", "wrap", "boil"],
    notes: ["soy", "pork-fat", "egg", "rice-wine"],
  },
}
