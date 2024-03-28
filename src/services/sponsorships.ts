import { ERC677ABI, ERC677, Operator, operatorABI } from '@streamr/network-contracts'
import { BigNumber, Contract, Event } from 'ethers'
import { defaultAbiCoder } from 'ethers/lib/utils'
import { getConfigForChain } from '~/shared/web3/config'
import networkPreflight from '~/utils/networkPreflight'
import { getPublicWeb3Provider, getSigner } from '~/shared/stores/wallet'
import { BN, BNish, toBN } from '~/utils/bn'
import { getChainConfigExtension } from '~/getters/getChainConfigExtension'
import { toastedOperation } from '~/utils/toastedOperation'
import { CreateSponsorshipForm } from '~/forms/createSponsorshipForm'
import { getSponsorshipTokenInfo } from '~/getters/getSponsorshipTokenInfo'
import { getParsedSponsorshipById } from '~/getters'
import { toDecimals } from '~/marketplace/utils/math'
import { useUncollectedEarningsStore } from '~/shared/stores/uncollectedEarnings'

export async function createSponsorship(
    chainId: number,
    formData: CreateSponsorshipForm,
    options: { onBlockNumber?: (blockNumber: number) => void | Promise<void> } = {},
): Promise<string> {
    const { decimals } = await getSponsorshipTokenInfo(chainId)

    const minOperatorCount = Number(formData.minNumberOfOperators)
    const maxOperatorCount = formData.maxNumberOfOperators
        ? String(formData.maxNumberOfOperators)
        : undefined
    // seconds
    const minimumStakeTime = toBN(formData.minStakeDuration)
        .multipliedBy(86400)
        .toString()
    // tokens per second
    const payoutRate = toBN(formData.payoutRate)
        .dividedBy(86400)
        .multipliedBy(toBN(10).pow(toBN(decimals)))
        .toString()
    // wei
    const initialFunding = toBN(formData.initialAmount)
        .multipliedBy(toBN(10).pow(toBN(decimals)))
        .toString()
    const streamId = formData.streamId

    const chainConfig = getConfigForChain(chainId)

    const { sponsorshipPaymentToken: paymentTokenSymbolFromConfig } =
        getChainConfigExtension(chainId)

    await networkPreflight(chainId)

    const policies = [
        chainConfig.contracts.SponsorshipStakeWeightedAllocationPolicy,
        chainConfig.contracts.SponsorshipDefaultLeavePolicy,
        chainConfig.contracts.SponsorshipVoteKickPolicy,
    ]

    // No params for SponsorshipVoteKickPolicy, so just pass 0 for that one
    const policyParams = [payoutRate, minimumStakeTime, 0]

    if (maxOperatorCount) {
        policies.push(chainConfig.contracts.SponsorshipMaxOperatorsJoinPolicy)
        policyParams.push(maxOperatorCount)
    }

    return new Promise<string>((resolve, reject) => {
        void (async () => {
            try {
                await toastedOperation('Sponsorship deployment', async () => {
                    const data = defaultAbiCoder.encode(
                        ['uint32', 'string', 'string', 'address[]', 'uint[]'],
                        [
                            minOperatorCount,
                            streamId,
                            JSON.stringify({}), // metadata
                            policies,
                            policyParams,
                        ],
                    )

                    const signer = await getSigner()

                    const token = new Contract(
                        chainConfig.contracts[paymentTokenSymbolFromConfig],
                        ERC677ABI,
                        signer,
                    ) as ERC677

                    const gasLimitEstimate = await token.estimateGas.transferAndCall(
                        chainConfig.contracts['SponsorshipFactory'],
                        initialFunding.toString(),
                        data,
                    )
                    const increasedGasLimit = BigNumber.from(
                        toBN(gasLimitEstimate)
                            .multipliedBy(1.5)
                            .precision(1, BN.ROUND_UP)
                            .toString(),
                    )

                    const sponsorshipDeployTx = await token.transferAndCall(
                        chainConfig.contracts['SponsorshipFactory'],
                        initialFunding.toString(),
                        data,
                        {
                            gasLimit: increasedGasLimit,
                        },
                    )

                    const { events = [], blockNumber } = await sponsorshipDeployTx.wait()

                    /**
                     * 2nd transfer is the transfer from the sponsorship factory to the newly
                     * deployed sponsorship contract.
                     */
                    const [, initialFundingTransfer]: (Event | undefined)[] =
                        events.filter((e) => e.event === 'Transfer') || []

                    const sponsorshipId = initialFundingTransfer.args?.to

                    if (typeof sponsorshipId !== 'string') {
                        throw new Error('Sponsorship deployment failed')
                    }

                    await options.onBlockNumber?.(blockNumber)

                    resolve(sponsorshipId)
                })
            } catch (e) {
                reject(e)
            }
        })()
    })
}

