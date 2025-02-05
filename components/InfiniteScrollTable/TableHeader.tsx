import { MemoizedHeader } from "./MemoizedTableComponents";

const TableHeader = ({ table }) => {
    return (
        <thead className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
                <tr
                    key={headerGroup.id}
                    className="bg-gray-200 text-black"
                    style={{ display: "flex", width: "100%" }}
                >
                    {headerGroup.headers.map((header) => (
                        <th
                            key={header.id}
                            className={`text-sm font-bold pl-5 pr-4 h-10 items-center whitespace-nowrap ${
                                header.column.columnDef.meta?.className ?? ""
                            }  ${
                                header.column.getCanSort()
                                    ? "cursor-default select-none"
                                    : ""
                            } bg-inherit`}
                            style={{
                                display: "flex",
                                width: header.getSize(),
                            }}
                            onClick={header.column.getToggleSortingHandler()}
                        >
                            <MemoizedHeader
                                header={header}
                                isSorted={header.column.getIsSorted()}
                            />
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    );
};

export default TableHeader;
