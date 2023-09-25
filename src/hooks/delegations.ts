import { UseInfiniteQueryResult, useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Operator } from '~/generated/gql/network'
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

async function getEnhancedOperatorsForWallet(
    address = '',
    {
        batchSize,
        skip,
        onParseError,
        onBeforeComplete,
    }: {
        batchSize?: number
        skip?: number
        onParseError?: (operator: Operator, error: unknown) => void
        onBeforeComplete?: (total: number, parsed: number) => void
    },
): Promise<EnhancedOperator[]> {
    if (!address) {
        return []
    }

    const operators: EnhancedOperator[] = []

    const rawOperators = await getOperatorsByDelegation({
        first: batchSize,
        skip,
        address,
    })

    const preparsedCount = rawOperators.length

    for (let i = 0; i < preparsedCount; i++) {
        const rawOperator = rawOperators[i]

        try {
            const operator = OperatorParser.parse(rawOperator)

            operators.push({
                ...operator,
                apy: getSpotApy(operator.poolValue, operator.stakes),
                myShare: getDelegationAmountForAddress2(address, operator.delegators),
            })
        } catch (e) {
            onParseError
                ? onParseError(rawOperator as Operator, e)
                : console.warn('Failed to parse an operator', e)
        }
    }

    onBeforeComplete?.(preparsedCount, operators.length)

    return operators
}

interface DelegationsStats {
    value: BN
    minApy: number
    maxApy: number
    numOfOperators: number
}

export function useDelegationStats(address = '') {
    const [stats, setStats] = useState<DelegationsStats | undefined | null>()

    const addr = address.toLowerCase()

    useEffect(() => {
        let mounted = true

        if (!addr) {
            setStats(null)

            return () => {}
        }

        setStats(undefined)

        setTimeout(async () => {
            const operators = await getEnhancedOperatorsForWallet(addr, {
                batchSize: 1000,
                onBeforeComplete(total, parsed) {
                    if (total !== parsed) {
                        errorToast({
                            title: 'Warning',
                            desc: `Delegation stats are calculated using ${parsed} out of ${total} available operators due to parsing issues.`,
                        })
                    }
                },
            })

            if (!mounted) {
                return
            }

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

            const value = operators.reduce(
                (sum, { myShare }) => sum.plus(myShare),
                toBN(0),
            )

            setStats({
                value,
                minApy,
                maxApy,
                numOfOperators: operators.length,
            })
        })

        return () => {
            mounted = false
        }
    }, [addr])

    return stats
}

export function useDelegationsForWalletQuery(
    address = '',
    { pageSize = 10 }: { pageSize?: number } = {},
): UseInfiniteQueryResult<{ skip: number; delegations: EnhancedOperator[] }> {
    return useInfiniteQuery({
        queryKey: ['useDelegationsForWalletQuery', address.toLowerCase(), pageSize],
        async queryFn({ pageParam: skip = 0 }) {
            let delegations: EnhancedOperator[] = []

            try {
                delegations = await getEnhancedOperatorsForWallet(address, {
                    batchSize: pageSize,
                    skip,
                    onBeforeComplete(total, parsed) {
                        if (total !== parsed) {
                            errorToast({
                                title: 'Failed to parse',
                                desc: `${
                                    total - parsed
                                } out of ${total} operators could not be parsed.`,
                            })
                        }
                    },
                })
            } catch (e) {
                console.warn('Could not fetch operators', e)

                errorToast({ title: 'Could not fetch operators' })
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
