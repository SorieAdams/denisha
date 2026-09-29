
"use client"
import { motion } from "framer-motion"

export default function ConfirmationScreen({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#050505]"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
        className="max-w-sm"
      >
        <div className="w-16 h-16 rounded-full border border-crimson flex items-center justify-center mx-auto mb-8">
          <span className="text-crimson text-2xl">&hearts;</span>
        </div>
        <p className="text-xs font-sans tracking-[0.2em] text-crimson uppercase mb-4">Memory saved</p>
        <h2 className="text-2xl font-serif text-cream mb-4">Thank you, {name}.</h2>
        <p className="text-sm font-sans text-cream-dim leading-relaxed mb-3">
          Your memory is safe. It will be woven into her story and revealed to her on October 6th.
        </p>
        <p className="text-sm font-sans text-cream-dim leading-relaxed">She will feel you in it.</p>
        <div className="mt-12 divider-crimson w-24 mx-auto" />
        <p className="text-xs font-sans text-[#2e1a1a] mt-8">You may close this page.</p>
      </motion.div>
    </motion.div>
  )
}
