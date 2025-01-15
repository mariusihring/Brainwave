import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { execute } from "@/execute.ts";
import { graphql } from "@/graphql";
import type {
	Course,
	NewCourse,
	RecurringAppointment,
} from "@/graphql/graphql";
import { useSemesterStepper } from "@/lib/stores/semester_stepper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CALENDAR_LINK_QUERY = graphql(`
  query getCalendarLink {
    calendarLink
  }
`);

const SAVE_CALENDAR_LINK_MUTATION = graphql(`
  mutation SaveCalendarLink($link: String!) {
    upsertCalendarLink(calendarLink: $link) {
      id
    }
  }
`);

const PROCESS_CALENDAR_MUTATION = graphql(`
  mutation ProcessCalendar($input: String!) {
    processSemesterCalendar(semesterId: $input) {
      name
      weekday
      startTime
      endTime
      location
    }
  }
`);

const CREATE_COURSES_MUTATION = graphql(`
  mutation CreateMultipleCourses($input: [NewCourse!]!) {
    createMultipleCourses(input: $input) {
      id
      academicDepartment
      grade
      moduleId
      name
      teacher
    }
  }
`);

export default function SemesterCalendarStep() {
	const formData = useSemesterStepper();
	const [link, setLink] = useState(formData.calendarLink);

	const { data: linkData, refetch: refetchLink } = useQuery({
		queryKey: ["calendarLink"],
		queryFn: () => execute(CALENDAR_LINK_QUERY),
	});

	useEffect(() => {
		if (linkData?.calendarLink) {
			setLink(linkData?.calendarLink);
			formData.setCalendarLink(linkData?.calendarLink);
		}
	}, [linkData]);

	const saveLinkMutation = useMutation({
		mutationKey: ["saveCalendarLink"],
		mutationFn: () => execute(SAVE_CALENDAR_LINK_MUTATION, { link }),
	});

	const appointmentsMutation = useMutation({
		mutationKey: ["processCalendar"],
		mutationFn: (input: string) =>
			execute(PROCESS_CALENDAR_MUTATION, { input }),
	});

	const handleSaveLink = () => {
		toast.promise(saveLinkMutation.mutateAsync(), {
			loading: "Loading...",
			success: () => {
				formData.setCalendarLink(link);
				refetchLink();
				return "Success";
			},
			error: (error) => {
				return error.message;
			},
		});
	};

	const handleCalendarImport = () => {
		toast.promise(
			appointmentsMutation.mutateAsync(formData.created_semester_id as string),
			{
				loading: "Loading...",
				success: (data) => {
					formData.setAvailableCourses(data.processSemesterCalendar);
					return "Success";
				},
				error: (error) => {
					return error.message;
				},
			},
		);
	};

	const availableCourses = formData.availableCourses.length;
	return (
		<>
			{availableCourses === 0 ? (
				<div className="space-y-4">
					{formData.calendarLink ? (
						<div className="space-y-2">
							<Label>Existing Calendar Link</Label>
							<div className="flex gap-2">
								<Input
									id="calendar-link"
									value={link}
									onChange={(e) => {
										setLink(e.target.value);
									}}
									placeholder="Enter calendar link"
								/>
								{formData.calendarLink !== link && (
									<Button onClick={handleSaveLink}>
										<SaveIcon />
									</Button>
								)}
							</div>
							<div className="flex items-center space-x-2">
								<Checkbox
									checked={formData.useExistingLink}
									onChange={(e) =>
										formData.setUseExistingLink(e.target.checked)
									}
								/>
								<Label htmlFor="use-existing-link">Use existing link</Label>
							</div>
						</div>
					) : (
						<div className="space-y-2">
							<Label htmlFor="calendar-link">Calendar Link</Label>
							<Input
								id="calendar-link"
								value={link}
								onChange={(e) => {
									setLink(e.target.value);
								}}
								placeholder="Enter calendar link"
							/>
							<Button onClick={handleSaveLink}>
								<SaveIcon />
							</Button>
						</div>
					)}
					<Button
						onClick={handleCalendarImport}
						disabled={appointmentsMutation.isPending}
					>
						Import Calendar
					</Button>
				</div>
			) : (
				<CoursesTable />
			)}
		</>
	);
}
function CoursesTable() {
	const formData = useSemesterStepper();
	const [appointments, setAppointments] = useState<RecurringAppointment[]>(
		formData.availableCourses,
	);
	const [selectedAppointments, setSelectedAppointments] = useState<
		RecurringAppointment[]
	>([]);
	const [checkAll, setCheckall] = useState<Boolean>(false);
	const createCourseMutation = useMutation({
		mutationKey: ["newCourse"],
		mutationFn: (courses: NewCourse[]) =>
			execute(CREATE_COURSES_MUTATION, { input: courses }),
	});

	const handleAppointmentSelect = (appointment: RecurringAppointment) => {
		setSelectedAppointments((prevSelected) => {
			if (prevSelected.includes(appointment)) {
				return prevSelected.filter((app) => app !== appointment);
			}
			return [...prevSelected, appointment];
		});
	};

	const handleCreateCourses = () => {
		toast.promise(
			createCourseMutation.mutateAsync(
				selectedAppointments.map((app) => {
					const course: NewCourse = {
						id: null,
						name: app.name,
						grade: null,
						teacher: null,
						academicDepartment: null,
						moduleId: null,
						isFavorite: null
					};
					return course;
				}),
			),
			{
				loading: "Loading",
				success: (data) => {
					formData.addAllCourses(data.createMultipleCourses as Course[]);
					formData.nextStep();
					return "Created";
				},
				error: (e) => {
					console.log(e);
					return "Error";
				},
			},
		);
	};

	useEffect(() => {
		console.log(formData);
	}, [formData])

	const checkAllAppointemnts = (appointments: RecurringAppointment[]) => {
		setCheckall(!checkAll)
		checkAll ? setSelectedAppointments([]) : appointments.every(app => selectedAppointments.push(app))
	}

	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[50px]">
							<Checkbox
							checked={checkAll}
							onCheckedChange={() => checkAllAppointemnts(appointments)}
						/>
						</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Weekday</TableHead>
						<TableHead>Time</TableHead>
						<TableHead>Location</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{appointments.map((appointment, index) => (
						<TableRow key={index}>
							<TableCell>
								<Checkbox
									checked={selectedAppointments.includes(appointment)}
									onCheckedChange={() => handleAppointmentSelect(appointment)}
								/>
							</TableCell>
							<TableCell>{appointment.name}</TableCell>
							<TableCell>{appointment.weekday}</TableCell>
							<TableCell>
								{appointment.startTime} - {appointment.endTime}
							</TableCell>
							<TableCell>{appointment.location}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className="flex justify-end mt-2">
				<Button onClick={handleCreateCourses}>Next</Button>
			</div>
		</div>
	);
}
