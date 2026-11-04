import "./globals.css"
import { ClientProviders } from "@website/components/ClientProviders"
import { SiteFooter } from "@website/components/site/site-footer"
import { SiteHeader } from "@website/components/site/site-header"
import type { Metadata } from "next"
import { Bricolage_Grotesque, Inter, Noto_Sans_SC } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" })
const notoSc = Noto_Sans_SC({ weight: ["400", "500"], preload: false, variable: "--font-noto-sc" })

export const metadata: Metadata = {
  title: { default: "FlavorDB", template: "%s · FlavorDB" },
  description:
    "The world's dishes and their local variations: history, where they're eaten, recipes, and similar dishes.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={"en"} className={`${inter.variable} ${bricolage.variable} ${notoSc.variable}`}>
      <body className={"min-h-screen bg-white font-sans text-ink"}>
        <ClientProviders>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ClientProviders>
      </body>
    </html>
  )
}
