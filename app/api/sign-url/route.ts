import { createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { paths } = await req.json() as { paths: string[] }
    
    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json({ error: "Invalid paths" }, { status: 400 })
    }

    const supabase = await createServiceClient()
    const signed: Record<string, string> = {}
    
    for (const path of paths) {
      if (!path) continue
      
      const { data, error } = await supabase.storage
        .from("denisha-memories")
        .createSignedUrl(path, 3600)
      
      if (error) {
        console.error(`Failed to sign URL for ${path}:`, error)
        continue
      }
      
      if (data?.signedUrl) {
        signed[path] = data.signedUrl
      }
    }
    
    return NextResponse.json(signed)
  } catch (error) {
    console.error("Sign URL error:", error)
    return NextResponse.json({ error: "Failed to sign URLs" }, { status: 500 })
  }
}
