import moment from 'moment'
import { useInfiniteQuery } from '@tanstack/react-query'
import { UseInfiniteQueryResult } from '@tanstack/react-query/src/types'
import { SponsorshipElement } from '~/types/sponsorship'
import { useWalletAccount } from '~/shared/stores/wallet'
import { Sponsorship } from '~/generated/gql/network'
import { toBN } from '~/utils/bn'
import { getAllSponsorships, getSponsorshipsByCreator } from '~/getters'
import { errorToast } from '~/utils/toast'
import { getConfigFromChain } from '~/getters/getConfigFromChain'
import getSponsorshipTokenInfo from '../getters/getSponsorshipTokenInfo'

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
                const tokenInfo = await getSponsorshipTokenInfo()
                const configFromChain = await getConfigFromChain()
                const sponsorships = (await getAllSponsorships({
                    first: pageSize,
                    streamId: searchQuery?.toLowerCase(),
                    skip: ctx.pageParam,
                })) as Sponsorship[]

                return {
                    skippedElements: ctx.pageParam || 0,
                    elements: sponsorships.map((sponsorship) =>
                        mapSponsorshipToElement(
                            sponsorship,
                            Number(tokenInfo.decimals.toString()),
                            toBN(configFromChain.minimumStakeWei)
                                .dividedBy(
                                    Math.pow(10, Number(tokenInfo.decimals.toString())),
                                )
                                .toString(),
                        ),
                    ),
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
                const tokenInfo = await getSponsorshipTokenInfo()
                const configFromChain = await getConfigFromChain()
                const sponsorships = (await getSponsorshipsByCreator(account, {
                    first: pageSize,
                    streamId: searchQuery?.toLowerCase(),
                })) as Sponsorship[]

                return {
                    skippedElements: ctx.pageParam || 0,
                    elements: sponsorships.map((sponsorship) =>
                        mapSponsorshipToElement(
                            sponsorship,
                            Number(tokenInfo.decimals.toString()),
                            toBN(configFromChain.minimumStakeWei)
                                .dividedBy(
                                    Math.pow(10, Number(tokenInfo.decimals.toString())),
                                )
                                .toString(),
                        ),
                    ),
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

export const mapSponsorshipToElement = (
    sponsorship: Sponsorship,
    decimals: number,
    minimumStake: string,
): SponsorshipElement => {
    return {
        id: sponsorship.id,
        streamId: sponsorship.stream?.id as string,
        fundedUntil: moment(Number(sponsorship.projectedInsolvency) * 1000).format(
            'D MMM YYYY',
        ),
        apy: sponsorship.spotAPY,
        payoutPerDay: Number(
            toBN(sponsorship.totalPayoutWeiPerSec)
                .dividedBy(Math.pow(10, decimals))
                .multipliedBy(86400),
        ).toString(),
        operators: Number(sponsorship.operatorCount),
        totalStake: toBN(sponsorship.totalStakedWei)
            .dividedBy(Math.pow(10, decimals))
            .toString(),
        active: sponsorship.isRunning,
        stakes: sponsorship.stakes.map((stake) => {
            return {
                operatorId: stake.operator.id,
                amount: toBN(stake.amount).dividedBy(Math.pow(10, decimals)).toString(),
                joinDate: toBN(stake.joinDate).multipliedBy(1000).toString(),
            }
        }),
        cumulativeSponsoring: toBN(sponsorship.cumulativeSponsoring)
            .dividedBy(Math.pow(10, decimals))
            .toString(),
        minimumStake,
        minimumStakingPeriodSeconds: sponsorship.minimumStakingPeriodSeconds,
    }
}
