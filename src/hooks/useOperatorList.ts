import moment from 'moment'
import { useInfiniteQuery } from '@tanstack/react-query'
import { UseInfiniteQueryResult } from '@tanstack/react-query/src/types'
import { OperatorElement } from '~/types/operator'
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

const parseMetadata = (operator: Operator): object | undefined => {
    try {
        const obj = JSON.parse(operator.metadataJsonString)
        return obj
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
            allocated: s.allocatedWei,
            amount: s.amount,
            date: s.date,
        })),
        delegatorCount: operator.delegatorCount,
        delegators: operator.delegators.map((d) => ({
            operatorId: d.operator?.id,
            amount: d.poolTokenWei,
        })),
        exchangeRate: operator.exchangeRate,
        freeFundsWei: operator.freeFundsWei,
        metadata: parseMetadata(operator),
        owner: operator.owner,
        poolTokenTotalSupplyWei: operator.poolTokenTotalSupplyWei,
        poolValue: operator.poolValue,
        poolValueBlockNumber: operator.poolValueBlockNumber,
        poolValueTimestamp: operator.poolValueTimestamp,
        totalValueInSponsorshipsWei: operator.totalValueInSponsorshipsWei,
    }
}
