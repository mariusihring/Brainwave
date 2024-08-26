import { Button } from "@/components/ui/button"
import { Todo } from "@/graphql/graphql"
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {
    ColumnDef,
} from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Link} from "@tanstack/react-router";

export const columns: ColumnDef<Todo>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("title")}</div>
        ),
    },
    {
        accessorKey: "todoType",
        header: "Type",
        cell: ({ row }) => (
            <Badge variant="outline">{row.getValue("todoType")}</Badge>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Select
                value={row.getValue("status")}
                onValueChange={(value) => {
                    // const updatedTodos = todos.map((todo) =>
                    //     todo.id === row.original.id ? { ...todo, status: value as Todo["status"] } : todo
                    // )
                    // setTodos(updatedTodos)
                }}
            >
                <SelectTrigger className="w-[130px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
            </Select>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const todo = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <Link to={"/todos/$todo"} params={{todo: todo.id}}>
                                View Details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Delete Todo</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]