import { useUpdateTodoMutation } from "@/components/brainwave/todos/graphql_todo.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Todo } from "@/graphql/graphql";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Trash } from "lucide-react";
import { graphql } from "@/graphql";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { execute } from "@/execute.ts";
import { DELETE_COURSE_MUTATION } from "@/components/brainwave/semester/stepper/semester_courses_step.tsx";
import { toast } from "sonner";
import { current } from "immer";

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
			);
		},
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("title")}</div>
		),
	},
	{
		accessorKey: "type",
		header: "Type",
		cell: ({ row }) => <Badge variant="outline">{row.getValue("type")}</Badge>,
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const mutation = useUpdateTodoMutation();
			const current_todo = row.original;
			return (
				<Select
					value={row.getValue("status")}
					onValueChange={(value) => {
						console.log(current_todo);
						mutation.mutate({
							id: current_todo.id,
							input: {
								id: current_todo.id,
								title: current_todo.title,
								due_on: current_todo.dueOn,
								course_id: current_todo.courseId,
								type: current_todo.type,
								notes: current_todo.notes,
								status: value,
							},
						});
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
						<SelectItem value="INPROGRESS">In Progress</SelectItem>
						<SelectItem value="COMPLETED">Completed</SelectItem>
					</SelectContent>
				</Select>
			);
		},
	},
	{
		accessorKey: "dueOn",
		header: "Due on",
		cell: ({ row }) => {
			const today = new Date();
			const dueDate = new Date(row.getValue("dueOn"));

			today.setHours(0, 0, 0, 0);
			dueDate.setHours(0, 0, 0, 0);
			const diffTime = dueDate.getTime() - today.getTime();
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			return (
				<Badge
					variant="outline"
					className={
						diffDays < 2
							? "outline-red-900 bg-red-200"
							: "outline-green-900 bg-green-100"
					}
				>
					{dueDate.toLocaleDateString()}
				</Badge>
			);
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const todo = row.original;
			// const DELETE_TODO_MUTATION = graphql(`
			// 	mutation DeleteTodo($id: UUID!) {
			// 		deleteTodo(id: $id)
			// 	}
			// `)
			// const queryClient = useQueryClient()
			// const deleteMutation = useMutation({
			// 	mutationKey: ['delete_courses'],
			// 	mutationFn: (deleteTodo: Todo) => execute(DELETE_TODO_MUTATION, {id: deleteTodo.id}),
			// 	onSuccess: () => {
			// 		queryClient.invalidateQueries({
			// 			queryKey: ['courses_index'],
			// 			exact: true,
			// 			refetchType: 'all'
			// 		})
			// 	}
			// })
			// const handleDelete = () => {
			// 	const mut = deleteMutation.mutateAsync(row)
			// 	toast.promise(mut, {
			// 		loading: "loading...",
			// 		success: (data) => {
			// 			return `Course was deleted successfully`
			// 		},
			// 		error: "Error occured while deleting course"
			// 	});
			// }

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
							<Link to={"/todos/$todo"} params={{ todo: todo.id }}>
								View Details
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => deleteTodo()}>
							Delete Todo
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
