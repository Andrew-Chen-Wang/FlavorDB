"use client"

import { cn } from "@website/lib/utils"
import { Search } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "./logo"

const links = [
  { href: "/dishes", label: "Dishes" },
  { href: "/map", label: "Map" },
  { href: "/ingredients", label: "Ingredients" },
  { href: "/places", label: "Places" },
  { href: "/pantry", label: "What can I make?" },
]

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className={"border-b border-line bg-white"}>
      <div
        className={
          "mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-7 gap-y-2 px-4 py-2.5 sm:px-8"
        }
      >
        <Logo />
        <nav aria-label={"Main"} className={"flex flex-wrap gap-0.5 text-[15px] font-medium"}>
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn("px-3 py-3 hover:text-chili", active ? "text-chili" : "text-ink")}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
        <form
          role={"search"}
          action={"/dishes"}
          className={"relative ml-auto max-w-[340px] flex-[1_1_240px]"}
        >
          <label htmlFor={"nav-q"} className={"sr-only"}>
            Search dishes and ingredients
          </label>
          <Search aria-hidden className={"absolute top-3.5 left-3.5 size-4 text-ink-3"} />
          <input
            aria-label={"Search dishes and ingredients"}
            id={"nav-q"}
            name={"q"}
            type={"search"}
            placeholder={"Search dishes, ingredients, places"}
            className={
              "h-11 w-full rounded-full border border-line-strong bg-paper pr-3.5 pl-10 text-[15px] text-ink placeholder:text-ink-3"
            }
          />
        </form>
      </div>
    </header>
  )
}
