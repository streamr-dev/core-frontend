import React from 'react'
import { toaster } from 'toasterhea'
import moment from 'moment'
import { Sponsorship, sponsorshipABI } from '@streamr/network-contracts'
import { config } from '@streamr/config'
import { Contract } from 'ethers'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import { Layer } from '~/utils/Layer'
import {
    forceUnstakeFromSponsorship,
    reduceStakeOnSponsorship,
    stakeOnSponsorship,
} from '~/services/sponsorships'
import EditStakeModal from '~/modals/EditStakeModal'
import { toBN } from '~/utils/bn'
import { confirm } from '~/getters/confirm'
import { fromDecimals } from '~/marketplace/utils/math'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'
import getCoreConfig from '~/getters/getCoreConfig'
import { getCustomTokenBalance } from '~/marketplace/utils/web3'
import { defaultChainConfig } from '~/getters/getChainConfig'

/**
 * Scouts for Operator's funding share.
 */
function getSponsorshipStakeForOperator(
    stakes: ParsedSponsorship['stakes'],
    operatorId: string,
) {
    return stakes.find((stake) => stake.operatorId === operatorId)
}

/**
 * Checks if a given Operator funds a given Sponsorship.
 */
export function isSponsorshipFundedByOperator(
    sponsorship: ParsedSponsorship,
    operator: ParsedOperator | null,
): boolean {
    if (operator == null) {
        return false
    }

    const operatorStake = getSponsorshipStakeForOperator(sponsorship.stakes, operator.id)
    return operatorStake != null && operatorStake.amount.isGreaterThan(0)
}

const editStakeModal = toaster(EditStakeModal, Layer.Modal)

/**
 * Takes the user through the process of modifying their Sponsorship
 * funding stake.
 */
export async function editSponsorshipFunding(
    sponsorship: Pick<ParsedSponsorship, 'id' | 'minimumStakingPeriodSeconds' | 'stakes'>,
    operator: Pick<ParsedOperator, 'id' | 'dataTokenBalanceWei' | 'queueEntries'>,
) {
    const stake = getSponsorshipStakeForOperator(sponsorship.stakes, operator.id)

    if (stake == null) {
        throw new Error('Cannot edit: Operator has no stake in sponsorship')
    }

    const { decimals, symbol: tokenSymbol } = await getSponsorshipTokenInfo()

    const leavePenaltyWei = await getSponsorshipLeavePenalty(sponsorship.id, operator.id)

    const joinTimestamp = moment(stake.joinTimestamp, 'X')

    const minLeaveDate = joinTimestamp
        .add(sponsorship.minimumStakingPeriodSeconds, 'seconds')
        .format('YYYY-MM-DD HH:mm')

    await editStakeModal.pop({
        currentStake: stake.amount.toString(),
        operatorBalance: operator.dataTokenBalanceWei.toString(),
        tokenSymbol,
        decimals,
        leavePenalty: leavePenaltyWei.toString(),
        minLeaveDate,
        hasUndelegationQueue: operator.queueEntries.length > 0,
        async onSubmit(amount, difference, forceUnstake = false) {
            const differenceBN = toBN(difference)

            if (differenceBN.isGreaterThanOrEqualTo(0)) {
                return void (await stakeOnSponsorship(
                    sponsorship.id,
                    difference,
                    operator.id,
                    { toastLabel: 'Increase stake on sponsorship' },
                ))
            }

            if (!forceUnstake) {
                return void (await reduceStakeOnSponsorship(
                    sponsorship.id,
                    amount,
                    operator.id,
                    amount === '0'
                        ? 'Unstake from sponsorship'
                        : 'Reduce stake on sponsorship',
                ))
            }

            if (
                await confirm({
                    title: 'Your stake will be slashed',
                    description: (
                        <>
                            Your minimum staking period is still ongoing and ends on{' '}
                            {minLeaveDate}. If you unstake now, you will lose{' '}
                            {fromDecimals(leavePenaltyWei, decimals).toString()}{' '}
                            {tokenSymbol}
                        </>
                    ),
                    proceedLabel: 'Proceed anyway',
                    cancelLabel: 'Cancel',
                })
            ) {
                return void (await forceUnstakeFromSponsorship(
                    sponsorship.id,
                    operator.id,
                ))
            }
        },
    })
}

/**
 * Gets the current Sponsorship leave penalty for a given Operator.
 */
async function getSponsorshipLeavePenalty(sponsorshipId: string, operatorId: string) {
    const { id: chainId } = config[getCoreConfig().defaultChain || 'polygon']

    const contract = new Contract(
        sponsorshipId,
        sponsorshipABI,
        getPublicWeb3Provider(chainId),
    ) as Sponsorship

    return toBN(await contract.getLeavePenalty(operatorId))
}

/**
 * Fetches wallet's balance of the Sponsorship-native token
 * on the default chain.
 */
export async function getBalanceForSponsorship(wallet: string) {
    return getCustomTokenBalance(
        defaultChainConfig.contracts[getCoreConfig().sponsorshipPaymentToken],
        wallet,
        defaultChainConfig.id,
    )
}
