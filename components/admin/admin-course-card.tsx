import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, Clock, Users } from "lucide-react"
import Link from "next/link"

export function AdminCourseCard({ course }: { course: any }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{course.title.en}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{course.description.en}</p>
          </div>
          <Badge variant={course.is_active ? "default" : "secondary"}>{course.is_active ? "Active" : "Inactive"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline">{course.level}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{course.duration_weeks} weeks</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Max {course.max_students}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>${course.price_usd}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/courses/${course.id}/edit`}>Edit</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/courses/${course.id}/schedules`}>View Schedules</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
