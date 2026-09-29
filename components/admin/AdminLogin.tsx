
"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError("Invalid credentials.")
      setLoading(false)
    } else {
      router.push("/admin/submissions")
      router.refresh()
    }
  }

  const inputClass = "w-full bg-[#0f0e0e] border border-[#2e2a25] rounded-lg px-4 py-3 text-cream placeholder-[#4a4540] focus:outline-none focus:border-gold transition-colors font-sans text-sm"

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-midnight">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-xs font-sans tracking-[0.2em] text-gold uppercase mb-2">Admin</p>
          <h1 className="font-serif text-2xl text-cream">Memory Book</h1>
        </div>

        <form onSubmit={login} className="space-y-4">
          <div>
            <input
              type="email"
              className={inputClass}
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <input
              type="password"
              className={inputClass}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-xs text-[#e07a5f] font-sans">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-midnight font-sans text-sm font-medium rounded-lg hover:bg-[#b8973f] transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}
