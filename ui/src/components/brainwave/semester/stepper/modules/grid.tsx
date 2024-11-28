import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogHeader,
	DialogContent,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Module, Semester } from "@/graphql/types";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ModuleForm from "./form";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSemesterStepper } from "@/lib/stores/semester_stepper";
type ModuleGridProps = {
	modules: Module[];
	semesters: Semester[];
};

export default function ModuleGrid({ modules, semesters }: ModuleGridProps) {
	const { updateModule, deleteModule } = useSemesterStepper();
	const [editingModule, setEditingModule] = useState<Module | null>(null);
	const [deletingModuleId, setDeletingModuleId] = useState<string | null>(null);

	const handleUpdate = (updatedModule: Module) => {
		updateModule(updatedModule);
		setEditingModule(null);
		toast.success("Module updated", {
			description: `${updatedModule.name} has been updated succesfully`,
		});
	};

	const handleDelete = () => {
		if (deletingModuleId) {
			deleteModule(deletingModuleId);
			setDeletingModuleId(null);
			toast.success("Module deleted", {
				description: "The module has been deleted succesfully",
			});
		}
	};

	const getSemesterName = (id: string) => {
		return (
			semesters.find((semester) => semester.id === id)?.semester || "Unknown"
		);
	};

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{modules.map((module) => (
					<Card key={module.id}>
						<CardHeader>
							<CardTitle>{module.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="flex justify-between">
									<span className="font-semibold">ECTS:</span>
									<span>{module.etCs}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-semibold">Start:</span>
									<Badge variant="secondary">
										Semester {getSemesterName(module.startSemester)}
									</Badge>
								</div>
								<div className="flex justify-between">
									<span className="font-semibold">End:</span>
									<Badge variant="secondary">
										{module.endSemester
											? `Semester ${getSemesterName(module.endSemester)}`
											: "Same as Start"}
									</Badge>
								</div>
								{module.grade !== undefined && (
									<div className="flex justify-between">
										<span className="font-semibold">Grade:</span>
										<span>{module.grade}</span>
									</div>
								)}
							</div>
						</CardContent>
						<CardFooter className="justify-end space-x-2">
							<Button
								variant="outline"
								size="icon"
								onClick={() => setEditingModule(module)}
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								variant="destructive"
								size="icon"
								onClick={() => setEditingModule(module)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
			<Dialog
				open={!!editingModule}
				onOpenChange={() => setEditingModule(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Module</DialogTitle>
					</DialogHeader>
					{editingModule && (
						<ModuleForm module={editingModule} onSubmit={handleUpdate} />
					)}
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={!!deletingModuleId}
				onOpenChange={() => setDeletingModuleId(null)}
			>
				<AlertDialogContent>
					<AlertDialogTitle>
						Are you sure you want to delete this module?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permantently delete the
						module from your list.
					</AlertDialogDescription>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
