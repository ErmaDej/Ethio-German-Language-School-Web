"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

interface Profile {
    id: string
    full_name: string
    avatar_url: string
    role: "student" | "instructor" | "admin"
    email: string
}

export function useUser() {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (session?.user) {
                    setUser(session.user)
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", session.user.id)
                        .single()
                    setProfile(profile)
                } else {
                    setUser(null)
                    setProfile(null)
                }
            } catch (error) {
                console.error("Error loading user:", error)
            } finally {
                setLoading(false)
            }
        }

        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUser(session.user)
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", session.user.id)
                    .single()
                setProfile(profile)
            } else {
                setUser(null)
                setProfile(null)
            }
            setLoading(false)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
        window.location.href = "/"
    }

    return { user, profile, loading, signOut }
}
