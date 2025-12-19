import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, FileText } from "lucide-react"
import { format, isPast } from "date-fns"
import Link from "next/link"

export function InstructorAssignmentCard({ assignment }: { assignment: any }) {
  const isOverdue = isPast(new Date(assignment.due_date))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{assignment.title.en}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{assignment.schedule.course.title.en}</p>
          </div>
          <div className="flex gap-2">
            {isOverdue ? (
              <Badge variant="secondary">Past Due</Badge>
            ) : (
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700">{assignment.description.en}</p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Due: {format(new Date(assignment.due_date), "MMM d, yyyy h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>Max Score: {assignment.max_score}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/instructor/assignments/${assignment.id}/submissions`}>View Submissions</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/instructor/assignments/${assignment.id}/edit`}>Edit</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
