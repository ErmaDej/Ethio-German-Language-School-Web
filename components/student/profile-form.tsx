"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"

export function ProfileForm({ profile }: { profile: any }) {
  const [fullName, setFullName] = useState(profile.full_name || "")
  const [phone, setPhone] = useState(profile.phone || "")
  const [bio, setBio] = useState(profile.bio || "")
  const [preferredLanguage, setPreferredLanguage] = useState(profile.preferred_language || "en")
  const [goal, setGoal] = useState(profile.goal || "")
  const [currentLevel, setCurrentLevel] = useState(profile.current_level || "beginner")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const { language } = useLanguage()
  const t = translations[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone,
          bio,
          preferred_language: preferredLanguage,
          goal,
          current_level: currentLevel,
        })
        .eq("id", profile.id)

      if (error) throw error

      setMessage({ type: "success", text: "Profile updated successfully!" })
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage({ type: "error", text: "Failed to update profile" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="dark:bg-gray-900 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="dark:text-white">{t.personalInformation}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full-name" className="dark:text-gray-300">{t.fullName}</Label>
              <Input
                id="full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="(Full Name)"
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">{t.email}</Label>
              <Input id="email" value={profile.email} disabled className="bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone" className="dark:text-gray-300">{t.phoneNumber}</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251 911 234 567"
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="dark:text-gray-300">{t.language}</Label>
              <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:border-gray-800">
                  <SelectItem value="en" className="dark:text-gray-300 dark:focus:bg-gray-800">English</SelectItem>
                  <SelectItem value="de" className="dark:text-gray-300 dark:focus:bg-gray-800">German</SelectItem>
                  <SelectItem value="am" className="dark:text-gray-300 dark:focus:bg-gray-800">Amharic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="level" className="dark:text-gray-300">{t.currentLevel}</Label>
              <Select value={currentLevel} onValueChange={setCurrentLevel}>
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:border-gray-800">
                  <SelectItem value="beginner" className="dark:text-gray-300 dark:focus:bg-gray-800">{t.completeBeginner}</SelectItem>
                  <SelectItem value="elementary" className="dark:text-gray-300 dark:focus:bg-gray-800">{t.elementary}</SelectItem>
                  <SelectItem value="intermediate" className="dark:text-gray-300 dark:focus:bg-gray-800">{t.intermediate}</SelectItem>
                  <SelectItem value="upper_intermediate" className="dark:text-gray-300 dark:focus:bg-gray-800">{t.upperIntermediate}</SelectItem>
                  <SelectItem value="advanced" className="dark:text-gray-300 dark:focus:bg-gray-800">{t.advanced}</SelectItem>
                  <SelectItem value="proficient" className="dark:text-gray-300 dark:focus:bg-gray-800">{t.mastery}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal" className="dark:text-gray-300">{t.languageGoal}</Label>
              <Input
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder={t.messagePlaceholder}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="dark:text-gray-300">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {message && (
            <div
              className={`rounded-lg p-3 text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
            >
              {message.text}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.saving}
              </>
            ) : (
              t.saveChanges
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
