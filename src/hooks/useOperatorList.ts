import { useInfiniteQuery } from '@tanstack/react-query'
import { UseInfiniteQueryResult } from '@tanstack/react-query/src/types'
import { OperatorElement, OperatorMetadata } from '~/types/operator'
import { Operator } from '~/generated/gql/network'
import { toBN } from '~/utils/bn'
import {
    getAllOperators,
    getOperatorsByDelegation,
    getOperatorsByDelegationAndId,
    getOperatorsByDelegationAndMetadata,
    searchOperatorsById,
    searchOperatorsByMetadata,
} from '~/getters'
import getCoreConfig from '~/getters/getCoreConfig'
import { fromAtto } from '~/marketplace/utils/math'
import { isEthereumAddress } from '~/marketplace/utils/validate'

const {
    ipfs: { ipfsGatewayUrl },
} = getCoreConfig()

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

            // no search query - get all
            if (searchQuery == null || searchQuery.length === 0) {
                operators = (await getAllOperators({
                    first: pageSize,
                    skip: ctx.pageParam,
                })) as Operator[]
                return {
                    skippedElements: ctx.pageParam || 0,
                    elements: operators.map(mapOperatorToElement),
                }
            }

            if (isEthereumAddress(searchQuery.toLowerCase())) {
                // search query is an ethereum address - search by id
                operators = (await searchOperatorsById({
                    first: pageSize,
                    operatorId: searchQuery.toLowerCase(),
                    skip: ctx.pageParam,
                })) as Operator[]
            } else {
                // search by metadata
                operators = (await searchOperatorsByMetadata({
                    first: pageSize,
                    searchQuery,
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
    searchQuery?: string,
): UseInfiniteQueryResult<{
    skippedElements: number
    elements: OperatorElement[]
}> => {
    return useInfiniteQuery({
        queryKey: ['delegatedOperators', address, searchQuery],
        async queryFn(ctx) {
            let operators: Operator[] = []

            // no search query - get all
            if (searchQuery == null || searchQuery.length === 0) {
                operators = (await getOperatorsByDelegation({
                    first: pageSize,
                    skip: ctx.pageParam,
                    address: address || '',
                })) as Operator[]
                return {
                    skippedElements: ctx.pageParam || 0,
                    elements: operators.map(mapOperatorToElement),
                }
            }

            if (isEthereumAddress(searchQuery.toLowerCase())) {
                operators = (await getOperatorsByDelegationAndId({
                    first: pageSize,
                    skip: ctx.pageParam,
                    address: address || '',
                    id: searchQuery.toLowerCase(),
                })) as Operator[]
            } else {
                operators = (await getOperatorsByDelegationAndMetadata({
                    first: pageSize,
                    skip: ctx.pageParam,
                    address: address || '',
                    searchQuery: searchQuery.toLowerCase(),
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

const parseMetadata = (operator: Operator): OperatorMetadata | undefined => {
    try {
        const metadataObject = JSON.parse(operator.metadataJsonString)
        return {
            name: metadataObject.name,
            description: metadataObject.description,
            imageUrl: metadataObject.imageIpfsCid
                ? `${ipfsGatewayUrl}${metadataObject.imageIpfsCid}`
                : undefined,
            imageIpfsCid: metadataObject.imageIpfsCid,
            redundancyFactor: metadataObject.redundancyFactor
                ? Number(metadataObject.redundancyFactor)
                : undefined,
        }
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
            joinDate: s.joinDate,
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
        totalStakeInSponsorshipsWei: toBN(operator.totalStakeInSponsorshipsWei),
        cumulativeProfitsWei: toBN(operator.cumulativeProfitsWei),
        cumulativeOperatorsCutWei: toBN(operator.cumulativeOperatorsCutWei),
        operatorsCutFraction: fromAtto(
            toBN(operator.operatorsCutFraction).multipliedBy(100),
        ),
        queueEntries: operator.queueEntries.map((entry) => ({
            id: entry.id,
            amount: toBN(entry.amount),
            date: entry.date,
            delegator: entry.delegator,
        })),
    }
}
