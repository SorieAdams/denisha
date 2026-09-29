
"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import type { Submission } from "@/lib/types"
import MemoryCard from "./MemoryCard"

interface Props {
  category: string
  label: string
  framing: string
  submissions: (Submission & { animation_style: "polaroid" | "split" })[]
  signedUrls: Record<string, string>
  chapterIndex: number
}

export default function ChapterSection({ label, framing, submissions, signedUrls, chapterIndex }: Props) {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-20% 0px" })

  return (
    <section className="min-h-screen py-24 px-5">
      <div ref={headerRef} className="text-center mb-20 max-w-xs mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-sans tracking-[0.3em] text-crimson uppercase mb-1"
        >
          Chapter {String(chapterIndex + 1).padStart(2, "0")}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 1, ease: "easeOut" }}
          className="font-serif text-3xl text-cream mb-4"
        >
          {label}
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={headerInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="divider-crimson w-12 mx-auto mb-4"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-serif text-sm text-cream-dim italic leading-relaxed"
        >
          {framing}
        </motion.p>
      </div>

      <div className="max-w-lg mx-auto space-y-16">
        {submissions.map((sub, i) => (
          <MemoryCard key={sub.id} submission={sub} signedUrls={signedUrls} index={i} />
        ))}
      </div>
    </section>
  )
}
