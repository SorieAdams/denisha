
"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Submission, AnimationStyle } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"
import clsx from "clsx"

interface Props { submission: Submission }

export default function SubmissionDetail({ submission: initial }: Props) {
  const router = useRouter()
  const [sub, setSub] = useState(initial)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({})
  const [loadingPhotos, setLoadingPhotos] = useState(false)

  // Load signed URLs on mount
  useEffect(() => {
    const loadPhotos = async () => {
      const paths = [sub.photo_1_url, sub.photo_2_url].filter(Boolean) as string[]
      if (!paths.length) return
      
      setLoadingPhotos(true)
      try {
        const res = await fetch("/api/sign-url", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ paths }) 
        })
        const data = await res.json()
        setSignedUrls(data)
      } catch (error) {
        console.error("Failed to load photos:", error)
      } finally {
        setLoadingPhotos(false)
      }
    }

    loadPhotos()
  }, [sub.photo_1_url, sub.photo_2_url])

  const patch = async (updates: Partial<Submission>) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/submissions/${sub.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        const updated = await res.json()
        setSub(updated)
        router.refresh() // Refresh to update the dashboard
      } else {
        console.error("Failed to update submission")
      }
    } catch (error) {
      console.error("Error updating submission:", error)
    } finally {
      setSaving(false)
    }
  }

  const deleteSubmission = async () => {
    setDeleting(true)
    await fetch(`/api/admin/submissions/${sub.id}`, { method: "DELETE" })
    router.push("/admin/submissions")
    router.refresh()
  }

  const inputClass = "w-full bg-[#0f0e0e] border border-[#2e2a25] rounded-lg px-3 py-2.5 text-cream placeholder-[#4a4540] focus:outline-none focus:border-gold transition-colors font-sans text-sm resize-none"

  return (
    <div className="min-h-screen bg-[#0d0c0c]">
      <header className="border-b border-[#1e1b18] px-5 py-4 flex items-center gap-4">
        <Link href="/admin/submissions" className="text-xs font-sans text-[#5a5348] hover:text-cream-dim transition-colors">
          ← Back
        </Link>
        <div className="flex-1">
          <h1 className="font-serif text-base text-cream">{sub.name}</h1>
          <p className="text-xs font-sans text-cream-dim">{sub.relationship} · {CATEGORY_LABELS[sub.category]}</p>
        </div>
        <a href="/" target="_blank" className="text-xs font-sans text-cream-dim hover:text-gold transition-colors border border-[#2e2a25] px-3 py-1.5 rounded-md">
          Preview ↗
        </a>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-8 space-y-6">
        {/* Status controls */}
        <div className="bg-[#111010] border border-[#1e1b18] rounded-xl p-5">
          <p className="text-xs font-sans text-[#5a5348] uppercase tracking-[0.15em] mb-3">Status</p>
          <div className="flex gap-2">
            {(["approved", "pending", "rejected"] as const).map(s => (
              <button
                key={s}
                onClick={() => patch({ status: s })}
                disabled={saving}
                className={clsx(
                  "px-4 py-2 rounded-lg text-xs font-sans transition-colors",
                  sub.status === s
                    ? s === "approved" ? "bg-[#1a3320] text-[#5a9e6f] border border-[#2a5a30]"
                      : s === "rejected" ? "bg-[#2a1210] text-[#b05a4a] border border-[#4a2020]"
                      : "bg-[#1a1510] text-[#b8973f] border border-[#3a2e10]"
                    : "border border-[#2e2a25] text-[#5a5348] hover:text-cream-dim hover:border-[#5a5348]"
                )}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Display settings */}
        <div className="bg-[#111010] border border-[#1e1b18] rounded-xl p-5">
          <p className="text-xs font-sans text-[#5a5348] uppercase tracking-[0.15em] mb-3">Display settings</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans text-cream-dim mb-1.5">Animation style</label>
              <select
                value={sub.animation_style ?? ""}
                onChange={e => patch({ animation_style: (e.target.value || null) as AnimationStyle | null })}
                className="w-full bg-[#0f0e0e] border border-[#2e2a25] rounded-lg px-3 py-2.5 text-cream font-sans text-sm focus:outline-none focus:border-gold"
              >
                <option value="">Auto-alternate</option>
                <option value="polaroid">Polaroid</option>
                <option value="split">Split</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-sans text-cream-dim mb-1.5">Display order</label>
              <input
                type="number"
                value={sub.display_order ?? ""}
                onChange={e => setSub(s => ({ ...s, display_order: e.target.value ? parseInt(e.target.value) : null }))}
                onBlur={e => patch({ display_order: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="Auto"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#111010] border border-[#1e1b18] rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-sans text-[#5a5348] uppercase tracking-[0.15em]">Content</p>
            <button
              onClick={() => setEditing(e => !e)}
              className="text-xs font-sans text-cream-dim hover:text-gold transition-colors"
            >
              {editing ? "Done editing" : "Edit text"}
            </button>
          </div>

          {editing ? (
            <div className="space-y-4">
              {([
                { key: "name", label: "Name" },
                { key: "relationship", label: "Relationship" },
                { key: "message", label: "Message", rows: 4 },
                { key: "memory", label: "Memory (optional)", rows: 3 },
                { key: "wish", label: "Wish (optional)", rows: 2 },
              ] as const).map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-sans text-cream-dim mb-1.5">{field.label}</label>
                  {"rows" in field ? (
                    <textarea
                      rows={field.rows}
                      value={(sub[field.key] as string) ?? ""}
                      onChange={e => setSub(s => ({ ...s, [field.key]: e.target.value }))}
                      onBlur={e => patch({ [field.key]: e.target.value || null })}
                      className={inputClass}
                    />
                  ) : (
                    <input
                      value={(sub[field.key] as string) ?? ""}
                      onChange={e => setSub(s => ({ ...s, [field.key]: e.target.value }))}
                      onBlur={e => patch({ [field.key]: e.target.value })}
                      className={inputClass}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-sans text-[#5a5348] mb-1">Message</p>
                <p className="font-serif text-sm text-cream leading-relaxed">&ldquo;{sub.message}&rdquo;</p>
              </div>
              {sub.memory && (
                <div>
                  <p className="text-xs font-sans text-[#5a5348] mb-1">Memory</p>
                  <p className="font-serif text-sm text-cream-dim leading-relaxed">{sub.memory}</p>
                </div>
              )}
              {sub.wish && (
                <div>
                  <p className="text-xs font-sans text-[#5a5348] mb-1">Wish</p>
                  <p className="font-serif text-sm text-cream-dim leading-relaxed italic">{sub.wish}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Photos */}
        {(sub.photo_1_url || sub.photo_2_url) && (
          <div className="bg-[#111010] border border-[#1e1b18] rounded-xl p-5">
            <p className="text-xs font-sans text-[#5a5348] uppercase tracking-[0.15em] mb-3">Photos</p>
            {loadingPhotos ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-xs font-sans text-[#5a5348]">Loading photos...</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[sub.photo_1_url, sub.photo_2_url].filter(Boolean).map((path, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-[#0d0c0c] border border-[#1e1b18]">
                    {signedUrls[path!] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={signedUrls[path!]} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#3e3830] text-xs font-sans">
                        <div className="animate-pulse">Loading...</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="bg-[#111010] border border-[#1e1b18] rounded-xl p-5">
          <p className="text-xs font-sans text-[#5a5348] uppercase tracking-[0.15em] mb-3">Metadata</p>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-xs font-sans text-[#5a5348]">ID</dt>
              <dd className="text-xs font-sans text-cream-dim font-mono">{sub.id.slice(0, 8)}...</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-xs font-sans text-[#5a5348]">Submitted</dt>
              <dd className="text-xs font-sans text-cream-dim">{new Date(sub.created_at).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-xs font-sans text-[#5a5348]">Category</dt>
              <dd className="text-xs font-sans text-cream-dim">{CATEGORY_LABELS[sub.category]}</dd>
            </div>
          </dl>
        </div>

        {/* Delete */}
        <div className="pb-8">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs font-sans text-[#5a5348] hover:text-[#b05a4a] transition-colors"
            >
              Delete submission
            </button>
          ) : (
            <div className="bg-[#1a0f0e] border border-[#4a2020] rounded-xl p-4">
              <p className="text-sm font-sans text-cream mb-3">Delete this submission permanently?</p>
              <div className="flex gap-3">
                <button
                  onClick={deleteSubmission}
                  disabled={deleting}
                  className="px-4 py-2 bg-[#b05a4a] text-white font-sans text-xs rounded-lg hover:bg-[#8a4035] transition-colors disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 border border-[#2e2a25] text-cream-dim font-sans text-xs rounded-lg hover:border-[#5a5348] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
