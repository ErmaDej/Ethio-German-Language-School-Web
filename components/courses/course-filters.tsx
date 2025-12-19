"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"

export function CourseFilters() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <Card className="dark:bg-gray-900 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="dark:text-white">{t.filters}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-semibold mb-3 block dark:text-gray-200">{t.deliveryMethod}</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="online" className="dark:border-gray-700" />
              <label htmlFor="online" className="text-sm font-medium cursor-pointer dark:text-gray-400">
                {t.onlineClasses}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="onsite" className="dark:border-gray-700" />
              <label htmlFor="onsite" className="text-sm font-medium cursor-pointer dark:text-gray-400">
                {t.onsiteAddis}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="one-to-one" className="dark:border-gray-700" />
              <label htmlFor="one-to-one" className="text-sm font-medium cursor-pointer dark:text-gray-400">
                {t.oneToOneTutoringLabel}
              </label>
            </div>
          </div>
        </div>

        <Separator className="dark:bg-gray-800" />

        <div>
          <Label className="text-base font-semibold mb-3 block dark:text-gray-200">{t.cefrLevel}</Label>
          <div className="space-y-2">
            {[
              { id: "a1", label: "A1 (Beginner)" },
              { id: "a2", label: "A2 (Elementary)" },
              { id: "b1", label: "B1 (Intermediate)" },
              { id: "b2", label: "B2 (Upper-Intermediate)" },
              { id: "c1", label: "C1 (Advanced)" },
              { id: "c2", label: "C2 (Mastery)" },
            ].map((level) => (
              <div key={level.id} className="flex items-center space-x-2">
                <Checkbox id={level.id} className="dark:border-gray-700" />
                <label htmlFor={level.id} className="text-sm font-medium cursor-pointer dark:text-gray-400">
                  {level.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="dark:bg-gray-800" />

        <div>
          <Label className="text-base font-semibold mb-3 block dark:text-gray-200">{t.durationLabel}</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="short" className="dark:border-gray-700" />
              <label htmlFor="short" className="text-sm font-medium cursor-pointer dark:text-gray-400">
                8-12 {t.weeks}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="medium" className="dark:border-gray-700" />
              <label htmlFor="medium" className="text-sm font-medium cursor-pointer dark:text-gray-400">
                13-16 {t.weeks}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="long" className="dark:border-gray-700" />
              <label htmlFor="long" className="text-sm font-medium cursor-pointer dark:text-gray-400">
                17+ {t.weeks}
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

