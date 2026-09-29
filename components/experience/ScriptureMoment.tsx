
"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export default function ScriptureMoment() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-20% 0px" })

  return (
    <section ref={ref} className="flex flex-col items-center justify-center min-h-[70vh] px-8 py-20 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 2, ease: "easeOut" }}
        className="max-w-xs mx-auto"
      >
        {/* Thin top rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2 }}
          className="divider-crimson w-12 mx-auto mb-12"
        />

        <p className="font-serif text-xl text-cream leading-relaxed mb-6">
          &ldquo;When the time is right,
          <br />
          I the Lord will make it happen.&rdquo;
        </p>

        <p className="font-sans text-xs tracking-[0.18em] text-crimson uppercase">
          Isaiah 60:22
        </p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.4, duration: 1.2 }}
          className="divider-crimson w-12 mx-auto mt-12"
        />
      </motion.div>
    </section>
  )
}
