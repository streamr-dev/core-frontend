import { useQuery } from '@tanstack/react-query'
import { getOperatorByOwnerAddress } from '~/getters'
import { Operator } from '~/generated/gql/network'
import { mapOperatorToElement } from './useOperatorList'

export function useMyOperator(address: string) {
    return useQuery({
        queryKey: ['getOperatorByOwnerAddress', address],
        async queryFn() {
            const operator = (await getOperatorByOwnerAddress(address)) as Operator
            if (operator != null) {
                return mapOperatorToElement(operator)
            }
            return null
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}
