import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const todos = [
	{
		done: false,
		title: "Fix bug in prod",
		deadline: new Date(),
	},
	{
		done: false,
		title: "Fix bug in prod 2",
		deadline: new Date(),
	},
	{
		done: true,
		title: "Fix bug in prod 3",
		deadline: new Date(),
	},
];

export default function Agenda() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Agenda</CardTitle>
				<CardDescription>Your daily tasks and events.</CardDescription>
			</CardHeader>
			<CardContent className="glex-grow">
				<div className="grid gap-4">
					{todos.map((todo) => (
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Checkbox checked={todo.done} />
								<div className="font-medium">{todo.title}</div>
							</div>
							<div className="text-xs text-muted-foreground">9:00 AM</div>
						</div>
					))}
				</div>
			</CardContent>
			<CardFooter>
				<Button size="sm">View Agenda</Button>
			</CardFooter>
		</Card>
	);
}
