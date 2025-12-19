import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }
  return user
}

export async function getUserProfile() {
  const supabase = await createClient()
  const user = await requireAuth()

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return profile
}

export async function requireRole(allowedRoles: string[]) {
  const profile = await getUserProfile()

  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect("/auth/login")
  }

  return profile
}
