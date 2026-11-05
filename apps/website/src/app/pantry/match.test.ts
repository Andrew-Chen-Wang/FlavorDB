import { describe, expect, test } from "vitest"
import { bucketByMissing, scoreDishes } from "./match"

const dishes = [
  {
    key: "congee",
    href: "/dishes/congee",
    name: "Congee",
    localName: "",
    ingredients: ["rice", "ginger", "salt"],
    hasRecipe: false,
  },
  {
    key: "fried-rice",
    href: "/dishes/fried-rice",
    name: "Fried rice",
    localName: "",
    ingredients: ["rice", "egg", "green-onion", "salt"],
    hasRecipe: false,
  },
  {
    key: "jiaozi",
    href: "/dishes/jiaozi",
    name: "Jiaozi",
    localName: "",
    ingredients: ["flour", "ground-pork", "napa-cabbage"],
    hasRecipe: false,
  },
]

describe("pantry matching", () => {
  test("staples never count as missing", () => {
    const [congee] = scoreDishes(dishes, new Set(["rice", "ginger"]), new Set(["salt"]))
    expect(congee?.missing).toEqual([])
    expect(congee?.needed).toBe(2)
  })

  test("without staples assumed, salt is missing", () => {
    const [congee] = scoreDishes(dishes, new Set(["rice", "ginger"]), new Set())
    expect(congee?.missing).toEqual(["salt"])
  })

  test("buckets by number of missing ingredients", () => {
    const buckets = bucketByMissing(
      scoreDishes(dishes, new Set(["rice", "ginger", "egg"]), new Set(["salt"])),
    )
    expect(buckets.map((b) => b.dishes.map((d) => d.key))).toEqual([
      ["congee"],
      ["fried-rice"],
      [],
      [],
    ])
  })
})
