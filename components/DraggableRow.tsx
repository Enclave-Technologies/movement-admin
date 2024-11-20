import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { FaEdit, FaGripVertical, FaTrash } from "react-icons/fa";

const DraggableRow = ({ exercise }) => {
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
            className="touch-action-none"
        >
            <td className="px-4 py-2 text-xs">
                <FaGripVertical className="cursor-move inline mr-1" />
            </td>

            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap">
                {exercise.setOrderMarker}
            </td>
            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap">
                {exercise.exerciseMotion}
            </td>
            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap">
                {exercise.exerciseDescription}
            </td>
            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap">
                {exercise.exerciseShortDescription}
            </td>
            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap">{`${exercise.setsMin}-${exercise.setsMax}`}</td>
            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap">{`${exercise.repsMin}-${exercise.repsMax}`}</td>
            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap">
                {exercise.TUT}
            </td>
            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap">
                {exercise.tempo}
            </td>
            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap">{`${exercise.restMin}-${exercise.restMax}`}</td>
            {/* <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap">
                <button disabled={true} className="text-gray-400 mr-2">
                    <FaEdit />
                </button>
                <button disabled={true} className="text-gray-400 mr-2">
                    <FaTrash />
                </button>
            </td> */}
        </tr>
    );
};

export default DraggableRow;
