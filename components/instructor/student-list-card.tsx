import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Mail } from "lucide-react"

export function StudentListCard({ enrollment }: { enrollment: any }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={enrollment.student.avatar_url || "/placeholder.svg"} alt={enrollment.student.full_name} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-lg">{enrollment.student.full_name || "Anonymous"}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Mail className="h-3 w-3" />
                  <span>{enrollment.student.email}</span>
                </div>
              </div>
              <Badge variant="outline">{enrollment.schedule.course.title.en}</Badge>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Course Progress</span>
                <span className="font-medium">{enrollment.progress_percentage}%</span>
              </div>
              <Progress value={enrollment.progress_percentage || 0} />
            </div>

            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}</span>
              {enrollment.student.phone && <span>• Phone: {enrollment.student.phone}</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
