import { createFileRoute } from '@tanstack/react-router'
import {graphql} from "@/__generated__";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, GraduationCapIcon, BookOpenIcon, PenToolIcon, AwardIcon, ClockIcon, BarChartIcon, CheckCircleIcon } from "lucide-react"

export const Route = createFileRoute('/_authenticated/semester/')({
  component: () => <Component />
})


const SEMESTER_QUERY = graphql(`
    query getAllSemester {
      semesters {
        id
        semester
        startDate
        endDate
        totalEcts
      }
    }
`)

// MOCK DATA
type Course = {
  name: string
  ects: number
  grade?: number
}

type Semester = {
  semester: number
  startDate: string
  endDate: string
  totalEcts: number
  coursesCount: number
  examsCount: number
  mainSubjectArea: string
  averageGrade: number | null
  difficulty: 'Easy' | 'Moderate' | 'Challenging'
  keyDeadlines: { date: string; event: string }[]
  courses: Course[]
}

const semesters: Semester[] = [
  {
    semester: 1,
    startDate: "2023-09-01",
    endDate: "2024-01-15",
    totalEcts: 30,
    coursesCount: 5,
    examsCount: 4,
    mainSubjectArea: "Computer Science Fundamentals",
    averageGrade: null,
    difficulty: 'Moderate',
    keyDeadlines: [
      { date: "2023-10-15", event: "Project Proposal Due" },
      { date: "2023-12-01", event: "Final Project Submission" },
    ],
    courses: [
      { name: "Introduction to Programming", ects: 6 },
      { name: "Mathematics for Computer Science", ects: 6 },
      { name: "Digital Logic Design", ects: 6 },
      { name: "Computer Architecture", ects: 6 },
      { name: "Academic Writing", ects: 6 },
    ],
  },
  {
    semester: 2,
    startDate: "2024-02-01",
    endDate: "2024-06-15",
    totalEcts: 30,
    coursesCount: 6,
    examsCount: 5,
    mainSubjectArea: "Data Structures and Algorithms",
    averageGrade: 3.7,
    difficulty: 'Challenging',
    keyDeadlines: [
      { date: "2024-03-20", event: "Midterm Exams" },
      { date: "2024-05-30", event: "Final Project Presentation" },
    ],
    courses: [
      { name: "Data Structures", ects: 6, grade: 3.8 },
      { name: "Algorithms", ects: 6, grade: 3.5 },
      { name: "Object-Oriented Programming", ects: 6, grade: 4.0 },
      { name: "Discrete Mathematics", ects: 4, grade: 3.7 },
      { name: "Probability and Statistics", ects: 4, grade: 3.5 },
      { name: "Professional Ethics", ects: 4, grade: 4.0 },
    ],
  },
  {
    semester: 3,
    startDate: "2024-09-01",
    endDate: "2025-01-15",
    totalEcts: 30,
    coursesCount: 5,
    examsCount: 3,
    mainSubjectArea: "Web Development",
    averageGrade: null,
    difficulty: 'Moderate',
    keyDeadlines: [
      { date: "2024-10-10", event: "Hackathon" },
      { date: "2024-12-15", event: "Portfolio Submission" },
    ],
    courses: [
      { name: "Web Programming", ects: 6 },
      { name: "Database Systems", ects: 6 },
      { name: "Software Engineering", ects: 6 },
      { name: "Computer Networks", ects: 6 },
      { name: "User Interface Design", ects: 6 },
    ],
  },
]

function calculateProgress(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const now = new Date().getTime()

  if (now < start) return 0
  if (now > end) return 100

  const total = end - start
  const elapsed = now - start
  return Math.round((elapsed / total) * 100)
}

function getDifficultyColor(difficulty: Semester['difficulty']) {
  switch (difficulty) {
    case 'Easy': return 'bg-green-500'
    case 'Moderate': return 'bg-yellow-500'
    case 'Challenging': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

function CurrentSemesterView({ semester }: { semester: Semester }) {
  const progress = calculateProgress(semester.startDate, semester.endDate)

  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-2xl">Current Semester: {semester.semester}</span>
          <Badge variant="outline" className="text-lg">{semester.mainSubjectArea}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5 opacity-70" />
                <span className="text-muted-foreground">
                  {new Date(semester.startDate).toLocaleDateString()} - {new Date(semester.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className={`w-4 h-4 rounded-full ${getDifficultyColor(semester.difficulty)}`} title={`Difficulty: ${semester.difficulty}`} />
            </div>
            <div className="flex items-center">
              <GraduationCapIcon className="mr-2 h-5 w-5 opacity-70" />
              <span className="text-muted-foreground">{semester.totalEcts} ECTS</span>
            </div>
            <div className="flex items-center">
              <BookOpenIcon className="mr-2 h-5 w-5 opacity-70" />
              <span className="text-muted-foreground">{semester.coursesCount} Courses</span>
            </div>
            <div className="flex items-center">
              <PenToolIcon className="mr-2 h-5 w-5 opacity-70" />
              <span className="text-muted-foreground">{semester.examsCount} Exams</span>
            </div>
            <div className="space-y-2">
              <span className="font-medium flex items-center">
                <ClockIcon className="mr-2 h-5 w-5 opacity-70" />
                Key Deadlines
              </span>
              <ul className="text-muted-foreground space-y-1">
                {semester.keyDeadlines.map((deadline, index) => (
                  <li key={index}>
                    {new Date(deadline.date).toLocaleDateString()}: {deadline.event}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="font-medium">Courses</span>
              <ul className="space-y-2">
                {semester.courses.map((course, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{course.name}</span>
                    <span className="text-muted-foreground">{course.ects} ECTS</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Progress</span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SemesterCard({ semester }: { semester: Semester }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Semester {semester.semester}</span>
          <Badge variant="outline">{semester.mainSubjectArea}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-sm text-muted-foreground">
                {new Date(semester.startDate).toLocaleDateString()} - {new Date(semester.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className={`w-3 h-3 rounded-full ${getDifficultyColor(semester.difficulty)}`} title={`Difficulty: ${semester.difficulty}`} />
          </div>
          <div className="flex items-center">
            <GraduationCapIcon className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm text-muted-foreground">{semester.totalEcts} ECTS</span>
          </div>
          <div className="flex items-center">
            <BookOpenIcon className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm text-muted-foreground">{semester.coursesCount} Courses</span>
          </div>
          <div className="flex items-center">
            <PenToolIcon className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm text-muted-foreground">{semester.examsCount} Exams</span>
          </div>
          {semester.averageGrade !== null && (
            <div className="flex items-center">
              <AwardIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-sm text-muted-foreground">Average Grade: {semester.averageGrade.toFixed(2)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function Component() {
  const currentDate = new Date()
  const currentSemester = semesters.find(sem =>
    new Date(sem.startDate) <= currentDate && currentDate <= new Date(sem.endDate)
  ) || semesters[0] // Default to first semester if no current semester found

  return (
    <div className="container mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8">Semester Overview</h1>
      <CurrentSemesterView semester={currentSemester} />
      <h2 className="text-2xl font-bold mb-6">All Semesters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {semesters.map((semester) => (
          <SemesterCard key={semester.semester} semester={semester} />
        ))}
      </div>
    </div>
  )
}