import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { execute } from "@/execute";
import { graphql } from "@/graphql";
import { queryOptions, useQuery } from "@tanstack/react-query";
import {
	addDays,
	addWeeks,
	format,
	isSameDay,
	parseISO,
	startOfWeek,
	subWeeks,
	differenceInMinutes,
	addMinutes,
} from "date-fns";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";

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

interface Appointment {
	id: string;
	date: string;
	endTime: string;
	startTime: string;
	location: string;
	name: string;
}

const getAppointmentColor = (name: string): string => {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}
	const hue = hash % 360;
	return `hsl(${hue}, 70%, 80%)`;
};

const hourHeight = 60; // Height for each hour in pixels
const startHour = 8; // Calendar starts at 5 AM
const endHour = 22; // Calendar ends at 10 PM
const totalHours = endHour - startHour;

const formatHour = (hour: number): string => {
	const period = hour >= 12 ? "PM" : "AM";
	const displayHour = hour % 12 || 12;
	return `${displayHour.toString().padStart(2, "0")} ${period}`;
};

function CalendarIndex() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const {
		data: { appointments = [] },
	} = useQuery({
		queryKey: ["calendar_appointments"],
		queryFn: () => execute(CALENDAR_APPOINTMENTS),
		initialData: Route.useLoaderData(),
	});

	const [events, setEvents] = useState<Appointment[]>(appointments);
	const containerRef = useRef<HTMLDivElement>(null);
	const placeholderRef = useRef<HTMLDivElement>(null);
	const draggedEventRef = useRef<{ id: string, element: HTMLElement, duration: number } | null>(null);

	const handleDragStart = useCallback((e: React.MouseEvent, eventId: string) => {
		e.preventDefault();
		const element = e.currentTarget.closest('[data-event-id]') as HTMLElement;
		if (!element) return;

		const event = events.find(event => event.id === eventId);
		if (!event) return;

		const duration = differenceInMinutes(parseISO(event.endTime), parseISO(event.startTime)) / 60;

		draggedEventRef.current = {
			id: eventId,
			element,
			duration
		};

		element.style.visibility = 'hidden'; // Hide the original element
		document.body.style.userSelect = 'none'; // Prevent text selection

		if (placeholderRef.current) {
			placeholderRef.current.style.display = 'block'; // Show the placeholder
			placeholderRef.current.style.height = `${duration * hourHeight}px`; // Set the height based on duration
		}

		updatePlaceholderPosition(e); // Update placeholder position
	}, [events]);

	const updatePlaceholderPosition = useCallback((e: MouseEvent | React.MouseEvent) => {
		if (!containerRef.current || !placeholderRef.current || !draggedEventRef.current) return;

		const containerRect = containerRef.current.getBoundingClientRect();
		const x = e.clientX - containerRect.left;
		const y = e.clientY - containerRect.top;

		const dayWidth = containerRect.width / 5;
		const dayIndex = Math.floor(x / dayWidth);
		const hour = Math.floor(y / hourHeight);

		// Adjust placeholder position
		placeholderRef.current.style.left = `${dayIndex * dayWidth + dayIndex * 8 + 64}px`; // Adjust for gap and time column
		placeholderRef.current.style.top = `${hour * hourHeight + 54}px`; // Adjust for header height
	}, []);

	const handleDrag = useCallback((e: MouseEvent) => {
		updatePlaceholderPosition(e); // Update placeholder position during drag
	}, [updatePlaceholderPosition]);

	const handleDragEnd = useCallback((e: MouseEvent) => {
		if (!draggedEventRef.current || !containerRef.current || !placeholderRef.current) return;

		const { id, element } = draggedEventRef.current;
		element.style.visibility = 'visible'; // Show the original element
		document.body.style.userSelect = 'auto'; // Restore text selection

		const containerRect = containerRef.current.getBoundingClientRect();
		const x = e.clientX - containerRect.left;
		const y = e.clientY - containerRect.top - 54; // Adjust for header height

		const dayWidth = containerRect.width / 5;
		const dayIndex = Math.floor((x - 64) / (dayWidth + 8)); // Adjust for time column and gaps
		const hour = Math.floor(y / hourHeight) + startHour;

		setEvents(prevEvents => {
			return prevEvents.map(event => {
				if (event.id === id) {
					const newDate = format(addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), dayIndex), 'yyyy-MM-dd');
					const newStartTime = `${newDate}T${hour.toString().padStart(2, '0')}:00:00`;
					const duration = differenceInMinutes(parseISO(event.endTime), parseISO(event.startTime));
					const newEndTime = format(addMinutes(parseISO(newStartTime), duration), "yyyy-MM-dd'T'HH:mm:ss");
					return { ...event, date: newDate, startTime: newStartTime, endTime: newEndTime };
				}
				return event;
			});
		});

		placeholderRef.current.style.display = 'none'; // Hide the placeholder
		draggedEventRef.current = null; // Clear the dragged event reference
	}, [currentDate]);

	useEffect(() => {
		document.addEventListener('mousemove', handleDrag);
		document.addEventListener('mouseup', handleDragEnd);
		return () => {
			document.removeEventListener('mousemove', handleDrag);
			document.removeEventListener('mouseup', handleDragEnd);
		};
	}, [handleDrag, handleDragEnd]);

	const handlePreviousWeek = () => {
		setCurrentDate((prevDate) => subWeeks(prevDate, 1));
	};

	const handleNextWeek = () => {
		setCurrentDate((prevDate) => addWeeks(prevDate, 1));
	};

	const weekDays = useMemo(() => {
		const start = startOfWeek(currentDate, { weekStartsOn: 1 });
		return Array.from({ length: 5 }, (_, i) => addDays(start, i));
	}, [currentDate]);

	return (
		<div className="flex flex-col space-y-4 w-full max-w-full mx-auto p-4">
			<div className="flex justify-between items-center">
				<Button onClick={handlePreviousWeek} variant="outline" size="icon">
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<h2 className="text-lg font-semibold">
					{format(weekDays[0], "MMM d")} - {format(weekDays[4], "MMM d, yyyy")}
				</h2>
				<Button onClick={handleNextWeek} variant="outline" size="icon">
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
			<div ref={containerRef} className="relative grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-2 overflow-x-auto">
				<div className="sticky left-0 z-10 bg-background w-16">
					<div className="h-14"></div>
					{Array.from({ length: totalHours }, (_, i) => i + startHour).map((hour) => (
						<div key={hour} className="h-[60px] border-t border-border flex items-center justify-end">
							<span className="text-[10px] text-muted-foreground pr-1">
								{formatHour(hour)}
							</span>
						</div>
					))}
				</div>
				{weekDays.map((day) => (
					<DayColumn
						key={day.toISOString()}
						day={day}
						events={events.filter((event) => isSameDay(parseISO(event.date), day))}
						onDragStart={handleDragStart}
					/>
				))}
				<div
					ref={placeholderRef}
					className="absolute bg-blue-200 opacity-50 rounded pointer-events-none"
					style={{ display: 'none', width: `calc(20% - 8px)` }}
				></div>
			</div>
		</div>
	);
}

