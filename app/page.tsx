import { createServiceClient } from "@/lib/supabase/server"
import BirthdayExperience from "@/components/experience/BirthdayExperience"
import type { Submission } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const supabase = await createServiceClient()

  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("status", "approved")
    .order("display_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true })

  const submissions: Submission[] = data ?? []

  // Sign URLs on the server side
  const signedUrls: Record<string, string> = {}
  const paths = submissions.flatMap(s => [s.photo_1_url, s.photo_2_url]).filter(Boolean) as string[]
  
  console.log("HomePage: Total approved submissions:", submissions.length)
  console.log("HomePage: Photo paths to sign:", paths)
  
  for (const path of paths) {
    try {
      const { data: urlData, error } = await supabase.storage
        .from("denisha-memories")
        .createSignedUrl(path, 3600)
      
      if (error) {
        console.error(`HomePage: Failed to sign ${path}:`, error)
        continue
      }
      
      if (urlData?.signedUrl) {
        console.log(`HomePage: Successfully signed ${path}`)
        signedUrls[path] = urlData.signedUrl
      } else {
        console.error(`HomePage: No signedUrl returned for ${path}`)
      }
    } catch (err) {
      console.error(`HomePage: Exception signing ${path}:`, err)
    }
  }
  
  console.log(`HomePage: Successfully signed ${Object.keys(signedUrls).length} of ${paths.length} photos`)
  console.log("HomePage: Signed URL keys:", Object.keys(signedUrls))

  return <BirthdayExperience submissions={submissions} initialSignedUrls={signedUrls} />
}
