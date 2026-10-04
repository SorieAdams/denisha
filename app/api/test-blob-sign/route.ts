import { createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServiceClient()
    
    const testPath = "photos/174bd4d7-86bf-482a-9290-06517065aa5e/photo-1.blob"
    
    console.log("[test-blob-sign] Attempting to sign:", testPath)
    
    const { data, error } = await supabase.storage
      .from("denisha-memories")
      .createSignedUrl(testPath, 3600)
    
    if (error) {
      console.error("[test-blob-sign] Error:", error)
      return NextResponse.json({
        success: false,
        path: testPath,
        error: {
          message: error.message,
          statusCode: error.statusCode,
          name: error.name
        }
      })
    }
    
    if (data?.signedUrl) {
      console.log("[test-blob-sign] Success! URL:", data.signedUrl.substring(0, 100))
      return NextResponse.json({
        success: true,
        path: testPath,
        signedUrl: data.signedUrl,
        canAccess: "Try opening the signedUrl in a browser"
      })
    }
    
    return NextResponse.json({
      success: false,
      path: testPath,
      error: "No signed URL returned"
    })
  } catch (error) {
    console.error("[test-blob-sign] Exception:", error)
    return NextResponse.json({ 
      success: false,
      error: String(error) 
    }, { status: 500 })
  }
}
