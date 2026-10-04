import { createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServiceClient()
    
    // List all files in the bucket
    const { data: files, error: listError } = await supabase.storage
      .from("denisha-memories")
      .list("photos", {
        limit: 100,
        offset: 0,
      })
    
    if (listError) {
      console.error("List error:", listError)
      return NextResponse.json({ error: "Failed to list files", details: listError }, { status: 500 })
    }
    
    console.log("Files found:", files?.length)
    
    // Try to sign one URL
    if (files && files.length > 0) {
      const firstFolder = files[0]
      if (firstFolder.name) {
        // List files in the first folder
        const { data: folderFiles, error: folderError } = await supabase.storage
          .from("denisha-memories")
          .list(`photos/${firstFolder.name}`, {
            limit: 10,
            offset: 0,
          })
        
        if (!folderError && folderFiles && folderFiles.length > 0) {
          const testPath = `photos/${firstFolder.name}/${folderFiles[0].name}`
          console.log("Test path:", testPath)
          
          const { data: signData, error: signError } = await supabase.storage
            .from("denisha-memories")
            .createSignedUrl(testPath, 3600)
          
          if (signError) {
            console.error("Sign error:", signError)
            return NextResponse.json({ 
              error: "Failed to sign URL", 
              details: signError,
              testPath 
            }, { status: 500 })
          }
          
          return NextResponse.json({
            success: true,
            filesCount: files.length,
            testPath,
            signedUrl: signData?.signedUrl,
            message: "Storage is working correctly"
          })
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      filesCount: files?.length || 0,
      message: "Storage accessible but no files found to test signing"
    })
  } catch (error) {
    console.error("Test storage error:", error)
    return NextResponse.json({ error: "Failed to test storage", details: String(error) }, { status: 500 })
  }
}
