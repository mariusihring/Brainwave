import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { graphql } from "@/graphql";
import { useSemesterStepper } from "@/lib/stores/semester_stepper";
import { PlusIcon } from "lucide-react";
import ModuleForm from "./modules/form";
import ModuleGrid from "./modules/grid";
import { useState } from "react";
import type { Module } from "@/graphql/types";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { execute } from "@/execute";

const CREATE_MODULE_MUTATION = graphql(`
  mutation CreateModule($input: NewModule!) {
    createModule(input: $input) {
      id
      etCs
      name
      startSemester
      endSemester
      grade
    }
  }
`);

export default function SemesterModuleStep() {
	const {
		semesters,
		addModule,
		modules,
		activeStep,
		nextStep,
		lastStep,
		steps,
	} = useSemesterStepper();
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

	const createModuleMutation = useMutation({
		mutationKey: ["create_module"],
		mutationFn: (x: Module) =>
			execute(CREATE_MODULE_MUTATION, {
				input: {
					ects: x.etCs,
					name: x.name,
					startSemester: x.startSemester,
					endSemester: x.endSemester,
					grade: x.grade,
				},
			}),
	});
	const handleAddModule = (newModule: Module) => {
		toast.promise(createModuleMutation.mutateAsync(newModule), {
			loading: "Creating...",
			error: (error) => {
				return error.message;
			},
			success: (data) => {
				addModule(data.createModule as Module);
				setIsAddDialogOpen(false);
				return "Module Added";
			},
		});
	};

	return (
		<>
			<div className="container mx-auto py-10">
				<div className="mb-6">
					<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
						<DialogTrigger asChild>
							<Button>
								<PlusIcon className="mr-2 h-4 w-4" />
								Add Module
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add New Module</DialogTitle>
							</DialogHeader>
							<ModuleForm onSubmit={handleAddModule} />
						</DialogContent>
					</Dialog>
				</div>
				<ModuleGrid modules={modules} semesters={semesters} />
			</div>
			<div className="mt-8 flex justify-between">
				<Button onClick={lastStep} disabled={activeStep === 0}>
					Back
				</Button>
				<Button onClick={nextStep}>
					{activeStep === steps.length - 1 ? "Finish" : "Next"}
				</Button>
			</div>
		</>
	);
}
