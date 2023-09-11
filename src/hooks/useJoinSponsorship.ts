import { useMemo } from 'react'
import { toaster } from 'toasterhea'
import { useWalletAccount } from '~/shared/stores/wallet'
import { useMyOperator } from '~/hooks/useMyOperator'
import JoinSponsorshipModal from '~/modals/JoinSponsorshipModal'
import { Layer } from '~/utils/Layer'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'
import { stakeOnSponsorship } from '~/services/sponsorships'

const joinSponsorshipModal = toaster(JoinSponsorshipModal, Layer.Modal)

export const useJoinSponsorship = (): {
    canJoinSponsorship: boolean
    joinSponsorship: (sponsorshipId: string, sponsorshipStreamId: string) => Promise<void>
} => {
    const wallet = useWalletAccount()
    const myOperatorQuery = useMyOperator(wallet || '')
    const canJoinSponsorship = useMemo(() => !!myOperatorQuery.data, [myOperatorQuery])

    return {
        canJoinSponsorship,
        joinSponsorship: async (sponsorshipId, sponsorshipStreamId) => {
            if (!myOperatorQuery.data) {
                return
            }
            try {
                const tokenInfo = await getSponsorshipTokenInfo()
                await joinSponsorshipModal.pop({
                    streamId: sponsorshipStreamId,
                    operatorId: myOperatorQuery.data?.id,
                    operatorBalance: myOperatorQuery.data?.freeFundsWei.toString(),
                    tokenSymbol: tokenInfo.symbol,
                    decimals: tokenInfo.decimals,
                    onSubmit: async (amount: string) => {
                        stakeOnSponsorship(
                            sponsorshipId,
                            amount,
                            myOperatorQuery.data?.id as string,
                        )
                    },
                })
            } catch (e) {
                // Ignore for now.
            }
        },
    }
}
