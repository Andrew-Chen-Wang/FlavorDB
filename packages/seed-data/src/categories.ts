import type { CategoryGraph } from "./graph"

/**
 * What a dish looks like when it's served, and the broad way it's made. Leaves are what a dish is
 * tagged with; the groups above them say which looks are related. A category can have several
 * parents: stir-fried noodles are noodle dishes and also wok-fried dishes.
 */
export const FORM_GRAPH = {
  // Groups
  "noodle-dish": [],
  "wok-fried": [], // tossed over high heat in a wok or pan, glossy and charred in spots
  soup: [],
  "in-sauce": [], // pieces in a sauce or gravy
  "fried-crisp": [],
  "sliced-meat": [],
  "cold-dish": [],
  "rice-dish": [],
  wrapped: [], // a filling closed up in dough, leaves or pastry
  "bread-based": [],
  baked: [],
  griddled: [],
  sweets: [],

  // Noodles
  "fried-noodles": ["noodle-dish", "wok-fried"], // stir-fried with meat and vegetables
  "dry-noodles": ["noodle-dish"], // boiled, then tossed in sauce, no broth
  "noodle-soup": ["noodle-dish", "soup"],
  "cold-noodles": ["noodle-dish", "cold-dish"],
  "noodle-casserole": ["noodle-dish", "baked"],

  // Rice
  "fried-rice": ["rice-dish", "wok-fried"],
  "mixed-rice": ["rice-dish"], // rice cooked with other things in one pot
  porridge: ["rice-dish"],

  // Soups and sauces
  "clear-soup": ["soup"], // broth with chunks in it
  "creamy-soup": ["soup"],
  "hot-pot": ["soup"], // a pot of broth at the table
  "thick-stew": ["soup", "in-sauce"], // spoonable stew, often over rice
  "stir-fried-pieces": ["in-sauce", "wok-fried"], // bite-size pieces tossed in a wok sauce
  "pieces-in-sauce": ["in-sauce"], // bite-size pieces simmered in sauce
  "braised-chunks": ["in-sauce"], // dark, glossy braised chunks
  "fried-pieces": ["fried-crisp"], // crisp fried pieces, maybe glazed
  "whole-fish": ["in-sauce"],

  // Meat and cold plates
  "roast-sliced": ["sliced-meat"], // roasted or smoked meat, sliced
  "cold-sliced": ["sliced-meat", "cold-dish"], // thin slices dressed and served cold
  "raw-cubes": ["cold-dish"],

  // Wrapped and bread
  "leaf-parcel": ["wrapped"], // filling wrapped in leaves or husks
  dumplings: ["wrapped"],
  "hand-pie": ["wrapped", "baked"], // filling sealed in pastry
  "filled-pastry": ["wrapped", "baked", "sweets"],
  sandwich: ["bread-based"], // filling inside bread or a bun
  "topped-flatbread": ["bread-based", "baked"], // pizza and the like
  "quick-bread": ["bread-based", "baked"],
  pie: ["baked", "sweets"],
  tart: ["baked", "sweets"],
  casserole: ["baked"], // baked in a dish, served by the spoonful
  crepe: ["griddled"], // a thin griddled sheet, filled or layered

  // Sweets
  "sweet-balls": ["sweets"],
  "rice-cake": ["sweets"],
  confection: ["sweets"],
} as const satisfies CategoryGraph<string>

export type FormCategory = keyof typeof FORM_GRAPH

/** The forms a dish can be tagged with: the leaves of the graph. */
export type Form = {
  [K in FormCategory]: (typeof FORM_GRAPH)[K] extends readonly [] ? never : K
}[FormCategory]

/**
 * The main ingredient a dish is built on: what you'd say it "is" (a noodle dish, a pork dish).
 * Noodles are split by what they're made of and their shape, since that changes both how they look
 * and how they eat.
 */
export const BASE_GRAPH = {
  grain: [],
  wheat: ["grain"],
  rice: ["grain"],
  corn: ["grain"],
  noodles: [],
  "wheat-noodles": ["noodles", "wheat"],
  "egg-noodles": ["wheat-noodles"], // yellow wheat-and-egg noodles (chow mein, mie)
  "alkaline-noodles": ["wheat-noodles"], // springy lye-water noodles (ramen, hot dry noodles)
  "hand-pulled-noodles": ["wheat-noodles"],
  "thick-wheat-noodles": ["wheat-noodles"], // udon, knife-cut, Hokkien mee
  pasta: ["wheat-noodles"],
  "rice-noodles": ["noodles", "rice"],
  "flat-rice-noodles": ["rice-noodles"], // he fen, kway teow, sen yai
  "round-rice-noodles": ["rice-noodles"], // Jiangxi and Guangxi mifen, bún
  "rice-vermicelli": ["rice-noodles"], // thin bee hoon
  "starch-noodles": ["noodles"], // glass noodles from mung bean or sweet potato starch
  "buckwheat-noodles": ["noodles"],
  "sticky-rice": ["rice"],
  bread: ["wheat"],
  pastry: ["wheat"],
  "dumpling-wrapper": ["wheat"],
  potato: [],
  beans: [],
  meat: [],
  pork: ["meat"],
  sausage: ["pork"],
  beef: ["meat"],
  lamb: ["meat"],
  offal: ["meat"],
  poultry: ["meat"],
  chicken: ["poultry"],
  duck: ["poultry"],
  seafood: [],
  fish: ["seafood"],
  shellfish: ["seafood"],
  soy: [],
  tofu: ["soy"],
  egg: [],
  dairy: [],
  cheese: ["dairy"],
  vegetable: [],
  "lotus-root": ["vegetable"],
  "green-beans": ["vegetable"],
  "citrus-peel": ["vegetable"],
  fruit: [],
  sweets: [],
  sugar: ["sweets"],
  chocolate: ["sweets"],
} as const satisfies CategoryGraph<string>

export type Base = keyof typeof BASE_GRAPH

const LABELS: Partial<Record<FormCategory | Base, string>> = {
  "noodle-dish": "noodles",
  "fried-noodles": "stir-fried noodles",
  "dry-noodles": "sauced noodles",
  "fried-rice": "fried rice",
  "wok-fried": "wok-fried",
  "in-sauce": "in sauce",
  "fried-crisp": "crisp-fried",
  "stir-fried-pieces": "stir-fry",
  "sticky-rice": "sticky rice",
}
export const categoryLabel = (c: FormCategory | Base) => LABELS[c] ?? c.replaceAll("-", " ")
