import { createClient, createServiceClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SubmissionsDashboard from "@/components/admin/SubmissionsDashboard"
import type { Submission } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function SubmissionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin")

  const serviceSupabase = await createServiceClient()
  const { data } = await serviceSupabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false })

  const submissions: Submission[] = data ?? []

  return <SubmissionsDashboard submissions={submissions} />
}
