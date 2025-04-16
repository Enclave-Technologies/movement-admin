"use server";

import { z } from "zod";

// Define the Person type (similar to the example)
export type Person = {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    status: string;
    progress: number;
    createdAt: Date;
};

// Define the API response type
export type PersonApiResponse = {
    data: Person[];
    meta: {
        totalRowCount: number;
    };
};

// Schema for validating sort parameters
const SortSchema = z.array(
    z.object({
        id: z.string(),
        desc: z.boolean().optional(),
    })
);

// Schema for validating filter parameters
const FilterSchema = z.array(
    z.object({
        id: z.string(),
        value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
    })
);

// Schema for validating pagination parameters
const PaginationSchema = z.object({
    pageIndex: z.coerce.number().default(0),
    pageSize: z.coerce.number().default(10),
});

// Schema for validating search parameters
const SearchSchema = z.object({
    query: z.string().optional(),
});

// Generate mock data
function generatePerson(index: number): Person {
    const statuses = ["active", "pending", "inactive"];
    const firstNames = [
        "John",
        "Jane",
        "Bob",
        "Alice",
        "Charlie",
        "Diana",
        "Edward",
        "Fiona",
    ];
    const lastNames = [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Miller",
        "Davis",
        "Garcia",
    ];

    return {
        id: index,
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        age: 20 + Math.floor(Math.random() * 50),
        visits: Math.floor(Math.random() * 100),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        progress: Math.floor(Math.random() * 100),
        createdAt: new Date(
            Date.now() - Math.floor(Math.random() * 10000000000)
        ),
    };
}

// Generate a dataset of people
const DATASET_SIZE = 1000;
const PEOPLE_DATASET = Array.from({ length: DATASET_SIZE }, (_, i) =>
    generatePerson(i)
);

// Apply sorting to data
function applySorting(data: Person[], sorting: z.infer<typeof SortSchema>) {
    if (!sorting.length) return data;

    return [...data].sort((a, b) => {
        for (const sort of sorting) {
            const { id, desc } = sort;
            const aValue = a[id as keyof Person];
            const bValue = b[id as keyof Person];

            // Handle different types of values
            if (aValue < bValue) {
                return desc ? 1 : -1;
            }
            if (aValue > bValue) {
                return desc ? -1 : 1;
            }
        }
        return 0;
    });
}

// Apply filtering to data
function applyFiltering(data: Person[], filters: z.infer<typeof FilterSchema>) {
    if (!filters.length) return data;

    return data.filter((person) => {
        return filters.every((filter) => {
            const { id, value } = filter;
            const personValue = person[id as keyof Person];

            if (value === null || value === undefined) {
                return true;
            }

            if (typeof personValue === "string" && typeof value === "string") {
                return personValue.toLowerCase().includes(value.toLowerCase());
            }

            return personValue === value;
        });
    });
}

// Apply search to data
function applySearch(data: Person[], search: string | undefined) {
    if (!search) return data;

    const searchLower = search.toLowerCase();
    return data.filter((person) => {
        return (
            person.firstName.toLowerCase().includes(searchLower) ||
            person.lastName.toLowerCase().includes(searchLower) ||
            person.status.toLowerCase().includes(searchLower) ||
            String(person.age).includes(searchLower) ||
            String(person.visits).includes(searchLower) ||
            String(person.progress).includes(searchLower)
        );
    });
}

// Fetch data with pagination, sorting, filtering, and search
export async function fetchPeopleData(params: {
    pageIndex?: number | string;
    pageSize?: number | string;
    sorting?: string;
    filters?: string;
    search?: string;
}): Promise<PersonApiResponse> {
    console.log(`Params received: ${JSON.stringify(params)}`);

    // Parse and validate parameters
    const pagination = PaginationSchema.parse({
        pageIndex:
            typeof params.pageIndex !== "undefined" ? params.pageIndex : 0,
        pageSize: typeof params.pageSize !== "undefined" ? params.pageSize : 50,
    });

    const sorting =
        typeof params.sorting !== "undefined" && params.sorting
            ? SortSchema.parse(JSON.parse(params.sorting as string))
            : [];

    const filters =
        typeof params.filters !== "undefined" && params.filters
            ? FilterSchema.parse(JSON.parse(params.filters as string))
            : [];

    const search = SearchSchema.parse({
        query: typeof params.search !== "undefined" ? params.search : undefined,
    });

    console.log(
        `Parsed Params: ${JSON.stringify({
            pagination,
            sorting,
            filters,
            search,
        })}`
    );

    // Simulate server delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Apply filtering and search first (affects total count)
    let filteredData = PEOPLE_DATASET;
    filteredData = applyFiltering(filteredData, filters);
    filteredData = applySearch(filteredData, search.query);

    // Get total count after filtering
    const totalRowCount = filteredData.length;

    // Apply sorting
    filteredData = applySorting(filteredData, sorting);

    // Apply pagination
    const { pageIndex, pageSize } = pagination;
    const start = pageIndex * pageSize;
    const paginatedData = filteredData.slice(start, start + pageSize);

    console.log(
        `Sliced from ${start} to ${start + pageSize} and sending ${
            paginatedData.length
        } rows`
    );

    // Return the response
    return {
        data: paginatedData,
        meta: {
            totalRowCount,
        },
    };
}

// Generic data fetching function for any table
export async function fetchTableData<T>(
    fetchFn: (params: Record<string, unknown>) => Promise<{
        data: T[];
        meta: { totalRowCount: number };
    }>,
    params: Record<string, unknown>
): Promise<{
    data: T[];
    meta: { totalRowCount: number };
}> {
    return fetchFn(params);
}
