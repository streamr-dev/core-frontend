import { useState, useEffect, useMemo, useCallback } from 'react'

function useFilterSort(sortOptions = []) {
    const defaultFilter = useMemo(() => {
        if (sortOptions && sortOptions.length > 0) {
            return sortOptions[0].filter
        }

        return undefined
    }, [sortOptions])

    const [filterOptions, setFilterOptions] = useState(defaultFilter)
    const [search, setSearch] = useState(undefined)

    useEffect(() => {
        setFilterOptions((previousFilterOptions) => (
            previousFilterOptions || defaultFilter
        ))
    }, [defaultFilter])

    const setSort = useCallback((sortOptionId) => {
        const sortOption = sortOptions.find((opt) => opt.filter.id === sortOptionId)

        if (sortOption) {
            setFilterOptions({
                ...sortOption.filter,
            })
        }
    }, [sortOptions])

    const resetFilter = useCallback(() => {
        setFilterOptions({
            ...defaultFilter,
        })
        setSearch(undefined)
    }, [defaultFilter])

    const filter = useMemo(() => ({
        ...filterOptions,
        search,
    }), [filterOptions, search])

    return useMemo(() => ({
        search,
        setSearch,
        setSort,
        setFilterOptions,
        filter,
        resetFilter,
        defaultFilter,
    }), [
        search,
        setSearch,
        setSort,
        setFilterOptions,
        filter,
        resetFilter,
        defaultFilter,
    ])
}

export default useFilterSort
