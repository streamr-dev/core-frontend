import { useCallback, useState } from 'react'
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
    const handleOrderChange = useCallback(
        (columnKey: string) => {
            setOrder((currentOrder) => {
                return getNextSortingParameters(
                    currentOrder.orderBy,
                    columnKey,
                    currentOrder.orderDirection,
                )
            })
        },
        [setOrder],
    )

    return {
        ...order,
        handleOrderChange,
    }
}
