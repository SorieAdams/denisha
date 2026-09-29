"use client"
import { useMemo, useState, useEffect } from "react"

export default function AuroraBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sparks = useMemo(() => {
    if (!mounted) return []
    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${(Math.random() * 8).toFixed(2)}s`,
      duration: `${(3 + Math.random() * 5).toFixed(2)}s`,
      size: Math.random() > 0.7 ? 4 : 2,
      opacity: (0.2 + Math.random() * 0.5).toFixed(2),
    }))
  }, [mounted])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {/* Aurora gradient waves */}
      <div className="absolute inset-0 aurora-bg">
        {/* First aurora wave */}
        <div className="aurora-wave aurora-wave-1" />
        {/* Second aurora wave */}
        <div className="aurora-wave aurora-wave-2" />
        {/* Third aurora wave */}
        <div className="aurora-wave aurora-wave-3" />
      </div>

      {/* Glassmorphism orbs */}
      <div className="glass-orb glass-orb-1" />
      <div className="glass-orb glass-orb-2" />
      <div className="glass-orb glass-orb-3" />

      {/* Neumorphism floating elements */}
      <div className="neuro-element neuro-element-1" />
      <div className="neuro-element neuro-element-2" />
      <div className="neuro-element neuro-element-3" />

      {/* Sparkle particles */}
      {sparks.map(s => (
        <span
          key={s.id}
          className="sparkle-dot"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
            opacity: 0,
          }}
        />
      ))}

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/30 to-[#050505]/80" />
    </div>
  )
}
