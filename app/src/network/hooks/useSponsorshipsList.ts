import { useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { UseInfiniteQueryResult } from '@tanstack/react-query/src/types'
import { SponsorshipElement } from '$app/src/network/types/sponsorship'
import { useWalletAccount } from '$shared/stores/wallet'
import {
    GetAllSponsorshipsQueryResult,
    GetSponsorshipsByCreatorQueryResult,
    Sponsorship,
    useGetAllSponsorshipsLazyQuery,
    useGetSponsorshipsByCreatorLazyQuery,
} from '~/gql'

export const useAllSponsorshipsQuery = (
    pageSize = 10,
    searchQuery?: string,
): UseInfiniteQueryResult<SponsorshipElement[]> => {
    const [loadAllSponsorships] = useGetAllSponsorshipsLazyQuery()
    const query = useInfiniteQuery({
        queryKey: ['allSponsorships'],
        queryFn: async (ctx) => {
            const queryResult: GetAllSponsorshipsQueryResult = await loadAllSponsorships({
                variables: {
                    first: pageSize,
                    streamContains: searchQuery,
                },
            })
            return queryResult?.data?.sponsorships
                ? queryResult?.data?.sponsorships.map((sponsorship) =>
                      mapSponsorshipToElement(sponsorship as Sponsorship),
                  )
                : []
        },
        getNextPageParam: (lastPage) => {
            return 0
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })

    useEffect(() => {
        query.refetch()
    }, [searchQuery])

    return query
}

export const useMySponsorshipsQuery = (
    pageSize = 10,
    searchQuery?: string,
): UseInfiniteQueryResult<SponsorshipElement[]> => {
    const account = useWalletAccount()
    const [loadMySponsorships] = useGetSponsorshipsByCreatorLazyQuery()

    const query = useInfiniteQuery({
        queryKey: ['mySponsorships'],
        queryFn: async (ctx) => {
            console.log('account', account)
            const queryResult: GetSponsorshipsByCreatorQueryResult | undefined = account
                ? await loadMySponsorships({
                      variables: {
                          first: pageSize,
                          creator: account as string,
                          streamContains: searchQuery,
                      },
                  })
                : undefined
            return queryResult?.data?.sponsorships
                ? queryResult?.data?.sponsorships.map((sponsorship) =>
                      mapSponsorshipToElement(sponsorship as Sponsorship),
                  )
                : []
        },
        getNextPageParam: (lastPage) => {
            return 0
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })

    useEffect(() => {
        query.refetch()
    }, [account, searchQuery])

    return query
}

const mapSponsorshipToElement = (sponsorship: Sponsorship): SponsorshipElement => {
    return {
        streamId: sponsorship?.stream?.id as string,
        fundedUntil: sponsorship.projectedInsolvency,
        apy: 0, // TODO add mapping when it will get included in the subgraph
        DATAPerDay: new BigNumber(sponsorship.totalPayoutWeiPerSec)
            .dividedBy(new BigNumber(Math.pow(10, 18)))
            .dividedBy(new BigNumber(86400))
            .toNumber(),
        operators: Number(sponsorship.operatorCount),
        totalStake: new BigNumber(sponsorship.totalStakedWei)
            .dividedBy(new BigNumber(Math.pow(10, 18)))
            .toNumber(),
    }
}
