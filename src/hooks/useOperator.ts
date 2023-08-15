import { useQuery } from '@tanstack/react-query'
import { getOperatorById } from '~/getters'
import { Operator } from '~/generated/gql/network'
import { mapOperatorToElement } from './useOperatorList'

export function useOperator(operatorId: string) {
    return useQuery({
        queryKey: ['getOperatorById', operatorId],
        async queryFn() {
            const operator = (await getOperatorById(operatorId)) as Operator
            if (operator != null) {
                return mapOperatorToElement(operator)
            }
            return null
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}
