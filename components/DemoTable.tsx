import React from "react";
import {
    closestCenter,
    DndContext,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const DemoTable = ({ exercises: incomingExercise }) => {
    const [exercises, setExercises] = React.useState(incomingExercise);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor)
    );

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            const originalPos = exercises.findIndex((e) => e.id === active.id);
            const newPos = exercises.findIndex((e) => e.id === over.id);
            const newExercises = [...exercises];
            newExercises.splice(originalPos, 1);
            newExercises.splice(newPos, 0, exercises[originalPos]);
            setExercises(newExercises);
            console.log("drag end");
        }
    }

    return (
        <div>
            DemoTable
            <DndContext
                onDragEnd={handleDragEnd}
                collisionDetection={closestCenter}
                sensors={sensors}
            >
                <table>
                    <thead>
                        <tr>
                            <th>Motion</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <SortableContext
                        items={exercises}
                        strategy={verticalListSortingStrategy}
                    >
                        {exercises.map((e) => (
                            <TabRow key={e.id} exercise={e} />
                            // <tr
                            //     key={e.id}
                            //     className="flex bg-gray-400 border rounded gap-1 exercise"
                            // >
                            //     <td>{e.Motion}</td>
                            //     <td>{e.SpecificDescription}</td>
                            // </tr>
                        ))}
                    </SortableContext>
                </table>
            </DndContext>
        </div>
    );
};

const TabRow = ({ exercise }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: exercise.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="flex bg-gray-400 border rounded gap-1 touch-action-none"
        >
            <td>{exercise.Motion}</td>
            <td>{exercise.SpecificDescription}</td>
        </tr>
    );
};

export default DemoTable;
