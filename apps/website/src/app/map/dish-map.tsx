"use client"

/* oxlint-disable jsx-a11y/prefer-tag-over-role -- SVG groups provide keyboard-operable map markers; HTML buttons cannot be SVG children. */

import { MapAttribution } from "@website/components/site/map-attribution"
import { MapPhotoMarker } from "@website/components/site/map-photo-marker"
import { DishPhoto } from "@website/components/site/dish-photo"
import { clusterMapPins } from "@website/lib/map-clusters"
import { cn } from "@website/lib/utils"
import { geoEqualEarth, geoPath, type GeoProjection } from "d3-geo"
import { select } from "d3-selection"
import "d3-transition"
import { type ZoomBehavior, type ZoomTransform, zoom, zoomIdentity } from "d3-zoom"
import type { FeatureCollection } from "geojson"
import { Minus, Plus, Search } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { feature } from "topojson-client"
import type { GeometryCollection, Topology } from "topojson-specification"
import world110 from "world-atlas/countries-110m.json"

export type MapData = {
  dishes: {
    slug: string
    name: string
    image?: string
    localName: string
    category: string
    placeLine: string
  }[]
  countries: { code: string; name: string; lng: number; lat: number; dishes: string[] }[]
  places: { id: string; name: string; lng: number; lat: number; dishes: string[] }[]
  placeDishOrigins: Record<string, string[]>
}

type Selection =
  | { kind: "country"; code: string }
  | { kind: "place"; id: string }
  | { kind: "cluster"; name: string; dishes: string[] }

const CATEGORIES: [string, string][] = [
  ["all", "All"],
  ["noodles", "Noodles"],
  ["dumplings", "Dumplings"],
  ["soup", "Soup"],
  ["street food", "Street food"],
  ["dessert", "Dessert"],
  ["other", "Mains & more"],
]

/** Above this zoom level, pins for individual places replace the per-country counts. */
const PLACE_ZOOM = 2.6

const toLand = (topo: unknown) => {
  const t = topo as Topology<{ countries: GeometryCollection }>
  return feature(t, t.objects.countries) as FeatureCollection
}

function matchesCategory(category: string, filter: string) {
  if (filter === "all") return true
  if (filter === "other")
    return !["noodles", "dumplings", "soup", "street food", "dessert"].includes(category)
  return category === filter
}

