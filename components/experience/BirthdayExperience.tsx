
"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Submission, Category } from "@/lib/types"
import { CATEGORY_LABELS, CATEGORY_FRAMING } from "@/lib/types"
import OpeningSequence from "./OpeningSequence"
import ChapterSection from "./ChapterSection"
import ClosingSequence from "./ClosingSequence"
import KeepsakeExport from "./KeepsakeExport"
import MilestoneInterlude from "./MilestoneInterlude"
import ScriptureMoment from "./ScriptureMoment"
import AuroraBackground from "./AuroraBackground"

// Ordered: family, friends, [SCRIPTURE], church/faith, [MILESTONE], school_work, other
const CHAPTER_ORDER: Category[] = ["family", "friends", "church", "school_work", "other"]

interface Props { submissions: Submission[] }

export default function BirthdayExperience({ submissions }: Props) {
  const [begun, setBegun] = useState(false)
  const [openingDone, setOpeningDone] = useState(false)
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null)
  const [muted, setMuted] = useState(false)

  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({})
  useEffect(() => {
    const paths = submissions.flatMap(s => [s.photo_1_url, s.photo_2_url]).filter(Boolean) as string[]
    if (!paths.length) return
    fetch("/api/sign-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paths }) })
      .then(r => r.json()).then(setSignedUrls).catch(() => {})
  }, [submissions])

  const begin = () => {
    setBegun(true)
    try {
      const audio = new Audio("/audio/background.mp3")
      audio.loop = true; audio.volume = 0.55
      audio.play().catch(() => {})
      setAudioEl(audio)
    } catch {}
  }

  const toggleMute = () => {
    if (!audioEl) return
    if (muted) { audioEl.volume = 0.35; setMuted(false) }
    else { audioEl.volume = 0; setMuted(true) }
  }

  const lowerVolume = () => { if (audioEl && !muted) audioEl.volume = 0.2 }

  const withStyles = submissions.map((s, i) => ({
    ...s,
    animation_style: s.animation_style ?? (i % 2 === 0 ? "polaroid" : "split") as "polaroid" | "split"
  }))

  const byCategory = CHAPTER_ORDER.reduce((acc, cat) => {
    acc[cat] = withStyles.filter(s => s.category === cat)
    return acc
  }, {} as Record<Category, typeof withStyles>)

  // Build rendered chapters with interludes injected
  const renderedChapters: JSX.Element[] = []
  let globalIdx = 0

  for (const cat of CHAPTER_ORDER) {
    // Scripture moment before Faith chapter
    if (cat === "church") {
      renderedChapters.push(<ScriptureMoment key="scripture" />)
    }
    // Milestone interlude before Campus chapter
    if (cat === "school_work") {
      renderedChapters.push(<MilestoneInterlude key="milestone" />)
    }
    if (byCategory[cat].length > 0) {
      renderedChapters.push(
        <ChapterSection
          key={cat}
          category={cat}
          label={CATEGORY_LABELS[cat]}
          framing={CATEGORY_FRAMING[cat]}
          submissions={byCategory[cat]}
          signedUrls={signedUrls}
          chapterIndex={globalIdx}
        />
      )
      globalIdx++
    }
  }

  return (
    <>
      <AuroraBackground />

      {/* Tap to begin */}
      <AnimatePresence>
        {!begun && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 bg-[#050505]/70 backdrop-blur-md flex flex-col items-center justify-center cursor-pointer"
            onClick={begin}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="text-center select-none"
            >
              <div className="w-20 h-20 rounded-full border border-[#2e1a1a] flex items-center justify-center mx-auto mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9b2335" strokeWidth="1.5">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              </div>
              <p className="text-cream-dim font-sans text-lg md:text-xl tracking-[0.15em]">Tap to begin</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {begun && !openingDone && (
        <OpeningSequence
          count={submissions.length}
          onComplete={() => { setOpeningDone(true); lowerVolume() }}
        />
      )}

      {openingDone && (
        <div className="bg-[#050505] relative z-10">
          {renderedChapters}
          <ClosingSequence />
          <KeepsakeExport submissions={withStyles} signedUrls={signedUrls} />
        </div>
      )}

      {/* Mute control */}
      {begun && audioEl && (
        <button
          onClick={toggleMute}
          className="fixed bottom-5 right-5 z-50 w-10 h-10 rounded-full border border-[#2e1a1a] bg-[#050505]/80 backdrop-blur-sm flex items-center justify-center text-cream-dim hover:text-cream hover:border-crimson transition-all"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      )}
    </>
  )
}
