"use client"

import { useId, useState } from "react"
import { dishPhotoSrc } from "./dish-photo"
import { clusterCount } from "@website/lib/map-clusters"

export type MapDishPhoto = { name: string; image?: string }

/** Photo, fallback illustration and badge shared by both SVG maps. */
export function MapPhotoMarker({
  dish,
  count,
  selected = false,
}: {
  dish?: MapDishPhoto
  count: number
  selected?: boolean
}) {
  const id = useId()
  const [failed, setFailed] = useState("")
  const source = dish?.image ? dishPhotoSrc(dish.image, 160) : "/images/dish-placeholder.svg"
  const label = dish?.name ?? "Dishes"
  return (
    <g>
      <title>{label}</title>
      <defs>
        <clipPath id={id}>
          <rect x={-28} y={-28} width={56} height={56} rx={12} />
        </clipPath>
      </defs>
      <rect
        x={-30}
        y={-30}
        width={60}
        height={60}
        rx={14}
        fill={selected ? "#B4361C" : "#fff"}
        className="drop-shadow-md"
      />
      <image
        href={failed === source ? "/images/dish-placeholder.svg" : source}
        x={-28}
        y={-28}
        width={56}
        height={56}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${id})`}
        onError={() => {
          setFailed(source)
        }}
      />
      <rect x={-52} y={35} width={104} height={20} rx={10} fill="#fff" fillOpacity={0.96} />
      <text
        textAnchor="middle"
        y={49}
        fontSize={10}
        fontWeight={600}
        fill="#35332c"
        pointerEvents="none"
      >
        {label.length > 18 ? `${label.slice(0, 17)}…` : label}
      </text>
      <circle cx={27} cy={-26} r={15} fill="#fff" />
      <circle cx={27} cy={-26} r={12} fill="#535d61" />
      <text
        x={27}
        y={-22}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fill="#fff"
        pointerEvents="none"
      >
        {clusterCount(count)}
      </text>
    </g>
  )
}