export async function fundSponsorship(
    chainId: number,
    sponsorshipId: string,
    amount: BNish,
    options: { onBlockNumber?: (blockNumber: number) => void | Promise<void> } = {},
): Promise<void> {
    const chainConfig = getConfigForChain(chainId)

    const { sponsorshipPaymentToken: paymentTokenSymbolFromConfig } =
        getChainConfigExtension(chainId)

    await networkPreflight(chainId)

    const signer = await getSigner()

    const contract = new Contract(
        chainConfig.contracts[paymentTokenSymbolFromConfig],
        ERC677ABI,
        signer,
    ) as ERC677

    await toastedOperation('Sponsorship funding', async () => {
        const tx = await contract.transferAndCall(
            sponsorshipId,
            toBN(amount).toString(),
            '0x',
        )

        const { blockNumber } = await tx.wait()

        await options.onBlockNumber?.(blockNumber)
    })
}

export async function stakeOnSponsorship(
    chainId: number,
    sponsorshipId: string,
    amountWei: string,
    operatorAddress: string,
    options: {
        toastLabel?: string
        onBlockNumber?: (blockNumber: number) => void | Promise<void>
        gasLimitMultiplier?: number
    } = {},
): Promise<void> {
    await networkPreflight(chainId)

    const {
        toastLabel = 'Stake on sponsorship',
        onBlockNumber,
        gasLimitMultiplier = 1.5,
    } = options

    await toastedOperation(toastLabel, async () => {
        const signer = await getSigner()

        const contract = new Contract(operatorAddress, operatorABI, signer) as Operator

        const gasLimit = toBN(await contract.estimateGas.stake(sponsorshipId, amountWei))
            .multipliedBy(gasLimitMultiplier)
            .precision(1, BN.ROUND_UP)
            .toString()

        const tx = await contract.stake(sponsorshipId, amountWei, {
            gasLimit,
        })

        const { blockNumber } = await tx.wait()

        await onBlockNumber?.(blockNumber)

        // Update uncollected earnings because the rate of change
        // will change along with stake amount
        const { fetch: updateEarnings } = useUncollectedEarningsStore.getState()
        await updateEarnings(chainId, operatorAddress)
    })
}

export async function reduceStakeOnSponsorship(
    chainId: number,
    sponsorshipId: string,
    targetAmountWei: string,
    operatorAddress: string,
    options: {
        toastLabel?: string
        onBlockNumber?: (blockNumber: number) => void | Promise<void>
        gasLimitMultiplier?: number
    } = {},
): Promise<void> {
    const {
        toastLabel = 'Reduce stake on sponsorship',
        onBlockNumber,
        gasLimitMultiplier = 1.5,
    } = options

    await networkPreflight(chainId)

    await toastedOperation(toastLabel, async () => {
        const signer = await getSigner()

        const contract = new Contract(operatorAddress, operatorABI, signer) as Operator

        const gasLimit = toBN(
            await contract.estimateGas.reduceStakeTo(sponsorshipId, targetAmountWei),
        )
            .multipliedBy(gasLimitMultiplier)
            .precision(1, BN.ROUND_UP)
            .toString()

        const tx = await contract.reduceStakeTo(sponsorshipId, targetAmountWei, {
            gasLimit,
        })

        const { blockNumber } = await tx.wait()

        await onBlockNumber?.(blockNumber)

        // Update uncollected earnings because the rate of change
        // will change along with stake amount
        const { fetch: updateEarnings } = useUncollectedEarningsStore.getState()
        await updateEarnings(chainId, operatorAddress)
    })
}

