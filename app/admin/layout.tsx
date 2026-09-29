import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin — Memory Book",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-midnight-soft text-cream font-sans">
      {children}
    </div>
  )
}
