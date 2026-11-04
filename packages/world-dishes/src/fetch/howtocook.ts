import { execFileSync } from "node:child_process"
import { existsSync } from "node:fs"
import path from "node:path"
import { CACHE_DIR } from "./http"

/** HowToCook is released into the public domain (Unlicense); a shallow clone is all we need. */
export function fetchHowToCook() {
  const dir = path.join(CACHE_DIR, "howtocook")
  if (!existsSync(dir)) {
    execFileSync(
      "git",
      ["clone", "--depth", "1", "https://github.com/Anduin2017/HowToCook.git", dir],
      { stdio: "inherit" },
    )
  }
}
