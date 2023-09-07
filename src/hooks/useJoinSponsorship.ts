import { useMemo } from 'react'
import { toaster } from 'toasterhea'
import { useWalletAccount } from '~/shared/stores/wallet'
import { useMyOperator } from '~/hooks/useMyOperator'
import JoinSponsorshipModal from '~/modals/JoinSponsorshipModal'
import { Layer } from '~/utils/Layer'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'

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
            try {
                const tokenInfo = await getSponsorshipTokenInfo()
                await joinSponsorshipModal.pop({
                    streamId: sponsorshipStreamId,
                    operatorId: myOperatorQuery.data?.id,
                    operatorBalance: myOperatorQuery.data?.poolValue.toString(),
                    tokenSymbol: tokenInfo.symbol,
                    decimals: tokenInfo.decimals,
                    onSubmit: async (amount: string) => {
                        console.log('submit', amount)
                        await new Promise((resolve) => void setTimeout(resolve, 2000))
                    },
                })
            } catch (e) {
                // Ignore for now.
            }
        },
    }
}
