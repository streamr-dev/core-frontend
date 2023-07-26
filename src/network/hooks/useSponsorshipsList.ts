import { useEffect } from 'react'
import moment from 'moment'
import { useInfiniteQuery } from '@tanstack/react-query'
import { UseInfiniteQueryResult } from '@tanstack/react-query/src/types'
import { SponsorshipElement } from '~/network/types/sponsorship'
import { useWalletAccount } from '~/shared/stores/wallet'
import { Sponsorship } from '~/generated/gql/network'
import { toBN } from '~/utils/bn'
import { getAllSponsorships, getSponsorshipsByCreator } from '~/getters'

/**
 * TODO - HANDLE PAGINATION
 */
export const useAllSponsorshipsQuery = (
    pageSize = 10,
    searchQuery?: string,
): UseInfiniteQueryResult<SponsorshipElement[]> => {
    const query = useInfiniteQuery({
        queryKey: ['allSponsorships'],
        async queryFn() {
            const sponsorships = (await getAllSponsorships({
                first: pageSize,
                streamId: searchQuery,
            })) as Sponsorship[]

            return sponsorships.map(mapSponsorshipToElement)
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

    const query = useInfiniteQuery({
        queryKey: ['mySponsorships'],
        async queryFn() {
            if (!account) {
                return []
            }

            const sponsorships = (await getSponsorshipsByCreator(account, {
                first: pageSize,
                streamId: searchQuery,
            })) as Sponsorship[]

            return sponsorships.map(mapSponsorshipToElement)
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
        DATAPerDay: toBN(sponsorship.totalPayoutWeiPerSec)
            .dividedBy(1e18)
            .dividedBy(86400)
            .toString(),
        operators: Number(sponsorship.operatorCount),
        totalStake: toBN(sponsorship.totalStakedWei).dividedBy(1e18).toString(),
        active: sponsorship.isRunning,
        stakes: sponsorship.stakes.map((stake) => {
            return {
                operatorId: stake.operator.id,
                amount: toBN(stake.amount).dividedBy(1e18).toString(),
                date: toBN(stake.date).multipliedBy(1000).toString(),
            }
        }),
    }
}
