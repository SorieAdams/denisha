import { createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const submissionId = formData.get("submissionId") as string | null
    const slot = formData.get("slot") as string | null

    if (!file || !submissionId || !slot) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
    // If extension is 'blob' or invalid, try to determine from MIME type
    const finalExt = (ext === "blob" || !["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
      ? (file.type.includes("png") ? "png" 
         : file.type.includes("webp") ? "webp"
         : file.type.includes("gif") ? "gif"
         : "jpg")
      : ext
    
    const path = `photos/${submissionId}/photo-${slot}.${finalExt}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const supabase = await createServiceClient()
    const { error: uploadError } = await supabase.storage
      .from("denisha-memories")
      .upload(path, buffer, { contentType: file.type, upsert: true })

    if (uploadError) throw uploadError

    const column = slot === "1" ? "photo_1_url" : "photo_2_url"
    await supabase.from("submissions").update({ [column]: path }).eq("id", submissionId)

    return NextResponse.json({ path })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
