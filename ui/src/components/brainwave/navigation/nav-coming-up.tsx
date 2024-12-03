import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
const events = [
	{
		id: "1",
		title: "Team Meeting",
		day: "Mon",
		time: "10:00",
		variant: "default",
	},
	{
		id: "2",
		title: "Retrospective",
		day: "Tue",
		time: "11:00",
		variant: "blue",
	},
	{
		id: "3",
		title: "Writing Time",
		day: "Thu",
		time: "12:00",
		variant: "light",
	},
];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = ["09:00", "10:00", "11:00", "12:00", "13:00"];
export default function NavComingUpView() {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [weekDays, setWeekdays] = useState<string[]>([]);

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 60000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		const today = new Date();
		const nextWeek = new Array(7).fill(null).map((_, i) => {
			const day = new Date(today);
			day.setDate(today.getDate() + 1);
			return days[day.getDay()];
		});
		setWeekdays(nextWeek);
	}, []);
	const isEventPast = (eventDay: string, eventTime: string) => {
		const eventDate = new Date(currentTime);
		eventDate.setHours(
			parseInt(eventTime.split(":")[0]),
			parseInt(eventTime.split(":")[1]),
			0,
			0,
		);
		const dayDiff =
			weekDays.indexOf(eventDay) - weekDays.indexOf(days[currentTime.getDay()]);
		eventDate.setDate(eventDate.getDate() + dayDiff);
		return eventDate < currentTime;
	};

	const getEventPosition = (eventTime: string) => {
		const startHour = parseInt(times[0].split(":")[0]);
		const eventHour = parseInt(eventTime.split(":")[0]);
		const eventMinute = parseInt(eventTime.split(":")[1]);
		const totalMinutes = (eventHour - startHour) * 60 + eventMinute;
		const totalDuration =
			(parseInt(times[times.length - 1].split(":")[0]) - startHour) * 60;
		return (totalMinutes / totalDuration) * 100;
	};

	return (
		<div className="w-full max-w-md p-4 bg-white rounded-lg shadow-sm">
			<h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
			<div className="relative">
				{/* Times header */}
				<div className="flex mb-4 pl-12">
					{times.map((time) => (
						<div key={time} className="flex-1 text-xs text-muted-foreground">
							{time}
						</div>
					))}
				</div>

				{/* Days and events */}
				<div className="relative">
					{/* Timeline line */}
					<div
						className="absolute left-12 w-px bg-blue-200"
						style={{
							top: "20px",
							bottom: "20px",
						}}
					/>

					{/* Current day marker */}
					<div
						className="absolute left-12 w-3 h-3 bg-blue-500 rounded-full -ml-[5px]"
						style={{
							top: `calc(${(weekDays.indexOf(days[currentTime.getDay()]) / 7) * 100}% + 10px)`,
						}}
					/>

					{weekDays.map((day, index) => (
						<div key={day} className="flex items-center h-12 mb-2">
							<div
								className={cn(
									"w-12 text-sm",
									index === weekDays.indexOf(days[currentTime.getDay()])
										? "font-semibold text-blue-500"
										: "text-muted-foreground",
								)}
							>
								{day}
							</div>
							<div className="flex-1 relative h-full">
								{events
									.filter((event) => event.day === day)
									.map((event) => (
										<div
											key={event.id}
											className={cn(
												"absolute px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap",
												isEventPast(event.day, event.time)
													? "opacity-50"
													: "opacity-100",
												event.variant === "default" &&
													"bg-primary text-primary-foreground",
												event.variant === "blue" && "bg-blue-500 text-white",
												event.variant === "light" &&
													"bg-blue-200 text-blue-900",
											)}
											style={{
												left: `${getEventPosition(event.time)}%`,
												top: "50%",
												transform: "translateY(-50%)",
											}}
										>
											• {event.title}
										</div>
									))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
