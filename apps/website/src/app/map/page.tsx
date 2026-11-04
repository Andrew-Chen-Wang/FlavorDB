import {
  COUNTRY_NAMES,
  countriesOf,
  countryPlace,
  dishes,
  dishesForPlace,
  placeLine,
  places,
} from "@website/lib/data"
import type { Metadata } from "next"
import { Suspense } from "react"
import { DishMap, type MapData } from "./dish-map"

export const metadata: Metadata = { title: "Map" }

export default function MapPage() {
  const data: MapData = {
    dishes: dishes.map((d) => ({
      slug: d.slug,
      name: d.name,
      localName: d.localName?.split(" / ")[0] ?? "",
      category: d.category,
      placeLine: placeLine(d),
    })),
    countries: [...new Set(dishes.flatMap(countriesOf))].flatMap((code) => {
      const p = countryPlace(code)
      if (!p) return []
      return [
        {
          code,
          name: COUNTRY_NAMES[code] ?? code,
          lng: p.lng,
          lat: p.lat,
          dishes: dishes.filter((d) => countriesOf(d).includes(code)).map((d) => d.slug),
        },
      ]
    }),
    places: places
      .filter((p) => p.kind !== "country")
      .map((p) => ({
        id: p.id,
        name: p.name,
        lng: p.lng,
        lat: p.lat,
        dishes: dishesForPlace(p).map((d) => d.slug),
      }))
      .filter((p) => p.dishes.length > 0),
    placeDishOrigins: Object.fromEntries(
      dishes.map((d) => [d.slug, d.places.map((p) => p.placeId)]),
    ),
  }
  return (
    <main>
      <Suspense>
        <DishMap data={data} />
      </Suspense>
    </main>
  )
}
