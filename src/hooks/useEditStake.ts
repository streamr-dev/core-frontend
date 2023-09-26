import { useCallback, useMemo } from 'react'
import { toaster } from 'toasterhea'
import moment from 'moment'
import { useWalletAccount } from '~/shared/stores/wallet'
import { useMyOperator } from '~/hooks/useMyOperator'
import { Layer } from '~/utils/Layer'
import EditStakeModal from '~/modals/EditStakeModal'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'
import {
    forceUnstakeFromSponsorship,
    reduceStakeOnSponsorship,
    stakeOnSponsorship,
} from '~/services/sponsorships'
import { SponsorshipElement, SponsorshipStake } from '~/types/sponsorship'
import { toBN } from '~/utils/bn'
import { getLeavePenalty } from '~/getters/getLeavePenalty'
import { fromDecimals } from '~/marketplace/utils/math'
import { confirm } from '~/getters/confirm'

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
                    (stake) =>
                        stake.operatorId === myOperatorQuery.data?.id &&
                        toBN(stake.amount).isGreaterThan(0),
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
                const leavePenaltyWei = await getLeavePenalty(
                    myOperatorQuery.data.id,
                    sponsorship.id,
                )
                const leavePenalty = fromDecimals(
                    leavePenaltyWei,
                    tokenInfo.decimals,
                ).toString()
                const joinDate = moment(
                    myOperatorQuery.data.stakes.find(
                        (stake) => stake.operatorId === myOperatorQuery.data?.id,
                    )?.joinDate as string,
                    'X',
                )
                const minLeaveDate = joinDate.add(
                    sponsorship.minimumStakingPeriodSeconds,
                    'seconds',
                )

                await editStakeModal.pop({
                    currentStake: currentStake.amount,
                    operatorId: myOperatorQuery.data.id,
                    operatorBalance: myOperatorQuery.data.dataTokenBalance.toString(),
                    tokenSymbol: tokenInfo.symbol,
                    decimals: tokenInfo.decimals,
                    leavePenalty: leavePenaltyWei.toString(),
                    minLeaveDate: minLeaveDate.format('YYYY-MM-DD HH:mm'),
                    hasUndelegationQueue: myOperatorQuery.data.queueEntries.length > 0,
                    onSubmit: async (
                        amount: string,
                        difference: string,
                        forceUnstake = false,
                    ) => {
                        const differenceBN = toBN(difference)

                        // increase stake
                        if (differenceBN.isGreaterThanOrEqualTo(0)) {
                            await stakeOnSponsorship(
                                sponsorship.id,
                                difference,
                                myOperatorQuery.data?.id as string,
                                'Increase stake on sponsorship',
                            )
                            return
                        }

                        // reduce stake
                        if (!forceUnstake) {
                            await reduceStakeOnSponsorship(
                                sponsorship.id,
                                amount,
                                myOperatorQuery.data?.id as string,
                                amount === '0'
                                    ? 'Unstake from sponsorship'
                                    : 'Reduce stake on sponsorship',
                            )
                            return
                        }

                        // force unstake
                        if (
                            await confirm({
                                title: 'Your stake will be slashed',
                                description: `Your minimum staking period is still ongoing and ends on ${minLeaveDate.format(
                                    'YYYY-MM-DD HH:mm',
                                )}. If you unstake now, you will lose ${leavePenalty} ${
                                    tokenInfo.symbol
                                }`,
                                proceedLabel: 'Proceed anyway',
                                cancelLabel: 'Cancel',
                            })
                        ) {
                            await forceUnstakeFromSponsorship(
                                sponsorship.id,
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
