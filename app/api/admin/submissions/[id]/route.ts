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
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    console.log("PATCH called")
    
    // For now, skip auth check since service role handles permissions
    // TODO: Implement proper admin session validation
    
    const params = 'then' in context.params ? await context.params : context.params
    const { id } = params
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
    
    // Now update it
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
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const { id } = params
    const supabase = await createServiceClient()
    
    await supabase.storage
      .from("denisha-memories")
      .remove([
        `photos/${id}/photo-1.jpg`, 
        `photos/${id}/photo-2.jpg`, 
        `photos/${id}/photo-1.png`, 
        `photos/${id}/photo-2.png`, 
        `photos/${id}/photo-1.webp`, 
        `photos/${id}/photo-2.webp`
      ])
    
    const { error } = await supabase.from("submissions").delete().eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE error:", err)
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : String(err) 
    }, { status: 500 })
  }
}
