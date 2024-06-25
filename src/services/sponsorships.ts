import { ERC677ABI, ERC677, Operator, operatorABI } from 'network-contracts-ethers6'
import { AbiCoder, Contract, EventLog, Log } from 'ethers'
import networkPreflight from '~/utils/networkPreflight'
import { getPublicWeb3Provider, getSigner } from '~/shared/stores/wallet'
import { BN, BNish, toBN } from '~/utils/bn'
import { toastedOperation } from '~/utils/toastedOperation'
import { CreateSponsorshipForm } from '~/forms/createSponsorshipForm'
import { getSponsorshipTokenInfo } from '~/getters/getSponsorshipTokenInfo'
import { getParsedSponsorshipById } from '~/getters'
import { toDecimals } from '~/marketplace/utils/math'
import { useUncollectedEarningsStore } from '~/shared/stores/uncollectedEarnings'
import { getChainConfig, getChainConfigExtension } from '~/utils/chains'

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

    const chainConfig = getChainConfig(chainId)

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
                    const data = AbiCoder.defaultAbiCoder().encode(
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
                    ) as unknown as ERC677

                    const sponsorshipFactoryAddress =
                        chainConfig.contracts['SponsorshipFactory']

                    if (!sponsorshipFactoryAddress) {
                        throw new Error('Missing sponsorship factory address')
                    }

                    const gasLimitEstimate = await token.transferAndCall.estimateGas(
                        sponsorshipFactoryAddress,
                        initialFunding.toString(),
                        data,
                    )
                    const increasedGasLimit = toBN(gasLimitEstimate)
                        .multipliedBy(1.5)
                        .precision(1, BN.ROUND_UP)
                        .toString()

                    const sponsorshipDeployTx = await token.transferAndCall(
                        sponsorshipFactoryAddress,
                        initialFunding.toString(),
                        data,
                        {
                            gasLimit: increasedGasLimit,
                        },
                    )

                    const receipt = await sponsorshipDeployTx.wait()

                    /**
                     * 2nd transfer is the transfer from the sponsorship factory to the newly
                     * deployed sponsorship contract.
                     */
                    let initialFundingTransfer: Log | EventLog | undefined = undefined

                    if (receipt?.logs) {
                        const [, transfer]: (Log | EventLog | undefined)[] =
                            receipt.logs.filter((e) => e.topics.includes('Transfer')) ||
                            []
                        initialFundingTransfer = transfer
                    }

                    const sponsorshipId =
                        initialFundingTransfer instanceof EventLog
                            ? initialFundingTransfer.args['to']
                            : null

                    if (typeof sponsorshipId !== 'string') {
                        throw new Error('Sponsorship deployment failed')
                    }

                    if (receipt?.blockNumber) {
                        await options.onBlockNumber?.(receipt.blockNumber)
                    }

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
    const chainConfig = getChainConfig(chainId)

    const { sponsorshipPaymentToken: paymentTokenSymbolFromConfig } =
        getChainConfigExtension(chainId)

    await networkPreflight(chainId)

    const signer = await getSigner()

    const contract = new Contract(
        chainConfig.contracts[paymentTokenSymbolFromConfig],
        ERC677ABI,
        signer,
    ) as unknown as ERC677

    await toastedOperation('Sponsorship funding', async () => {
        const tx = await contract.transferAndCall(
            sponsorshipId,
            toBN(amount).toString(),
            '0x',
        )

        const receipt = await tx.wait()

        if (receipt?.blockNumber) {
            await options.onBlockNumber?.(receipt.blockNumber)
        }
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

        const contract = new Contract(
            operatorAddress,
            operatorABI,
            signer,
        ) as unknown as Operator

        const gasLimit = toBN(await contract.stake.estimateGas(sponsorshipId, amountWei))
            .multipliedBy(gasLimitMultiplier)
            .precision(1, BN.ROUND_UP)
            .toString()

        const tx = await contract.stake(sponsorshipId, amountWei, {
            gasLimit,
        })

        const receipt = await tx.wait()

        if (receipt?.blockNumber) {
            await onBlockNumber?.(receipt.blockNumber)
        }

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

        const contract = new Contract(
            operatorAddress,
            operatorABI,
            signer,
        ) as unknown as Operator

        const gasLimit = toBN(
            await contract.reduceStakeTo.estimateGas(sponsorshipId, targetAmountWei),
        )
            .multipliedBy(gasLimitMultiplier)
            .precision(1, BN.ROUND_UP)
            .toString()

        const tx = await contract.reduceStakeTo(sponsorshipId, targetAmountWei, {
            gasLimit,
        })

        const receipt = await tx.wait()

        if (receipt?.blockNumber) {
            await onBlockNumber?.(receipt.blockNumber)
        }

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

        const contract = new Contract(
            operatorAddress,
            operatorABI,
            signer,
        ) as unknown as Operator

        const gasLimit = toBN(
            await contract.forceUnstake.estimateGas(sponsorshipId, 1000000),
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

        const receipt = await tx.wait()

        if (receipt?.blockNumber) {
            await onBlockNumber?.(receipt.blockNumber)
        }

        // Update uncollected earnings because the rate of change
        // will change along with stake amount
        const { fetch: updateEarnings } = useUncollectedEarningsStore.getState()
        await updateEarnings(chainId, operatorAddress)
    })
}

export interface SponsorshipEarnings {
    uncollectedEarnings: bigint
    rateOfChangePerSec: bigint | undefined
}

export async function getEarningsForSponsorships(
    chainId: number,
    operatorAddress: string,
): Promise<Record<string, SponsorshipEarnings>> {
    const provider = getPublicWeb3Provider(chainId)

    const contract = new Contract(
        operatorAddress,
        operatorABI,
        provider,
    ) as unknown as Operator

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
            uncollectedEarnings: earnings[i],
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

    const contract = new Contract(
        operatorAddress,
        operatorABI,
        signer,
    ) as unknown as Operator

    await toastedOperation('Collect earnings', async () => {
        const tx = await contract.withdrawEarningsFromSponsorships([sponsorshipId])

        const receipt = await tx.wait()

        if (receipt?.blockNumber) {
            await options.onBlockNumber?.(receipt.blockNumber)
        }

        // Update uncollected earnings because the rate of change
        // will change along with stake amount
        const { fetch: updateEarnings } = useUncollectedEarningsStore.getState()
        await updateEarnings(chainId, operatorAddress)
    })
}
