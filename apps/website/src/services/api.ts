import { QueryClient } from "@tanstack/react-query"
import { client } from "@website/services/client/client.gen"
import { ErrorResponseT } from "@website/services/client/types.gen"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
    mutations: {
      retry: 0,
      onError: (error) => {
        if ("error" in error) {
          const err = error as ErrorResponseT
          console.error(err.error.message)
        }
      },
    },
  },
})

// The standalone API (apps/internal-api) serves routes at the root; when mounted in Next it lives under /api.
client.setConfig({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? `${process.env.NEXT_PUBLIC_HOST_URL ?? ""}/api`,
})
