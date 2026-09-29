
"use client"
import { useMemo, useState, useEffect } from "react"

export default function SparkleBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sparks = useMemo(() => {
    if (!mounted) return []
    return Array.from({ length: 28 }, (_, i) => ({
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
    </div>
  )
}
