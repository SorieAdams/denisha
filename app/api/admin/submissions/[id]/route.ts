import { createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await req.json()
    
    // Only allow known updatable fields to prevent arbitrary writes
    const allowed = ["status", "animation_style", "display_order", "name", "relationship", "message", "memory", "wish"]
    const updates: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) updates[key] = body[key]
    }

    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from("submissions")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    if (!data) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (err) {
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
    
    const supabase = await createServiceClient()

    // Fetch photo paths before deleting
    const { data: existing, error: fetchError } = await supabase
      .from("submissions")
      .select("photo_1_url, photo_2_url")
      .eq("id", id)
      .single()
    
    if (fetchError) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }
    
    // Delete photos from storage if they exist
    const photoPaths: string[] = []
    if (existing.photo_1_url) photoPaths.push(existing.photo_1_url)
    if (existing.photo_2_url) photoPaths.push(existing.photo_2_url)
    
    if (photoPaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("denisha-memories")
        .remove(photoPaths)
      if (storageError) console.error("Storage deletion error (non-fatal):", storageError)
    }
    
    // Delete the submission record
    const { error } = await supabase
      .from("submissions")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : String(err) 
    }, { status: 500 })
  }
}
