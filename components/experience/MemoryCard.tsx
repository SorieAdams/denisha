
"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import type { Submission } from "@/lib/types"
import PolaroidCard from "./PolaroidCard"
import SplitCard from "./SplitCard"

interface Props {
  submission: Submission & { animation_style: "polaroid" | "split" }
  signedUrls: Record<string, string>
  index: number
}

export default function MemoryCard({ submission, signedUrls, index }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })

  const photo1 = submission.photo_1_url ? signedUrls[submission.photo_1_url] : null
  const photo2 = submission.photo_2_url ? signedUrls[submission.photo_2_url] : null

  console.log(`MemoryCard ${index} - ${submission.name}:`, {
    photo_1_url: submission.photo_1_url,
    photo_2_url: submission.photo_2_url,
    photo1_signed: photo1,
    photo2_signed: photo2
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
    >
      {submission.animation_style === "polaroid" ? (
        <PolaroidCard submission={submission} photo1={photo1} photo2={photo2} />
      ) : (
        <SplitCard submission={submission} photo1={photo1} photo2={photo2} />
      )}
    </motion.div>
  )
}
