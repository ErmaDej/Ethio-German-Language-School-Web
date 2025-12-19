"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

export function UserManagementTable({ users }: { users: any[] }) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700"
      case "instructor":
        return "bg-blue-100 text-blue-700"
      case "student":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.full_name || "Anonymous"}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{user.preferred_language || "en"}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
