import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { RecurringAppointment } from "@/graphql/graphql"
import { useSemesterStepper } from "@/lib/stores/semester_stepper"
import { useEffect, useState } from "react"
import { graphql } from "@/graphql";
import { useMutation, useQuery } from "@tanstack/react-query";
import { execute } from "@/execute.ts";
import { toast } from "sonner";
import { SaveIcon } from "lucide-react";


const CALENDAR_LINK_QUERY = graphql(`
  query getCalendarLink {
    calendarLink
  }
`)

const SAVE_CALENDAR_LINK_MUTATION = graphql(`
  mutation SaveCalendarLink($link: String!) {
    upsertCalendarLink(calendarLink: $link) {
      id
    }
  }
`)

const PROCESS_CALENDAR_MUTATION = graphql(`
  mutation ProcessCalendar ($input: String!){
    processSemesterCalendar (semesterId: $input){
      name
      weekday
      startTime
      endTime
      location
    }
  }
`)

export default function SemesterCalendarStep() {
  const formData = useSemesterStepper()
  const [link, setLink] = useState(formData.calendarLink)

  const { data: linkData, refetch: refetchLink } = useQuery({
    queryKey: ['calendarLink'],
    queryFn: () => execute(CALENDAR_LINK_QUERY)
  })

  useEffect(() => {
    if (linkData?.calendarLink) {
      setLink(linkData?.calendarLink)
      formData.setCalendarLink(linkData?.calendarLink)
    }
  }, [linkData])

  const saveLinkMutation = useMutation({
    mutationKey: ["saveCalendarLink"],
    mutationFn: () => execute(SAVE_CALENDAR_LINK_MUTATION, { link }),
  })

  const appointmentsMutation = useMutation({
    mutationKey: ['processCalendar'],
    mutationFn: () => execute(PROCESS_CALENDAR_MUTATION, { input: formData.created_semester_id }),
  })


  const handleSaveLink = () => {
    toast.promise(saveLinkMutation.mutateAsync(), {
      loading: "Loading...",
      success: () => {
        formData.setCalendarLink(link)
        refetchLink()
        return "Success"
      },
      error: (error) => {
        return error.message
      }
    })
  }


  const handleCalendarImport = () => {
    toast.promise(appointmentsMutation.mutateAsync(), {
      loading: "Loading...",
      success: (data) => {
        formData.setAvailableCourses(data.processSemesterCalendar)
        return "Success"
      },
      error: (error) => {
        return error.message
      }
    })
  }
  const availableCourses = formData.availableCourses.length
  return (
    <>
      {availableCourses === 0 ? (<div className="space-y-4">
        {formData.calendarLink ? (
          <div className="space-y-2">
            <Label>Existing Calendar Link</Label>
            <div className="flex gap-2">
              <Input
                id="calendar-link"
                value={link}
                onChange={(e) => {
                  setLink(e.target.value)
                }}
                placeholder="Enter calendar link"
              />
              {formData.calendarLink !== link && <Button onClick={handleSaveLink}><SaveIcon /></Button>}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
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
              value={link}
              onChange={(e) => {
                setLink(e.target.value)
              }}
              placeholder="Enter calendar link"
            />
            <Button onClick={handleSaveLink}><SaveIcon /></Button>
          </div>
        )}
        <Button onClick={handleCalendarImport} disabled={appointmentsMutation.isPending}>Import Calendar</Button>

      </div>) : <CoursesTable />}
    </>
  )
}
function CoursesTable() {
  const formData = useSemesterStepper()
  const [appointments, setAppointments] = useState<RecurringAppointment[]>(formData.availableCourses)
  const [selectedAppointments, setSelectedAppointments] = useState<RecurringAppointment[]>([])

  const handleAppointmentSelect = (appointment: RecurringAppointment) => {

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
