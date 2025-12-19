import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, CheckCircle } from "lucide-react"
import { format, isPast } from "date-fns"
import Link from "next/link"

export function AssignmentCard({ assignment, studentId }: { assignment: any; studentId: string }) {
  const isOverdue = isPast(new Date(assignment.due_date))
  const submission = assignment.submission?.find((s: any) => s.student_id === studentId)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{assignment.title.en}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{assignment.schedule.course.title.en}</p>
          </div>
          <div className="flex gap-2">
            {submission ? (
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Submitted
              </Badge>
            ) : isOverdue ? (
              <Badge variant="destructive">Overdue</Badge>
            ) : (
              <Badge variant="secondary">Pending</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700">{assignment.description.en}</p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Due: {format(new Date(assignment.due_date), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(assignment.due_date), "h:mm a")}</span>
          </div>
        </div>

        {submission && submission.score !== null && (
          <div className="pt-3 border-t">
            <p className="text-sm font-medium">
              Score: {submission.score}/{assignment.max_score}
            </p>
            {submission.feedback && <p className="text-sm text-muted-foreground mt-1">{submission.feedback}</p>}
          </div>
        )}

        {!submission && (
          <Button asChild className="w-full">
            <Link href={`/student/assignments/${assignment.id}`}>Submit Assignment</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
