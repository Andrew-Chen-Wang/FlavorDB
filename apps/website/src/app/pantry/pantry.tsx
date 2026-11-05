"use client"

import { cn } from "@website/lib/utils"
import { Plus, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { DishPhoto } from "@website/components/site/dish-photo"
import type { PantryResult } from "@website/lib/pantry"

export type PantryData = {
  ingredients: { id: string; name: string; aliases: string[] }[]
  staples: string[]
  quickAdd: { title: string; ids: string[] }[]
}

const STORAGE_KEY = "flavordb:pantry"
const DEFAULT_HAVE = [
  "soy-sauce",
  "green-onion",
  "ginger",
  "garlic",
  "egg",
  "rice",
  "sugar",
  "flour",
  "onion",
]

const BUCKET_TITLES = [
  "Ready to cook",
  "Missing 1 ingredient",
  "Missing 2 ingredients",
  "Missing 3 ingredients",
]
const BUCKET_COLORS = ["border-jade", "border-chili", "border-[#D9A99B]", "border-line"]

export function Pantry({ data }: { data: PantryData }) {
  const [have, setHave] = useState<Set<string>>(() => new Set(DEFAULT_HAVE))
  const [assumeStaples, setAssumeStaples] = useState(true)
  const [query, setQuery] = useState("")
  const [loaded, setLoaded] = useState(false)

  // Remember the kitchen between visits.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setHave(new Set(JSON.parse(saved) as string[]))
    } catch {
      // Storage can be unavailable (private mode); the defaults are fine.
    }
    setLoaded(true)
  }, [])
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...have]))
    } catch {
      // Ignore: remembering is a convenience.
    }
  }, [have, loaded])

  const names = new Map(data.ingredients.map((i) => [i.id, i.name]))
  const toggle = (id: string) => {
    const next = new Set(have)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setHave(next)
  }

  // Matching runs on the server: there are too many dishes to send to the browser.
  const [result, setResult] = useState<PantryResult | undefined>()
  const haveKey = [...have].toSorted().join(",")
  useEffect(() => {
    if (!loaded) return
    const controller = new AbortController()
    fetch("/pantry/match", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ have: haveKey ? haveKey.split(",") : [], staples: assumeStaples }),
      signal: controller.signal,
    })
      .then(async (r) => (await r.json()) as PantryResult)
      .then(setResult)
      .catch(() => {
        // Aborted by a newer request, or offline: keep showing the last result.
      })
    return () => {
      controller.abort()
    }
  }, [haveKey, assumeStaples, loaded])
  const buckets = result?.buckets ?? []
  const rest = result?.rest ?? 0

  const q = query.trim().toLowerCase()
  const suggestions = q
    ? data.ingredients
        .filter(
          (i) => !have.has(i.id) && [i.name, ...i.aliases].some((n) => n.toLowerCase().includes(q)),
        )
        .slice(0, 8)
    : []

  return (
    <div className={"mt-8 flex flex-wrap items-start gap-10"}>
      <aside
        aria-label={"Your ingredients"}
        className={
          "flex max-w-[420px] min-w-0 flex-[1_1_340px] flex-col gap-[22px] rounded-[20px] border border-line p-6"
        }
      >
        <div>
          <h2 className={"mb-3 text-lg font-semibold"}>
            In my kitchen <span className={"font-normal text-ink-3"}>({have.size})</span>
          </h2>
          <form
            className={"relative"}
            onSubmit={(e) => {
              e.preventDefault()
              const first = suggestions[0]
              if (first) {
                toggle(first.id)
                setQuery("")
              }
            }}
          >
            <label htmlFor={"pantry-q"} className={"sr-only"}>
              Add an ingredient
            </label>
            <Plus aria-hidden className={"absolute top-3.5 left-3.5 size-4 text-ink-3"} />
            <input
              aria-label={"Add an ingredient"}
              id={"pantry-q"}
              type={"text"}
              autoComplete={"off"}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
              }}
              placeholder={"Add an ingredient, e.g. lotus root"}
              className={
                "h-11 w-full rounded-xl border border-line-strong bg-paper pr-3.5 pl-10 text-[15px]"
              }
            />
            {suggestions.length > 0 && (
              <ul
                className={
                  "absolute inset-x-0 top-12 z-10 overflow-hidden rounded-xl border border-line bg-white shadow-lg"
                }
              >
                {suggestions.map((s) => (
                  <li key={s.id}>
                    <button
                      type={"button"}
                      onClick={() => {
                        toggle(s.id)
                        setQuery("")
                      }}
                      className={
                        "flex min-h-11 w-full items-center justify-between px-3.5 text-left text-[15px] hover:bg-paper"
                      }
                    >
                      {s.name}
                      <span className={"font-cjk text-sm text-ink-3"}>
                        {s.aliases.find((a) => /\p{Script=Han}/u.test(a))}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </form>
          <div className={"mt-3 flex flex-wrap gap-1.5"}>
            {[...have]
              .toSorted((a, b) => (names.get(a) ?? a).localeCompare(names.get(b) ?? b))
              .map((id) => (
                <button
                  key={id}
                  type={"button"}
                  onClick={() => {
                    toggle(id)
                  }}
                  aria-label={`Remove ${names.get(id) ?? id}`}
                  className={
                    "inline-flex min-h-9 items-center gap-1.5 rounded-full bg-ink pr-2.5 pl-3 text-sm text-white hover:bg-ink-2"
                  }
                >
                  {names.get(id) ?? id}
                  <X className={"size-3.5"} aria-hidden />
                </button>
              ))}
          </div>
          {have.size > 0 && (
            <button
              type={"button"}
              onClick={() => {
                setHave(new Set())
              }}
              className={"mt-2.5 min-h-11 text-sm font-semibold text-chili hover:text-chili-dark"}
            >
              Clear all
            </button>
          )}
        </div>

        <button
          type={"button"}
          role={"switch"}
          aria-label={"Assume I have the basics: water, salt, pepper and cooking oil"}
          aria-checked={assumeStaples}
          onClick={() => {
            setAssumeStaples(!assumeStaples)
          }}
          className={"flex items-start gap-3 rounded-[14px] bg-stone p-3.5 text-left"}
        >
          <span
            className={cn(
              "relative mt-0.5 h-[26px] w-11 flex-none rounded-full",
              assumeStaples ? "bg-jade" : "bg-[#C9C2B2]",
            )}
          >
            <span
              className={cn(
                "absolute top-[3px] size-5 rounded-full bg-white transition-all",
                assumeStaples ? "left-[21px]" : "left-[3px]",
              )}
            />
          </span>
          <span>
            <span className={"block text-[15px] font-semibold"}>Assume I have the basics</span>
            <span className={"mt-0.5 block text-[13px] text-ink-3"}>
              Water, salt, pepper and cooking oil never count as missing.
            </span>
          </span>
        </button>

        {data.quickAdd.map((group) => (
          <div key={group.title}>
            <h3
              className={"mb-2.5 text-[13px] font-semibold tracking-[0.08em] text-ink-3 uppercase"}
            >
              {group.title}
            </h3>
            <div className={"flex flex-wrap gap-1.5"}>
              {group.ids.map((id) => (
                <button
                  key={id}
                  type={"button"}
                  aria-pressed={have.has(id)}
                  onClick={() => {
                    toggle(id)
                  }}
                  className={cn(
                    "min-h-9 rounded-full border px-3 text-sm",
                    have.has(id)
                      ? "border-ink bg-ink text-white"
                      : "border-line-strong bg-white hover:border-ink",
                  )}
                >
                  {names.get(id) ?? id}
                </button>
              ))}
            </div>
          </div>
        ))}
      </aside>

      <section
        aria-label={"Dishes you can make"}
        className={"flex min-w-0 flex-[999_1_600px] flex-col gap-10"}
        aria-live={"polite"}
      >
        {!result && <p className={"text-[15px] text-ink-3"}>Finding dishes…</p>}
        {buckets.map((bucket) => (
          <div key={bucket.missing}>
            <div
              className={cn(
                "flex flex-wrap items-baseline gap-3 border-b-2 pb-3",
                BUCKET_COLORS[bucket.missing],
              )}
            >
              <h2 className={"font-display text-[28px] font-bold tracking-tight"}>
                {BUCKET_TITLES[bucket.missing]}
              </h2>
              <span className={"text-[15px] text-ink-3"}>
                {bucket.count.toLocaleString("en")} {bucket.count === 1 ? "dish" : "dishes"}
                {bucket.count > bucket.dishes.length && `, best ${bucket.dishes.length} shown`}
              </span>
            </div>
            {bucket.dishes.length === 0 ? (
              <p className={"mt-4 text-[15px] text-ink-3"}>
                {bucket.missing === 0 ? "Nothing yet. Add a few more ingredients." : "None."}
              </p>
            ) : (
              <div className={"mt-4 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3.5"}>
                {bucket.dishes.map((d) => (
                  <Link
                    key={d.key}
                    href={d.href}
                    className={
                      "flex gap-3.5 rounded-2xl border border-line p-3.5 hover:border-chili"
                    }
                  >
                    <DishPhoto
                      file={d.image}
                      width={160}
                      className={"size-[72px] flex-none rounded-xl"}
                    />
                    <span className={"min-w-0 flex-1"}>
                      <span className={"flex flex-wrap items-baseline gap-1.5"}>
                        <span className={"font-semibold"}>{d.name}</span>
                        {d.localName && (
                          <span lang={"zh"} className={"font-cjk text-sm text-ink-3"}>
                            {d.localName}
                          </span>
                        )}
                      </span>
                      <span className={"mt-1.5 flex items-center gap-2"}>
                        <span
                          className={
                            "h-1.5 max-w-[140px] flex-1 overflow-hidden rounded-full bg-[#EEEAE0]"
                          }
                        >
                          <span
                            className={cn(
                              "block h-full",
                              d.missing.length ? "bg-chili" : "bg-jade",
                            )}
                            style={{ width: `${(d.have / Math.max(d.needed, 1)) * 100}%` }}
                          />
                        </span>
                        <span className={"text-[13px] text-ink-3"}>
                          {d.have} of {d.needed}
                        </span>
                        {d.hasRecipe && (
                          <span
                            className={
                              "rounded-md bg-jade-soft px-1.5 py-0.5 text-xs font-semibold text-jade-dark"
                            }
                          >
                            Recipe
                          </span>
                        )}
                      </span>
                      {d.missing.length > 0 && (
                        <span className={"mt-2 flex flex-wrap gap-1"}>
                          <span className={"py-0.5 text-xs text-ink-3"}>Need:</span>
                          {d.missing.map((m) => (
                            <span
                              key={m}
                              className={
                                "rounded-full bg-chili-soft px-2 py-0.5 text-xs font-medium text-chili-dark"
                              }
                            >
                              {names.get(m) ?? m}
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        {rest > 0 && (
          <p className={"text-[15px] text-ink-3"}>
            {rest.toLocaleString("en")} more dishes need 4 or more ingredients you don&apos;t have,
            or none you do.
          </p>
        )}
      </section>
    </div>
  )
}
