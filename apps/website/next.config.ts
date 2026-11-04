import * as path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  // The imported world dishes are read from disk at request time, so ship their data files with the
  // routes that need them.
  outputFileTracingRoot: path.join(__dirname, "..", ".."),
  outputFileTracingIncludes: {
    "/world": ["../../packages/world-dishes/data/*.jsonl"],
    "/world/[id]": ["../../packages/world-dishes/data/*.jsonl"],
  },
  turbopack: {
    root: path.join(__dirname, "..", ".."),
  },
}

export default nextConfig
