import { UseInfiniteQueryResult, useInfiniteQuery } from '@tanstack/react-query'
import { getOperatorsByDelegation } from '~/getters'
import { OperatorParser, ParsedOperator } from '~/parsers/OperatorParser'
import { getSpotApy } from '~/utils/apy'
import { BN, toBN } from '~/utils/bn'
import { getDelegationAmountForAddress2 } from '~/utils/delegation'
import { errorToast } from '~/utils/toast'

interface EnhancedOperator extends ParsedOperator {
    apy: number
    myShare: BN
}

export function useDelegationStats(address = '') {
    const { data } = useDelegationsForWalletQuery(address, { pageSize: 1000 })

    if (!data) {
        return
    }

    const operators = data?.pages.flatMap((page) => page.delegations) || []

    let minApy = 1

    let maxApy = 0

    operators.forEach(({ apy }) => {
        minApy = Math.min(minApy, apy)

        maxApy = Math.max(maxApy, apy)
    })

    if (minApy > maxApy) {
        minApy = 0

        maxApy = 0
    }

    const value = operators.reduce((sum, { myShare }) => sum.plus(myShare), toBN(0))

    return {
        value,
        minApy,
        maxApy,
        numOfOperators: operators.length,
    }
}

export function useDelegationsForWalletQuery(
    address = '',
    { pageSize = 10 }: { pageSize?: number } = {},
): UseInfiniteQueryResult<{ skip: number; delegations: EnhancedOperator[] }> {
    return useInfiniteQuery({
        queryKey: ['useDelegationsForWalletQuery', address.toLowerCase(), pageSize],
        async queryFn({ pageParam: skip = 0 }) {
            if (!address) {
                return {
                    skip,
                    delegations: [],
                }
            }

            const delegations: EnhancedOperator[] = []

            let preparsedCount = 0

            try {
                const operators = await getOperatorsByDelegation({
                    first: pageSize,
                    skip,
                    address,
                })

                preparsedCount = operators.length

                for (let i = 0; i < operators.length; i++) {
                    try {
                        const operator = OperatorParser.parse(operators[i])

                        delegations.push({
                            ...operator,
                            apy: getSpotApy(operator.poolValue, operator.stakes),
                            myShare: getDelegationAmountForAddress2(
                                address,
                                operator.delegators,
                            ),
                        })
                    } catch (e) {
                        console.warn('Failed to parse an operator', e)
                    }
                }
            } catch (e) {
                console.warn('Could not fetch operators', e)

                errorToast({ title: 'Could not fetch operators' })
            }

            if (preparsedCount !== delegations.length) {
                errorToast({
                    title: 'Failed to parse',
                    desc: `${
                        preparsedCount - delegations.length
                    } out of ${preparsedCount} operators could not be parsed.`,
                })
            }

            return {
                skip,
                delegations,
            }
        },
        getNextPageParam: ({ skip, delegations }) => {
            return delegations.length === pageSize ? skip + pageSize : undefined
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}
