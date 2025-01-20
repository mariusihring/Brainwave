import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { execute } from "@/execute";
import { graphql } from "@/graphql";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { generateTimeSlots, generateWeekDays } from "@/lib/utils/calendar";
import {
	differenceInMinutes,
	format,
	isSameDay,
	parseISO,
	addMinutes,
	setHours,
	setMinutes,
} from "date-fns";
import type { Appointment } from "@/graphql/graphql";

const CALENDAR_APPOINTMENTS = graphql(`
  query AppointmentQuery {
    appointments {
      id
      title
      date
      endTime
      startTime
      location
    }
  }
`);

interface Event {
	id: string;
	date: string;
	endTime: string;
	startTime: string;
	location: string;
	title: string;
}

export const Route = createFileRoute("/_authenticated/calendar")({
	component: () => <CalendarIndex />,
	errorComponent: ({ error }) => <div>{error.message}</div>,
	loader: async ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(
			queryOptions({
				queryKey: ["calendar_appointments"],
				queryFn: () => execute(CALENDAR_APPOINTMENTS),
			}),
		),
});

function CalendarIndex() {
	const {
		data: { appointments = [] } = {},
	} = useQuery({
		queryKey: ["calendar_appointments"],
		queryFn: () => execute(CALENDAR_APPOINTMENTS),
		initialData: Route.useLoaderData(),
	});
	const [localAppointments, setLocalAppointments] = useState(appointments);

	const [currentWeek, setCurrentWeek] = useState(new Date());
	const weekDays = generateWeekDays(currentWeek);
	const timeSlots = generateTimeSlots();
	const [previewStyle, setPreviewStyle] = useState(null);

	const navigateWeek = (direction: "prev" | "next") => {
		setCurrentWeek((prevWeek) => {
			const newWeek = new Date(prevWeek);
			newWeek.setDate(newWeek.getDate() + (direction === "next" ? 7 : -7));
			return newWeek;
		});
	};

	const getAppointmentsForDay = (day: Date) => {
		const x =  localAppointments.filter((appointment) => {

			const d = parseISO(appointment.startTime);
			console.log(d + " vs " + day)
			const appointmentStart = d
			return isSameDay(appointmentStart, day);
		});
		console.log(x)
		return x
	};

	const isAllDayAppointment = (appointment: Appointment) => {
		const start = parseISO(appointment.startTime);
		const end = parseISO(appointment.endTime);
		return differenceInMinutes(end, start) >= 720; // 12 hours or more
	};

	const getAppointmentStyle = (appointment: Appointment) => {
		const start = parseISO(appointment.startTime);
		const end = parseISO(appointment.endTime);
		const dayStart = new Date(start);
		dayStart.setHours(6, 0, 0, 0); // 6 AM start for the calendar
		const startMinutes = differenceInMinutes(start, dayStart);
		const durationMinutes = differenceInMinutes(end, start);
		const top = (startMinutes / 60) * 3; // 3rem per hour
		const height = (durationMinutes / 60) * 3; // 3rem per hour

		return {
			top: `${top}rem`,
			height: `${height}rem`,
			zIndex: 10, // Ensure the appointment is above the grid
			userSelect: "none", // Prevent text selection during drag
		};
	};

	const onDragUpdate = (update) => {
		if (!update.destination) {
			setPreviewStyle(null);
			return;
		}

		const { destination, draggableId } = update;
		const draggedAppointment = localAppointments.find(
			(app) => app.id === draggableId,
		);
		if (!draggedAppointment) {
			setPreviewStyle(null);
			return;
		}

		const newDay = parseISO(destination.droppableId);
		const start = parseISO(draggedAppointment.startTime);
		const newStartTime = setHours(
			setMinutes(newDay, start.getMinutes()),
			start.getHours(),
		);
		const durationMinutes = differenceInMinutes(
			parseISO(draggedAppointment.endTime),
			start,
		);
		const newEndTime = addMinutes(newStartTime, durationMinutes);

		const dayStart = new Date(newStartTime);
		dayStart.setHours(6, 0, 0, 0); // 6 AM start for the calendar
		const startMinutes = differenceInMinutes(newStartTime, dayStart);
		const top = (startMinutes / 60) * 3; // 3rem per hour
		const height = (durationMinutes / 60) * 3; // 3rem per hour

		setPreviewStyle({
			top: `${top}rem`,
			height: `${height}rem`,
			zIndex: 5,
			backgroundColor: "rgba(255, 193, 7, 0.3)", // Yellow with transparency for preview
		});
	};

	const onDragEnd = (result) => {
		setPreviewStyle(null);
		if (!result.destination) {
			return;
		}

		const { source, destination, draggableId } = result;
		const draggedAppointment = localAppointments.find(
			(app) => app.id === draggableId,
		);
		if (!draggedAppointment) {
			return;
		}

		const newDay = parseISO(destination.droppableId);
		const originalDay = parseISO(source.droppableId);
		const start = parseISO(draggedAppointment.startTime);
		const end = parseISO(draggedAppointment.endTime);

		const newStartTime = setHours(
			setMinutes(newDay, start.getMinutes()),
			start.getHours(),
		);
		const durationMinutes = differenceInMinutes(end, start);
		const newEndTime = addMinutes(newStartTime, durationMinutes);

		// Update appointment locally
		const updatedAppointments = localAppointments.map((appointment) =>
			appointment.id === draggedAppointment.id
				? {
						...appointment,
						startTime: newStartTime.toISOString(),
						endTime: newEndTime.toISOString(),
					}
				: appointment,
		);

		setLocalAppointments([...updatedAppointments]); // Spread the array to trigger a re-render
	};

	const handleResize = (appointmentId, direction, minutes) => {
		const updatedAppointments = localAppointments.map((appointment) => {
			if (appointment.id === appointmentId) {
				const start = parseISO(appointment.startTime);
				const end = parseISO(appointment.endTime);

				if (direction === "start") {
					const newStart = addMinutes(start, minutes);
					return { ...appointment, startTime: newStart.toISOString() };
				} else if (direction === "end") {
					const newEnd = addMinutes(end, minutes);
					return { ...appointment, endTime: newEnd.toISOString() };
				}
			}
			return appointment;
		});
		setLocalAppointments(updatedAppointments);
	};

	useEffect(() => {
		console.log("Fetched appointments:", appointments);
		setLocalAppointments(appointments);
	}, [appointments]);

	return (
		<DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
			<Card className="w-full bg-stone-50 shadow-sm relative h-full">
				<CardContent className="p-6 h-full">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-light text-stone-700">
							{format(weekDays[0], "MMMM yyyy")}
						</h2>
						<div className="flex space-x-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => navigateWeek("prev")}
							>
								<ChevronLeft className="h-4 w-4 text-stone-500" />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="font-light text-stone-700"
								onClick={() => setCurrentWeek(new Date())}
							>
								Today
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => navigateWeek("next")}
							>
								<ChevronRight className="h-4 w-4 text-stone-500" />
							</Button>
						</div>
					</div>
					<div className="grid grid-cols-6 gap-4">
						<div></div>
						{weekDays.map((day) => (
							<div key={day.toISOString()} className="text-center">
								<div className="font-medium text-stone-600">
									{format(day, "EEE")}
								</div>
								<div className="text-sm text-stone-400">{format(day, "d")}</div>
							</div>
						))}
						<div className="col-span-6">
							<div className="relative">
								{weekDays.map((day, index) => (
									<Droppable
										key={day.toISOString()}
										droppableId={day.toISOString()}
										type="APPOINTMENT"
									>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.droppableProps}
												className="absolute"
												style={{
													top: "8rem",
													left: `${(index + 1) * (100 / 6)}%`,
													width: `${100 / 6}%`,
												}}
											>
												{previewStyle &&
													destination?.droppableId === day.toISOString() && (
														<div
															className="absolute left-1 right-1 rounded-sm"
															style={previewStyle}
														></div>
													)}
												{getAppointmentsForDay(day)
													.filter((app) => !isAllDayAppointment(app as Appointment))
													.map((appointment, index) => {
														console.log("rendering app")
														return (
														<Draggable
															key={appointment.id}
															draggableId={appointment.id}
															index={index}
														>
															{(provided, snapshot) => (
																<div
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																	className={`absolute left-1 right-1 bg-amber-100 text-amber-800 rounded-sm px-2 py-1 text-xs truncate text-wrap shadow-sm cursor-pointer z-10 ${snapshot.isDragging ? "z-20" : ""}`}
																	style={{
																		...getAppointmentStyle(appointment),
																		...provided.draggableProps.style,
																	}}
																	onDoubleClick={() =>
																		handleResize(appointment.id, "end", 30)
																	}
																	title={`Title: ${appointment.title}\nLocation: ${appointment.location}\nStart: ${format(parseISO(appointment.startTime), "p")}\nEnd: ${format(parseISO(appointment.endTime), "p")}`}
																>
																	<div className="font-bold mb-1">
																		{appointment.title}
																	</div>
																	<div className="text-xs text-stone-600 mb-1">
																		{appointment.location}
																	</div>
																	<div className="text-xs text-stone-500">
																		{format(
																			parseISO(appointment.startTime),
																			"p",
																		)}{" "}
																		-{" "}
																		{format(parseISO(appointment.endTime), "p")}
																	</div>
																</div>
															)}
														</Draggable>)})
													}
												{provided.placeholder}
											</div>
										)}
									</Droppable>
								))}
							</div>
						</div>
						{timeSlots.map((time) => (
							<React.Fragment key={time}>
								<div className="text-right pr-4 py-2 text-sm text-stone-400">
									{time}
								</div>
								{weekDays.map((day) => (
									<div
										key={`${day.toISOString()}-${time}`}
										className="relative h-12 group"
									>
										<div className="absolute inset-0 border-t border-stone-100 group-hover:bg-stone-100/50 transition-colors duration-200"></div>
									</div>
								))}
							</React.Fragment>
						))}
					</div>
				</CardContent>
			</Card>
		</DragDropContext>
	);
}
