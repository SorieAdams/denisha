import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import SubmissionDetail from "@/components/admin/SubmissionDetail"
import type { Submission } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin")

  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .single()

  if (!data) notFound()

  return <SubmissionDetail submission={data as Submission} />
}
