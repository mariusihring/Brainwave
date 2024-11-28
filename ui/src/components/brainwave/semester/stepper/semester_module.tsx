import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { execute } from "@/execute.ts";
import { graphql } from "@/graphql";
import type { Module } from "@/graphql/graphql";
import { useSemesterStepper } from "@/lib/stores/semester_stepper";
import { useMutation } from "@tanstack/react-query";
import { Check, GraduationCapIcon, Pen, Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const CREATE_MODULE_MUTATION = graphql(
	`
   mutation CreateModule($input: NewModule!) {
       createModule(input: $input) {
           id
           etCs
           name
       }
   }
    `,
);

export default function SemesterModuleStep() {
	const formData = useSemesterStepper();
	const [newModule, setNewModule] = useState<Module | null>(null);
	const [isEditing, setIsEditing] = useState(true);
	const nameInputRef = useRef<HTMLInputElement>(null);
	const createModuleMutation = useMutation({
		mutationKey: [`crate_module_${newModule?.name}`],
		mutationFn: () =>
			execute(CREATE_MODULE_MUTATION, {
				input: {
					ects: newModule?.ects as number,
					name: newModule?.name as string,
					startSemester: newModule?.startSemester as string,
				},
			}),
	});

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = () => {
		// setModule(tempModule)
		// setIsEditing(false)
		toast.promise(createModuleMutation.mutateAsync(), {
			loading: "Loading...",
			error: (error) => {
				return error.message;
			},
			success: (data) => {
				const mod: Module = {
					ects: data.createModule.ects,
					id: data.createModule.id,
					name: data.createModule.name,
					startSemester: formData.created_semester_id as string,
				};
				formData.addModule(mod);
				setNewModule(null);

				return "Created";
			},
		});
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewModule((prev) => ({ ...prev, name: e.target.value }));
	};

	const handleEctsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number.parseInt(e.target.value) || 0;
		setNewModule((prev) => ({ ...prev, ects: value }));
	};

	useEffect(() => {
		if (isEditing && nameInputRef.current) {
			nameInputRef.current.focus();
		}
	}, [isEditing]);

	const handleCreateNewModule = () => {
		const module: Module = {
			ects: 0,
			id: "some stuff",
			name: "New Module",
			startSemester: formData.created_semester_id as string,
		};
		setNewModule(module);
	};
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
				{newModule && (
					<Card className="w-full max-w-md mx-auto">
						<CardContent className="pt-5">
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<div className="flex items-center space-x-2">
										{isEditing ? (
											<Input
												ref={nameInputRef}
												value={newModule.name}
												onChange={handleNameChange}
												className="text-lg font-medium text-primary"
												aria-label="Module name"
											/>
										) : (
											<h4 className="text-lg font-medium text-primary">
												{newModule.name}
											</h4>
										)}
									</div>
									{isEditing ? (
										<Input
											type="number"
											value={newModule.ects}
											onChange={handleEctsChange}
											className="w-20 text-sm font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-full text-center ml-1"
											aria-label="ECTS credits"
										/>
									) : (
										<span className="text-sm font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-full">
											{newModule.ects} ECTS
										</span>
									)}
									{!isEditing && (
										<Button
											variant="ghost"
											size="icon"
											onClick={handleEdit}
											className="h-8 w-8"
											aria-label="Edit module"
										>
											<Pen className="h-4 w-4" />
										</Button>
									)}
								</div>
								<p className="text-sm text-muted-foreground">
									This module is worth {newModule.ects} ECTS credits.
								</p>
								{isEditing && (
									<div className="flex justify-end space-x-2 mt-4">
										<Button variant="outline" onClick={handleCancel}>
											Cancel
										</Button>
										<Button onClick={handleSave}>
											<Check className="h-4 w-4 mr-2" />
											Save
										</Button>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				)}
				{formData.modules.length > 0 &&
					formData.modules.map((module, index) => (
						<div key={index} className="flex space-x-4 items-end">
							<ModuleCard module={module} index={index} />
						</div>
					))}

				<Button className="col-span-4" onClick={handleCreateNewModule}>
					Add Module
				</Button>
			</div>
			<div className="mt-8 flex justify-between">
				<Button
					onClick={formData.lastStep}
					disabled={formData.activeStep === 0}
				>
					Back
				</Button>
				<Button
					disabled={formData.modules.length === 0}
					onClick={formData.nextStep}
				>
					{formData.activeStep === formData.steps.length - 1
						? "Finish"
						: "Next"}
				</Button>
			</div>
		</div>
	);
}

function ModuleCard({
	module,
	index,
}: { module: { name: string; ects: number }; index: number }) {
	const formData = useSemesterStepper();
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<Input
						placeholder="Module Name"
						id={`module-name-${index}`}
						value={module.name}
						onChange={(e) =>
							formData.updateModule(index, {
								courses: [],
								ects: 0,
								endSemester: "",
								id: "",
								name: e.target.value,
								startSemester: "",
							})
						}
					/>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex items-center">
						<GraduationCapIcon className="mr-2 h-4 w-4 opacity-70" />
						<span className="text-sm text-muted-foreground">
							{module.ects} ECTS
						</span>
					</div>
				</div>
				<div className="space-y-4">
					<div className="flex justify-end">
						<Button size="icon" onClick={() => formData.removeModule(module)}>
							<Trash2Icon className="h-4 w-4" />
							<span className="sr-only">Remove module</span>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
