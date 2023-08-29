import moment from 'moment'
import { useInfiniteQuery } from '@tanstack/react-query'
import { UseInfiniteQueryResult } from '@tanstack/react-query/src/types'
import { OperatorElement, OperatorMetadata } from '~/types/operator'
import { Operator } from '~/generated/gql/network'
import { toBN } from '~/utils/bn'
import { getAllOperators, getOperatorsByDelegation, searchOperators } from '~/getters'

export const useAllOperatorsQuery = (
    pageSize = 10,
    searchQuery?: string,
): UseInfiniteQueryResult<{
    skippedElements: number
    elements: OperatorElement[]
}> => {
    return useInfiniteQuery({
        queryKey: ['allOperators', searchQuery],
        async queryFn(ctx) {
            let operators: Operator[] = []
            if (searchQuery != null && searchQuery.length > 0) {
                operators = (await searchOperators({
                    first: pageSize,
                    searchQuery: searchQuery,
                    skip: ctx.pageParam,
                })) as Operator[]
            } else {
                operators = (await getAllOperators({
                    first: pageSize,
                    skip: ctx.pageParam,
                })) as Operator[]
            }

            return {
                skippedElements: ctx.pageParam || 0,
                elements: operators.map(mapOperatorToElement),
            }
        },
        getNextPageParam: (lastPage, pages) => {
            return lastPage.elements.length === pageSize
                ? lastPage.skippedElements + pageSize
                : undefined
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}

export const useDelegatedOperatorsQuery = (
    pageSize = 10,
    address?: string,
): UseInfiniteQueryResult<{
    skippedElements: number
    elements: OperatorElement[]
}> => {
    return useInfiniteQuery({
        queryKey: ['delegatedOperators', address],
        async queryFn(ctx) {
            const operators = (await getOperatorsByDelegation({
                first: pageSize,
                skip: ctx.pageParam,
                address: address || '',
            })) as Operator[]

            return {
                skippedElements: ctx.pageParam || 0,
                elements: operators.map(mapOperatorToElement),
            }
        },
        getNextPageParam: (lastPage, pages) => {
            return lastPage.elements.length === pageSize
                ? lastPage.skippedElements + pageSize
                : undefined
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}

const parseMetadata = (operator: Operator): OperatorMetadata | undefined => {
    try {
        return JSON.parse(operator.metadataJsonString)
    } catch (e) {
        console.warn('Could not parse metadata for operator', operator.id)
        return undefined
    }
}

export const mapOperatorToElement = (operator: Operator): OperatorElement => {
    return {
        id: operator.id,
        stakes: operator.stakes.map((s) => ({
            operatorId: s.operator.id,
            allocated: toBN(s.allocatedWei),
            amount: toBN(s.amount),
            date: s.date,
            sponsorship: s.sponsorship,
        })),
        delegatorCount: operator.delegatorCount,
        delegators: operator.delegators.map((d) => ({
            amount: toBN(d.poolTokenWei),
            delegator: d.delegator,
        })),
        slashingEvents: operator.slashingEvents.map((e) => ({
            amount: e.amount,
            date: e.date,
            streamId: e.sponsorship.stream?.id,
        })),
        exchangeRate: toBN(operator.exchangeRate),
        freeFundsWei: toBN(operator.freeFundsWei),
        metadata: parseMetadata(operator),
        owner: operator.owner,
        nodes: operator.nodes,
        poolTokenTotalSupplyWei: toBN(operator.poolTokenTotalSupplyWei),
        poolValue: toBN(operator.poolValue),
        poolValueBlockNumber: operator.poolValueBlockNumber,
        poolValueTimestamp: operator.poolValueTimestamp,
        totalValueInSponsorshipsWei: toBN(operator.totalValueInSponsorshipsWei),
        cumulativeProfitsWei: toBN(operator.cumulativeProfitsWei),
        cumulativeOperatorsShareWei: toBN(operator.cumulativeOperatorsShareWei),
        operatorsShareFraction: toBN(operator.operatorsShareFraction),
    }
}
