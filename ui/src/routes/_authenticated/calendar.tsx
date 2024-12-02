import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { execute } from "@/execute";
import { graphql } from "@/graphql";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, MapPinIcon } from "lucide-react";

import React, { useState } from "react";

import { generateTimeSlots, generateWeekDays } from "@/lib/utils/calendar";
import { differenceInMinutes, format, isSameDay, isWithinInterval, parseISO } from "date-fns";
import type { Appointment } from "@/graphql/types";

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
      })
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

  const [currentWeek, setCurrentWeek] = useState(new Date());
  const weekDays = generateWeekDays(currentWeek);
  const timeSlots = generateTimeSlots();

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek((prevWeek) => {
      const newWeek = new Date(prevWeek);
      newWeek.setDate(newWeek.getDate() + (direction === "next" ? 7 : -7));
      return newWeek;
    });
  };

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((appointment) => {
      const appointmentStart = parseISO(appointment.startTime);
      return isSameDay(appointmentStart, day);
    });
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
    };
  };

  return (
    <Card className="w-full bg-stone-50 shadow-sm relative">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-light text-stone-700">
            {format(weekDays[0], "MMMM yyyy")}
          </h2>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => navigateWeek("prev")}>
              <ChevronLeft className="h-4 w-4 text-stone-500" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigateWeek("next")}>
              <ChevronRight className="h-4 w-4 text-stone-500" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <div></div>
          {weekDays.map((day) => (
            <div key={day.toString()} className="text-center">
              <div className="font-medium text-stone-600">{format(day, "EEE")}</div>
              <div className="text-sm text-stone-400">{format(day, "d")}</div>
            </div>
          ))}
          <div className="col-span-6">
            <div className="relative">
              {weekDays.map((day, index) => (
                <div
                  key={day.toString()}
                  className="absolute"
                  style={{ top: "8rem", left: `${(index + 1) * (100 / 6)}%`, width: `${100 / 6}%` }}
                >
                  {getAppointmentsForDay(day)
                    .filter((app) => !isAllDayAppointment(app))
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="absolute left-1 right-1 bg-amber-100 text-amber-800 rounded-sm px-2 py-1 text-xs truncate shadow-sm"
                        style={getAppointmentStyle(appointment)}
                      >
                        {appointment.title}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
          {timeSlots.map((time) => (
            <React.Fragment key={time}>
              <div className="text-right pr-4 py-2 text-sm text-stone-400">{time}</div>
              {weekDays.map((day) => (
                <div key={`${day}-${time}`} className="relative h-12 group">
                  <div className="absolute inset-0 border-t border-stone-100 group-hover:bg-stone-100/50 transition-colors duration-200"></div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
