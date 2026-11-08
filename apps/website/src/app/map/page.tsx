import { catalogMapData } from "@website/lib/map-data"
import type { Metadata } from "next"
import { Suspense } from "react"
import { DishMap } from "./dish-map"

export const metadata: Metadata = { title: "Map" }

export default function MapPage() {
  return (
    <main>
      <Suspense>
        <DishMap data={catalogMapData()} />
      </Suspense>
    </main>
  )
}
