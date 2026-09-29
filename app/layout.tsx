import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "For Denisha",
  description: "A living memory book.",
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="bg-midnight text-cream font-serif antialiased">
        {children}
      </body>
    </html>
  )
}
