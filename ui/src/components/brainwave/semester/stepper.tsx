import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckIcon } from 'lucide-react'
import { graphql } from "@/graphql";
import { useSemesterStepper } from "@/lib/stores/semester_stepper.ts";
import { RecurringAppointment } from "@/graphql/graphql.ts";
import { useMutation, useQuery } from '@tanstack/react-query'
import { execute } from '@/execute'
import SemesterDateStep from './stepper/semester_dates'
import SemesterModuleStep from './stepper/semester_module'
import SemesterCalendarStep from './stepper/semester_calendar_step'
import SemesterCourseStep from './stepper/semester_courses_step'
import SemesterReviewStep from './stepper/semester_review_step'




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


export default function SemesterStepper() {
    const formData = useSemesterStepper()
    const [selectedAppointments, setSelectedAppointments] = useState<RecurringAppointment[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [appointments, setAppointments] = useState<RecurringAppointment[]>([])
    const [calendarLink, setCalendarLink] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const { data: LinkData, refetch: RefetchLink } = useQuery({
        queryKey: ['calendarLink'],
        queryFn: () => execute(CALENDAR_LINK_QUERY)
    })
    const saveLinkMutation = useMutation({
        mutationKey: ["saveCalendarLink"],
        mutationFn: (link: string) => execute(SAVE_CALENDAR_LINK_MUTATION, { link }),
    })

    const appointmentsMutation = useMutation({
        mutationKey: ['processCalendar'],
        mutationFn: () => execute(PROCESS_CALENDAR_MUTATION),
        onSuccess: (data) => {
            setAppointments(data.processSemesterCalendar), setIsLoading(false)
            setProgress(100)
            setErrorMessage(null)
        },
        onError: (error) => {
            setIsLoading(false)
            setProgress(0)
            setErrorMessage(error.message || "help error")
        }
    })

    const filteredAppointments = appointments.filter((appointment) =>
        appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleImport = () => {
        console.log("Selected appointments:", selectedAppointments)
        // Here you can call your mutation or perform any other action with the selected appointments
    }

    // const mutation = useMutation({
    //   //   mutationKey: ["create_semester"],
    //   //   mutationFn: () =>
    //   //       execute(CREATE_SEMESTER_MUTATION, {
    //   //         input: {
    //   //           semester: parseInt(formData.semester,10) || 1,
    //   //           endDate: formData.endDate.toISOString().split('T')[0],
    //   //           startDate: formData.startDate.toISOString().split('T')[0],
    //   //           totalEcts: 0,
    //   //         },
    //   //       }),
    //   //   onSuccess: () => {
    //   //     queryClient.refetchQueries({ queryKey: ["semesters"] });
    //   //   },
    //   // });


    const renderStepContent = () => {
        switch (formData.steps[formData.activeStep].id) {
            case 'semester':
                return (
                    <SemesterDateStep />
                )
            case 'modules':
                return (
                    <SemesterModuleStep />
                )
            case 'calendar':
                return (
                    <SemesterCalendarStep />
                )
            case 'courses':
                return (
                    <SemesterCourseStep />
                )
            case 'review':
                return (
                    <SemesterReviewStep />
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>Semester Planner</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-8">
                        <div className="flex items-center">
                            {formData.steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className={`flex items-center ${index !== formData.steps.length - 1 ? 'flex-1' : ''}`}
                                // onClick={() => handleStepClick(index)}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${index < formData.activeStep
                                            ? 'bg-green-300 text-white'
                                            : index === formData.activeStep
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-gray-300 text-gray-500'
                                            } ${index <= formData.activeStep ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                    >
                                        {index < formData.activeStep ? (
                                            <CheckIcon className="w-5 h-5" />
                                        ) : (
                                            <span>{index + 1}</span>
                                        )}
                                    </div>
                                    {index !== formData.steps.length - 1 && (
                                        <div
                                            className={`flex-1 h-1 ${index < formData.activeStep ? 'bg-green-300' : 'bg-gray-300'
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2">
                            {formData.steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className={`text-sm ${index <= formData.activeStep ? 'text-gray-700' : 'text-gray-400'
                                        }`}
                                >
                                    {step.title}
                                </div>
                            ))}
                        </div>
                    </div>
                    {renderStepContent()}

                </CardContent>
            </Card>
        </div>
    )
}
