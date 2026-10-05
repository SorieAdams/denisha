"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
  count: number
  onComplete: () => void
}

// Three rhythm-line variants for Sorie to choose from.
// Active one is LINES[2] (index 2). Swap to [2b] or [2c] before launch.
const RHYTHM_LINE = "You are Passionate. Focused. Unstoppable when you sets your mind to something, Faithful. Determined. Someone who turns conviction into action, Rooted. Relentless. Someone the people around her quietly count on. But For Me, I am your boxing bag, anger collector etc. But I Love It.. I Love everything but sometimes..i don't know.. "

const LINES: { text: string; size: "large" | "normal" | "small"; showSunflower?: boolean }[] = [
  { text: "For someone very special...", size: "small" },
  { text: "Denisha Salamatou Voegli", size: "large", showSunflower: true },
  { text: RHYTHM_LINE, size: "small" },
  { text: "Today is about you.", size: "normal" },
  { text: 
    "Sometimes I wonder... 🤍 Why did you allow me to be the one who calls you anytime? Why am I the one who gets your attention anytime? Why am I the one you share so many deep things with? Even though I’ve made you cry... made you angry... and kept messing up in ways I probably shouldn’t have... 😔 Yet somehow, you kept giving me chances. You kept showing grace. You kept letting me stay. 🤍 And honestly... I don’t even have much to give you on this birthday. 🎂", size: "normal" },
  { text:  "But I wanted to give you something that could hold the things money can't buy... Memories, Words, Laughter, Prayers, Moments. People who love and appreciate you. 🌻✨", size: "normal" },
  { text: "So... I made this for you, Your first gift. 🎁 Not just a website... but a little place where some of the people and moments that have been part of your journey can live together. A place you can come back to... whenever you want to remember how loved, appreciated, and prayed for you are", size: "normal" },
  { text: "So, Denisha...Now... let's turn the pages. ✨", size: "small" },
  { text: "Welcome to your Memory Book. 📖🌻.", size: "normal" },
]

export default function OpeningSequence({ count, onComplete }: Props) {
  const [phase, setPhase] = useState(0)
  const [showCount, setShowCount] = useState(false)
  const [exiting, setExiting] = useState(false)

  const handleTap = () => {
    if (showCount) {
      // Move to exit after count screen
      setExiting(true)
      setTimeout(() => onComplete(), 1000)
    } else if (phase < LINES.length) {
      // Move to next line
      setPhase(prev => prev + 1)
    } else {
      // All lines shown, show count
      setShowCount(true)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-40 bg-[#050505]/60 backdrop-blur-sm flex flex-col items-center justify-center px-8 cursor-pointer"
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 1.6 }}
      onClick={handleTap}
    >
      <div className="text-center max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {!showCount ? (
            <motion.div 
              key={`phase-${phase}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              {phase < LINES.length && (
                <>
                  <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.3, ease: "easeOut" }}
                    className={`
                      ${
                        LINES[phase].size === "large"
                          ? "font-serif text-5xl md:text-6xl tracking-[0.1em] text-cream mb-6 mt-2"
                          : LINES[phase].size === "small"
                          ? "font-sans text-base md:text-lg tracking-[0.07em] text-cream-dim leading-relaxed"
                          : "font-serif text-2xl md:text-3xl text-cream leading-snug"
                      }
                    `}
                  >
                    {LINES[phase].text}
                  </motion.p>

                  {/* Sunflower image below name */}
                  {LINES[phase].showSunflower && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                      className="flex justify-center mt-6"
                    >
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-[#1a1010]/30 border border-[#2e1a1a] flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src="/milestone-image.png" 
                          alt="Sunflower" 
                          className="w-full h-full object-cover"
                          loading="eager"
                        />
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {/* Tap indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="pt-8 flex justify-center items-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9b2335" strokeWidth="1.5">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
                <p className="font-sans text-sm text-cream-dim tracking-wider">Tap to continue</p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="count"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 1.2 }}
              className="text-center"
            >
              <p className="font-sans text-base md:text-lg tracking-[0.2em] text-crimson uppercase mb-4">Waiting for you</p>
              <p className="font-serif text-4xl md:text-5xl text-cream">
                {count} {count === 1 ? "person" : "people"} left something for you.
              </p>
              <div className="mt-8 divider-crimson w-16 mx-auto" />
              {/* Tap indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="pt-8 flex justify-center items-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9b2335" strokeWidth="1.5">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
                <p className="font-sans text-sm text-cream-dim tracking-wider">Tap to continue</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
