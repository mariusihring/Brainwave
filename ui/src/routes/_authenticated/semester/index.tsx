import { createFileRoute } from '@tanstack/react-router'
import {graphql} from "@/__generated__";
import {useQuery} from "@apollo/client";
import CurrentSemesterView from '@/components/brainwave/semester/current_semester';
import SemesterCard from '@/components/brainwave/semester/semester_card';

export const Route = createFileRoute('/_authenticated/semester/')({
  component: () => <Component />
})

//TODO: move fetching in loader function

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
function Component() {
  const {loading, error, data} = useQuery(SEMESTER_QUERY)
  const currentDate = new Date()
  const currentSemester = data?.semesters.find(sem =>
    new Date(sem.startDate) <= currentDate && currentDate <= new Date(sem.endDate)
  ) || semesters[0] // Default to first semester if no current semester found

  return (
    <div className="container mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8">Semester Overview</h1>
      <CurrentSemesterView semester={currentSemester} />
      <h2 className="text-2xl font-bold mb-6">All Semesters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.semesters.map((semester) => (
          <SemesterCard key={semester.semester} semester={semester} />
        ))}
      </div>
    </div>
  )
}