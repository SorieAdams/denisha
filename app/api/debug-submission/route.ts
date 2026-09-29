import { createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 })
    }
    
    const supabase = await createServiceClient()
    
    // Get submission
    const { data: submission, error: subError } = await supabase
      .from("submissions")
      .select("*")
      .eq("id", id)
      .single()
    
    if (subError || !submission) {
      return NextResponse.json({ error: "Submission not found", details: subError }, { status: 404 })
    }
    
    // Try to list files in the submission folder
    const { data: files, error: listError } = await supabase.storage
      .from("denisha-memories")
      .list(`photos/${id}`, {
        limit: 100,
        offset: 0,
      })
    
    // Try to sign URLs
    const signedUrls: Record<string, any> = {}
    const paths = [submission.photo_1_url, submission.photo_2_url].filter(Boolean) as string[]
    
    for (const path of paths) {
      const { data: urlData, error: signError } = await supabase.storage
        .from("denisha-memories")
        .createSignedUrl(path, 3600)
      
      signedUrls[path] = {
        success: !signError,
        error: signError,
        signedUrl: urlData?.signedUrl?.substring(0, 100) + "..." || null
      }
    }
    
    return NextResponse.json({
      submission: {
        id: submission.id,
        name: submission.name,
        photo_1_url: submission.photo_1_url,
        photo_2_url: submission.photo_2_url,
      },
      filesInFolder: listError ? { error: listError } : files,
      signedUrls
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({ error: "Failed to debug", details: String(error) }, { status: 500 })
  }
}
