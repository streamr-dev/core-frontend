import { useEffect } from 'react'
import moment from 'moment'
import { useInfiniteQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { UseInfiniteQueryResult } from '@tanstack/react-query/src/types'
import { SponsorshipElement } from '~/network/types/sponsorship'
import { useWalletAccount } from '~/shared/stores/wallet'
import {
    GetAllSponsorshipsQueryResult,
    GetSponsorshipsByCreatorQueryResult,
    Sponsorship,
    useGetAllSponsorshipsLazyQuery,
    useGetSponsorshipsByCreatorLazyQuery,
} from '~/gql'

/**
 * TODO - HANDLE PAGINATION
 */
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
        const effect = async () => {
            try {
                await query.refetch()
            } catch (e) {
                // we don't care about it
            }
        }
        effect()
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
        const effect = async () => {
            try {
                await query.refetch()
            } catch (e) {
                // we don't care about it
            }
        }
        effect()
    }, [account, searchQuery])

    return query
}

export const mapSponsorshipToElement = (sponsorship: Sponsorship): SponsorshipElement => {
    return {
        id: sponsorship.id,
        streamId: sponsorship.stream?.id as string,
        fundedUntil: moment(Number(sponsorship.projectedInsolvency) * 1000).format(
            'D MMM YYYY',
        ),
        apy: 0, // TODO add mapping when it will get included in the subgraph
        DATAPerDay: new BigNumber(sponsorship.totalPayoutWeiPerSec)
            .dividedBy(1e18)
            .dividedBy(86400)
            .toString(),
        operators: Number(sponsorship.operatorCount),
        totalStake: new BigNumber(sponsorship.totalStakedWei).dividedBy(1e18).toString(),
        active: sponsorship.isRunning,
    }
}