function DayColumn({ day, events, onDragStart }: { day: Date, events: Appointment[], onDragStart: (e: React.MouseEvent, eventId: string) => void }) {
	return (
		<div className="flex flex-col min-w-[120px] relative">
			<div className="text-center font-medium mb-1">
				{format(day, "EEE")}
			</div>
			<div className="text-center text-sm text-muted-foreground mb-2">
				{format(day, "d")}
			</div>
			<div className="relative" style={{ height: `${totalHours * hourHeight}px` }}>
				{Array.from({ length: totalHours }, (_, i) => i).map((hour) => (
					<div
						key={hour}
						className="absolute w-full border-t border-border"
						style={{ top: `${hour * hourHeight}px`, height: `${hourHeight}px` }}
					></div>
				))}
				{events.map((event) => (
					<Appointment key={event.id} event={event} day={day} onDragStart={onDragStart} />
				))}
			</div>
		</div>
	);
}

function Appointment({ event, day, onDragStart }: { event: Appointment, day: Date, onDragStart: (e: React.MouseEvent, eventId: string) => void }) {
	const startTime = parseISO(event.startTime);
	const endTime = parseISO(event.endTime);
	const startHourInDay = startTime.getHours() + startTime.getMinutes() / 60 - startHour;
	const durationHours = differenceInMinutes(endTime, startTime) / 60;

	const top = Math.max(0, startHourInDay * hourHeight);
	const height = Math.min(durationHours * hourHeight, totalHours * hourHeight - top);

	return (
		<div
			data-event-id={event.id}
			className="absolute left-0 right-0 overflow-hidden rounded px-1 text-xs"
			style={{
				top: `${top}px`,
				height: `${height}px`,
				backgroundColor: getAppointmentColor(event.name),
			}}
		>
			<div className="flex justify-between items-center">
				<div className="font-medium truncate">{event.name}</div>
				<div
					className="cursor-move p-1"
					onMouseDown={(e) => onDragStart(e, event.id)}
				>
					<GripVertical size={14} />
				</div>
			</div>
			<div>{format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}</div>
			<div className="text-muted-foreground truncate">{event.location}</div>
		</div>
	);
}
