import { useCallback, useMemo } from 'react'
import { toaster } from 'toasterhea'
import { useWalletAccount } from '~/shared/stores/wallet'
import { useMyOperator } from '~/hooks/useMyOperator'
import { Layer } from '~/utils/Layer'
import EditStakeModal from '~/modals/EditStakeModal'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'
import { reduceStakeOnSponsorship, stakeOnSponsorship } from '~/services/sponsorships'
import { SponsorshipElement, SponsorshipStake } from '~/types/sponsorship'
import { toBN } from '~/utils/bn'
import { getLeavePenalty } from '~/getters/getLeavePenalty'

const editStakeModal = toaster(EditStakeModal, Layer.Modal)
export const useEditStake = (): {
    canEditStake(sponsorship: SponsorshipElement): boolean
    editStake: (sponsorship: SponsorshipElement) => Promise<void>
} => {
    const wallet = useWalletAccount()
    const myOperatorQuery = useMyOperator(wallet || '')
    const canJoinSponsorship = useMemo<boolean>(
        () => !!myOperatorQuery.data,
        [myOperatorQuery],
    )

    const getCurrentStake = useCallback(
        (sponsorship: SponsorshipElement): SponsorshipStake | undefined | false => {
            return (
                !!myOperatorQuery.data &&
                sponsorship.stakes.find(
                    (stake) => stake.operatorId === myOperatorQuery.data?.id,
                )
            )
        },
        [myOperatorQuery.data],
    )
    return {
        canEditStake: (sponsorship: SponsorshipElement): boolean => {
            return canJoinSponsorship && !!getCurrentStake(sponsorship)
        },
        editStake: async (sponsorship: SponsorshipElement) => {
            const currentStake = getCurrentStake(sponsorship)
            if (!myOperatorQuery.data || !sponsorship || !currentStake) {
                return
            }
            try {
                const tokenInfo = await getSponsorshipTokenInfo()
                const leavePenalty = await getLeavePenalty(
                    myOperatorQuery.data.id,
                    sponsorship.id,
                )
                await editStakeModal.pop({
                    currentStake: currentStake.amount,
                    operatorId: myOperatorQuery.data.id,
                    operatorBalance: myOperatorQuery.data.freeFundsWei.toString(),
                    tokenSymbol: tokenInfo.symbol,
                    decimals: tokenInfo.decimals,
                    leavePenalty: leavePenalty.toString(),
                    onSubmit: async (amount: string, difference: string) => {
                        const differenceBN = toBN(difference)
                        if (differenceBN.isGreaterThanOrEqualTo(0)) {
                            await stakeOnSponsorship(
                                sponsorship.id,
                                difference,
                                myOperatorQuery.data?.id as string,
                            )
                        } else {
                            await reduceStakeOnSponsorship(
                                sponsorship.id,
                                amount,
                                myOperatorQuery.data?.id as string,
                            )
                        }
                    },
                })
            } catch (e) {
                // do nothing for now
            }
        },
    }
}
