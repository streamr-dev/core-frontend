import moment from 'moment'
import { useInfiniteQuery } from '@tanstack/react-query'
import { UseInfiniteQueryResult } from '@tanstack/react-query/src/types'
import { SponsorshipElement } from '~/network/types/sponsorship'
import { useWalletAccount } from '~/shared/stores/wallet'
import { Sponsorship } from '~/generated/gql/network'
import { toBN } from '~/utils/bn'
import { getAllSponsorships, getSponsorshipsByCreator } from '~/getters'
import { errorToast } from '~/utils/toast'

export const useAllSponsorshipsQuery = (
    pageSize = 10,
    searchQuery?: string,
): UseInfiniteQueryResult<{
    skippedElements: number
    elements: SponsorshipElement[]
}> => {
    return useInfiniteQuery({
        queryKey: ['allSponsorships', searchQuery],
        async queryFn(ctx) {
            try {
                const sponsorships = (await getAllSponsorships({
                    first: pageSize,
                    streamId: searchQuery,
                    skip: ctx.pageParam,
                })) as Sponsorship[]

                return {
                    skippedElements: ctx.pageParam || 0,
                    elements: sponsorships.map(mapSponsorshipToElement),
                }
            } catch (e) {
                errorToast({ title: 'Could not fetch the sponsorships list' })
                return {
                    skippedElements: 0,
                    elements: [],
                }
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

export const useMySponsorshipsQuery = (
    pageSize = 10,
    searchQuery?: string,
): UseInfiniteQueryResult<{
    skippedElements: number
    elements: SponsorshipElement[]
}> => {
    const account = useWalletAccount()

    return useInfiniteQuery({
        queryKey: ['mySponsorships', searchQuery],
        async queryFn(ctx) {
            if (!account) {
                return {
                    skippedElements: 0,
                    elements: [],
                }
            }

            try {
                const sponsorships = (await getSponsorshipsByCreator(account, {
                    first: pageSize,
                    streamId: searchQuery,
                })) as Sponsorship[]

                return {
                    skippedElements: ctx.pageParam || 0,
                    elements: sponsorships.map(mapSponsorshipToElement),
                }
            } catch (e) {
                errorToast({ title: 'Could not fetch the sponsorships list' })
                return {
                    skippedElements: 0,
                    elements: [],
                }
            }
        },
        getNextPageParam: (lastPage) => {
            return lastPage.elements.length === pageSize
                ? lastPage.skippedElements + pageSize
                : undefined
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}

export const mapSponsorshipToElement = (sponsorship: Sponsorship): SponsorshipElement => {
    return {
        id: sponsorship.id,
        streamId: sponsorship.stream?.id as string,
        fundedUntil: moment(Number(sponsorship.projectedInsolvency) * 1000).format(
            'D MMM YYYY',
        ),
        apy: 0, // TODO add mapping when it will get included in the subgraph
        DATAPerDay: Number(
            toBN(sponsorship.totalPayoutWeiPerSec).dividedBy(1e18).multipliedBy(86400),
        ).toString(),
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
