import { useCallback, useState } from 'react'
import { OrderDirection } from '~/types'

export function useTableOrder<T extends string = string>({
    orderBy,
    orderDirection,
}: GetNextSortingParametersResult<T> = {}): GetNextSortingParametersResult<T> & {
    setOrder: (orderBy: T, orderDirection?: OrderDirection) => void
} {
    const [order, setOrder] = useState<GetNextSortingParametersResult<T>>(
        orderBy && orderDirection
            ? {
                  orderBy,
                  orderDirection,
              }
            : { orderBy: undefined, orderDirection: undefined },
    )

    const handleOrderChange = useCallback((column: T, direction?: OrderDirection) => {
        if (!direction) {
            setOrder((currentOrder) => {
                return getNextSortingParameters<T>(
                    currentOrder.orderBy,
                    column,
                    currentOrder.orderDirection,
                )
            })

            return
        }

        setOrder({
            orderBy: column,
            orderDirection: direction,
        })
    }, [])

    return {
        ...order,
        setOrder: handleOrderChange,
    }
}

type GetNextSortingParametersResult<T extends string = string> =
    | {
          orderBy: T
          orderDirection: OrderDirection
      }
    | { orderBy?: undefined; orderDirection?: undefined }

function getNextSortingParameters<T extends string = string>(
    currentOrderBy: T | undefined,
    newOrderBy: T,
    currentOrderDirection: OrderDirection | undefined,
): GetNextSortingParametersResult<T> {
    if (currentOrderBy !== newOrderBy) {
        return {
            orderBy: newOrderBy,
            orderDirection: 'asc',
        }
    }

    const newDirection = !currentOrderDirection
        ? 'asc'
        : currentOrderDirection === 'asc'
        ? 'desc'
        : undefined

    if (newDirection == null) {
        return {
            orderBy: undefined,
            orderDirection: undefined,
        }
    }

    return {
        orderBy: newOrderBy,
        orderDirection: newDirection,
    }
}
