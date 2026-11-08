"use client"

import type { CountryCluster } from "@website/lib/geo"
import { clusterMapPins, clusterCount } from "@website/lib/map-clusters"
import { geoEqualEarth, geoPath } from "d3-geo"
import { useEffect, useRef, useState } from "react"
import { feature } from "topojson-client"
import type { GeometryCollection, Topology } from "topojson-specification"
import world from "world-atlas/countries-110m.json"

const topology = world as unknown as Topology<{ countries: GeometryCollection }>
const land = feature(topology, topology.objects.countries)

/** Cluster in actual CSS pixels, including when the responsive preview is resized. */
export function WorldPreview({ countries }: { countries: CountryCluster[] }) {
  const ref = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState({ width: 1440, height: 440 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height })
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
    }
  }, [])
  const { width, height } = size
  const projection = geoEqualEarth()
    .rotate([-10, 0])
    .fitExtent(
      [
        [12, 12],
        [width - 12, height - 12],
      ],
      { type: "Sphere" },
    )
  const path = geoPath(projection).digits(1)
  const pins = clusterMapPins(
    countries.flatMap((c) => {
      const xy = projection([c.lng, c.lat])
      return xy ? [{ id: c.code, name: c.name, x: xy[0], y: xy[1], dishes: c.dishes }] : []
    }),
    width,
    height,
    64,
  )
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      className="absolute inset-0 h-full w-full"
    >
      <path d={path(land) ?? ""} fill="#F6F4EE" stroke="#C9C2B2" strokeWidth={0.6} />
      {pins.map((pin) => (
        <g
          key={pin.members
            .map((p) => p.id)
            .toSorted()
            .join(":")}
          transform={`translate(${pin.x},${pin.y})`}
        >
          <circle r={27} fill="rgba(180,54,28,0.22)" />
          <circle r={23} fill="#B4361C" />
          <text textAnchor="middle" dy={4} fontSize={12} fontWeight={700} fill="#fff">
            {clusterCount(pin.dishes.length)}
          </text>
        </g>
      ))}
    </svg>
  )
}
