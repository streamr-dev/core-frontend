import { useInfiniteQuery } from '@tanstack/react-query'
import { getSponsoringEvents } from '~/getters/getSponsoringEvents'
import { errorToast } from '~/utils/toast'

const FUNDING_HISTORY_PAGE_SIZE = 10
export const useSponsorshipFundingHistory = (
    sponsorshipId?: string,
    pageSize = FUNDING_HISTORY_PAGE_SIZE,
) => {
    return useInfiniteQuery({
        queryKey: ['fundingEvents', sponsorshipId],
        queryFn: async (ctx) => {
            try {
                if (!sponsorshipId) {
                    return {
                        skippedElements: 0,
                        events: [],
                    }
                }
                const events = await getSponsoringEvents(
                    sponsorshipId,
                    pageSize,
                    ctx.pageParam || 0,
                    { force: true },
                )
                return {
                    skippedElements: ctx.pageParam || 0,
                    events,
                }
            } catch (e) {
                errorToast({ title: "Could not load the sponsorship's funding history" })
                return {
                    skippedElements: 0,
                    events: [],
                }
            }
        },
        getNextPageParam: (lastPage) => {
            return lastPage.events.length === pageSize
                ? lastPage.skippedElements + pageSize
                : undefined
        },
    })
}
