import { useState, useEffect, useMemo, useCallback } from 'react'

// TODO add typing
function useFilterSort(sortOptions: any[] = []): any {
    const defaultFilter = useMemo(() => {
        if (sortOptions && sortOptions.length > 0) {
            return sortOptions[0].filter
        }

        return undefined
    }, [sortOptions])
    const [filterOptions, setFilterOptions] = useState(defaultFilter)
    const [search, setSearch] = useState(undefined)
    useEffect(() => {
        setFilterOptions((previousFilterOptions: any) => previousFilterOptions || defaultFilter)
    }, [defaultFilter])
    const setSort = useCallback(
        (sortOptionId: any) => {
            const sortOption = sortOptions.find((opt) => opt.filter.id === sortOptionId)

            if (sortOption) {
                setFilterOptions({ ...sortOption.filter })
            }
        },
        [sortOptions],
    )
    const resetFilter = useCallback(() => {
        setFilterOptions({ ...defaultFilter })
        setSearch(undefined)
    }, [defaultFilter])
    const filter = useMemo(
        () => ({
            ...filterOptions,
            search,
        }),
        [filterOptions, search],
    )
    return useMemo(
        () => ({
            search,
            setSearch,
            setSort,
            filter,
            resetFilter,
            defaultFilter,
        }),
        [search, setSearch, setSort, filter, resetFilter, defaultFilter],
    )
}

export default useFilterSort
