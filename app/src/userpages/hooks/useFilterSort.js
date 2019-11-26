import { useState, useEffect, useMemo, useCallback } from 'react'

function useFilterSort(sortOptions = []) {
    const [search, setSearch] = useState(undefined)
    const [filterOptions, setFilterOptions] = useState(undefined)
    const [defaultFilter, setDefaultFilter] = useState(undefined)

    useEffect(() => {
        setDefaultFilter((previousDefaultFilter) => {
            let newDefaultFilter
            if (sortOptions && sortOptions.length > 0) {
                newDefaultFilter = sortOptions[0].filter
            }
            newDefaultFilter = previousDefaultFilter

            setFilterOptions((previousFilterOptions) => {
                if (!previousFilterOptions) {
                    return newDefaultFilter
                }
                return previousFilterOptions
            })

            return newDefaultFilter
        })
    }, [sortOptions])

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
        filter,
        resetFilter,
        defaultFilter,
    }), [
        search,
        setSearch,
        setSort,
        filter,
        resetFilter,
        defaultFilter,
    ])
}

export default useFilterSort
