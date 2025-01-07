import { MemoizedHeader } from "./MemoizedTableComponents";

const TableHeader = ({ table }) => {
    return (
        <thead className="sticky top-0 z-10 bg-gray-200 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="flex w-full">
                    {headerGroup.headers.map((header) => (
                        <th
                            key={header.id}
                            className={`flex w-[${header.getSize()}] p-3 font-medium text-gray-700 ${
                                header.column.getCanSort()
                                    ? "cursor-pointer select-none hover:bg-gray-300"
                                    : ""
                            }`}
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
