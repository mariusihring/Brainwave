import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { graphql } from "@/graphql";
import { useQuery } from "@tanstack/react-query";
import { execute } from "@/execute";
import { Appointment } from "@/graphql/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EVENT_QUERY = graphql(`
  query EventsQuery {
    appointments {
      id
      title
      startTime
      endTime
    }
  }
`);

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

interface QueryResponse {
  appointments: Appointment[];
}

export default function NavComingUpView() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [weekRange, setWeekRange] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(),
  });

  const { data } = useQuery<QueryResponse>({
    queryKey: ["events_dashboard"],
    queryFn: () => execute(EVENT_QUERY),
  });

  const events = data?.appointments ?? [];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const today = new Date();
    const weekStart = new Date(today);
    const weekEnd = new Date(today);

    weekStart.setDate(today.getDate());
    weekStart.setHours(0, 0, 0, 0);
    weekEnd.setDate(today.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    setWeekRange({ start: weekStart, end: weekEnd });

    const weekDaysList = new Array(7).fill(null).map((_, index) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + index);
      const adjustedDay = day.getDay();
      return days[adjustedDay === 0 ? 6 : adjustedDay - 1];
    });
    setWeekDays(weekDaysList);
  }, []);

  const getFirstWord = (title: string) => {
    return title.split(" ")[0];
  };

  const formatEventTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  const isEventInCurrentWeek = (startTime: string) => {
    const eventDate = new Date(startTime);
    return eventDate >= weekRange.start && eventDate <= weekRange.end;
  };

  const getEventDay = (dateString: string) => {
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return days[dayIndex === 0 ? 6 : dayIndex - 1];
  };

  const isEventPast = (startTime: string) => {
    const eventDate = new Date(startTime);
    return eventDate < currentTime;
  };

  const getEventPosition = (startTime: string) => {
    const date = new Date(startTime);
    const [startHour] = times[0].split(":").map(Number);
    const eventHour = date.getHours();
    const eventMinute = date.getMinutes();
    const totalMinutes = (eventHour - startHour) * 60 + eventMinute;
    const [endHour] = times[times.length - 1].split(":").map(Number);
    const totalDuration = (endHour - startHour) * 60;
    return Math.max(0, Math.min(100, (totalMinutes / totalDuration) * 100));
  };

  const getEventWidth = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const [startHour] = times[0].split(":").map(Number);
    const [endHourDay] = times[times.length - 1].split(":").map(Number);

    const totalDayMinutes = (endHourDay - startHour) * 60;
    const eventMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

    return Math.min(100, (eventMinutes / totalDayMinutes) * 100);
  };

  const getCurrentDayPosition = () => {
    const today = new Date();
    const currentDayIndex = weekDays.indexOf(
      days[today.getDay() === 0 ? 6 : today.getDay() - 1],
    );
    return currentDayIndex >= 0 ? currentDayIndex : 0;
  };

  const filteredEvents = events.filter((event) =>
    isEventInCurrentWeek(event.startTime),
  );

  return (
    <TooltipProvider>
      <div className="w-full h-full p-4 bg-white rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
        <div className="relative h-[calc(100%-2rem)]">
          {/* Times header */}
          <div className="flex mb-4 pl-12">
            {times.map((time) => (
              <div key={time} className="flex-1 text-xs text-muted-foreground">
                {time}
              </div>
            ))}
          </div>

          {/* Days and events */}
          <div className="relative h-[calc(100%-2rem)]">
            {/* Timeline line */}
            <div
              className="absolute left-12 w-px bg-blue-200"
              style={{
                top: "20px",
                bottom: "20px",
              }}
            />

            {/* Current day marker */}
            {weekDays.length > 0 && (
              <div
                className="absolute left-12 w-3 h-3 bg-blue-500 rounded-full -ml-[5px]"
                style={{
                  top: `calc(${(getCurrentDayPosition() / 7) * 100}% + 20px)`,
                }}
              />
            )}

            {weekDays.map((day, index) => (
              <div
                key={day + index}
                className="flex items-center h-[calc(100%/7-0.5rem)] mb-2"
              >
                <div
                  className={cn(
                    "w-12 text-sm",
                    index === getCurrentDayPosition()
                      ? "font-semibold text-blue-500"
                      : "text-muted-foreground",
                  )}
                >
                  {day}
                </div>
                <div className="flex-1 relative h-full">
                  {filteredEvents
                    .filter((event) => getEventDay(event.startTime) === day)
                    .map((event) => (
                      <Tooltip key={event.id} delayDuration={300}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "absolute px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer select-none",
                              isEventPast(event.startTime)
                                ? "opacity-50"
                                : "opacity-100",
                              "bg-blue-500 text-white hover:bg-blue-600 transition-colors",
                            )}
                            style={{
                              left: `${getEventPosition(event.startTime)}%`,
                              width: `${getEventWidth(
                                event.startTime,
                                event.endTime,
                              )}%`,
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          >
                            • {getFirstWord(event.title)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="bg-white p-3 rounded-lg shadow-lg"
                        >
                          <div className="space-y-1">
                            <p className="font-semibold text-muted-foreground">
                              {event.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatEventTime(event.startTime, event.endTime)}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
