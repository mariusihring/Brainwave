import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { CheckIcon, Trash2Icon } from 'lucide-react'
import {graphql} from "@/graphql";
import {useMutation} from "@tanstack/react-query";
import {execute} from "@/execute.ts";
import ImportCalendarAppointmentsDialog from "@/components/brainwave/calendar/import_dialog.tsx";

// Hi there my love, im adding comments here so i help u a bit with what to do <3
export default function SemesterStepper() {
  const [activeStep, setActiveStep] = useState<number>(0) // Specify type for activeStep
  const [formData, setFormData] = useState<{
    semester: number;
    startDate: Date | null;
    endDate: Date | null;
    modules: { name: string; ects: string }[];
    courses: { name: string; module: string; ectsPercent: number} [];
    calendarLink: string;
    useExistingLink: boolean;
  }>({
    semester: '',
    startDate: null,
    endDate: null,
    modules: [],
    courses: [],
    calendarLink: '',
    useExistingLink: false,
  })
  // Ich weis nicht wie viel Sinn die hier ergeben muessen wir nachdenken, ob wir noch andere steps etc brauchen.
  const steps = [
    { id: 'semester', title: 'Semester' },
    { id: 'modules', title: 'Modules' },
    { id: 'calendar', title: 'Calendar' },
    { id: 'courses', title: 'Courses' },
    { id: 'review', title: 'Review' },
  ]
  /*
  hier muessen wir einen neuen state machen, der trackt was wir maximal schon waren, damit wenn wir bei schritt 1 was changen wollen wir nicht nochmal durch alles klicken muessen.
  Dabei muessen wir auch schauen wo es sinn ergibt das wir das nochmal machen koennen, des semester neu zu machen ergibt nicht wirklich sinn, aber bei modules vielleicht schon.
  */
  const handleNext = () => {
    switch (activeStep) {
      case 0:
        handleCreateSemester();
        break;
      default:
        break;
    }
    setActiveStep((prevStep) => prevStep + 1
  )}

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleStepClick = (index: number) => { // Specify type for index
    if (index <= activeStep) {
      setActiveStep(index)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: any) => { // Specify type for field and value
    setFormData((prevData) => ({ ...prevData, [field]: value }))
  }

  const handleAddModule = () => {
    setFormData((prevData) => ({
      ...prevData,
      modules: [...prevData.modules, { name: '', ects: '' }]
    }))
  }

  const handleModuleChange = (index: number, field: keyof typeof formData.modules[0], value: any) => { // Specify types for index, field, and value
    setFormData((prevData) => {
      const updatedModules = [...prevData.modules]
      updatedModules[index][field] = value
      return { ...prevData, modules: updatedModules }
    })
  }

  const handleRemoveModule = (index: number) => { // Specify type for index
    setFormData((prevData) => ({
      ...prevData,
      modules: prevData.modules.filter((_, i) => i !== index)
    }))
  }

  const handleAddCourse = () => {
    setFormData((prevData) => ({
      ...prevData,
      courses: [...prevData.courses, { name: '', module: '', ectsPercent: 1 }]
    }))
  }

  const handleCourseChange = (index: number, field: keyof typeof formData.courses[0], value: any) => { // Specify types for index, field, and value
    setFormData((prevData) => {
      const updatedCourses = [...prevData.courses]
      updatedCourses[index][field] = value
      return { ...prevData, courses: updatedCourses}
    })
  }

  const handleRemoveCourse= (index: number) => { // Specify type for index
    setFormData((prevData) => ({
      ...prevData,
      courses: prevData.courses.filter((_, i) => i !== index)
    }))
  }

  // semester
  const CREATE_SEMESTER_MUTATION = graphql(`
    mutation createSemesterMutation($input: NewSemester!) {
        createSemester(input: $input) {
            id
        }
    }
`);

  const mutation = useMutation({
    mutationKey: ["create_semester"],
    mutationFn: () =>
        execute(CREATE_SEMESTER_MUTATION, {
          input: {
            semester: parseInt(formData.semester,10) || 1,
            endDate: formData.endDate.toISOString().split('T')[0],
            startDate: formData.startDate.toISOString().split('T')[0],
            totalEcts: 0,
          },
        }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["semesters"] });
    },
  });

  const handleCreateSemester = () => {
    // Here you would typically send the semester data to your backend
    mutation.mutate();
    router.invalidate();
    setOpen(false);
  };

  //courses


  const renderStepContent = () => {
    switch (steps[activeStep].id) {
      case 'semester':
        return (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="semester">Semester Number</Label>
                <Select
                    value={formData.semester}
                    onValueChange={(value) => handleInputChange('semester', value)}
                >
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Select semester"/>
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          Semester {num}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:space-x-4">
                  <div className="flex-1 space-y-2">
                    <Label>Start Date</Label>
                    <Calendar
                        mode="single"
                        selected={formData.startDate as Date | undefined}
                        onSelect={(date) => handleInputChange('startDate', date)}
                        className="rounded-md border"
                    />
                  </div>
                  <div className="flex-1 space-y-2 mt-4 sm:mt-0">
                    <Label>End Date</Label>
                    <Calendar
                        mode="single"
                        selected={formData.endDate as Date | undefined}
                        onSelect={(date) => handleInputChange('endDate', date)}
                        className="rounded-md border"
                    />
                  </div>
                </div>
              </div>
            </div>
        )
      case 'modules':
        return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {formData.modules.map((module, index) => (
                    <div key={index} className="flex space-x-4 items-end">
                      <Card className="p-4 border-purple-200">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`module-name-${index}`}>Module Name</Label>
                            <Input
                                id={`module-name-${index}`}
                                value={module.name}
                                onChange={(e) => handleModuleChange(index, 'name', e.target.value)}
                            />
                          </div>
                          <div className="flex items-end space-x-2">
                            <div className="flex-grow">
                              <Label htmlFor={`module-ects-${index}`}>ECTS</Label>
                              <Input
                                  id={`module-ects-${index}`}
                                  type="number"
                                  value={module.ects}
                                  onChange={(e) => handleModuleChange(index, 'ects', e.target.value)}
                              />
                            </div>
                            <Button

                                size="icon"
                                onClick={() => handleRemoveModule(index)}
                            >
                              <Trash2Icon className="h-4 w-4"/>
                              <span className="sr-only">Remove module</span>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                ))}
                <Card className="flex items-center justify-center">
                  <Button className="flex grow" variant="ghost" onClick={handleAddModule}>Add Module</Button>
                </Card>
              </div>


            </div>
        )
      case 'calendar':
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
                    onChange={(e) => handleInputChange('useExistingLink', e.target.checked)}
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
                  onChange={(e) => handleInputChange('calendarLink', e.target.value)}
                  placeholder="Enter calendar link"
                />
              </div>
            )}
            <Button onClick={() => alert('Calendar imported!')}>Import Calendar</Button>
          </div>
        )
      case 'courses':
        return (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.modules.map((modul, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg shadow-lg text-black bg-purple-50`}
                    >
                      <p className="text-md">{modul.name}</p>
                      <p className="text-md pb-2"> ECTS: {modul.ects}</p>
                      <Card className="flex grow p-1 space-y-4">
                        hier dann Course rein droppen pls
                      </Card>
                    </div>
                ))}
              </div>
            </div>
        )
      case 'review':
        return (
            <div className="space-y-4">
              <p>Placeholder for the table with imported data</p>
            </div>
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
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center ${index !== steps.length - 1 ? 'flex-1' : ''}`}
                  onClick={() => handleStepClick(index)}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${index < activeStep
                      ? 'bg-purple-300 text-white'
                      : index === activeStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-300 text-gray-500'
                      } ${index <= activeStep ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  >
                    {index < activeStep ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  {index !== steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 ${index < activeStep ? 'bg-purple-300' : 'bg-gray-300'
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`text-sm ${index <= activeStep ? 'text-gray-700' : 'text-gray-400'
                    }`}
                >
                  {step.title}
                </div>
              ))}
            </div>
          </div>
          {renderStepContent()}
          <div className="mt-8 flex justify-between">
            <Button onClick={handleBack} disabled={activeStep === 0}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={activeStep === steps.length - 1}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
