import { geoMercator, geoPath } from "d3-geo"
import { feature, mesh } from "topojson-client"
import type { GeometryCollection, Topology } from "topojson-specification"
import world from "world-atlas/countries-50m.json"

export type MapPoint = { id: string; lng: number; lat: number; label: string }

const topology = world as unknown as Topology<{ countries: GeometryCollection }>
const land = feature(topology, topology.objects.countries)
const borders = mesh(topology, topology.objects.countries, (a, b) => a !== b)

/** A static, server-rendered map framed around a set of points. */
export function MiniMap({
  points,
  width = 800,
  height = 440,
  minSpan = 14,
  label,
}: {
  points: MapPoint[]
  width?: number
  height?: number
  /** Minimum width of the framed area, in degrees of longitude, so a single city isn't absurdly zoomed */
  minSpan?: number
  label: string
}) {
  const lngs = points.map((p) => p.lng)
  const lats = points.map((p) => p.lat)
  const cx = (Math.min(...lngs) + Math.max(...lngs)) / 2
  const cy = (Math.min(...lats) + Math.max(...lats)) / 2
  const halfLng = Math.max((Math.max(...lngs) - Math.min(...lngs)) / 2, minSpan / 2)
  const halfLat = Math.max((Math.max(...lats) - Math.min(...lats)) / 2, minSpan / 4)
  const projection = geoMercator().fitExtent(
    [
      [60, 50],
      [width - 60, height - 50],
    ],
    {
      type: "MultiPoint",
      coordinates: [
        [cx - halfLng, cy - halfLat],
        [cx + halfLng, cy + halfLat],
      ],
    },
  )
  projection.clipExtent([
    [0, 0],
    [width, height],
  ])
  const path = geoPath(projection).digits(1)
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role={"img"}
      aria-label={label}
      className={"block h-full w-full"}
    >
      <rect width={width} height={height} fill={"#DCE6E8"} />
      <path d={path(land) ?? ""} fill={"#F6F4EE"} />
      <path d={path(borders) ?? ""} fill={"none"} stroke={"#B9B2A3"} strokeWidth={0.8} />
      {points.map((p) => {
        const xy = projection([p.lng, p.lat])
        if (!xy) return null
        return (
          <g key={p.id} transform={`translate(${xy[0]},${xy[1]})`}>
            <circle r={9} fill={"rgba(180,54,28,0.25)"} />
            <circle r={5} fill={"#B4361C"} />
            <text
              x={10}
              y={4}
              fontSize={13}
              fontWeight={500}
              fill={"#1B1A17"}
              stroke={"#fff"}
              strokeWidth={3}
              paintOrder={"stroke"}
            >
              {p.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
