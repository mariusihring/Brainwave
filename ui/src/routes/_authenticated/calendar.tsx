"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { execute } from "@/execute";
import { graphql } from "@/graphql";
import { queryOptions, useQuery } from "@tanstack/react-query";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const CALENDAR_APPOINTMENTS = graphql(`
	query AppointmentQuery {
		appointments {
			id
			date
			endTime
			startTime
			location
			name
		}
	}
`);

interface Event {
	id: string;
	date: string;
	endTime: string;
	startTime: string;
	location: string;
	name: string;
}

const EventComponent = ({ event }: { event: Event }) => (
	<div className="p-2 bg-primary/10 border border-primary rounded-md shadow-sm">
		<div className="font-medium text-primary">{event.name}</div>
		<div className="flex items-center text-xs text-muted-foreground mt-1">
			<MapPinIcon className="w-3 h-3 mr-1" />
			{event.location}
		</div>
	</div>
);

export const Route = createFileRoute("/_authenticated/calendar")({
	component: () => <CalendarIndex />,
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
		data: { appointments = [] },
	} = useQuery({
		queryKey: ["calendar_appointments"],
		queryFn: () => execute(CALENDAR_APPOINTMENTS),
		initialData: Route.useLoaderData(),
	});

	const [events, setEvents] = useState<Event[]>(appointments.map(appointment => ({
		...appointment,
		id: uuidv4(), // Generate a unique ID for each event
	})));

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

	const calendarEvents = useMemo(() => {
		return events.map(event => ({
			...event,
			start: new Date(event.startTime),
			end: new Date(event.endTime),
		}));
	}, [events]);

	const onEventDrop = useCallback(
		({ event, start, end }) => {
			setEvents((prev) =>
				prev.map((ev) =>
					ev.id === event.id
						? {
							...ev,
							date: moment(start).format('YYYY-MM-DD'),
							startTime: moment(start).format('YYYY-MM-DDTHH:mm:ss'),
							endTime: moment(end).format('YYYY-MM-DDTHH:mm:ss'),
						}
						: ev
				)
			);
		},
		[setEvents]
	);

	const onSelectEvent = useCallback((event: Event) => {
		setSelectedEvent(event);
		setIsDialogOpen(true);
	}, []);

	const handleUpdateEvent = (updatedEvent: Event) => {
		setEvents((prev) =>
			prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
		);
		setIsDialogOpen(false);
	};

	return (
		<Card className="w-full max-w-4xl mx-auto shadow-lg">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">Weekly Schedule</CardTitle>
			</CardHeader>
			<CardContent className="p-6">
				<DnDCalendar
					localizer={localizer}
					events={calendarEvents}
					startAccessor="start"
					endAccessor="end"
					style={{ height: 600 }}
					defaultView="week"
					views={["week"]}
					onEventDrop={onEventDrop}
					resizable
					selectable
					onSelectEvent={onSelectEvent}
					components={{
						event: EventComponent,
					}}
					className="bg-background text-foreground rounded-md shadow-sm"
				/>
			</CardContent>
			{selectedEvent && (
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Edit Appointment</DialogTitle>
						</DialogHeader>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								const formData = new FormData(e.target as HTMLFormElement);
								const startTime = moment(formData.get("date") as string + "T" + formData.get("startTime")).format("YYYY-MM-DDTHH:mm:ss");
								const endTime = moment(formData.get("date") as string + "T" + formData.get("endTime")).format("YYYY-MM-DDTHH:mm:ss");
								handleUpdateEvent({
									...selectedEvent,
									name: formData.get("name") as string,
									location: formData.get("location") as string,
									date: formData.get("date") as string,
									startTime,
									endTime,
								});
							}}
							className="space-y-4"
						>
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									name="name"
									defaultValue={selectedEvent.name}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="location">Location</Label>
								<Input
									id="location"
									name="location"
									defaultValue={selectedEvent.location}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="date">Date</Label>
								<div className="relative">
									<CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
									<Input
										id="date"
										name="date"
										type="date"
										defaultValue={selectedEvent.date}
										className="pl-10"
									/>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="startTime">Start Time</Label>
									<Input
										id="startTime"
										name="startTime"
										type="time"
										defaultValue={moment(selectedEvent.startTime).format("HH:mm")}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="endTime">End Time</Label>
									<Input
										id="endTime"
										name="endTime"
										type="time"
										defaultValue={moment(selectedEvent.endTime).format("HH:mm")}
									/>
								</div>
							</div>
							<DialogFooter>
								<Button type="submit">Save changes</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			)}
		</Card>
	);
}
