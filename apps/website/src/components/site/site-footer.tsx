import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className={"mt-24 border-t border-line bg-paper"}>
      <div
        className={
          "mx-auto flex max-w-[1240px] flex-wrap justify-between gap-6 px-4 py-10 text-sm text-ink-3 sm:px-8"
        }
      >
        <p className={"max-w-[52ch]"}>
          FlavorDB lists every place a dish belongs to and doesn&apos;t take sides in origin
          disputes. Something missing from your family&apos;s table? Suggest a dish or a variation.
        </p>
        <div className={"flex flex-wrap gap-5"}>
          <Link href={"/dishes"} className={"py-3 text-ink hover:text-chili"}>
            All dishes
          </Link>
          <Link href={"/map"} className={"py-3 text-ink hover:text-chili"}>
            Map
          </Link>
        </div>
      </div>
    </footer>
  )
}
