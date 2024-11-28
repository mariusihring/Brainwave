import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { execute } from "@/execute";
import { graphql } from "@/graphql";
import { RecurringAppointment } from "@/graphql/graphql.ts";
import { useSemesterStepper } from "@/lib/stores/semester_stepper.ts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import SemesterCalendarStep from "./stepper/semester_calendar_step";
import SemesterCourseStep from "./stepper/semester_courses_step";
import SemesterDateStep from "./stepper/semester_dates";
import SemesterModuleStep from "./stepper/semester_module";
import SemesterReviewStep from "./stepper/semester_review_step";

export default function SemesterStepper() {
	const formData = useSemesterStepper();

	const renderStepContent = () => {
		switch (formData.steps[formData.activeStep].id) {
			case "semester":
				return <SemesterDateStep />;
			case "modules":
				return <SemesterModuleStep />;
			case "calendar":
				return <SemesterCalendarStep />;
			case "courses":
				return <SemesterCourseStep />;
			case "review":
				return <SemesterReviewStep />;
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<Card className="w-full max-w-4xl">
				<CardHeader>
					<CardTitle>Semester Planner</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="mb-8">
						<div className="flex items-center">
							{formData.steps.map((step, index) => (
								<div
									key={step.id}
									className={`flex items-center ${index !== formData.steps.length - 1 ? "flex-1" : ""}`}
									// onClick={() => handleStepClick(index)}
								>
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center ${
											index < formData.activeStep
												? "bg-green-300 text-white"
												: index === formData.activeStep
													? "bg-primary text-primary-foreground"
													: "bg-gray-300 text-gray-500"
										} ${index <= formData.activeStep ? "cursor-pointer" : "cursor-not-allowed"}`}
									>
										{index < formData.activeStep ? (
											<CheckIcon className="w-5 h-5" />
										) : (
											<span>{index + 1}</span>
										)}
									</div>
									{index !== formData.steps.length - 1 && (
										<div
											className={`flex-1 h-1 ${
												index < formData.activeStep
													? "bg-green-300"
													: "bg-gray-300"
											}`}
										/>
									)}
								</div>
							))}
						</div>
						<div className="flex justify-between mt-2">
							{formData.steps.map((step, index) => (
								<div
									key={step.id}
									className={`text-sm ${
										index <= formData.activeStep
											? "text-gray-700"
											: "text-gray-400"
									}`}
								>
									{step.title}
								</div>
							))}
						</div>
					</div>
					{renderStepContent()}
				</CardContent>
			</Card>
		</div>
	);
}
