"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { execute } from "@/execute"
import { graphql } from "@/graphql"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { useMutation, useQuery } from "@tanstack/react-query"
import { RecurringAppointment } from "@/graphql/graphql"
import { Checkbox } from "@/components/ui/checkbox"
import { Search } from "lucide-react"
import { Progress } from "@/components/ui/progress"

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
  mutation ProcessCalendar {
    processSemesterCalendar {
      name
      weekday
      startTime
      endTime
      location
    }
  }
`)

export default function ImportCalendarAppointmentsDialog() {
  const [selectedAppointments, setSelectedAppointments] = useState<RecurringAppointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [appointments, setAppointments] = useState<RecurringAppointment[]>([])
  const [calendarLink, setCalendarLink] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const { data: linkData, refetch: refetchLink } = useQuery({
    queryKey: ["calendarLink"],
    queryFn: () => execute(CALENDAR_LINK_QUERY),
  })

  const saveLinkMutation = useMutation({
    mutationKey: ["saveCalendarLink"],
    mutationFn: (link: string) => execute(SAVE_CALENDAR_LINK_MUTATION, { link }),
  })

  const appointmentsMutation = useMutation({
    mutationKey: ["processCalendar"],
    mutationFn: () => execute(PROCESS_CALENDAR_MUTATION),
    onSuccess: (data) => {
      setAppointments(data.processSemesterCalendar)
      setIsLoading(false)
      setProgress(100)
    },
  })

  useEffect(() => {
    if (isOpen && linkData?.calendarLink) {
      handleProcessCalendar()
    }
  }, [isOpen, linkData?.calendarLink])

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAppointmentSelect = (appointment: RecurringAppointment) => {
    setSelectedAppointments((prev) => {
      if (prev.includes(appointment)) {
        return prev.filter((a) => a !== appointment)
      } else {
        return [...prev, appointment]
      }
    })
  }

  const handleImport = () => {
    console.log("Selected appointments:", selectedAppointments)
    // Here you can call your mutation or perform any other action with the selected appointments
  }

  const handleSaveLink = async () => {
    await saveLinkMutation.mutateAsync(calendarLink)
    await refetchLink()
    handleProcessCalendar()
  }

  const handleProcessCalendar = async () => {
    setIsLoading(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10
        return newProgress > 90 ? 90 : newProgress
      })
    }, 500)

    await appointmentsMutation.mutateAsync()

    clearInterval(interval)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Import current Semester Calendar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Import Calendar</DialogTitle>
          <DialogDescription>
            {!linkData?.calendarLink
              ? "Please insert the link to your calendar."
              : "Select the appointments you want to import."}
          </DialogDescription>
        </DialogHeader>

        {!linkData?.calendarLink ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Calendar Link
              </Label>
              <Input
                id="link"
                value={calendarLink}
                onChange={(e) => setCalendarLink(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
        ) : isLoading ? (
          <div className="py-4">
            <Progress value={progress} className="w-full" />
          </div>
        ) : appointments.length > 0 ? (
          <>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="max-h-[60vh] overflow-auto">
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
                  {filteredAppointments.map((appointment, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox
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
            </div>
          </>
        ) : (
          <div>No appointments found. Try processing the calendar again.</div>
        )}

        <DialogFooter>
          {!linkData?.calendarLink ? (
            <Button type="submit" onClick={handleSaveLink} disabled={!calendarLink}>
              Save and Import
            </Button>
          ) : isLoading ? (
            <Button disabled>Processing...</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={selectedAppointments.length === 0}>
                Import Selected ({selectedAppointments.length})
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
