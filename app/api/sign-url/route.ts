import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { paths } = body as { paths: string[] }
    
    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json({ error: "Invalid paths" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { autoRefreshToken: false, persistSession: false },
      }
    )
    
    const signed: Record<string, string> = {}
    
    for (const path of paths) {
      if (!path) continue
      try {
        const { data, error } = await supabase.storage
          .from("denisha-memories")
          .createSignedUrl(path, 3600)
        
        if (!error && data?.signedUrl) {
          signed[path] = data.signedUrl
        }
      } catch (signError) {
        console.error(`Failed to sign ${path}:`, signError)
      }
    }
    
    return NextResponse.json(signed)
  } catch (error) {
    return NextResponse.json({ error: "Failed to sign URLs" }, { status: 500 })
  }
}
