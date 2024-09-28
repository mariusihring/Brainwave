import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSemesterStepper } from "@/lib/stores/semester_stepper"
import { GraduationCapIcon, Trash2Icon } from "lucide-react";

export default function SemesterModuleStep() {
  const formData = useSemesterStepper()
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {formData.modules.map((module, index) => (
          <div key={index} className="flex space-x-4 items-end">
            <ModuleCard module={module} index={index} />
          </div>
        ))}
        <Card className="flex items-center justify-center">
          <Button className="flex grow h-full" variant="ghost" onClick={() => formData.addModule({
            ects: 0,
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
}

function ModuleCard({ module, index }: { module: { name: string, ects: number }, index: number }) {
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
            <GraduationCapIcon className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm text-muted-foreground">
              {module.ects} ECTS
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              size="icon"
              onClick={() => formData.removeModule(module)}
            >
              <Trash2Icon className="h-4 w-4" />
              <span className="sr-only">Remove module</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
