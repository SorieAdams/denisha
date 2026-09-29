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

  return <BirthdayExperience submissions={submissions} />
}
