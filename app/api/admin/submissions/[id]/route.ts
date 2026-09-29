import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

async function authCheck() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await authCheck()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const supabase = await createServiceClient()
  const { data, error } = await supabase.from("submissions").update(body).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await authCheck()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const supabase = await createServiceClient()
  await supabase.storage.from("denisha-memories").remove([`photos/${id}/photo-1.jpg`, `photos/${id}/photo-2.jpg`, `photos/${id}/photo-1.png`, `photos/${id}/photo-2.png`, `photos/${id}/photo-1.webp`, `photos/${id}/photo-2.webp`])
  const { error } = await supabase.from("submissions").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
