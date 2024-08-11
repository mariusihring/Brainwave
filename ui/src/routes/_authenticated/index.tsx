import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useUser } from "@/lib/stores/user";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
	component: () => <Dashboard />,
});

const test: string[] = [
	"rust",
	"typescripto",
	"boring stuff",
];

function Dashboard() {
	const { user } = useUser();
	return (
		<div className="flex flex-col space-y-6 w-full h-full">
			<h1 className="font-bold text-3xl">Hello, {user?.username}</h1>
			<div className="flex gap-3 h-full">
				<div className="gap-3 flex flex-col h-full w-[70%]">
					<Card className=" flex flex-col  h-[30%]">
						<CardHeader>
							<CardTitle>Courses</CardTitle>
						</CardHeader>

						<CardContent className="max-w-full flex gap-3 grid grid-cols-3 grid-rows-1 h-full">
							{/* <ScrollArea className="w-auto whitespace-nowrap">
								<div className="flex w-auto space-x-4 p-4">
									{test.map((title) => (
										<Card key={title}>
											<CardHeader>
												<CardTitle>{title}</CardTitle>
											</CardHeader>
											<CardContent>Content for {title}</CardContent>
										</Card>
									))}
								</div>
								<ScrollBar orientation="horizontal" />
							</ScrollArea> */}
							{test.map((title) => (
										<Card key={title}>
											<CardHeader>
												<CardTitle>{title}</CardTitle>
											</CardHeader>
											<CardContent>Content for {title}</CardContent>
										</Card>
									))}
						</CardContent>
					</Card>
					<Card className=" h-[70%]">
						<CardHeader>
							<CardTitle>Some more stuff</CardTitle>
						</CardHeader>

						<CardContent className="3">some more stuff content</CardContent>
					</Card>
				</div>

				<Card className="w-[30%]">
					<CardHeader>
						<CardTitle>Agenda</CardTitle>
					</CardHeader>

					<CardContent className="flex gap-3">Agenda Content</CardContent>
				</Card>
			</div>
		</div>
	);
}
