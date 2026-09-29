
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import type { Submission, Status, Category } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"
import clsx from "clsx"

const STATUS_COLORS: Record<Status, string> = {
  pending: "text-[#b8973f] bg-[#1a1510]",
  approved: "text-[#5a9e6f] bg-[#0f1a12]",
  rejected: "text-[#b05a4a] bg-[#1a0f0e]",
}

interface Props { submissions: Submission[] }

export default function SubmissionsDashboard({ submissions }: Props) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all")

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === "pending").length,
    approved: submissions.filter(s => s.status === "approved").length,
    rejected: submissions.filter(s => s.status === "rejected").length,
  }

  const filtered = submissions.filter(s => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false
    if (categoryFilter !== "all" && s.category !== categoryFilter) return false
    return true
  })

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin")
    router.refresh()
  }

  const filterBtn = (active: boolean) =>
    clsx("px-3 py-1.5 rounded-md text-xs font-sans transition-colors",
      active ? "bg-gold text-midnight font-medium" : "text-cream-dim hover:text-cream border border-[#2e2a25] hover:border-[#5a5348]")

  return (
    <div className="min-h-screen bg-[#0d0c0c]">
      {/* Nav */}
      <header className="border-b border-[#1e1b18] px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-sans text-gold tracking-[0.15em] uppercase">Admin</p>
          <h1 className="font-serif text-lg text-cream">Submissions</h1>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-xs font-sans text-cream-dim hover:text-gold transition-colors border border-[#2e2a25] px-3 py-1.5 rounded-md">
            Preview as Denisha ↗
          </a>
          <button onClick={logout} className="text-xs font-sans text-[#5a5348] hover:text-cream-dim transition-colors">
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {([
            { label: "Total", value: stats.total, color: "text-cream" },
            { label: "Pending", value: stats.pending, color: "text-[#b8973f]" },
            { label: "Approved", value: stats.approved, color: "text-[#5a9e6f]" },
            { label: "Rejected", value: stats.rejected, color: "text-[#b05a4a]" },
          ]).map(stat => (
            <div key={stat.label} className="bg-[#111010] border border-[#1e1b18] rounded-xl px-4 py-4">
              <p className="text-xs font-sans text-[#5a5348] mb-1">{stat.label}</p>
              <p className={`text-3xl font-serif ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex gap-1.5 flex-wrap">
            {(["all", "pending", "approved", "rejected"] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={filterBtn(statusFilter === s)}>
                {s === "all" ? "All status" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(["all", "family", "friends", "church", "school_work", "other"] as const).map(c => (
              <button key={c} onClick={() => setCategoryFilter(c)} className={filterBtn(categoryFilter === c)}>
                {c === "all" ? "All categories" : CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <p className="text-center text-[#5a5348] font-sans text-sm py-12">No submissions match this filter.</p>
          )}
          {filtered.map(sub => (
            <Link
              key={sub.id}
              href={`/admin/submissions/${sub.id}`}
              className="flex items-center justify-between gap-3 bg-[#111010] border border-[#1e1b18] rounded-xl px-4 py-4 hover:border-[#3e3830] transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-serif text-sm text-cream truncate">{sub.name}</p>
                  <span className="text-[#3e3830]">·</span>
                  <p className="font-sans text-xs text-cream-dim truncate">{sub.relationship}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-sans text-[#5a5348]">{CATEGORY_LABELS[sub.category]}</span>
                  {(sub.photo_1_url || sub.photo_2_url) && (
                    <span className="text-[#3e3830] text-xs">· 📷 photo</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={clsx("px-2 py-0.5 rounded text-xs font-sans", STATUS_COLORS[sub.status])}>
                  {sub.status}
                </span>
                <svg className="text-[#3e3830] group-hover:text-cream-dim transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
