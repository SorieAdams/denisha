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

  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .single()

  if (!data) notFound()

  const submission = data as Submission

  // Generate signed URLs for photos server-side
  const signedUrls: Record<string, string> = {}
  const serviceSupabase = await createServiceClient()
  const paths = [submission.photo_1_url, submission.photo_2_url].filter(Boolean) as string[]
  
  console.log(`[SubmissionDetail ${id}] Photo paths:`, paths)
  
  for (const path of paths) {
    try {
      console.log(`[SubmissionDetail ${id}] Signing URL for:`, path)
      const { data: urlData, error } = await serviceSupabase.storage
        .from("denisha-memories")
        .createSignedUrl(path, 3600)
      
      if (error) {
        console.error(`[SubmissionDetail ${id}] Sign error for ${path}:`, error)
      } else if (urlData?.signedUrl) {
        console.log(`[SubmissionDetail ${id}] Successfully signed ${path}`)
        signedUrls[path] = urlData.signedUrl
      } else {
        console.error(`[SubmissionDetail ${id}] No signedUrl returned for ${path}`)
      }
    } catch (err) {
      console.error(`[SubmissionDetail ${id}] Exception signing ${path}:`, err)
    }
  }
  
  console.log(`[SubmissionDetail ${id}] Total signed URLs:`, Object.keys(signedUrls).length)
  console.log(`[SubmissionDetail ${id}] Signed URL keys:`, Object.keys(signedUrls))

  return <SubmissionDetail submission={submission} initialSignedUrls={signedUrls} />
}
