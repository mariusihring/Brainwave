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
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

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

const getAppointmentColor = (name: string) => {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}
	const hue = hash % 360;
	return `hsl(${hue}, 70%, 80%)`;
};

const hourHeight = 60; // Height for each hour in pixels

const formatHour = (hour: number) => {
	const period = hour >= 12 ? "PM" : "AM";
	const displayHour = hour % 12 || 12;
	return `${displayHour.toString().padStart(2, "0")} ${period}`;
};

export default function CalendarIndex() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const {
		data: { appointments = [] },
	} = useQuery({
		queryKey: ["calendar_appointments"],
		queryFn: () => execute(CALENDAR_APPOINTMENTS),
		initialData: Route.useLoaderData(),
	});

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

	const events = useMemo(() => {
		return appointments.map((appointment) => ({
			id: appointment.id,
			title: appointment.name,
			start: parseISO(appointment.startTime),
			end: parseISO(appointment.endTime),
			location: appointment.location,
			color: getAppointmentColor(appointment.name),
		}));
	}, [appointments]);

	const hours = Array.from({ length: 17 }, (_, i) => i + 5);

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
			<div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-2 overflow-x-auto">
				<div className="sticky left-0 z-10 bg-background w-16">
					{" "}
					{/* Slightly increased width */}
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
				{weekDays.map((day, dayIndex) => (
					<div key={dayIndex} className="flex flex-col min-w-[120px]">
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
							{events
								.filter((event) => isSameDay(event.start, day))
								.map((event) => {
									const startHour =
										event.start.getHours() + event.start.getMinutes() / 60 - 5;
									const endHour =
										event.end.getHours() + event.end.getMinutes() / 60 - 5;
									const top = Math.max(0, startHour * hourHeight);
									const height = Math.min(
										(endHour - startHour) * hourHeight,
										17 * hourHeight - top,
									);
									return (
										<div
											key={event.id}
											className="absolute left-0 right-0 overflow-hidden rounded px-1 text-xs"
											style={{
												top: `${top}px`,
												height: `${height}px`,
												backgroundColor: event.color,
											}}
										>
											<div className="font-medium truncate">{event.title}</div>
											<div>
												{format(event.start, "HH:mm")} -{" "}
												{format(event.end, "HH:mm")}
											</div>
											<div className="text-muted-foreground truncate">
												{event.location}
											</div>
										</div>
									);
								})}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
