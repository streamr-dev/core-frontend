import { useQuery } from '@tanstack/react-query'
import { getOperatorById } from '~/getters'

export function useOperator(operatorId: string) {
    return useQuery({
        queryKey: ['getOperatorById', operatorId],
        async queryFn() {
            const operator = await getOperatorById(operatorId)
            return operator
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}
