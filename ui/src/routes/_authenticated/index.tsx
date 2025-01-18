import NavComingUpView from "@/components/brainwave/navigation/nav-coming-up";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/lib/stores/user";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {queryOptions, useQuery} from "@tanstack/react-query";
import {execute} from "@/execute.ts";
import {graphql} from "@/graphql";

export const Route = createFileRoute("/_authenticated/")({
  component: () => <Dashboard />,
  loader: async ({
                   context: {queryClient}
                 }) => queryClient.ensureQueryData(queryOptions({
    queryKey: ['dashboard_index'],
    queryFn: () => execute(COURSE_INDEX_QUERY)
  }))
});

const COURSE_INDEX_QUERY = graphql(`
  query dashboard_index {
    courses {
      id
      name
      moduleId
      grade
      teacher
      academicDepartment
      isFavorite
    }
  }
`)

function Dashboard() {
  const { user } = useUser();
  const { t } = useTranslation(["global"]);
  const {data: {courses}} = useQuery({
    queryKey: ['dashboard_index'],
    queryFn: () => execute(COURSE_INDEX_QUERY),
    initialData: Route.useLoaderData()
  })

  return (
    <div className="flex flex-col space-y-6 w-full h-full">
      <h1 className="font-bold text-3xl px-6">
        {t("global:hello")}, {user?.username}
      </h1>
      <main className="grid gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3  w-full">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            <Card className="sm:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl">Coming up</CardTitle>
                <CardDescription>This Week</CardDescription>
              </CardHeader>
              <CardContent>
                <NavComingUpView />
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="courses">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="courses">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Your Courses</CardTitle>
                  <CardDescription>
                    View details and progress for your enrolled courses.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Professor
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Progress
                        </TableHead>
                        <TableHead className="text-right">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course, index) => (
                          <TableRow className={index % 2 == 0 ? "bg-accent": ""}>
                            <TableCell>
                              <div className="font-medium">
                                {course.name}
                              </div>
                              <div className="hidden text-sm text-muted-foreground sm:inline">
                                {course.academicDepartment}
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {course.teacher}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Progress value={85} aria-label="85% completed" />
                            </TableCell>
                            <TableCell className="text-right">{course.grade}</TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
