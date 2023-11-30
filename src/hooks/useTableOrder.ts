import { useCallback, useState } from 'react'
import {
    getNextSortingParameters,
    ScrollTableOrderDirection,
} from '~/shared/components/ScrollTable/ScrollTable'

type TableOrderParams = {
    orderBy?: string
    orderDirection?: ScrollTableOrderDirection
}

export const useTableOrder = ({ orderBy, orderDirection }: TableOrderParams = {}): {
    orderBy: string | undefined
    orderDirection: ScrollTableOrderDirection | undefined
    handleOrderChange: (columnKey: string) => void
} => {
    const [order, setOrder] = useState<ReturnType<typeof getNextSortingParameters>>({
        orderBy,
        orderDirection,
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
