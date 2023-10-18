import { useState } from 'react'
import {
    getNextSortingParameters,
    ScrollTableOrderDirection,
} from '~/shared/components/ScrollTable/ScrollTable'

export const useTableOrder = (): {
    orderBy: string | undefined
    orderDirection: ScrollTableOrderDirection | undefined
    handleOrderChange: (columnKey: string) => void
} => {
    const [order, setOrder] = useState<ReturnType<typeof getNextSortingParameters>>({
        orderBy: undefined,
        orderDirection: undefined,
    })
    const handleOrderChange = (columnKey: string) => {
        const newOrderSettings = getNextSortingParameters(
            order.orderBy,
            columnKey,
            order.orderDirection,
        )
        setOrder(newOrderSettings)
    }

    return {
        ...order,
        handleOrderChange,
    }
}
