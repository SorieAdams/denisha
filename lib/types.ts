
export type Category = "family" | "friends" | "church" | "school_work" | "other"
export type Status = "pending" | "approved" | "rejected"
export type AnimationStyle = "polaroid" | "split"

export interface Submission {
  id: string
  name: string
  relationship: string
  category: Category
  message: string
  memory: string | null
  wish: string | null
  photo_1_url: string | null
  photo_2_url: string | null
  status: Status
  animation_style: AnimationStyle | null
  display_order: number | null
  created_at: string
}

export const CATEGORY_LABELS: Record<Category, string> = {
  family: "Family",
  friends: "Friends",
  church: "Faith",
  school_work: "Campus & Colleagues",
  other: "Everyone Else",
}

export const CATEGORY_FRAMING: Record<Category, string> = {
  family: "The ones who have known her from the beginning — the people who shaped her foundation.",
  friends: "The ones who chose her. Who stayed close when it mattered most.",
  church: "The people who have shared her walk with Christ — a walk that has taken her further than anyone expected.",
  school_work: "Driven. Disciplined. She set her sights on medicine and did not look away.",
  other: "And everyone else who wanted her to know something.",
}
