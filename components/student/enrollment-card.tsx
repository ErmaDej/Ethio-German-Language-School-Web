import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

export function EnrollmentCard({ enrollment }: { enrollment: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{enrollment.schedule.course.title.en}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{enrollment.schedule.course.description.en}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(enrollment.enrollment_status)}>{enrollment.enrollment_status}</Badge>
            <Badge variant="outline">{enrollment.payment_status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{enrollment.progress_percentage}%</span>
          </div>
          <Progress value={enrollment.progress_percentage || 0} />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(enrollment.schedule.start_date), "MMM d")} -{" "}
              {format(new Date(enrollment.schedule.end_date), "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {enrollment.schedule.time_start} - {enrollment.schedule.time_end}
            </span>
          </div>
        </div>

        {enrollment.schedule.instructor && (
          <div className="flex items-center gap-3 pt-3 border-t">
            <Avatar>
              <AvatarImage
                src={enrollment.schedule.instructor.avatar_url || "/placeholder.svg"}
                alt={enrollment.schedule.instructor.full_name}
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Instructor</p>
              <p className="text-sm text-muted-foreground">{enrollment.schedule.instructor.full_name}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
