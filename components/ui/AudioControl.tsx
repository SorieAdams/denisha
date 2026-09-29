
"use client"
import { useEffect, useRef, useState } from "react"

interface AudioControlProps {
  src: string
  autoPlay?: boolean
  volume?: number
}

export default function AudioControl({ src, autoPlay = false, volume = 0.35 }: AudioControlProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!autoPlay) return
    const audio = new Audio(src)
    audio.loop = true
    audio.volume = volume
    audioRef.current = audio
    audio.play().then(() => setStarted(true)).catch(() => {})
    return () => { audio.pause(); audio.src = "" }
  }, [src, autoPlay, volume])

  const toggle = () => {
    if (!audioRef.current) return
    if (muted) {
      audioRef.current.volume = volume
      setMuted(false)
    } else {
      audioRef.current.volume = 0
      setMuted(true)
    }
  }

  if (!started && !autoPlay) return null

  return (
    <button
      onClick={toggle}
      className="fixed bottom-5 right-5 z-50 w-10 h-10 rounded-full border border-[#2e2a25] bg-midnight/80 backdrop-blur-sm flex items-center justify-center text-cream-dim hover:text-cream hover:border-gold transition-all"
      aria-label={muted ? "Unmute" : "Mute"}
    >
      {muted ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  )
}

export function startAudio(src: string, volume: number = 0.35): HTMLAudioElement {
  const audio = new Audio(src)
  audio.loop = true
  audio.volume = volume
  audio.play().catch(() => {})
  return audio
}
