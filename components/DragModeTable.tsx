// import React from "react";
// import { closestCenter, DndContext } from "@dnd-kit/core";
// import {
//     SortableContext,
//     verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import DraggableRow from "./DraggableRow";

// const DragModeTable = ({ exercises, handleDragEnd }) => {
//     return (
//         <div>
//             {exercises.length === 0 ? (
//                 <div className="text-center py-4 px-6 bg-gray-100 rounded-md shadow-sm">
//                     <p className="text-gray-500 text-sm font-medium uppercase">
//                         No exercises added yet
//                     </p>
//                     <p className="text-gray-400 text-xs mt-1 uppercase">
//                         Enter edit mode and click &ldquo;Add exercise&rdquo; to
//                         get started
//                     </p>
//                 </div>
//             ) : (
//                 <DndContext
//                     onDragEnd={handleDragEnd}
//                     collisionDetection={closestCenter}
//                 >
//                     <table className="min-w-full bg-white table-fixed">
//                         <colgroup>
//                             <col className="w-[140px]" />
//                             <col className="w-[150px]" />
//                             <col className="w-[200px]" />
//                             <col className="w-[320px]" />
//                             <col className="w-[320px]" />
//                             <col className="w-[200px]" />
//                             <col className="w-[200px]" />
//                             <col className="w-[100px]" />
//                             <col className="w-[150px]" />
//                             <col className="w-[150px]" />
//                             {/* <col className="w-[150px]" /> */}
//                         </colgroup>
//                         <thead className="bg-green-500 text-white">
//                             <tr>
//                                 <th className="px-2 py-2 text-xs">Order</th>
//                                 <th className="px-2 py-2 text-xs">Marker</th>
//                                 <th className="px-2 py-2 text-xs">Motion</th>
//                                 <th className="px-2 py-2 text-xs">
//                                     Description
//                                 </th>
//                                 <th className="px-2 py-2 text-xs">
//                                     Short Description
//                                 </th>
//                                 <th className="px-2 py-2 text-xs">Sets</th>
//                                 <th className="px-2 py-2 text-xs">Reps</th>
//                                 <th className="px-2 py-2 text-xs">TUT</th>
//                                 <th className="px-2 py-2 text-xs">Tempo</th>
//                                 <th className="px-2 py-2 text-xs">Rest</th>
//                                 {/* <th className="px-2 py-2 text-xs">Actions</th> */}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <SortableContext
//                                 items={exercises}
//                                 strategy={verticalListSortingStrategy}
//                             >
//                                 {exercises
//                                     .sort(
//                                         (a, b) =>
//                                             a.exerciseOrder - b.exerciseOrder
//                                     )
//                                     .map((exercise) => (
//                                         <DraggableRow
//                                             id={exercise.id}
//                                             key={exercise.id}
//                                         />
//                                     ))}
//                             </SortableContext>
//                         </tbody>
//                     </table>
//                 </DndContext>
//             )}
//         </div>
//     );
// };

// export default DragModeTable;
