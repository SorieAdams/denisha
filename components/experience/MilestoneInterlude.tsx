
"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export default function MilestoneInterlude() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15% 0px" })

  return (
    <section
      ref={ref}
      className="flex flex-col items-center justify-center min-h-screen px-8 py-24 text-center relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full bg-crimson/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-xl mx-auto relative z-10"
      >
        {/* Image placeholder - Recommended size: 400x400px (square), PNG or JPG with transparent/clean background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ delay: 0.3, duration: 1.4, ease: "easeOut" }}
          className="flex justify-center mb-10"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden bg-[#1a1010]/30 border border-[#2e1a1a] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/milestone-image.png" 
              alt="Milestone celebration" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Fallback text when image is not available */}
            <noscript>
              <span className="text-cream-dim text-xs">Image: 400x400px</span>
            </noscript>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 1.2 }}
          className="font-sans text-sm md:text-base tracking-[0.25em] text-crimson uppercase mb-6"
        >
          A milestone worth honoring
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 1.2, ease: "easeOut" }}
          className="font-serif text-4xl md:text-5xl text-cream leading-snug mb-4"
        >
          She passed her PreMeds.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 1.2 }}
          className="font-serif text-base md:text-lg text-cream-dim leading-relaxed mb-8"
        >
          She is now entering medical school — a door that opened because she refused
          to stop pushing. Years of discipline, faith, and quiet determination.
          This year, it paid off.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.3, duration: 1 }}
        >
          <div className="divider-crimson w-10 mx-auto" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 1 }}
          className="font-serif text-sm md:text-base text-crimson italic mt-6"
        >
          Doctor Denisha is not a dream. It is what is next.
        </motion.p>
      </motion.div>
    </section>
  )
}
