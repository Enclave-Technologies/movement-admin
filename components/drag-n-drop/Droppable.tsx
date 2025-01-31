import { useDroppable } from "@dnd-kit/core";

function Droppable({ setNodeRef, children }) {
  return <div ref={setNodeRef}>{children}</div>;
}
