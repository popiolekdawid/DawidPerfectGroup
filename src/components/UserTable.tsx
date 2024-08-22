import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Badge } from "@/components/ui/badge"
  import { CalendarIcon, CheckCircleIcon, XCircleIcon } from "lucide-react"
  
  const users = [
    {
      id: "USR001",
      name: "Alice Johnson",
      email: "alice@example.com",
      status: "Active",
      activationDate: "2023-01-15",
    },
    {
      id: "USR002",
      name: "Bob Smith",
      email: "bob@example.com",
      status: "Inactive",
      activationDate: null,
    },
    {
      id: "USR003",
      name: "Charlie Brown",
      email: "charlie@example.com",
      status: "Active",
      activationDate: "2023-02-20",
    },
    {
      id: "USR004",
      name: "Diana Prince",
      email: "diana@example.com",
      status: "Active",
      activationDate: "2023-03-10",
    },
    {
      id: "USR005",
      name: "Ethan Hunt",
      email: "ethan@example.com",
      status: "Inactive",
      activationDate: null,
    },
  ]
  
  export default function Component() {
    const activeUsers = users.filter(user => user.status === "Active").length
  
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">User ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Activation Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.activationDate ? (
                  <span className="flex items-center">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {user.activationDate}
                  </span>
                ) : (
                  "Brak"
                )}
              </TableCell>
              <TableCell>
                <Badge variant={user.status === "Active" ? "secondary" : "destructive"}>
                  {user.status === "Active" ? (
                    <CheckCircleIcon className="mr-1 h-4 w-4" />
                  ) : (
                    <XCircleIcon className="mr-1 h-4 w-4" />
                  )}
                  {user.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total Active Users</TableCell>
            <TableCell>{activeUsers}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )
  }