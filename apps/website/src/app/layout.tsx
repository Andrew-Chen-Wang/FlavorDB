import "./globals.css"
import { ClientProviders } from "@website/components/ClientProviders"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Flavor DB",
  description:
    "The world's dishes and their local variations: history, where they're eaten, recipes, and similar dishes.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={"en"}>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
