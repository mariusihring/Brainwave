import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Module } from "@/graphql/types";

export function ModuleCard({ module }: { module: Module }) {
	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="text-lg">{module.name}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col space-y-2">
					<div className="flex justify-between">
						<span className="text-sm text-muted-foreground">ECTS</span>
						<span className="font-medium">{module.etCs}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-sm text-muted-foreground">Semester</span>
						<span className="font-medium">1</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-sm text-muted-foreground">Grade</span>
						{module.grade !== null ? (
							<Badge variant="secondary">
								{Math.round(module.grade * 100) / 100}
							</Badge>
						) : (
							<Badge variant="outline">N/A</Badge>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
