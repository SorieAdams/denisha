import { createServiceClient } from "@/lib/supabase/server"
import BirthdayExperience from "@/components/experience/BirthdayExperience"
import type { Submission } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const supabase = createServiceClient()

  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("status", "approved")
    .order("display_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true })

  const submissions: Submission[] = data ?? []

  // Sign URLs on the server side using the same working pattern as /api/sign-url
  const signedUrls: Record<string, string> = {}
  const paths = submissions.flatMap(s => [s.photo_1_url, s.photo_2_url]).filter(Boolean) as string[]
  
  console.log("HomePage: Total approved submissions:", submissions.length)
  console.log("HomePage: Photo paths to sign:", paths.length)
  
  // Use the direct client creation pattern that works
  const { createServerClient } = await import("@supabase/ssr")
  const storageClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return [] },
        setAll() {},
      },
    }
  )
  
  for (const path of paths) {
    try {
      const { data: urlData, error } = await storageClient.storage
        .from("denisha-memories")
        .createSignedUrl(path, 3600)
      
      if (error) {
        console.error(`HomePage: Failed to sign ${path}:`, error.message)
        continue
      }
      
      if (urlData?.signedUrl) {
        signedUrls[path] = urlData.signedUrl
      }
    } catch (err) {
      console.error(`HomePage: Exception signing ${path}:`, err)
    }
  }
  
  console.log(`HomePage: Successfully signed ${Object.keys(signedUrls).length} of ${paths.length} photos`)

  return <BirthdayExperience submissions={submissions} initialSignedUrls={signedUrls} />
}
