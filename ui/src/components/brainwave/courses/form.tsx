import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {Course} from "@/graphql/types";
import {  useState } from "react";

type CourseFormProps = {
    course?: Course;
    onSubmit: (module: Course) => void;
};
export default function CourseForm({ course, onSubmit }: CourseFormProps) {
    const [initialData, setInitialData] = useState<Partial<Course>>(
        course || {
            name: "",
        },
    );
    const handleChange = (name: string, value: unknown) => {
        setInitialData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...initialData,
            grade: initialData.grade as number
        } as Course);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Module Name</Label>
                <Input
                    id="name"
                    value={initialData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="grade">Grade</Label>
                <Input
                    id="grade"
                    type="number"
                    value={initialData.grade as number}
                    onChange={(e) => handleChange("grade", Number(e.target.value))}
                />
            </div>
            <div>
                <Label htmlFor="teacher">Teacher</Label>
                <Input
                    id="teacher"
                    type="string"
                    value={initialData.teacher as string}
                    onChange={(e) => handleChange("teacher", e.target.value)}
                />
            </div>
            <div>
                <Label htmlFor="examDay">Exam Day</Label>
                <Input
                    id="examDay"
                    type="date"
                    value={initialData.grade as number}
                    onChange={(e) => handleChange("examDay", e.target.value)}
                />
            </div>
            <div>
                <Label htmlFor="examType">Exam Type</Label>
                <Input
                    id="examType"
                    type="string"
                    value={initialData.grade || ""}
                    onChange={(e) => handleChange("examType", e.target.value)}
                />
            </div>
            <Button type="submit">{"Update Course"}</Button>
        </form>
    );
}
