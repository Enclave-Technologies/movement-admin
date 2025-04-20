"use client"

import { useCallback, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SortingState, ColumnFiltersState } from "@tanstack/react-table"

export function useTableActions() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Parse current URL search params
  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortingParam = searchParams.get("sorting")
    return sortingParam ? JSON.parse(sortingParam) : []
  })
  
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    const filtersParam = searchParams.get("filters")
    return filtersParam ? JSON.parse(filtersParam) : []
  })
  
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    return searchParams.get("search") || ""
  })
  
  const [pageIndex, setPageIndex] = useState<number>(0) // Don't read from URL
  
  const [pageSize, setPageSize] = useState<number>(() => {
    return Number(searchParams.get("pageSize") || 50)
  })

  // Update URL search params
  const updateSearchParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Update or remove each parameter
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    
    // Remove pageIndex from URL if it exists
    if (params.has("pageIndex")) {
      params.delete("pageIndex")
    }
    
    // Update the URL
    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, router, searchParams])

  // Handle sorting change
  const handleSortingChange = useCallback((newSorting: SortingState) => {
    setSorting(newSorting)
    setPageIndex(0) // Reset to first page on sort change
    updateSearchParams({
      sorting: newSorting.length ? JSON.stringify(newSorting) : null,
    })
  }, [updateSearchParams])

  // Handle column filters change
  const handleColumnFiltersChange = useCallback((newFilters: ColumnFiltersState) => {
    setColumnFilters(newFilters)
    setPageIndex(0) // Reset to first page on filter change
    updateSearchParams({
      filters: newFilters.length ? JSON.stringify(newFilters) : null,
    })
  }, [updateSearchParams])

  // Handle search query change
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
    setPageIndex(0) // Reset to first page on search change
    updateSearchParams({
      search: query || null,
    })
  }, [updateSearchParams])

  // Handle pagination change
  const handlePaginationChange = useCallback((newPageIndex: number, newPageSize?: number) => {
    setPageIndex(newPageIndex)
    
    const updates: Record<string, string | null> = {}
    
    if (newPageSize !== undefined && newPageSize !== pageSize) {
      setPageSize(newPageSize)
      updates.pageSize = String(newPageSize)
      updateSearchParams(updates)
    }
  }, [updateSearchParams, pageSize])

  // Handle load more for infinite scroll
  const handleLoadMore = useCallback(() => {
    const nextPageIndex = pageIndex + 1
    setPageIndex(nextPageIndex)
    // Don't update URL for pageIndex
  }, [pageIndex])

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSorting([])
    setColumnFilters([])
    setSearchQuery("")
    setPageIndex(0)
    
    updateSearchParams({
      sorting: null,
      filters: null,
      search: null,
    })
  }, [updateSearchParams])

  return {
    // Current state
    sorting,
    columnFilters,
    searchQuery,
    pageIndex,
    pageSize,
    
    // Action handlers
    handleSortingChange,
    handleColumnFiltersChange,
    handleSearchChange,
    handlePaginationChange,
    handleLoadMore,
    resetFilters,
    
    // URL params for server components
    urlParams: {
      sorting: sorting.length ? JSON.stringify(sorting) : undefined,
      filters: columnFilters.length ? JSON.stringify(columnFilters) : undefined,
      search: searchQuery || undefined,
      pageSize: pageSize.toString(),
      // pageIndex is intentionally omitted from urlParams
    }
  }
}
