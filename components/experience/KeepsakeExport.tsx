
"use client"
import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import type { Submission } from "@/lib/types"
import SunflowerSVG from "./SunflowerSVG"

interface Props {
  submissions: Submission[]
  signedUrls: Record<string, string>
}

export default function KeepsakeExport({ submissions, signedUrls }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const jsPDF = (await import("jspdf")).default
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
      const W = 210

      // Deep black background
      doc.setFillColor(5, 5, 5)
      doc.rect(0, 0, W, 297, "F")

      // Crimson top bar
      doc.setFillColor(155, 35, 53)
      doc.rect(0, 0, W, 4, "F")

      // Title
      doc.setFont("times", "bold")
      doc.setFontSize(30)
      doc.setTextColor(245, 240, 232)
      doc.text("For Denisha", W / 2, 34, { align: "center" })

      // Subtitle
      doc.setFont("times", "italic")
      doc.setFontSize(11)
      doc.setTextColor(155, 35, 53)
      doc.text("Salamatou Voegli", W / 2, 43, { align: "center" })

      // Crimson line
      doc.setDrawColor(155, 35, 53)
      doc.setLineWidth(0.5)
      doc.line(70, 49, W - 70, 49)

      // Date + milestone
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8)
      doc.setTextColor(155, 35, 53)
      doc.text("October 6, 2026  •  Doctor in the making", W / 2, 56, { align: "center" })

      // Scripture
      doc.setFont("times", "italic")
      doc.setFontSize(9)
      doc.setTextColor(180, 160, 140)
      doc.text("“When the time is right, I the Lord will make it happen.”  — Isaiah 60:22", W / 2, 65, { align: "center" })

      let y = 76

      // Draw simple sunflower petal pattern via lines (PDF has no SVG)
      const sfCx = W / 2, sfCy = y + 12
      doc.setDrawColor(155, 35, 53)
      doc.setLineWidth(0.3)
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 * Math.PI) / 180
        const x1 = sfCx + Math.cos(angle) * 6, y1 = sfCy + Math.sin(angle) * 6
        const x2 = sfCx + Math.cos(angle) * 12, y2 = sfCy + Math.sin(angle) * 12
        doc.line(x1, y1, x2, y2)
      }
      doc.setDrawColor(155, 35, 53)
      doc.circle(sfCx, sfCy, 5)
      y += 30

      // Messages
      const featured = submissions.slice(0, 6)
      for (const sub of featured) {
        if (y > 262) break
        doc.setFont("times", "italic")
        doc.setFontSize(9.5)
        doc.setTextColor(245, 240, 232)
        const lines = doc.splitTextToSize(`“${sub.message}”`, W - 52)
        const blockH = lines.length * 5 + 12
        if (y + blockH > 268) break
        doc.text(lines, W / 2, y, { align: "center" })
        y += lines.length * 5 + 4
        doc.setFont("helvetica", "normal")
        doc.setFontSize(7.5)
        doc.setTextColor(155, 35, 53)
        doc.text(`— ${sub.name}, ${sub.relationship}`, W / 2, y, { align: "center" })
        y += 9
        doc.setDrawColor(30, 21, 21)
        doc.setLineWidth(0.2)
        doc.line(60, y, W - 60, y)
        y += 7
      }

      // Footer
      doc.setFillColor(155, 35, 53)
      doc.rect(0, 293, W, 4, "F")
      doc.setFont("helvetica", "normal")
      doc.setFontSize(7)
      doc.setTextColor(80, 55, 60)
      doc.text("A living memory book, built with love.", W / 2, 289, { align: "center" })

      doc.save("Denisha-Keepsake.pdf")
    } catch (e) {
      console.error(e)
      alert("Could not generate keepsake. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.3, duration: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="mb-6 opacity-40">
        <SunflowerSVG size={40} color="#9b2335" />
      </div>
      <p className="text-xs font-sans tracking-[0.2em] text-crimson uppercase mb-3">Take it with you</p>
      <p className="font-serif text-sm text-cream-dim mb-6 max-w-xs">
        Save a keepsake of your memories — a composed page you can print or keep.
      </p>
      <button
        onClick={generate}
        disabled={loading}
        className="px-6 py-3 border border-crimson text-crimson font-sans text-sm hover:bg-crimson hover:text-cream transition-all rounded-lg disabled:opacity-50"
      >
        {loading ? "Generating..." : "Download keepsake PDF"}
      </button>
    </motion.div>
  )
}
