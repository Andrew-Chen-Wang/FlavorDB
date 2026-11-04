import { countryClusters } from "@website/lib/geo"
import { geoEqualEarth, geoPath } from "d3-geo"
import { feature } from "topojson-client"
import type { GeometryCollection, Topology } from "topojson-specification"
import world from "world-atlas/countries-110m.json"

const topology = world as unknown as Topology<{ countries: GeometryCollection }>
const land = feature(topology, topology.objects.countries)

/** Decorative world map with dish counts, used as the home page's link to the map. */
export function WorldPreview() {
  const width = 1440
  const height = 720
  const projection = geoEqualEarth()
    .rotate([-10, 0])
    .fitExtent(
      [
        [20, -60],
        [width - 20, height + 160],
      ],
      { type: "Sphere" },
    )
  const path = geoPath(projection).digits(1)
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={"xMidYMid slice"}
      aria-hidden
      className={"absolute inset-0 h-full w-full"}
    >
      <path d={path(land) ?? ""} fill={"#F6F4EE"} stroke={"#C9C2B2"} strokeWidth={0.6} />
      {countryClusters().map((c) => {
        const xy = projection([c.lng, c.lat])
        if (!xy) return null
        const r = 14 + Math.sqrt(c.count) * 3
        return (
          <g key={c.code} transform={`translate(${xy[0]},${xy[1]})`}>
            <circle r={r + 5} fill={"rgba(180,54,28,0.22)"} />
            <circle r={r} fill={"#B4361C"} />
            <text
              textAnchor={"middle"}
              dy={5}
              fontSize={c.count > 9 ? 16 : 13}
              fontWeight={700}
              fill={"#fff"}
            >
              {c.count}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
