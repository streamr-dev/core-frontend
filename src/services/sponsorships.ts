import { ERC677ABI, ERC677, Operator, operatorABI } from '@streamr/network-contracts'
import { BigNumber, Contract, Event } from 'ethers'
import { defaultAbiCoder } from 'ethers/lib/utils'
import { getConfigForChain } from '~/shared/web3/config'
import networkPreflight from '~/utils/networkPreflight'
import { getPublicWeb3Provider, getSigner } from '~/shared/stores/wallet'
import { BN, BNish, toBN } from '~/utils/bn'
import getCoreConfig from '~/getters/getCoreConfig'
import { toastedOperation } from '~/utils/toastedOperation'
import { CreateSponsorshipForm } from '~/forms/createSponsorshipForm'
import { defaultChainConfig } from '~/getters/getChainConfig'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'

const getSponsorshipChainId = () => {
    return defaultChainConfig.id
}

export async function createSponsorship(
    formData: CreateSponsorshipForm,
    options: { onBlockNumber?: (blockNumber: number) => void | Promise<void> } = {},
): Promise<string> {
    const { decimals } = await getSponsorshipTokenInfo()

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

    const chainId = getSponsorshipChainId()

    const chainConfig = getConfigForChain(chainId)

    const paymentTokenSymbolFromConfig = getCoreConfig().sponsorshipPaymentToken as string

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
    sponsorshipId: string,
    amount: BNish,
    options: { onBlockNumber?: (blockNumber: number) => void | Promise<void> } = {},
): Promise<void> {
    const chainId = getSponsorshipChainId()

    const chainConfig = getConfigForChain(chainId)

    const paymentTokenSymbolFromConfig = getCoreConfig().sponsorshipPaymentToken

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
    sponsorshipId: string,
    amountWei: string,
    operatorAddress: string,
    options: {
        toastLabel?: string
        onBlockNumber?: (blockNumber: number) => void | Promise<void>
    } = {},
): Promise<void> {
    const chainId = getSponsorshipChainId()

    await networkPreflight(chainId)

    const { toastLabel = 'Stake on sponsorship', onBlockNumber } = options

    await toastedOperation(toastLabel, async () => {
        const signer = await getSigner()

        const contract = new Contract(operatorAddress, operatorABI, signer) as Operator

        const gasLimitEstimate = await contract.estimateGas.stake(
            sponsorshipId,
            amountWei,
        )
        const increasedGasLimit = BigNumber.from(
            toBN(gasLimitEstimate).multipliedBy(1.5).precision(1, BN.ROUND_UP).toString(),
        )

        const tx = await contract.stake(sponsorshipId, amountWei, {
            gasLimit: increasedGasLimit,
        })

        const { blockNumber } = await tx.wait()

        await onBlockNumber?.(blockNumber)
    })
}

export async function reduceStakeOnSponsorship(
    sponsorshipId: string,
    targetAmountWei: string,
    operatorAddress: string,
    options: {
        toastLabel?: string
        onBlockNumber?: (blockNumber: number) => void | Promise<void>
    } = {},
): Promise<void> {
    const { toastLabel = 'Reduce stake on sponsorship', onBlockNumber } = options

    const chainId = getSponsorshipChainId()

    await networkPreflight(chainId)

    await toastedOperation(toastLabel, async () => {
        const signer = await getSigner()

        const contract = new Contract(operatorAddress, operatorABI, signer) as Operator

        const tx = await contract.reduceStakeTo(sponsorshipId, targetAmountWei)

        const { blockNumber } = await tx.wait()

        await onBlockNumber?.(blockNumber)
    })
}

export async function forceUnstakeFromSponsorship(
    sponsorshipId: string,
    operatorAddress: string,
    options: { onBlockNumber?: (blockNumber: number) => void | Promise<void> } = {},
): Promise<void> {
    const chainId = getSponsorshipChainId()

    await networkPreflight(chainId)

    await toastedOperation('Force unstake from sponsorship', async () => {
        const signer = await getSigner()

        const contract = new Contract(operatorAddress, operatorABI, signer) as Operator

        /**
         * @jtakalai asked to put a big value in the second parameter. Value big enough
         * to pay out the whole queue after unstaking.
         */
        const tx = await contract.forceUnstake(sponsorshipId, 1000000)

        const { blockNumber } = await tx.wait()

        await options.onBlockNumber?.(blockNumber)
    })
}

export async function getEarningsForSponsorships(
    operatorAddress: string,
): Promise<Record<string, BN>> {
    const chainId = getSponsorshipChainId()
    const provider = getPublicWeb3Provider(chainId)

    const contract = new Contract(operatorAddress, operatorABI, provider) as Operator
    const { addresses, earnings } = await contract.getSponsorshipsAndEarnings()

    const result: Record<string, BN> = {}

    for (let i = 0; i < addresses.length; i++) {
        result[addresses[i].toLowerCase()] = toBN(earnings[i])
    }

    return result
}

export async function collectEarnings(
    sponsorshipId: string,
    operatorAddress: string,
    options: { onBlockNumber?: (blockNumber: number) => void | Promise<void> } = {},
): Promise<void> {
    const chainId = getSponsorshipChainId()

    await networkPreflight(chainId)

    const signer = await getSigner()

    const contract = new Contract(operatorAddress, operatorABI, signer) as Operator

    await toastedOperation('Collect earnings', async () => {
        const tx = await contract.withdrawEarningsFromSponsorships([sponsorshipId])

        const { blockNumber } = await tx.wait()

        await options.onBlockNumber?.(blockNumber)
    })
}
