import { STAPLE_INGREDIENTS } from "@website/lib/data"
import { matchPantry } from "@website/lib/pantry"

/** Matches a kitchen against every dish: POST `{ have: string[], staples: boolean }`. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { have?: unknown; staples?: unknown }
  const have = Array.isArray(body.have)
    ? body.have.filter((x): x is string => typeof x === "string").slice(0, 500)
    : []
  return Response.json(matchPantry(have, body.staples === false ? [] : [...STAPLE_INGREDIENTS]))
}
