import Link from "next/link"

export function Logo() {
  return (
    <Link
      href={"/"}
      className={
        "flex min-h-11 items-center gap-2.5 font-display text-[22px] font-bold tracking-tight text-ink"
      }
    >
      <svg
        width={28}
        height={28}
        viewBox={"0 0 28 28"}
        fill={"none"}
        stroke={"#B4361C"}
        strokeWidth={2}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        aria-hidden
      >
        <path d={"M3 13h22a11 11 0 0 1-22 0z"} />
        <path d={"M9 9c0-2 2-2 2-4M14 9c0-2 2-2 2-4M19 9c0-2 2-2 2-4"} />
      </svg>
      FlavorDB
    </Link>
  )
}
