import CoursesCard from "@/components/brainwave/courses/courses_card.tsx";
import {FavoriteCourses} from "@/components/brainwave/courses/favorites.tsx";
import {execute} from "@/execute.ts";
import {queryOptions,  useQuery} from "@tanstack/react-query";
import {createFileRoute} from "@tanstack/react-router";
import {graphql} from "@/graphql";

export const Route = createFileRoute("/_authenticated/university/courses/")({
    component: () => <Coursesindex/>,
    loader: async ({
                       context: {queryClient}
                   }) => queryClient.ensureQueryData(queryOptions({
        queryKey: ['courses_index'],
        queryFn: () => execute(COURSE_INDEX_QUERY)
    }))
});

const COURSE_INDEX_QUERY = graphql(`
    query course_index {
        courses {
            id
            name
            moduleId
            grade
            teacher
            academicDepartment
        }
    }
`)

function Coursesindex() {
    const {data: {courses}} = useQuery({
        queryKey: ['courses_index'],
        queryFn: () => execute(COURSE_INDEX_QUERY),
        initialData: Route.useLoaderData()
    })


    console.log(courses)
    return (
        <div className="w-full">
            <div className="flex w-full justify-between">
                <h1 className="text-3xl font-bold mb-8">Courses Overview</h1>
            </div>
            <FavoriteCourses/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    // @ts-ignore
                    <CoursesCard course={course}/>
                )
                )}
            </div>
        </div>
    );
}
