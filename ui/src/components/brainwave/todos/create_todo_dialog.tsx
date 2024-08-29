import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { execute } from "@/execute.ts";
import { graphql } from "@/graphql";
import  {type NewTodo, TodoType} from "@/graphql/graphql.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatToNaiveDateTime } from "@/lib/date";

const CREATE_TODO_MUTATION = graphql(`
    mutation createTodoMutation($input: NewTodo!) {
        createTodo(input: $input) {
            id
        }
    }
`);

export default function CreateTodoDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [todo, setTodo] = useState<Partial<NewTodo>>({

  });
  const mutation = useMutation({
    mutationKey: ["create_semester"],
    mutationFn: () =>
      execute(CREATE_TODO_MUTATION, {
        input: {
          courseId: todo.courseId,
          dueOn: todo.dueOn,
          title: todo.title as string,
          todoType: todo.todoType,
        },
      }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["index_todos"] });
      setTodo({})
    },
  });
  const handleCreate = () => {
    // Here you would typically send the semester data to your backend
    mutation.mutate();
    router.invalidate();
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-[200px]">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Create Todo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="semester" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              type="text"
              className="col-span-3"
              value={todo.title}
              onChange={(e) =>
                setTodo({
                  ...todo,
                  title: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
             Due on
            </Label>
            <Input
              id="startDate"
              type="datetime-local"
              className="col-span-3"
              value={todo.dueOn}
              onChange={(e) =>
                setTodo({ ...todo, dueOn: formatToNaiveDateTime(e.target.value) })
              }
            />
          </div>
          {/*TODO: make this the course select*/}
          {/*<div className="grid grid-cols-4 items-center gap-4">*/}
          {/*  <Label htmlFor="endDate" className="text-right">*/}
          {/*    End Date*/}
          {/*  </Label>*/}
          {/*  <Input*/}
          {/*    id="course"*/}
          {/*    type="date"*/}
          {/*    className="col-span-3"*/}
          {/*    value={semester.endDate}*/}
          {/*    onChange={(e) =>*/}
          {/*      setSemester({ ...semester, endDate: e.target.value })*/}
          {/*    }*/}
          {/*  />*/}
          {/*</div>*/}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="totalEcts" className="text-right">
              Type
            </Label>
            <Select onValueChange={(v) => setTodo({...todo, todoType: v as TodoType})}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Type of the Todo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={TodoType.General}>General</SelectItem>
                  <SelectItem value={TodoType.Assignment}>Assignment</SelectItem>
                  <SelectItem value={TodoType.Exam}>Exam</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleCreate}>Create Todo</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
