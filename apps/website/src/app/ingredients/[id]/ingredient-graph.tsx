"use client"

import { cn } from "@website/lib/utils"
import Link from "next/link"
import { useState } from "react"
import type { Graph } from "./graph-layout"

const nodeClass = {
  center: "bg-ink text-white text-[17px] font-semibold px-[22px] py-3.5",
  dish: "bg-chili text-white text-[15px] font-semibold px-[18px] py-3",
  ingredient: "bg-white text-ink text-sm font-medium px-3.5 py-2 border border-[#8C8576]",
  far: "bg-white text-chili-dark text-sm font-medium px-3 py-1.5 border-2 border-dashed border-chili",
}

export function IngredientGraph({ graph }: { graph: Graph }) {
  const [depth, setDepth] = useState<1 | 2>(2)
  const nodes = graph.nodes.filter((n) => depth === 2 || n.kind !== "far")
  const byId = new Map(graph.nodes.map((n) => [n.id, n]))
  const edges = graph.edges.filter((e) => depth === 2 || !e.far)

  return (
    <div>
      <div className={"mb-4 flex flex-wrap items-center justify-between gap-3"}>
        <h2 className={"font-display text-[30px] font-bold tracking-tight"}>Ingredient graph</h2>
        <div role={"group"} aria-label={"Graph depth"} className={"flex gap-1.5"}>
          {([1, 2] as const).map((d) => (
            <button
              key={d}
              type={"button"}
              aria-pressed={depth === d}
              onClick={() => {
                setDepth(d)
              }}
              className={cn(
                "min-h-11 rounded-full border px-4 text-sm font-medium",
                depth === d ? "border-ink bg-ink text-white" : "border-line-strong bg-white",
              )}
            >
              {d} {d === 1 ? "step" : "steps"}
            </button>
          ))}
        </div>
      </div>
      <div className={"overflow-x-auto rounded-[20px] border border-line bg-paper"}>
        <div className={"relative mx-auto"} style={{ width: graph.width, height: graph.height }}>
          <svg className={"absolute inset-0"} width={graph.width} height={graph.height} aria-hidden>
            {edges.map((e) => {
              const a = byId.get(e.from)!
              const b = byId.get(e.to)!
              return (
                <line
                  key={`${e.from}-${e.to}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={e.main ? "#B4361C" : e.far ? "#D9A99B" : "#B9B2A3"}
                  strokeWidth={e.main ? 3 : e.far ? 2 : 1.5}
                  strokeDasharray={e.far ? "6 5" : undefined}
                />
              )
            })}
          </svg>
          {nodes.map((n) => (
            <Link
              key={n.id}
              href={n.href}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full whitespace-nowrap shadow-[0_1px_3px_rgba(27,26,23,0.12)] hover:ring-2 hover:ring-chili/40",
                nodeClass[n.kind],
              )}
              style={{ left: n.x, top: n.y }}
            >
              {n.label}
            </Link>
          ))}
        </div>
      </div>
      <div className={"mt-3 flex flex-wrap gap-5 text-sm text-ink-2"}>
        <Legend swatch={"bg-ink"}>This ingredient</Legend>
        <Legend swatch={"bg-chili"}>Dishes that use it</Legend>
        <Legend swatch={"border border-[#8C8576] bg-white"}>
          Other ingredients in those dishes
        </Legend>
        <Legend swatch={"border-2 border-dashed border-chili bg-white"}>
          More dishes, one step further
        </Legend>
      </div>
      {graph.hiddenDishes > 0 && (
        <p className={"mt-2 text-sm text-ink-3"}>
          The graph shows 10 dishes. All of them are listed below.
        </p>
      )}
    </div>
  )
}

function Legend({ swatch, children }: { swatch: string; children: React.ReactNode }) {
  return (
    <span className={"inline-flex items-center gap-2"}>
      <span className={cn("size-3.5 rounded-full", swatch)} />
      {children}
    </span>
  )
}
