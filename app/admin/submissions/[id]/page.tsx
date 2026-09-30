import { createClient, createServiceClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import SubmissionDetail from "@/components/admin/SubmissionDetail"
import type { Submission } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin")

  // Use service client for everything
  const serviceSupabase = await createServiceClient()
  
  const { data } = await serviceSupabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .single()

  if (!data) notFound()

  const submission = data as Submission

  // Note: Server-side URL signing has auth context issues in Next.js 15
  // We rely on client-side loading via /api/sign-url instead
  const signedUrls: Record<string, string> = {}

  return <SubmissionDetail submission={submission} initialSignedUrls={signedUrls} />
}
