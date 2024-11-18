import { execute } from "@/execute";
import { graphql } from "@/graphql";
import { useSemesterStepper } from "@/lib/stores/semester_stepper";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DropResult,
} from "@hello-pangea/dnd";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function SemesterCourseStep() {
  const formData = useSemesterStepper();

  const [courses, setCourses] = useState(formData.courses);

  const onDragEnd = (result: DropResult): void => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "courses_overview") {
        setCourses((prevCourses) => {
          const newCourses = Array.from(prevCourses);
          const [removed] = newCourses.splice(source.index, 1);
          newCourses.splice(destination.index, 0, removed);
          return newCourses;
        });
      } else {
        // Reorder within a module
        formData.reorderModuleCourses(
          source.droppableId,
          source.index,
          destination.index,
        );
      }
    } else if (source.droppableId === "courses_overview") {
      // Moving from courses to a module
      const courseToMove = courses.find((course) => course.id === draggableId);
      if (courseToMove) {
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== draggableId),
        );
        formData.addModuleCourse(
          destination.droppableId,
          courseToMove,
          destination.index,
        );
      }
    } else if (destination.droppableId === "courses_overview") {
      // Moving from a module to courses
      const moduleSource = formData.modules.find(
        (m) => m.id === source.droppableId,
      );
      const courseToMove = moduleSource?.courses[source.index];
      if (courseToMove) {
        formData.removeModuleCourse(source.droppableId, source.index);
        setCourses((prevCourses) => {
          const newCourses = Array.from(prevCourses);
          newCourses.splice(destination.index, 0, courseToMove);
          return newCourses;
        });
      }
    } else {
      // Moving between modules
      const moduleSource = formData.modules.find(
        (m) => m.id === source.droppableId,
      );
      const courseToMove = moduleSource?.courses[source.index];
      if (courseToMove) {
        formData.removeModuleCourse(source.droppableId, source.index);
        formData.addModuleCourse(
          destination.droppableId,
          courseToMove,
          destination.index,
        );
      }
    }
  };

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
                      className={`border shadow-sm p-4 w-62 rounded-md ${snapshot.isDraggingOver ? "bg-gray-100" : ""}`}
                      {...provided.droppableProps}
                    >
                      <h2 className="text-lg font-bold mb-2">{modul.name}</h2>
                      {formData.modules
                        .find((m) => m.id === modul.id)
                        ?.courses?.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(
                              provided: DraggableProvided,
                              snapshot: DraggableStateSnapshot,
                            ) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-2 mb-2 bg-blue rounded shadow-lg ${snapshot.isDragging ? "bg-green-200" : ""}`}
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
                  className={`border shadow-sm p-4 w-full rounded-lg ${snapshot.isDraggingOver ? "bg-gray-100" : ""}`}
                  {...provided.droppableProps}
                >
                  <h2 className="text-lg font-bold mb-2">Courses</h2>
                  <div className="flex gap-2">
                    {courses.map((course, index) => (
                      <Draggable
                        key={course.id}
                        draggableId={course.id}
                        index={index}
                      >
                        {(
                          provided: DraggableProvided,
                          snapshot: DraggableStateSnapshot,
                        ) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-2 mb-2 bg-white rounded shadow w-32 ${snapshot.isDragging ? "bg-green-200" : ""}`}
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
  );
}
