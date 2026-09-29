
"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import type { Submission } from "@/lib/types"

interface Props {
  submission: Submission
  photo1: string | null
  photo2: string | null
}

export default function PolaroidCard({ submission, photo1, photo2 }: Props) {
  const photoRef = useRef<HTMLDivElement>(null)
  const photoInView = useInView(photoRef, { once: true, margin: "-5% 0px" })

  return (
    <div className="bg-[#0a0909] border border-[#1e1515] rounded-2xl overflow-hidden">
      {(photo1 || photo2) && (
        <div ref={photoRef} className="flex gap-3 p-4 pb-2">
          {[photo1, photo2].filter(Boolean).map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, rotate: i === 0 ? -4 : 3, y: 20 }}
              animate={photoInView ? { opacity: 1, rotate: i === 0 ? -1.5 : 1.5, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
              className="flex-1 bg-white p-2 pb-6 shadow-lg"
              style={{ boxShadow: "0 8px 28px rgba(0,0,0,0.6)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src!} alt="" className="w-full aspect-square object-cover" loading="lazy" />
            </motion.div>
          ))}
        </div>
      )}

      <div className="px-5 py-5">
        <div className="flex items-baseline gap-2 mb-4">
          <p className="font-serif text-xl md:text-2xl text-cream">{submission.name}</p>
          <span className="text-[#2e1a1a]">&middot;</span>
          <p className="font-sans text-sm md:text-base text-cream-dim">{submission.relationship}</p>
        </div>

        <p className="font-serif text-base md:text-lg text-cream leading-relaxed mb-4">
          &ldquo;{submission.message}&rdquo;
        </p>

        {submission.memory && (
          <div className="border-t border-[#1e1515] pt-4 mb-4">
            <p className="text-sm md:text-base font-sans text-crimson uppercase tracking-[0.15em] mb-2">A memory</p>
            <p className="font-serif text-base md:text-lg text-cream-dim leading-relaxed">{submission.memory}</p>
          </div>
        )}

        {submission.wish && (
          <div className="border-t border-[#1e1515] pt-4">
            <p className="text-sm md:text-base font-sans text-crimson uppercase tracking-[0.15em] mb-2">A wish</p>
            <p className="font-serif text-base md:text-lg text-cream-dim leading-relaxed italic">{submission.wish}</p>
          </div>
        )}
      </div>
    </div>
  )
}
