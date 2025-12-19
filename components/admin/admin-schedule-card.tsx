import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Users } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

export function AdminScheduleCard({ schedule }: { schedule: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-green-100 text-green-700"
      case "upcoming":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-gray-100 text-gray-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getDayName = (day: number) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return days[day]
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{schedule.course.title.en}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{schedule.instructor?.full_name || "Unassigned"}</span>
            </div>
          </div>
          <Badge className={getStatusColor(schedule.status)}>{schedule.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(schedule.start_date), "MMM d")} - {format(new Date(schedule.end_date), "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {schedule.time_start} - {schedule.time_end}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{schedule.available_seats} seats available</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Days:</span>
          <span>{schedule.days_of_week.map((d: number) => getDayName(d)).join(", ")}</span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/schedules/${schedule.id}/edit`}>Edit</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/schedules/${schedule.id}/enrollments`}>View Enrollments</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
