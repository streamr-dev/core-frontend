import { useCallback } from 'react'
import { toaster } from 'toasterhea'
import {
    getTokenAndBalanceForSponsorship,
    TokenAndBalanceForSponsorship,
} from '~/getters/getTokenAndBalanceForSponsorship'
import { useWalletAccount } from '~/shared/stores/wallet'
import FundSponsorshipModal from '~/modals/FundSponsorshipModal'
import { Layer } from '~/utils/Layer'
import { errorToast } from '~/utils/toast'
import { fundSponsorship } from '~/services/sponsorships'

const fundSponsorshipModal = toaster(FundSponsorshipModal, Layer.Modal)
export const useFundSponsorship = (): ((
    sponsorshipId: string,
    payoutPerDay: string,
) => Promise<void>) => {
    const wallet = useWalletAccount()
    return useCallback(
        async (sponsorshipId: string, payoutPerDay: string) => {
            if (!wallet) {
                return
            }
            let tokenAndBalanceInfo: TokenAndBalanceForSponsorship
            try {
                tokenAndBalanceInfo = await getTokenAndBalanceForSponsorship(wallet)
            } catch (e) {
                errorToast({ title: 'Could not fetch the wallet balance' })
                return
            }
            try {
                await fundSponsorshipModal.pop({
                    decimals: tokenAndBalanceInfo.tokenDecimals,
                    tokenSymbol: tokenAndBalanceInfo.tokenSymbol,
                    balance: tokenAndBalanceInfo.balance,
                    payoutPerDay,
                    onSubmit: async (value) => {
                        await fundSponsorship(sponsorshipId, value)
                    },
                })
            } catch (e) {
                // modal closed - ignore
            }
        },
        [wallet],
    )
}
