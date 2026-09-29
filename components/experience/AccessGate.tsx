"use client"
import { useState } from "react"
import { motion } from "framer-motion"

interface Props {
  onCorrectCode: () => void
}

const CORRECT_CODE = process.env.NEXT_PUBLIC_ACCESS_CODE || "2522"

export default function AccessGate({ onCorrectCode }: Props) {
  const [code, setCode] = useState("")
  const [error, setError] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (code === CORRECT_CODE) {
      // Store access in sessionStorage so they don't need to re-enter
      sessionStorage.setItem("denisha_access", "granted")
      onCorrectCode()
    } else {
      setError(true)
      setIsShaking(true)
      setTimeout(() => {
        setIsShaking(false)
        setCode("")
        setTimeout(() => setError(false), 500)
      }, 600)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setCode(value)
    setError(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center px-6">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #9b2335 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 text-center max-w-md w-full"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-20 h-20 rounded-full border-2 border-[#2e1a1a] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9b2335" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-serif text-3xl md:text-4xl text-cream mb-3"
        >
          Private Memory
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="font-sans text-sm md:text-base text-cream-dim tracking-[0.08em] mb-10 leading-relaxed"
        >
          This birthday experience is protected.
          <br />
          Enter the access code to continue.
        </motion.p>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Code Input */}
          <motion.div
            animate={isShaking ? {
              x: [0, -10, 10, -10, 10, 0],
              transition: { duration: 0.5 }
            } : {}}
          >
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              value={code}
              onChange={handleInputChange}
              placeholder="• • • •"
              maxLength={4}
              className={`
                w-full max-w-xs mx-auto px-6 py-4 
                bg-[#0a0909] border-2 rounded-lg
                text-center text-2xl tracking-[0.5em] font-mono
                text-cream placeholder-[#2e1a1a]
                focus:outline-none focus:border-crimson
                transition-all duration-300
                ${error ? 'border-crimson' : 'border-[#1e1515]'}
              `}
              autoFocus
              autoComplete="off"
            />
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-crimson text-sm font-sans"
            >
              Incorrect code. Please try again.
            </motion.p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={code.length !== 4}
            className={`
              px-8 py-3 rounded-lg font-sans text-sm tracking-[0.15em] uppercase
              transition-all duration-300
              ${code.length === 4
                ? 'bg-crimson text-cream hover:bg-[#7a1b29] cursor-pointer'
                : 'bg-[#1e1515] text-[#4a4040] cursor-not-allowed'
              }
            `}
          >
            Enter
          </button>
        </motion.form>

        {/* Decorative Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="divider-crimson w-16 mx-auto mt-12"
        />
      </motion.div>
    </div>
  )
}
