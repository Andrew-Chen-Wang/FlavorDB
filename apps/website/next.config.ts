import * as path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  // The imported world dishes are read from disk at request time, so ship their data files with the
  // routes that need them.
  outputFileTracingRoot: path.join(__dirname, "..", ".."),
  outputFileTracingIncludes: {
    "/dishes": [
      "../../packages/world-dishes/data/*.jsonl",
      "../../packages/world-dishes/data/images.json",
    ],
    "/pantry/match": [
      "../../packages/world-dishes/data/*.jsonl",
      "../../packages/world-dishes/data/ingredient-map.json",
    ],
    "/dishes/[slug]": [
      "../../packages/world-dishes/data/*.jsonl",
      "../../packages/world-dishes/data/images.json",
    ],
  },
  // The imported dishes used to have their own section.
  async redirects() {
    return [
      { source: "/world", destination: "/dishes", permanent: true },
      { source: "/world/:id", destination: "/dishes/:id", permanent: true },
    ]
  },
  turbopack: {
    root: path.join(__dirname, "..", ".."),
  },
}

export default nextConfig
