import {useState} from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Calendar} from "@/components/ui/calendar"
import {CheckIcon, GraduationCapIcon, Trash2Icon} from 'lucide-react'
import {graphql} from "@/graphql";
import {useSemesterStepper} from "@/lib/stores/semester_stepper.ts";
import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    DraggableStateSnapshot, Droppable,
    DroppableProvided,
    DropResult
} from "@hello-pangea/dnd";
import {Course} from "@/graphql/graphql.ts";
import * as Module from "node:module";
import {undefined} from "zod";

export default function SemesterStepper() {
    const formData = useSemesterStepper()
    const [courses, setCourses] = useState(formData.courses)
    // semester
    const CREATE_SEMESTER_MUTATION = graphql(`
        mutation createSemesterMutation($input: NewSemester!) {
            createSemester(input: $input) {
                id
            }
        }
    `);

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

    const onDragEnd = (result: DropResult): void => {
        const { source, destination, draggableId } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            if (source.droppableId === "courses_overview") {
                setCourses(prevCourses => {
                    const newCourses = Array.from(prevCourses);
                    const [removed] = newCourses.splice(source.index, 1);
                    newCourses.splice(destination.index, 0, removed);
                    return newCourses;
                });
            } else {
                // Reorder within a module
                formData.reorderModuleCourses(source.droppableId, source.index, destination.index);
            }
        } else if (source.droppableId === "courses_overview") {
            // Moving from courses to a module
            const courseToMove = courses.find(course => course.id === draggableId);
            if (courseToMove) {
                setCourses(prevCourses => prevCourses.filter(course => course.id !== draggableId));
                formData.addModuleCourse(destination.droppableId, courseToMove, destination.index);
            }
        } else if (destination.droppableId === "courses_overview") {
            // Moving from a module to courses
            const moduleSource = formData.modules.find(m => m.id === source.droppableId);
            const courseToMove = moduleSource?.courses[source.index];
            if (courseToMove) {
                formData.removeModuleCourse(source.droppableId, source.index);
                setCourses(prevCourses => {
                    const newCourses = Array.from(prevCourses);
                    newCourses.splice(destination.index, 0, courseToMove);
                    return newCourses;
                });
            }
        } else {
            // Moving between modules
            const moduleSource = formData.modules.find(m => m.id === source.droppableId);
            const courseToMove = moduleSource?.courses[source.index];
            if (courseToMove) {
                formData.removeModuleCourse(source.droppableId, source.index);
                formData.addModuleCourse(destination.droppableId, courseToMove, destination.index);
            }
        }
    }


    const renderStepContent = () => {
        switch (formData.steps[formData.activeStep].id) {
            case 'semester':
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="semester">Semester Number</Label>
                            <Select
                                value={formData.semester.toString()}
                                onValueChange={(value) => formData.setSemester(Number(value))}
                            >
                                <SelectTrigger id="semester">
                                    <SelectValue placeholder="Select semester"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                        <SelectItem key={num} value={num.toString()}>
                                            {num} Semester
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
                                        onSelect={(date) => formData.setStartDate(date)}
                                        className="rounded-md border"
                                    />
                                </div>
                                <div className="flex-1 space-y-2 mt-4 sm:mt-0">
                                    <Label>End Date</Label>
                                    <Calendar
                                        mode="single"
                                        selected={formData.endDate as Date | undefined}
                                        onSelect={(date) => formData.setEndDate(date)}
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
                                    <ModuleCard module={module} index={index}/>
                                </div>
                            ))}
                            <Card className="flex items-center justify-center">
                                <Button className="flex grow h-full" variant="ghost" onClick={() => formData.addModule({
                                    ects: 12,
                                    endSemester: (Math.random() + 1).toString(36).substring(7),
                                    grade: null,
                                    id: (Math.random() + 1).toString(36).substring(7),
                                    name: "My Module",
                                    startSemester: (Math.random() + 1).toString(36).substring(7),
                                    courses: []
                                })}>Add Module</Button>
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
                    </div>
                )
            case 'courses':
                return (
                    <>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {formData.modules.map((modul, index) => (
                                        <div>
                                            <Droppable droppableId={modul.id} key={modul.id}>
                                                {(provided: DroppableProvided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        className={`border shadow-sm p-4 w-62 rounded-md ${snapshot.isDraggingOver ? 'bg-gray-100' : ''}`}
                                                        {...provided.droppableProps}
                                                    >
                                                        <h2 className="text-lg font-bold mb-2">{modul.name}</h2>
                                                        {formData.modules.find(m => m.id === modul.id).courses.map((item, index) => (
                                                            <Draggable key={item.id} draggableId={item.id}
                                                                       index={index} key={item.id}>
                                                                {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className={`p-2 mb-2 bg-blue rounded shadow-lg ${snapshot.isDragging ? 'bg-green-200' : ''}`}
                                                                    >
                                                                        <h3 className="font-semibold">{item.name}</h3>

                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex grow">
                                    <Droppable droppableId="courses_overview">
                                        {(provided: DroppableProvided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                className={`border shadow-sm p-4 w-full rounded-lg ${snapshot.isDraggingOver ? 'bg-gray-100' : ''}`}
                                                {...provided.droppableProps}
                                            >
                                                <h2 className="text-lg font-bold mb-2">Courses</h2>
                                                <div className="flex gap-2">


                                                {courses.map((course, index) => (
                                                    <Draggable key={course.id} draggableId={course.id} index={index}>
                                                        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`p-2 mb-2 bg-white rounded shadow w-32 ${snapshot.isDragging ? 'bg-green-200' : ''}`}
                                                            >
                                                                <h3 className="font-semibold">{course.name}</h3>

                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                </div>
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </div>
                        </DragDropContext>
                    </>
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
                                            <CheckIcon className="w-5 h-5"/>
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
                    <div className="mt-8 flex justify-between">
                        <Button onClick={formData.lastStep} disabled={formData.activeStep === 0}>
                            Back
                        </Button>
                        <Button onClick={formData.nextStep}
                                disabled={formData.activeStep === formData.steps.length - 1}>
                            {formData.activeStep === formData.steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function ModuleCard({module, index}: { module: { name: string, ects: number }, index: Number }) {
    const formData = useSemesterStepper()
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <Input
                        placeholder="Module Name"
                        id={`module-name-${index}`}
                        value={module.name}
                        onChange={(e) => formData.updateModule(index, {
                            courses: [],
                            ects: 0,
                            endSemester: "",
                            id: "",
                            name: e.target.value,
                            startSemester: ""
                        })}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <GraduationCapIcon className="mr-2 h-4 w-4 opacity-70"/>
                        <span className="text-sm text-muted-foreground">
                {module.ects} ECTS
              </span>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <Button
                            size="icon"
                            onClick={() => handleRemoveModule(index)}
                        >
                            <Trash2Icon className="h-4 w-4"/>
                            <span className="sr-only">Remove module</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


function ModuleCourseCard({module, index}: { module: { name: string, ects: number }, index: Number }) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{module.name}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">

                    <div className="flex items-center">
                        <GraduationCapIcon className="mr-2 h-4 w-4 opacity-70"/>
                        <span className="text-sm text-muted-foreground">
                {module.ects} ECTS
              </span>
                    </div>
                    <div className="flex items-center">
              <span className="text-sm text-muted-foreground">
                <Input placeholder="dann so rein droppen <3"/>
              </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function CourseCard({course, index}: { course: { name: string, ects: number }, index: Number }) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{course.name}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">

                </div>
            </CardContent>
        </Card>
    );
}