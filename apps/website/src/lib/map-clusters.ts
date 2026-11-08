export type MapPin = { id: string; name: string; x: number; y: number; dishes: string[] }
export type MapCluster = { x: number; y: number; members: MapPin[]; dishes: string[] }

/** Cluster projected screen positions, so zoom and viewport changes naturally split/merge pins. */
export function clusterMapPins(
  pins: MapPin[],
  width: number,
  height: number,
  distance = 64,
): MapCluster[] {
  const groups = pins
    .filter(
      (p) => p.dishes.length && p.x >= -30 && p.y >= -30 && p.x <= width + 30 && p.y <= height + 30,
    )
    .map((p) => ({ x: p.x, y: p.y, members: [p], dishes: p.dishes }))
  // Recompute centers after every union, including a second pass over earlier groups.
  let changed = true
  while (changed) {
    changed = false
    outer: for (let i = 0; i < groups.length; i++)
      for (let j = i + 1; j < groups.length; j++) {
        const a = groups[i],
          b = groups[j]
        if (Math.hypot(a.x - b.x, a.y - b.y) >= distance) continue
        const n = a.members.length + b.members.length
        a.x = (a.x * a.members.length + b.x * b.members.length) / n
        a.y = (a.y * a.members.length + b.y * b.members.length) / n
        a.members.push(...b.members)
        a.dishes = [...new Set([...a.dishes, ...b.dishes])]
        groups.splice(j, 1)
        changed = true
        break outer
      }
  }
  return groups
}

export function clusterCount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n)
}
