import path from "node:path"
import { defineProject } from "vitest/config"

export default defineProject({
  resolve: { alias: { "@website": path.join(import.meta.dirname, "src") } },
  test: { name: "website" },
})
