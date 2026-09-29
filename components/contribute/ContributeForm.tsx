
"use client"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import imageCompression from "browser-image-compression"
import ConfirmationScreen from "./ConfirmationScreen"
import clsx from "clsx"

type Category = "family" | "friends" | "church" | "school_work" | "other"

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "family", label: "Family" },
  { value: "friends", label: "Friend" },
  { value: "church", label: "Faith / Church" },
  { value: "school_work", label: "Campus / Work" },
  { value: "other", label: "Other" },
]

const STEPS = 6

export default function ContributeForm() {
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState("")
  const [category, setCategory] = useState<Category | "">("")
  const [relationship, setRelationship] = useState("")
  const [message, setMessage] = useState("")
  const [memory, setMemory] = useState("")
  const [wish, setWish] = useState("")
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileRef = useRef<HTMLInputElement>(null)

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (step === 1 && !name.trim()) e.name = "Your name is required."
    if (step === 2) {
      if (!category) e.category = "Please choose a category."
      if (!relationship.trim()) e.relationship = "Please describe your relationship."
    }
    if (step === 3 && !message.trim()) e.message = "A birthday message is required."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (!validate()) return; setStep(s => Math.min(s + 1, STEPS)) }
  const back = () => setStep(s => Math.max(s - 1, 1))

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const toAdd = files.slice(0, 2 - photos.length)
    const compressed: File[] = []
    for (const file of toAdd) {
      try { compressed.push(await imageCompression(file, { maxSizeMB: 1.5, maxWidthOrHeight: 1920, useWebWorker: true })) }
      catch { compressed.push(file) }
    }
    setPhotos(prev => [...prev, ...compressed])
    setPhotoPreviews(prev => [...prev, ...compressed.map(f => URL.createObjectURL(f))])
    if (fileRef.current) fileRef.current.value = ""
  }

  const removePhoto = (i: number) => {
    setPhotos(p => p.filter((_, idx) => idx !== i))
    setPhotoPreviews(p => p.filter((_, idx) => idx !== i))
  }

  const submit = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, relationship, category, message, memory, wish }),
      })
      const { id, error } = await res.json()
      if (error || !id) throw new Error(error || "Unknown error")
      for (let i = 0; i < photos.length; i++) {
        const fd = new FormData()
        fd.append("file", photos[i])
        fd.append("submissionId", id)
        fd.append("slot", String(i + 1))
        await fetch("/api/upload", { method: "POST", body: fd })
      }
      setDone(true)
    } catch (err) {
      console.error(err)
      setErrors({ submit: "Something went wrong. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  if (done) return <ConfirmationScreen name={name} />

  const inputClass = "w-full bg-[#0f0e0e] border border-[#2e1a1a] rounded-lg px-4 py-3 text-cream placeholder-[#4a3535] focus:outline-none focus:border-crimson transition-colors resize-none font-sans text-sm"
  const errorClass = "mt-1 text-xs text-[#e07a5f] font-sans"

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12">
      <div className="text-center mb-10">
        <p className="text-xs font-sans tracking-[0.2em] text-crimson uppercase mb-3">For Denisha</p>
        <h1 className="text-2xl font-serif text-cream">Leave her a memory</h1>
        <p className="text-sm text-cream-dim font-sans mt-2">Your words will be part of her story on October 6th.</p>
      </div>

      <div className="w-full max-w-md mb-8">
        <div className="flex gap-1">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div key={i} className={clsx("h-0.5 flex-1 rounded-full transition-all duration-500", i < step ? "bg-crimson" : "bg-[#2e1a1a]")} />
          ))}
        </div>
        <p className="text-xs text-[#4a3535] font-sans mt-2 text-right">Step {step} of {STEPS}</p>
      </div>

      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {step === 1 && (
              <div>
                <label className="block text-sm font-sans text-cream-dim mb-2">What is your full name? <span className="text-crimson">*</span></label>
                <input className={inputClass} placeholder="Your name" value={name} onChange={e => { setName(e.target.value); setErrors({}) }} autoFocus />
                {errors.name && <p className={errorClass}>{errors.name}</p>}
              </div>
            )}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-sans text-cream-dim mb-3">How do you know Denisha? <span className="text-crimson">*</span></p>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(c => (
                      <button key={c.value} type="button" onClick={() => { setCategory(c.value); setErrors(e => ({ ...e, category: "" })) }}
                        className={clsx("py-3 px-4 rounded-lg border text-sm font-sans transition-all duration-200",
                          category === c.value ? "border-crimson text-crimson bg-[#150a0b]" : "border-[#2e1a1a] text-cream-dim hover:border-[#4a2a2a]")}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                  {errors.category && <p className={errorClass}>{errors.category}</p>}
                </div>
                <div>
                  <label className="block text-sm font-sans text-cream-dim mb-2">Describe your relationship specifically <span className="text-crimson">*</span></label>
                  <input className={inputClass} placeholder='e.g. "Older sister", "Best friend", "Study partner"' value={relationship} onChange={e => { setRelationship(e.target.value); setErrors(er => ({ ...er, relationship: "" })) }} />
                  {errors.relationship && <p className={errorClass}>{errors.relationship}</p>}
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <label className="block text-sm font-sans text-cream-dim mb-2">Write Denisha a birthday message <span className="text-crimson">*</span></label>
                <textarea className={clsx(inputClass, "min-h-[160px]")} placeholder="What do you want her to know on this day?" value={message} onChange={e => { setMessage(e.target.value); setErrors({}) }} maxLength={600} />
                <div className="flex justify-between mt-1">
                  {errors.message ? <p className={errorClass}>{errors.message}</p> : <span />}
                  <p className={clsx("text-xs font-sans", message.length > 500 ? "text-crimson" : "text-[#4a3535]")}>{message.length}/500</p>
                </div>
              </div>
            )}
            {step === 4 && (
              <div>
                <label className="block text-sm font-sans text-cream-dim mb-1">A memory you share with her</label>
                <p className="text-xs font-sans text-[#4a3535] mb-2">Optional &mdash; skip if you don&apos;t have one</p>
                <textarea className={clsx(inputClass, "min-h-[160px]")} placeholder="A story, a moment, a time that mattered..." value={memory} onChange={e => setMemory(e.target.value)} />
              </div>
            )}
            {step === 5 && (
              <div>
                <label className="block text-sm font-sans text-cream-dim mb-1">A wish for her new year</label>
                <p className="text-xs font-sans text-[#4a3535] mb-2">Optional &mdash; skip if you don&apos;t have one</p>
                <textarea className={clsx(inputClass, "min-h-[140px]")} placeholder="What do you wish for her in the year ahead?" value={wish} onChange={e => setWish(e.target.value)} />
              </div>
            )}
            {step === 6 && (
              <div>
                <label className="block text-sm font-sans text-cream-dim mb-1">Add up to 2 photos</label>
                <p className="text-xs font-sans text-[#4a3535] mb-4">Optional &mdash; jpg, png, or webp</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {photoPreviews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-[#2e1a1a]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removePhoto(i)} className="absolute top-2 right-2 w-6 h-6 bg-[#050505]/80 rounded-full text-cream text-xs flex items-center justify-center">&times;</button>
                    </div>
                  ))}
                  {photos.length < 2 && (
                    <button type="button" onClick={() => fileRef.current?.click()} className="aspect-square rounded-lg border border-dashed border-[#2e1a1a] flex flex-col items-center justify-center text-[#4a3535] hover:border-crimson hover:text-crimson transition-colors text-sm font-sans gap-1">
                      <span className="text-2xl">+</span>
                      <span>Add photo</span>
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handlePhoto} />
                {errors.submit && <p className={errorClass}>{errors.submit}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button type="button" onClick={back} className="flex-1 py-3 rounded-lg border border-[#2e1a1a] text-cream-dim font-sans text-sm hover:border-[#4a2a2a] transition-colors">Back</button>
          )}
          {step < STEPS ? (
            <button type="button" onClick={next} className="flex-1 py-3 rounded-lg bg-crimson text-cream font-sans text-sm font-medium hover:bg-crimson-light transition-colors">Continue</button>
          ) : (
            <button type="button" onClick={submit} disabled={loading} className="flex-1 py-3 rounded-lg bg-crimson text-cream font-sans text-sm font-medium hover:bg-crimson-light transition-colors disabled:opacity-50">
              {loading ? "Saving your memory..." : "Leave your memory ♡"}
            </button>
          )}
        </div>

        {step >= 4 && step < STEPS && (
          <button type="button" onClick={() => setStep(s => s + 1)} className="w-full mt-3 text-xs font-sans text-[#4a3535] hover:text-cream-dim transition-colors text-center">Skip this step</button>
        )}
      </div>
    </div>
  )
}
