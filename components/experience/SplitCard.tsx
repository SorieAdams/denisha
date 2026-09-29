
"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import type { Submission } from "@/lib/types"

interface Props {
  submission: Submission
  photo1: string | null
  photo2: string | null
}

export default function SplitCard({ submission, photo1, photo2 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-5% 0px" })

  return (
    <div ref={ref} className="bg-[#0a0909] border border-[#1e1515] rounded-2xl overflow-hidden">
      {photo1 && (
        <div className="flex flex-col sm:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="sm:w-2/5 aspect-square sm:aspect-auto"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo1} alt="" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 p-5 flex flex-col justify-center"
          >
            <div className="flex items-baseline gap-2 mb-4">
              <p className="font-serif text-xl md:text-2xl text-cream">{submission.name}</p>
              <span className="text-[#2e1a1a]">&middot;</span>
              <p className="font-sans text-sm md:text-base text-cream-dim">{submission.relationship}</p>
            </div>
            <p className="font-serif text-base md:text-lg text-cream leading-relaxed">&ldquo;{submission.message}&rdquo;</p>
          </motion.div>
        </div>
      )}

      {(!photo1 || submission.memory || submission.wish || photo2) && (
        <div className="px-5 py-5">
          {!photo1 && (
            <>
              <div className="flex items-baseline gap-2 mb-4">
                <p className="font-serif text-xl md:text-2xl text-cream">{submission.name}</p>
                <span className="text-[#2e1a1a]">&middot;</span>
                <p className="font-sans text-sm md:text-base text-cream-dim">{submission.relationship}</p>
              </div>
              <p className="font-serif text-base md:text-lg text-cream leading-relaxed mb-4">&ldquo;{submission.message}&rdquo;</p>
            </>
          )}
          {photo2 && (
            <div className="mb-4 rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo2} alt="" className="w-full aspect-video object-cover" loading="lazy" />
            </div>
          )}
          {submission.memory && (
            <div className={`${photo1 ? "border-t border-[#1e1515] pt-4 " : ""}mb-4`}>
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
      )}
    </div>
  )
}
