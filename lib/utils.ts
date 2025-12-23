import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLevelLabel(level: string, t?: any) {
  const levelMap: Record<string, string> = {
    beginner: "completeBeginner",
    a1: "completeBeginner",
    elementary: "elementary",
    a2: "elementary",
    intermediate: "intermediate",
    b1: "intermediate",
    upper_intermediate: "upperIntermediate",
    b2: "upperIntermediate",
    advanced: "advanced",
    c1: "advanced",
    proficient: "mastery",
    c2: "mastery",
  }

  const key = levelMap[level.toLowerCase()]
  if (t && key && t[key]) {
    return t[key]
  }

  const labels: Record<string, string> = {
    beginner: "A1 - Beginner",
    elementary: "A2 - Elementary",
    intermediate: "B1 - Intermediate",
    upper_intermediate: "B2 - Upper Intermediate",
    advanced: "C1 - Advanced",
    proficient: "C2 - Proficient",
  }
  return labels[level.toLowerCase()] || level
}

export function getLevelColor(level: string) {
  switch (level.toLowerCase()) {
    case "beginner":
    case "a1":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
    case "elementary":
    case "a2":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
    case "intermediate":
    case "b1":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800"
    case "upper_intermediate":
    case "b2":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800"
    case "advanced":
    case "c1":
    case "c2":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700"
  }
}
