import { Button } from "@/components/ui/button.tsx";
import { Combobox } from "@/components/ui/combobox";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { execute } from "@/execute.ts";
import { graphql } from "@/graphql";
import { type NewTodo, TodoType } from "@/graphql/graphql.ts";
import { formatToNaiveDateTime } from "@/lib/date";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { PlusCircleIcon, PlusIcon } from "lucide-react";
import { type } from "os";
import { useState } from "react";

const CREATE_TODO_MUTATION = graphql(`
  mutation createTodoMutation($input: NewTodo!) {
    createTodo(input: $input) {
      id
    }
  }
`);

type CreateTodoDialogProps = {
	courseId: string | null;
	inCard?: boolean; // The ? makes it optional
	courses?: { id: string; name: string }[];
};

export default function CreateTodoDialog({
	courseId,
	inCard = false,
	courses = [],
}: CreateTodoDialogProps) {
	const [open, setOpen] = useState(false);

	const queryClient = useQueryClient();
	const router = useRouter();
	const [todo, setTodo] = useState<Partial<NewTodo>>({});
	//TODO: add the course here to pass to tthe backend
	const mutation = useMutation({
		mutationKey: ["create_semester"],
		mutationFn: () =>
			execute(CREATE_TODO_MUTATION, {
				input: {
					courseId: todo.courseId ? todo.courseId : courseId,
					type: type,
					dueOn: todo.dueOn,
					title: todo.title as string,
					notes: todo.notes as string,
				},
			}),
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ["index_todos"] });
			setTodo({});
		},
	});
	const handleCreate = () => {
		mutation.mutate();
		router.invalidate();
		setOpen(false);
	};
	const [semester, setSemester] = useState("");
	const [type, setType] = useState("GENERAL");
	const c = courses.map((course) => {
		return { value: course.name, label: course.name };
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{inCard ? (
					<PlusIcon className="h-3.5 w-3.5 text-muted-foreground/70 hover:text-muted-foreground" />
				) : (
					<Button variant="outline" className="w-[200px]">
						<PlusCircleIcon className="mr-2 h-4 w-4" />
						Create Todo
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<div className="space-y-2">
					<Label htmlFor="title">Todo Title</Label>
					<Input
						id="title"
						placeholder="Enter todo title"
						value={todo.title}
						onChange={(e) => setTodo({ ...todo, title: e.target.value })}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label>Todo Type</Label>
					<Tabs value={type} onValueChange={setType} className="w-full">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="GENERAL">General</TabsTrigger>
							<TabsTrigger value="ASSIGNMENT">Assignment</TabsTrigger>
							<TabsTrigger value="EXAM">Exam</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
				<div className="space-y-2 flex flex-col">
					<Label htmlFor="startDate" className="">
						Due on
					</Label>
					<Input
						id="startDate"
						type="datetime-local"
						className="col-span-3"
						value={todo.dueOn}
						onChange={(e) =>
							setTodo({
								...todo,
								dueOn: formatToNaiveDateTime(e.target.value),
							})
						}
					/>
				</div>
				<div className="space-y-2 flex flex-col">
					<Label htmlFor="dueDate">Course (optional)</Label>

					<Combobox
						items={c}
						onValueChange={(e: string) =>
							setTodo({
								...todo,
								courseId: courses.find((course) => course.name === e).id,
							})
						}
					/>
				</div>

				<div className="flex justify-end">
					<Button onClick={handleCreate}>Create Todo</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
