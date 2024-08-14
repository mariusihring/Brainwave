import Agenda from "@/components/brainwave/dashboard/agenda"
import {useUser} from "@/lib/stores/user";
import {createFileRoute} from "@tanstack/react-router";
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import {CalendarIcon, ChevronRightIcon, CheckIcon, BookOpenIcon} from "lucide-react"
import {useTranslation} from "react-i18next"
export const Route = createFileRoute("/_authenticated/")({
    component: () => <Dashboard/>,
});

const test: string[] = ["rust", "typescripto", "boring stuff"];

function Dashboard() {
    const {user} = useUser();
  const {t} = useTranslation(["global"])
    return (
        <div className="flex flex-col space-y-6 w-full h-full">
            <h1 className="font-bold text-3xl px-6">{t("global:hello")}, {user?.username}</h1>
            {/*<div className="grid bg-red-200 w-full h-full grid-cols-3 grid-rows-2 gap-2">*/}

            {/*    <Agenda/>*/}

            {/*    <div className="w-full h-full bg-green-200"/>*/}
            {/*    <div className="w-full h-full bg-green-200"/>*/}
            {/*    <div className="w-full h-full bg-blue-200 col-span-3"/>*/}
            {/*</div>*/}
            <main className="grid gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3  w-full">
                     <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
                       <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                         <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
                           <CardHeader className="pb-3">
                             <CardTitle>Your Agenda</CardTitle>
                             <CardDescription className="max-w-lg text-balance leading-relaxed">
                               Stay on top of your daily tasks and upcoming events.
                             </CardDescription>
                           </CardHeader>
                           <CardContent>
                             <div className="grid gap-4">
                               <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                   <CalendarIcon className="h-4 w-4" />
                                 </div>
                                 <div>
                                   <div className="font-medium">Exam Preparation</div>
                                   <div className="text-sm text-muted-foreground">Today, 2:00 PM</div>
                                 </div>
                                 <Button variant="ghost" size="icon" className="h-8 w-8">
                                   <ChevronRightIcon className="h-4 w-4" />
                                 </Button>
                               </div>
                               <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                                   <CheckIcon className="h-4 w-4" />
                                 </div>
                                 <div>
                                   <div className="font-medium">Finish Assignment</div>
                                   <div className="text-sm text-muted-foreground">Tomorrow, 5:00 PM</div>
                                 </div>
                                 <Button variant="ghost" size="icon" className="h-8 w-8">
                                   <ChevronRightIcon className="h-4 w-4" />
                                 </Button>
                               </div>
                               <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                   <BookOpenIcon className="h-4 w-4" />
                                 </div>
                                 <div>
                                   <div className="font-medium">Read Chapter 3</div>
                                   <div className="text-sm text-muted-foreground">Friday, 7:00 PM</div>
                                 </div>
                                 <Button variant="ghost" size="icon" className="h-8 w-8">
                                   <ChevronRightIcon className="h-4 w-4" />
                                 </Button>
                               </div>
                             </div>
                           </CardContent>
                           <CardFooter>
                             <Button>View Full Agenda</Button>
                           </CardFooter>
                         </Card>
                         <Card x-chunk="dashboard-05-chunk-1">
                           <CardHeader className="pb-2">
                             <CardDescription>This Week</CardDescription>
                             <CardTitle className="text-4xl">4 Tasks</CardTitle>
                           </CardHeader>
                           <CardContent>
                             <div className="text-xs text-muted-foreground">+2 tasks from last week</div>
                           </CardContent>
                           <CardFooter>
                             <Progress value={50} aria-label="50% of tasks completed" />
                           </CardFooter>
                         </Card>
                         <Card x-chunk="dashboard-05-chunk-2">
                           <CardHeader className="pb-2">
                             <CardDescription>Upcoming Exams</CardDescription>
                             <CardTitle className="text-4xl">3 Exams</CardTitle>
                           </CardHeader>
                           <CardContent>
                             <div className="text-xs text-muted-foreground">+1 exam from last month</div>
                           </CardContent>
                           <CardFooter>
                             <Progress value={75} aria-label="75% of exams prepared" />
                           </CardFooter>
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
                               <CardDescription>View details and progress for your enrolled courses.</CardDescription>
                             </CardHeader>
                             <CardContent>
                               <Table>
                                 <TableHeader>
                                   <TableRow>
                                     <TableHead>Course</TableHead>
                                     <TableHead className="hidden sm:table-cell">Professor</TableHead>
                                     <TableHead className="hidden sm:table-cell">Progress</TableHead>
                                     <TableHead className="text-right">Grade</TableHead>
                                   </TableRow>
                                 </TableHeader>
                                 <TableBody>
                                   <TableRow className="bg-accent">
                                     <TableCell>
                                       <div className="font-medium">Introduction to Computer Science</div>
                                       <div className="hidden text-sm text-muted-foreground sm:inline">CS101</div>
                                     </TableCell>
                                     <TableCell className="hidden sm:table-cell">Dr. Jane Doe</TableCell>
                                     <TableCell className="hidden sm:table-cell">
                                       <Progress value={85} aria-label="85% completed" />
                                     </TableCell>
                                     <TableCell className="text-right">A-</TableCell>
                                   </TableRow>
                                   <TableRow>
                                     <TableCell>
                                       <div className="font-medium">Calculus I</div>
                                       <div className="hidden text-sm text-muted-foreground sm:inline" />
                                     </TableCell>
                                   </TableRow>
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
