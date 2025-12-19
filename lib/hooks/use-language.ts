"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Language = "en" | "de" | "am"

interface LanguageStore {
  language: Language
  setLanguage: (lang: Language) => void
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "ethiogerman-language",
    },
  ),
)
