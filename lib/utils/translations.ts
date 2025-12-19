export function getTranslation(content: any, language = "en") {
  if (typeof content === "string") return content
  return content?.[language] || content?.en || ""
}

export function formatLevel(level: string): string {
  return level
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function formatLanguage(code: string): string {
  const languages: Record<string, string> = {
    en: "English",
    de: "German",
    am: "Amharic",
  }
  return languages[code] || code
}
