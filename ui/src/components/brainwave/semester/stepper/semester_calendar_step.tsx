import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RecurringAppointment } from "@/graphql/graphql"
import { useSemesterStepper } from "@/lib/stores/semester_stepper"
import { Checkbox } from "@radix-ui/react-checkbox"
import { useState } from "react"

export default function SemesterCalendarStep() {
  const formData = useSemesterStepper()
  return (
    <div className="space-y-4">
      {formData.calendarLink ? (
        <div className="space-y-2">
          <Label>Existing Calendar Link</Label>
          <p>{formData.calendarLink}</p>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="use-existing-link"
              checked={formData.useExistingLink}
              onChange={(e) => formData.setUseExistingLink(e.target.checked)}
            />
            <Label htmlFor="use-existing-link">Use existing link</Label>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="calendar-link">Calendar Link</Label>
          <Input
            id="calendar-link"
            value={formData.calendarLink}
            onChange={(e) => formData.setCalendarLink(e.target.value)}
            placeholder="Enter calendar link"
          />
        </div>
      )}
      <Button onClick={() => alert('Calendar imported!')}>Import Calendar</Button>
      <CoursesTable />
    </div>
  )
}

function CoursesTable() {
  const [appointments, setAppointments] = useState<RecurringAppointment[]>([])

  const handleAppointmentSelect = (appointment: RecurringAppointment) => {
    // setSelectedAppointments((prev) => {
    //   if (prev.includes(appointment)) {
    //     return prev.filter((a) => a !== appointment)
    //   } else {
    //     return [...prev, appointment]
    //   }
    // })
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Select</TableHead>
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
                  checked={appointments.includes(appointment)}
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
    </div>
  )
}
