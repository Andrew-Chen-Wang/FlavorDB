import { FLAVOR_LABELS } from "@website/lib/data"
import type { Dish } from "@website/lib/data"

export function FlavorBars({ flavor }: { flavor: Dish["flavor"] }) {
  return (
    <dl className={"flex flex-col gap-2.5"}>
      {FLAVOR_LABELS.map((key) => (
        <div key={key} className={"grid grid-cols-[76px_1fr_18px] items-center gap-3 text-sm"}>
          <dt className={"text-ink-2 capitalize"}>{key}</dt>
          <dd className={"flex gap-[3px]"} aria-label={`${flavor[key]} out of 5`}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={
                  i < flavor[key]
                    ? "h-2.5 flex-1 rounded-[3px] bg-chili"
                    : "h-2.5 flex-1 rounded-[3px] bg-[#EEEAE0]"
                }
              />
            ))}
          </dd>
          <dd className={"text-right text-ink-3"} aria-hidden>
            {flavor[key]}
          </dd>
        </div>
      ))}
    </dl>
  )
}
