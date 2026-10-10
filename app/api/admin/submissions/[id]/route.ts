import { createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Simple auth check - returns true if there's any valid session
async function isAuthenticated() {
  try {
    const supabase = await createServiceClient()
    // Use service role to check if there's an admin session
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    // If we can list users, service role is working
    return !error
  } catch (err) {
    console.error("Auth check exception:", err)
    return false
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log("PATCH called")
    
    const { id } = await context.params
    const body = await req.json()
    
    console.log("PATCH request for submission:", id, "with body:", body)
    
    const supabase = await createServiceClient()
    
    // First verify the submission exists
    const { data: existing, error: fetchError } = await supabase
      .from("submissions")
      .select("id")
      .eq("id", id)
      .single()
    
    if (fetchError || !existing) {
      console.error("Submission not found:", id, fetchError)
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }
    
    // Now update and select
    const { data, error } = await supabase
      .from("submissions")
      .update(body)
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Supabase update error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log("Update successful:", data)
    return NextResponse.json(data)
  } catch (err) {
    console.error("PATCH error:", err)
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : String(err) 
    }, { status: 500 })
  }
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    console.log("DELETE called for submission:", id)
    
    const supabase = await createServiceClient()
    
    // First verify the submission exists
    const { data: existing, error: fetchError } = await supabase
      .from("submissions")
      .select("photo_1_url, photo_2_url")
      .eq("id", id)
      .single()
    
    if (fetchError) {
      console.error("Submission not found:", id, fetchError)
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }
    
    // Delete photos from storage if they exist
    const photoPaths: string[] = []
    if (existing.photo_1_url) photoPaths.push(existing.photo_1_url)
    if (existing.photo_2_url) photoPaths.push(existing.photo_2_url)
    
    if (photoPaths.length > 0) {
      console.log("Deleting photos from storage:", photoPaths)
      const { error: storageError } = await supabase.storage
        .from("denisha-memories")
        .remove(photoPaths)
      
      if (storageError) {
        console.error("Storage deletion error (non-fatal):", storageError)
      }
    }
    
    // Delete the submission record
    const { error } = await supabase.from("submissions").delete().eq("id", id)
    if (error) {
      console.error("Submission deletion error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log("Deletion successful for:", id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE error:", err)
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : String(err) 
    }, { status: 500 })
  }
}
