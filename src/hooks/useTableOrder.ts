import { useState } from 'react'
import {
    getNextSortingParameters,
    ScrollTableOrderDirection,
} from '~/shared/components/ScrollTable/ScrollTable'

export const useTableOrder = () => {
    const [orderBy, setOrderBy] = useState<string | undefined>()
    const [orderDirection, setOrderDirection] = useState<
        ScrollTableOrderDirection | undefined
    >()
    const handleOrderChange = (columnKey: string) => {
        const newOrderSettings = getNextSortingParameters(
            orderBy,
            columnKey,
            orderDirection,
        )
        setOrderBy(newOrderSettings.orderBy)
        setOrderDirection(newOrderSettings.orderDirection)
    }

    return {
        orderBy,
        orderDirection,
        handleOrderChange,
    }
}
