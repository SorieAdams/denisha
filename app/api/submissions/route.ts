import { createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, relationship, category, message, memory, wish } = body

    if (!name || !relationship || !category || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createServiceClient()
    const { data, error } = await supabase
      .from("submissions")
      .insert({ name, relationship, category, message, memory: memory || null, wish: wish || null, status: "pending" })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ id: data.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
