import { MemoizedCell } from "./MemoizedTableComponents";
import { Row } from "@tanstack/react-table";

const TableBody = ({ rowVirtualizer, rows }) => {
    return (
        <tbody
            className="grid"
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index] as Row<any>;
                return (
                    <tr
                        data-index={virtualRow.index}
                        ref={(node) => rowVirtualizer.measureElement(node)}
                        key={row.id}
                        className="flex absolute w-full bg-white border-b hover:bg-gray-100"
                        style={{
                            transform: `translateY(${virtualRow.start}px)`,
                        }}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <MemoizedCell key={cell.id} cell={cell} />
                        ))}
                    </tr>
                );
            })}
        </tbody>
    );
};

export default TableBody;
