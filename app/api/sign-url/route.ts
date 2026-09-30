import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log("[sign-url] API route called")
  
  try {
    const body = await req.json()
    console.log("[sign-url] Request body:", body)
    
    const { paths } = body as { paths: string[] }
    
    if (!paths || !Array.isArray(paths)) {
      console.error("[sign-url] Invalid paths format:", paths)
      return NextResponse.json({ error: "Invalid paths" }, { status: 400 })
    }

    console.log("[sign-url] Creating Supabase client with service role key...")
    
    // Create client directly with service role key (no caching)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return [] },
          setAll() {},
        },
      }
    )
    
    console.log("[sign-url] Service client created")
    
    const signed: Record<string, string> = {}
    
    for (const path of paths) {
      if (!path) {
        console.log("[sign-url] Skipping empty path")
        continue
      }
      
      console.log(`[sign-url] Signing URL for: "${path}"`)
      
      try {
        const { data, error } = await supabase.storage
          .from("denisha-memories")
          .createSignedUrl(path, 3600)
        
        if (error) {
          console.error(`[sign-url] Error signing ${path}:`, JSON.stringify(error))
          continue
        }
        
        if (data?.signedUrl) {
          console.log(`[sign-url] SUCCESS for ${path}`)
          console.log(`[sign-url] Signed URL: ${data.signedUrl.substring(0, 100)}...`)
          signed[path] = data.signedUrl
        } else {
          console.error(`[sign-url] No signedUrl in response for ${path}:`, data)
        }
      } catch (signError) {
        console.error(`[sign-url] Exception signing ${path}:`, signError)
      }
    }
    
    console.log(`[sign-url] Total signed URLs: ${Object.keys(signed).length}`)
    console.log(`[sign-url] Returning:`, Object.keys(signed))
    return NextResponse.json(signed)
  } catch (error) {
    console.error("[sign-url] Top-level error:", error)
    return NextResponse.json({ error: "Failed to sign URLs" }, { status: 500 })
  }
}
