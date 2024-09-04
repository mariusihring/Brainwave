import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { execute } from "@/execute"
import { graphql } from "@/graphql"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { RecurringAppointment } from "@/graphql/graphql"
import { Checkbox } from "@/components/ui/Checkbox"


const CALENDAR_LINK_QUERY = graphql(`
  query getCalendarLink {
    calendarLink
  }
  `)

const PROCESS_CALENDAR_MUTATION = graphql(
  `mutation ProcessCalendar{
    processSemesterCalendar {
        name
        weekday
        startTime
        endTime
        location
    }
  }`
)

export default function ImportCalendarAppointmentsDialog() {
  const [selectedAppointments, setSelectedAppointments] = useState<RecurringAppointment[]>([])
  const { data } = useQuery({
    queryKey: ["calendarLink"],
    queryFn: () => execute(CALENDAR_LINK_QUERY),
  })

  const appointmentsMutation = useMutation({
    mutationKey: ["processCalendar"],
    mutationFn: () => execute(PROCESS_CALENDAR_MUTATION),
  })

  const handleAppointmentSelect = (appointment: RecurringAppointment) => {
    if (selectedAppointments.includes(appointment)) {
      setSelectedAppointments(selectedAppointments.filter((a) => a !== appointment))
    } else {
      setSelectedAppointments([...selectedAppointments, appointment])
    }
  }
  const handleCreateCourses = () => {
    console.log("Selected appointments:", selectedAppointments)
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" >Import current Semester Calendar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Calendar</DialogTitle>
          {!data?.calendarLink ? <DialogDescription>
            You havent imported your calendar yet. Please insert the link to your calendar.
          </DialogDescription> : null}
        </DialogHeader>


        {!data?.calendarLink ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"></div>
            <Label htmlFor="link" className="text-right flex">
              Calendar Link
            </Label>
            <Input id="link" value="https://calendar.dhbw.de/..." className="col-span-3" />
          </div>

        ) : appointmentsMutation.isPending ? <div>Loading...</div> : appointmentsMutation.isSuccess ? <div><div className="grid gap-4 py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[32px]">
                  <Checkbox id="select-all" />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Weekday</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointmentsMutation.data.processSemesterCalendar.map((appointment, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      id={`appointment-${index}`}
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
        </div></div> : appointmentsMutation.isError ? <div>Error</div> : null}


        <DialogFooter>
          <Button type="submit" onClick={() => appointmentsMutation.mutate()}>Import</Button>
        </DialogFooter>
      </DialogContent >
    </Dialog >
  )
}
