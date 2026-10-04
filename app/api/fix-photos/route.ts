import { createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServiceClient()
    
    // Get all submissions with photos
    const { data: submissions, error: subError } = await supabase
      .from("submissions")
      .select("*")
      .or("photo_1_url.not.is.null,photo_2_url.not.is.null")
    
    if (subError) {
      return NextResponse.json({ error: "Failed to fetch submissions", details: subError }, { status: 500 })
    }
    
    const results = []
    
    for (const sub of submissions || []) {
      const subId = sub.id
      
      // List all files in this submission's folder
      const { data: files, error: listError } = await supabase.storage
        .from("denisha-memories")
        .list(`photos/${subId}`, {
          limit: 100,
          offset: 0,
        })
      
      if (listError) {
        results.push({
          id: subId,
          name: sub.name,
          error: listError,
          photo_1_url: sub.photo_1_url,
          photo_2_url: sub.photo_2_url
        })
        continue
      }
      
      // Check what files actually exist
      const actualFiles = files?.map(f => f.name) || []
      
      results.push({
        id: subId,
        name: sub.name,
        photo_1_url: sub.photo_1_url,
        photo_2_url: sub.photo_2_url,
        actualFiles,
        needsFix: actualFiles.length > 0 && (
          !actualFiles.includes(sub.photo_1_url?.split('/').pop() || '') ||
          !actualFiles.includes(sub.photo_2_url?.split('/').pop() || '')
        )
      })
    }
    
    return NextResponse.json({
      total: results.length,
      results
    })
  } catch (error) {
    console.error("Fix photos error:", error)
    return NextResponse.json({ error: "Failed to check photos", details: String(error) }, { status: 500 })
  }
}

export async function POST() {
  try {
    const supabase = createServiceClient()
    
    // Get all submissions with .blob photos
    const { data: submissions, error: subError } = await supabase
      .from("submissions")
      .select("*")
      .or("photo_1_url.like.%.blob,photo_2_url.like.%.blob")
    
    if (subError) {
      return NextResponse.json({ error: "Failed to fetch submissions", details: subError }, { status: 500 })
    }
    
    const fixed = []
    
    for (const sub of submissions || []) {
      const subId = sub.id
      const updates: any = {}
      
      // List files in folder
      const { data: files } = await supabase.storage
        .from("denisha-memories")
        .list(`photos/${subId}`, { limit: 100 })
      
      const actualFiles = files?.map(f => f.name) || []
      
      // Try to find the correct file for photo 1
      if (sub.photo_1_url?.endsWith('.blob')) {
        const correctFile = actualFiles.find(f => 
          f.startsWith('photo-1.') && !f.endsWith('.blob')
        )
        if (correctFile) {
          updates.photo_1_url = `photos/${subId}/${correctFile}`
        }
      }
      
      // Try to find the correct file for photo 2
      if (sub.photo_2_url?.endsWith('.blob')) {
        const correctFile = actualFiles.find(f => 
          f.startsWith('photo-2.') && !f.endsWith('.blob')
        )
        if (correctFile) {
          updates.photo_2_url = `photos/${subId}/${correctFile}`
        }
      }
      
      // Update if we found corrections
      if (Object.keys(updates).length > 0) {
        await supabase
          .from("submissions")
          .update(updates)
          .eq("id", subId)
        
        fixed.push({
          id: subId,
          name: sub.name,
          updates
        })
      }
    }
    
    return NextResponse.json({
      fixed: fixed.length,
      details: fixed
    })
  } catch (error) {
    console.error("Fix photos error:", error)
    return NextResponse.json({ error: "Failed to fix photos", details: String(error) }, { status: 500 })
  }
}