export function DishMap({ data }: { data: MapData }) {
  const params = useSearchParams()
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const [size, setSize] = useState({ width: 1200, height: 760 })
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity)
  const [land, setLand] = useState(() => toLand(world110))
  const [category, setCategory] = useState("all")
  const [query, setQuery] = useState("")
  const [shown, setShown] = useState(200)
  const [selection, setSelection] = useState<Selection>({ kind: "country", code: "CN" })

  const dishBySlug = useMemo(() => new Map(data.dishes.map((d) => [d.slug, d])), [data.dishes])
  const q = query.trim().toLowerCase()
  const visible = (slug: string) => {
    const d = dishBySlug.get(slug)
    if (!d || !matchesCategory(d.category, category)) return false
    return !q || `${d.name} ${d.localName} ${d.placeLine}`.toLowerCase().includes(q)
  }

  const projection: GeoProjection = useMemo(
    () =>
      geoEqualEarth()
        .rotate([-10, 0])
        .fitExtent(
          [
            // Leave room for the side panel on wide screens.
            [size.width >= 768 ? 410 : 10, 10],
            [size.width - 10, size.width < 640 ? size.height * 0.45 : size.height * 1.15],
          ],
          { type: "Sphere" },
        ),
    [size],
  )
  const path = useMemo(() => geoPath(projection), [projection])
  const landPath = useMemo(() => path(land) ?? "", [path, land])

  // Track the container size.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height })
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
    }
  }, [])

  // Load more detailed borders once the page is up.
  useEffect(() => {
    void import("world-atlas/countries-50m.json").then((m) => {
      setLand(toLand(m.default))
    })
  }, [])

  // Pan and zoom.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 40])
      .on("zoom", (event: { transform: ZoomTransform }) => {
        setTransform(event.transform)
      })
    zoomRef.current = behavior
    select(svg).call(behavior)
    return () => {
      select(svg).on(".zoom", null)
    }
  }, [])

  const zoomTo = (lng: number, lat: number, k: number) => {
    const svg = svgRef.current
    const behavior = zoomRef.current
    const xy = projection([lng, lat])
    if (!svg || !behavior || !xy) return
    const t = zoomIdentity
      .translate(size.width / 2, size.height / 2)
      .scale(k)
      .translate(-xy[0], -xy[1])
    select(svg)
      .transition()
      .duration(750)
      .call((sel) => {
        behavior.transform(sel, t)
      })
  }

  const zoomBy = (factor: number) => {
    const svg = svgRef.current
    const behavior = zoomRef.current
    if (!svg || !behavior) return
    select(svg)
      .transition()
      .call((sel) => {
        behavior.scaleBy(sel, factor)
      })
  }

  // Deep links: /map?dish=zongzi or /map?place=cn-wuhan
  const deepLinked = useRef(false)
  useEffect(() => {
    if (deepLinked.current || size.width === 1200) return
    deepLinked.current = true
    const placeId = params.get("place") ?? data.placeDishOrigins[params.get("dish") ?? ""]?.[0]
    const place = data.places.find((p) => p.id === placeId)
    const country = data.countries.find((c) => c.code.toLowerCase() === placeId)
    if (place) {
      setSelection({ kind: "place", id: place.id })
      zoomTo(place.lng, place.lat, 6)
    } else if (country) {
      setSelection({ kind: "country", code: country.code })
      zoomTo(country.lng, country.lat, 3)
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- runs once, after the first real measurement
  }, [size.width])

  const screen = (lng: number, lat: number) => {
    const xy = projection([lng, lat])
    return xy ? transform.apply(xy) : null
  }

  const zoomedIn = transform.k >= PLACE_ZOOM
  const selected =
    selection.kind === "cluster"
      ? selection
      : selection.kind === "country"
        ? data.countries.find((c) => c.code === selection.code)
        : data.places.find((p) => p.id === selection.id)
  const list = (selected?.dishes ?? []).filter(visible).map((s) => dishBySlug.get(s)!)

  const pins = clusterMapPins(
    (zoomedIn ? data.places : data.countries.map((c) => ({ ...c, id: c.code }))).flatMap((p) => {
      const xy = screen(p.lng, p.lat)
      return xy
        ? [{ id: p.id, name: p.name, x: xy[0], y: xy[1], dishes: p.dishes.filter(visible) }]
        : []
    }),
    size.width,
    size.height,
    108,
  )
  const activatePin = (pin: (typeof pins)[number]) => {
    if (pin.members.length === 1) {
      const member = pin.members[0]
      setSelection(
        zoomedIn ? { kind: "place", id: member.id } : { kind: "country", code: member.id },
      )
      return
    }
    setSelection({ kind: "cluster", name: `${pin.members.length} places`, dishes: pin.dishes })
    const ll = projection.invert?.(transform.invert([pin.x, pin.y]))
    if (ll) zoomTo(ll[0], ll[1], Math.min(40, transform.k * 2))
  }

  return (
    <div
      className={
        "relative h-[calc(100vh-65px)] max-sm:h-[calc(100dvh-220px)] min-h-[560px] overflow-hidden bg-sea"
      }
      ref={wrapRef}
    >
      <div className="absolute top-4 right-4 hidden rounded-lg bg-white/90 px-3 py-2 md:block">
        <MapAttribution />
      </div>
      <svg
        ref={svgRef}
        width={size.width}
        height={size.height}
        className={"block cursor-grab touch-none active:cursor-grabbing"}
      >
        <title>World map of dishes</title>
        <g transform={transform.toString()}>
          <path d={landPath} fill={"#F6F4EE"} stroke={"#B9B2A3"} strokeWidth={0.6 / transform.k} />
        </g>
        {pins.map((pin) => {
          const grouped = pin.members.length > 1
          const representative =
            pin.dishes.map((id) => dishBySlug.get(id)).find((d) => d?.image) ??
            dishBySlug.get(pin.dishes[0])
          const member = pin.members[0]
          const on =
            !grouped &&
            (selection.kind === "country"
              ? !zoomedIn && selection.code === member.id
              : selection.kind === "place" && zoomedIn && selection.id === member.id)
          const label = grouped
            ? `${pin.members.length} places, ${pin.dishes.length} dishes. Zoom in`
            : `${member.name}, ${pin.dishes.length} dishes`
          return (
            <g
              key={pin.members
                .map((p) => p.id)
                .toSorted()
                .join(":")}
              transform={`translate(${pin.x},${pin.y})`}
              role="button"
              tabIndex={0}
              aria-label={label}
              className="cursor-pointer outline-none"
              onClick={() => {
                activatePin(pin)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  activatePin(pin)
                }
              }}
            >
              <title>{label}</title>
              <MapPhotoMarker dish={representative} count={pin.dishes.length} selected={on} />
            </g>
          )
        })}
      </svg>

      <section
        aria-label={"Map filters and results"}
        className={
          "absolute top-4 bottom-4 left-4 flex w-[min(380px,calc(100%-32px))] flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_8px_32px_rgba(27,26,23,0.16)] max-sm:top-auto max-sm:h-[55%] max-sm:overflow-y-auto"
        }
      >
        <div className={"border-b border-[#EEEAE0] p-5 pb-4"}>
          <h1 className={"font-display text-[26px] font-bold tracking-tight"}>Dish map</h1>
          <p className={"mt-1 mb-3.5 text-sm text-ink-3"}>
            {data.dishes.length} dishes in {data.countries.length} countries and territories
          </p>
          <div className={"relative"}>
            <label htmlFor={"map-q"} className={"sr-only"}>
              Filter dishes
            </label>
            <Search aria-hidden className={"absolute top-3.5 left-3.5 size-4 text-ink-3"} />
            <input
              aria-label={"Filter dishes"}
              id={"map-q"}
              type={"search"}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
              }}
              placeholder={"Filter by dish or place"}
              className={
                "h-11 w-full rounded-xl border border-line-strong bg-paper pr-3.5 pl-10 text-[15px]"
              }
            />
          </div>
          <div role={"group"} aria-label={"Category"} className={"mt-3 flex flex-wrap gap-1.5"}>
            {CATEGORIES.map(([value, label]) => (
              <button
                key={value}
                type={"button"}
                aria-pressed={category === value}
                onClick={() => {
                  setCategory(value)
                }}
                className={cn(
                  "min-h-9 rounded-full border px-3 text-[13px] font-medium",
                  category === value
                    ? "border-ink bg-ink text-white"
                    : "border-line-strong bg-white",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className={"flex items-baseline justify-between gap-3 px-5 pt-4 pb-2"}>
          <h2 className={"text-lg font-semibold"}>{selected?.name ?? "Select a place"}</h2>
          <span className={"text-sm text-ink-3"}>
            {list.length} {list.length === 1 ? "dish" : "dishes"}
          </span>
        </div>
        {selection.kind === "country" && selected && "code" in selected && (
          <div className={"px-5 pb-2"}>
            <button
              type={"button"}
              onClick={() => {
                zoomTo(selected.lng, selected.lat, selected.code === "US" ? 3.2 : 4)
              }}
              className={
                "flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink text-sm font-semibold text-white hover:bg-ink-2"
              }
            >
              Zoom into {selected.name}
            </button>
          </div>
        )}
        {list.length > shown && (
          <p className="px-5 pb-2 text-sm text-ink-3">
            Showing {Math.min(shown, list.length)} of {list.length} matches.
          </p>
        )}
        <ul className={"flex-1 overflow-y-auto px-3 pt-1 pb-4 max-sm:flex-none"}>
          {list.slice(0, shown).map((d) => (
            <li key={d.slug}>
              <Link
                href={`/dishes/${encodeURIComponent(d.slug)}`}
                className={"flex items-center gap-3 rounded-xl p-2 hover:bg-paper"}
              >
                <DishPhoto
                  file={d.image ?? "/images/dish-placeholder.svg"}
                  width={104}
                  className="size-[52px] flex-none rounded-[10px]"
                />
                <span className={"min-w-0"}>
                  <span className={"block text-[15px] font-semibold"}>
                    {d.name}{" "}
                    {d.localName && (
                      <span lang={"zh"} className={"font-cjk font-normal text-ink-3"}>
                        {d.localName}
                      </span>
                    )}
                  </span>
                  <span className={"mt-0.5 block text-[13px] text-ink-3"}>
                    {d.placeLine} · <span className={"capitalize"}>{d.category}</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
          {list.length > shown && (
            <li>
              <button
                type="button"
                className="min-h-11 w-full rounded-xl bg-paper text-sm font-semibold"
                onClick={() => {
                  setShown((n) => n + 200)
                }}
              >
                Show more dishes
              </button>
            </li>
          )}
        </ul>
      </section>

      <div
        className={
          "absolute right-4 bottom-4 flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_4px_16px_rgba(27,26,23,0.16)]"
        }
      >
        <button
          type={"button"}
          aria-label={"Zoom in"}
          onClick={() => {
            zoomBy(1.8)
          }}
          className={
            "flex size-12 items-center justify-center border-b border-[#EEEAE0] hover:bg-paper"
          }
        >
          <Plus className={"size-5"} aria-hidden />
        </button>
        <button
          type={"button"}
          aria-label={"Zoom out"}
          onClick={() => {
            zoomBy(1 / 1.8)
          }}
          className={"flex size-12 items-center justify-center hover:bg-paper"}
        >
          <Minus className={"size-5"} aria-hidden />
        </button>
      </div>
      <div
        className={
          "absolute right-20 bottom-4 hidden items-center gap-2 rounded-[10px] bg-white/90 px-3.5 py-2.5 text-[13px] text-ink-2 sm:flex"
        }
      >
        {zoomedIn
          ? "Dishes per place. Select one to list them."
          : "Dishes per country. Zoom in to see each place."}
      </div>
    </div>
  )
}
