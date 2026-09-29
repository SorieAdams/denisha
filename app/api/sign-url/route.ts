import { createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { paths } = await req.json() as { paths: string[] }
    const supabase = await createServiceClient()
    const signed: Record<string, string> = {}
    for (const path of paths) {
      if (!path) continue
      const { data } = await supabase.storage
        .from("denisha-memories")
        .createSignedUrl(path, 3600)
      if (data?.signedUrl) signed[path] = data.signedUrl
    }
    return NextResponse.json(signed)
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}
