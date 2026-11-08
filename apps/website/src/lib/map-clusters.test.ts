import { expect, test } from "vitest"
import { clusterMapPins, type MapPin } from "./map-clusters"
const pins: MapPin[] = [
  { id: "a", name: "A", x: 100, y: 100, dishes: ["shared", "a"] },
  { id: "b", name: "B", x: 130, y: 100, dishes: ["shared", "b"] },
  { id: "c", name: "C", x: 350, y: 200, dishes: ["c"] },
]
test("nearby pins cluster, shared dishes count once, and zoom splits clusters", () => {
  const grouped = clusterMapPins(pins, 500, 400)
  expect(grouped).toHaveLength(2)
  expect(grouped[0].dishes).toHaveLength(3)
  expect(
    clusterMapPins(
      pins.map((p) => ({ ...p, x: p.x * 3, y: p.y * 3 })),
      1500,
      1200,
    ),
  ).toHaveLength(3)
})
test("viewport changes omit offscreen pins and never leave overlapping clusters", () => {
  expect(clusterMapPins(pins, 200, 150)).toHaveLength(1)
  const groups = clusterMapPins(
    Array.from({ length: 100 }, (_, i) => ({
      id: String(i),
      name: String(i),
      x: (i % 10) * 20,
      y: Math.floor(i / 10) * 20,
      dishes: [String(i)],
    })),
    500,
    400,
  )
  expect(new Set(groups.flatMap((g) => g.dishes)).size).toBe(100)
  for (let i = 0; i < groups.length; i++)
    for (let j = i + 1; j < groups.length; j++)
      expect(
        Math.hypot(groups[i].x - groups[j].x, groups[i].y - groups[j].y),
      ).toBeGreaterThanOrEqual(64)
})