export async function forceUnstakeFromSponsorship(
    chainId: number,
    sponsorshipId: string,
    operatorAddress: string,
    options: {
        onBlockNumber?: (blockNumber: number) => void | Promise<void>
        gasLimitMultiplier?: number
    } = {},
): Promise<void> {
    const { onBlockNumber, gasLimitMultiplier = 1.5 } = options

    await networkPreflight(chainId)

    await toastedOperation('Force unstake from sponsorship', async () => {
        const signer = await getSigner()

        const contract = new Contract(operatorAddress, operatorABI, signer) as Operator

        const gasLimit = toBN(
            await contract.estimateGas.forceUnstake(sponsorshipId, 1000000),
        )
            .multipliedBy(gasLimitMultiplier)
            .precision(1, BN.ROUND_UP)
            .toString()

        /**
         * @jtakalai asked to put a big value in the second parameter. Value big enough
         * to pay out the whole queue after unstaking.
         */
        const tx = await contract.forceUnstake(sponsorshipId, 1000000, {
            gasLimit,
        })

        const { blockNumber } = await tx.wait()

        await onBlockNumber?.(blockNumber)

        // Update uncollected earnings because the rate of change
        // will change along with stake amount
        const { fetch: updateEarnings } = useUncollectedEarningsStore.getState()
        await updateEarnings(chainId, operatorAddress)
    })
}

export interface SponsorshipEarnings {
    uncollectedEarnings: BN
    rateOfChangePerSec: BN | undefined
}

export async function getEarningsForSponsorships(
    chainId: number,
    operatorAddress: string,
): Promise<Record<string, SponsorshipEarnings>> {
    const provider = getPublicWeb3Provider(chainId)

    const contract = new Contract(operatorAddress, operatorABI, provider) as Operator

    const { addresses, earnings } = await contract.getSponsorshipsAndEarnings()

    const result: Record<string, SponsorshipEarnings> = {}

    for (let i = 0; i < addresses.length; i++) {
        const sponsorshipId = addresses[i].toLowerCase()

        const graphSponsorship = await getParsedSponsorshipById(chainId, sponsorshipId)

        const myStake = graphSponsorship?.stakes.find(
            (s) => s.operatorId.toLowerCase() === operatorAddress.toLowerCase(),
        )?.amount

        const totalStake = graphSponsorship?.totalStake

        let totalPayoutPerSec: BN | undefined = toDecimals(
            graphSponsorship?.payoutPerDay.dividedBy(24 * 60 * 60) ?? BN(0),
            18,
        )

        const isSponsorshipPaying =
            graphSponsorship?.isRunning &&
            graphSponsorship.remainingBalance.isGreaterThan(0)
        if (!isSponsorshipPaying) {
            totalPayoutPerSec = undefined
        }

        const myEarningsChangePerSec =
            totalPayoutPerSec != null &&
            myStake != null &&
            totalStake != null &&
            myStake.isGreaterThan(0) &&
            totalStake.isGreaterThan(0)
                ? myStake.dividedBy(totalStake).multipliedBy(totalPayoutPerSec)
                : undefined

        result[sponsorshipId] = {
            uncollectedEarnings: toBN(earnings[i]),
            rateOfChangePerSec: myEarningsChangePerSec,
        }
    }

    return result
}

export async function collectEarnings(
    chainId: number,
    sponsorshipId: string,
    operatorAddress: string,
    options: { onBlockNumber?: (blockNumber: number) => void | Promise<void> } = {},
): Promise<void> {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const contract = new Contract(operatorAddress, operatorABI, signer) as Operator

    await toastedOperation('Collect earnings', async () => {
        const tx = await contract.withdrawEarningsFromSponsorships([sponsorshipId])

        const { blockNumber } = await tx.wait()

        await options.onBlockNumber?.(blockNumber)

        // Update uncollected earnings because the rate of change
        // will change along with stake amount
        const { fetch: updateEarnings } = useUncollectedEarningsStore.getState()
        await updateEarnings(chainId, operatorAddress)
    })
}
