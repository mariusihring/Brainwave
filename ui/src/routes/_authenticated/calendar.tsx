import { Button } from "@/components/ui/button";
import { execute } from "@/execute.ts";
import { graphql } from "@/graphql";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
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
	startOfDay,
	setHours,
	setMinutes,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState, useCallback, useRef } from "react";
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DroppableProvided, DraggableStateSnapshot, DroppableStateSnapshot, DragStart } from 'react-beautiful-dnd';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';

export const Route = createFileRoute("/_authenticated/calendar")({
	component: CalendarIndex,
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

interface Event {
	id: string;
	title: string;
	start: Date;
	end: Date;
	location: string;
	color: string;
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

const formatHour = (hour: number): string => {
	const period = hour >= 12 ? "PM" : "AM";
	const displayHour = hour % 12 || 12;
	return `${displayHour.toString().padStart(2, "0")} ${period}`;
};

const hours = Array.from({ length: 17 }, (_, i) => i + 5);

export default function CalendarIndex() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const {
		data: { appointments = [] },
	} = useQuery({
		queryKey: ["calendar_appointments"],
		queryFn: () => execute(CALENDAR_APPOINTMENTS),
		initialData: Route.useLoaderData(),
	});

	const [events, setEvents] = useState<Event[]>(() =>
		appointments.map((appointment: Appointment) => ({
			id: appointment.id,
			title: appointment.name,
			start: parseISO(appointment.startTime),
			end: parseISO(appointment.endTime),
			location: appointment.location,
			color: getAppointmentColor(appointment.name),
		}))
	);

	const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);

	const handlePreviousWeek = () => {
		setCurrentDate((prevDate) => subWeeks(prevDate, 1));
	};

	const handleNextWeek = () => {
		setCurrentDate((prevDate) => addWeeks(prevDate, 1));
	};

	const weekDays = useMemo(() => {
		const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
		return Array.from({ length: 5 }, (_, i) => addDays(start, i)); // Only 5 days for weekdays
	}, [currentDate]);

	const handleEditAppointment = useCallback((editedEvent: Event) => {
		setEvents(prevEvents =>
			prevEvents.map(event =>
				event.id === editedEvent.id ? { ...event, ...editedEvent } : event
			)
		);
	}, []);

	const handleDeleteAppointment = useCallback((id: string) => {
		setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
	}, []);

	const onDragStart = useCallback((start: DragStart) => {
		const event = events.find(e => e.id === start.draggableId);
		if (event) {
			setDraggedEvent(event);
		}
	}, [events]);
	const onDragEnd = useCallback((result: DropResult) => {
		setDraggedEvent(null);
		if (!result.destination) return;

		const { draggableId, destination } = result;
		const newDate = parseISO(destination.droppableId);
		const dropTime = destination.index + 5; // 5 is the start hour

		setEvents(prevEvents =>
			prevEvents.map(event => {
				if (event.id === draggableId) {
					const newStart = setHours(setMinutes(newDate, 0), dropTime);
					const duration = differenceInMinutes(event.end, event.start);
					return {
						...event,
						start: newStart,
						end: addMinutes(newStart, duration),
					};
				}
				return event;
			})
		);
	}, []);

	return (
		<DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
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
				<div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-2 overflow-x-auto">
					<div className="sticky left-0 z-10 bg-background w-16">
						<div className="h-14"></div>
						{hours.map((hour) => (
							<div
								key={hour}
								className="h-[60px] border-t border-border flex items-center justify-end"
							>
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
							events={events.filter((event) => isSameDay(event.start, day))}
							draggedEvent={draggedEvent}
							handleEditAppointment={handleEditAppointment}
							handleDeleteAppointment={handleDeleteAppointment}
						/>
					))}
				</div>
			</div>
		</DragDropContext>
	);
}

interface AppointmentProps {
	event: Event;
	index: number;
	onEdit: (event: Event) => void;
	onDelete: (id: string) => void;
}

function Appointment({ event, index, onEdit, onDelete }: AppointmentProps) {
	const startHour = event.start.getHours() + event.start.getMinutes() / 60 - 5;
	const endHour = event.end.getHours() + event.end.getMinutes() / 60 - 5;
	const top = Math.max(0, startHour * hourHeight);
	const height = Math.min((endHour - startHour) * hourHeight, 17 * hourHeight - top);

	return (
		<Draggable draggableId={event.id} index={index}>
			{(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					className={`absolute left-0 right-0 overflow-hidden rounded px-1 text-xs transition-shadow ${snapshot.isDragging ? 'shadow-lg opacity-50' : ''
						}`}
					style={{
						...provided.draggableProps.style,
						top: `${top}px`,
						height: `${height}px`,
						backgroundColor: event.color,
					}}
				>
					<div className="flex justify-between items-center">
						<div className="font-medium truncate">{event.title}</div>
						<div className="flex items-center">
							<div {...provided.dragHandleProps} className="cursor-move mr-2">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
									<path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
								</svg>
							</div>
							<Menu as="div" className="relative inline-block text-left">
								<Menu.Button className="rounded-full p-1 hover:bg-gray-200">
									<EllipsisVerticalIcon className="h-4 w-4 text-gray-500" />
								</Menu.Button>
								<Transition
									enter="transition ease-out duration-100"
									enterFrom="transform opacity-0 scale-95"
									enterTo="transform opacity-100 scale-100"
									leave="transition ease-in duration-75"
									leaveFrom="transform opacity-100 scale-100"
									leaveTo="transform opacity-0 scale-95"
								>
									<Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
										<div className="px-1 py-1">
											<Menu.Item>
												{({ active }) => (
													<button
														className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
															} group flex rounded-md items-center w-full px-2 py-1 text-sm`}
														onClick={() => onEdit(event)}
													>
														Edit
													</button>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<button
														className={`${active ? 'bg-red-500 text-white' : 'text-gray-900'
															} group flex rounded-md items-center w-full px-2 py-1 text-sm`}
														onClick={() => onDelete(event.id)}
													>
														Delete
													</button>
												)}
											</Menu.Item>
										</div>
									</Menu.Items>
								</Transition>
							</Menu>
						</div>
					</div>
					<div>
						{format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
					</div>
					<div className="text-muted-foreground truncate">{event.location}</div>
				</div>
			)}
		</Draggable>
	);
}

interface DayColumnProps {
	day: Date;
	events: Event[];
	draggedEvent: Event | null;
	handleEditAppointment: (event: Event) => void;
	handleDeleteAppointment: (id: string) => void;
}

function DayColumn({ day, events, draggedEvent, handleEditAppointment, handleDeleteAppointment }: DayColumnProps) {
	const placeholderRef = useRef<HTMLDivElement>(null);

	return (
		<Droppable droppableId={day.toISOString()}>
			{(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.droppableProps}
					className={`flex flex-col min-w-[120px] relative ${snapshot.isDraggingOver ? 'bg-gray-100' : ''
						}`}
				>
					<div className="text-center font-medium mb-1">
						{format(day, "EEE")}
					</div>
					<div className="text-center text-sm text-muted-foreground mb-2">
						{format(day, "d")}
					</div>
					<div className="relative h-[1020px]">
						{hours.map((hour) => (
							<div
								key={hour}
								className="h-[60px] border-t border-border"
							></div>
						))}
						{events.map((event, index) => (
							<Appointment
								key={event.id}
								event={event}
								index={index}
								onEdit={handleEditAppointment}
								onDelete={handleDeleteAppointment}
							/>
						))}
						{snapshot.isDraggingOver && draggedEvent && (
							<div
								ref={placeholderRef}
								className="absolute left-0 right-0 bg-gray-300 opacity-50 rounded"
								style={{
									top: `${Math.max(0, (snapshot.draggingOverWith ? parseInt(snapshot.draggingOverWith) : 0) * hourHeight)}px`,
									height: `${differenceInMinutes(draggedEvent.end, draggedEvent.start) * (hourHeight / 60)}px`,
									backgroundColor: draggedEvent.color,
								}}
							>

								<div className="font-medium truncate">{draggedEvent.title}</div>
								<div>{format(draggedEvent.start, "HH:mm")} - {format(draggedEvent.end, "HH:mm")}</div>
								<div className="text-muted-foreground truncate">{draggedEvent.location}</div>
							</div>
						)}
						{provided.placeholder}
					</div>
				</div>
			)}
		</Droppable>
	);
} 
