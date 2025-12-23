"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"

interface CourseFiltersProps {
  filters: {
    deliveryMethod: string[]
    level: string[]
  }
  onFilterChange: (category: string, value: string) => void
}

export function CourseFilters({ filters, onFilterChange }: CourseFiltersProps) {
  const { language } = useLanguage()
  const t = translations[language]

  const levels = [
    { id: "beginner", label: t.completeBeginner },
    { id: "elementary", label: t.elementary },
    { id: "intermediate", label: t.intermediate },
    { id: "upper_intermediate", label: t.upperIntermediate },
    { id: "advanced", label: t.advanced },
    { id: "proficient", label: t.mastery },
  ]

  const deliveryMethods = [
    { id: "online", label: t.onlineClasses },
    { id: "onsite", label: t.onsiteAddis },
    { id: "one-to-one", label: t.oneToOneTutoringLabel },
  ]

  return (
    <Card className="dark:bg-gray-900 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="dark:text-white">{t.filters}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-semibold mb-3 block dark:text-gray-200">{t.deliveryMethod}</Label>
          <div className="space-y-2">
            {deliveryMethods.map((method) => (
              <div key={method.id} className="flex items-center space-x-2">
                <Checkbox
                  id={method.id}
                  className="dark:border-gray-700"
                  checked={filters.deliveryMethod.includes(method.id)}
                  onCheckedChange={() => onFilterChange("deliveryMethod", method.id)}
                />
                <label htmlFor={method.id} className="text-sm font-medium cursor-pointer dark:text-gray-400">
                  {method.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="dark:bg-gray-800" />

        <div>
          <Label className="text-base font-semibold mb-3 block dark:text-gray-200">{t.cefrLevel}</Label>
          <div className="space-y-2">
            {levels.map((level) => (
              <div key={level.id} className="flex items-center space-x-2">
                <Checkbox
                  id={level.id}
                  className="dark:border-gray-700"
                  checked={filters.level.includes(level.id)}
                  onCheckedChange={() => onFilterChange("level", level.id)}
                />
                <label htmlFor={level.id} className="text-sm font-medium cursor-pointer dark:text-gray-400">
                  {level.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

