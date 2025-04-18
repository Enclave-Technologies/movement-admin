import { MemoizedCell } from "./MemoizedTableComponents";
import { Row } from "@tanstack/react-table";

const TableBody = ({ rowVirtualizer, rows }) => {
    const rowHeight = 48; // h-12 = 3rem = 48px per row
    
    let finalHeight;
    
    if (rows.length <= 15) {
        finalHeight = `${rows.length * rowHeight}px`;
    } else {
        finalHeight = `${rowVirtualizer.getTotalSize()}px`;
    }
    
    return (
        <tbody
            style={{
                display: "grid",
                height: finalHeight,
                position: "relative", //needed for absolute positioning of rows
                marginTop: 0,
                paddingTop: 0
            }}
            className="w-full"
        >
            {rowVirtualizer.getVirtualItems().length === 0 ? (
                <tr className={`bg-white h-12 items-center cursor-default`}>
                    <td
                        colSpan={rows[0]?.getVisibleCells().length || 6}
                        className="text-center"
                    >
                        No Entries Found
                    </td>
                </tr>
            ) : (
                rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = rows[virtualRow.index] as Row<any>;
                    return (
                        <tr
                            data-index={virtualRow.index}
                            ref={(node) => rowVirtualizer.measureElement(node)}
                            key={row.id}
                            className={`${
                                virtualRow.index % 2
                                    ? "bg-white"
                                    : "bg-gray-100"
                            } h-12 items-center cursor-default hover:bg-gray-200`}
                            style={{
                                display: "flex",
                                position: "absolute",
                                transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                                width: "100%",
                                top: 0,
                            }}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <MemoizedCell key={cell.id} cell={cell} />
                            ))}
                        </tr>
                    );
                })
            )}
        </tbody>
    );
};

export default TableBody;
