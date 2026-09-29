
"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import SunflowerSVG from "./SunflowerSVG"

export default function ClosingSequence() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15% 0px" })

  return (
    <section ref={ref} className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2 }}
        className="divider-crimson w-16 mx-auto mb-20"
      />

      <div className="max-w-sm mx-auto space-y-8">
        {/* Sorie's personal message — placeholder blocks below */}
        {/* EDIT THESE PARAGRAPHS WITH YOUR OWN WORDS BEFORE LAUNCH */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
          className="font-serif text-sm text-cream-dim leading-loose"
        >
          You carry yourself with a quiet kind of strength that most people don’t even recognize
          as strength — because it isn’t loud. It doesn’t need to be. It shows up
          in the discipline you keep when no one is watching, in the faith you hold
          when things don’t make sense yet, in the way you simply keep going.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
          className="font-serif text-sm text-cream-dim leading-loose"
        >
          {/* → Replace this paragraph with your own personal words to Denisha */}
          [Write your personal message to her here. This is the longest, most personal
          block in the experience. Take your time with it. It will be the last thing
          she reads before &ldquo;Happy Birthday.&rdquo;]
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 1.2, ease: "easeOut" }}
          className="font-serif text-sm text-cream-dim leading-loose"
        >
          The people in this experience didn’t just know your name.
          They knew you. And every single one of them wanted you to feel that today.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 1.5 }}
          className="font-serif text-2xl text-cream pt-4"
        >
          Happy Birthday, Denisha.
        </motion.p>

        {/* Blessing line — echoes her faith, studies, and future love */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 2, duration: 1.5 }}
          className="font-sans text-xs tracking-[0.15em] text-crimson uppercase"
        >
          May this new chapter carry the same grace that brought you this far
          — in your faith, your calling, and the love still ahead of you.
        </motion.p>

        {/* Sunflower motif */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={inView ? { opacity: 0.5, scale: 1 } : {}}
          transition={{ delay: 2.4, duration: 1.2 }}
          className="flex justify-center pt-4"
        >
          <SunflowerSVG size={44} color="#9b2335" />
        </motion.div>

        {/* Replay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 2.8, duration: 1 }}
          className="pt-4"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm font-sans text-cream-dim hover:text-cream transition-colors border-b border-[#2e1a1a] hover:border-cream pb-0.5"
          >
            &hearts; Replay your memories
          </button>
        </motion.div>
      </div>
    </section>
  )
}
