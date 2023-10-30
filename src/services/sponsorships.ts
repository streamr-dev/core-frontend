import { ERC677ABI, ERC677, Operator, operatorABI } from '@streamr/network-contracts'
import { Contract } from 'ethers'
import { defaultAbiCoder } from 'ethers/lib/utils'
import { getConfigForChain } from '~/shared/web3/config'
import networkPreflight from '~/utils/networkPreflight'
import { getPublicWeb3Provider, getSigner } from '~/shared/stores/wallet'
import { BN, BNish, toBN } from '~/utils/bn'
import getCoreConfig from '~/getters/getCoreConfig'
import { toastedOperation } from '~/utils/toastedOperation'
import { CreateSponsorshipForm } from '~/forms/createSponsorshipForm'
import { defaultChainConfig } from '~/getters/getChainConfig'
import { saveLastBlockNumber } from '~/getters/waitForGraphSync'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'

const getSponsorshipChainId = () => {
    return defaultChainConfig.id
}

export async function createSponsorship(formData: CreateSponsorshipForm): Promise<void> {
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

        const sponsorshipDeployTx = await token.transferAndCall(
            chainConfig.contracts['SponsorshipFactory'],
            initialFunding.toString(),
            data,
        )

        const sponsorshipDeployReceipt = await sponsorshipDeployTx.wait()

        /**
         * You may wonder why we are accessing the SECOND transfer event, that's because first
         * the funds are being transferred to the sponsorship factory and then the factory
         * transfers them to the sponsorship contract.
         */
        const newSponsorshipAddress = sponsorshipDeployReceipt.events?.filter(
            (e) => e.event === 'Transfer',
        )[1]?.args?.to

        if (!newSponsorshipAddress) {
            throw new Error('Sponsorship deployment failed')
        }
        saveLastBlockNumber(sponsorshipDeployReceipt.blockNumber)
    })
}

export async function fundSponsorship(
    sponsorshipId: string,
    amount: BNish,
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

        const receipt = await tx.wait()
        saveLastBlockNumber(receipt.blockNumber)
    })
}

export async function stakeOnSponsorship(
    sponsorshipId: string,
    amountWei: string,
    operatorAddress: string,
    toastLabel = 'Stake on sponsorship',
): Promise<void> {
    const chainId = getSponsorshipChainId()
    await networkPreflight(chainId)

    await toastedOperation(toastLabel, async () => {
        const signer = await getSigner()

        const contract = new Contract(operatorAddress, operatorABI, signer) as Operator

        const tx = await contract.stake(sponsorshipId, amountWei)
        const receipt = await tx.wait()
        saveLastBlockNumber(receipt.blockNumber)
    })
}

export async function reduceStakeOnSponsorship(
    sponsorshipId: string,
    targetAmountWei: string,
    operatorAddress: string,
    toastLabel = 'Reduce stake on sponsorship',
): Promise<void> {
    const chainId = getSponsorshipChainId()
    await networkPreflight(chainId)

    await toastedOperation(toastLabel, async () => {
        const signer = await getSigner()

        const contract = new Contract(operatorAddress, operatorABI, signer) as Operator

        const tx = await contract.reduceStakeTo(sponsorshipId, targetAmountWei)
        const receipt = await tx.wait()
        saveLastBlockNumber(receipt.blockNumber)
    })
}

export async function forceUnstakeFromSponsorship(
    sponsorshipId: string,
    operatorAddress: string,
): Promise<void> {
    const chainId = getSponsorshipChainId()
    await networkPreflight(chainId)

    await toastedOperation('Force unstake from sponsorship', async () => {
        const signer = await getSigner()

        const contract = new Contract(operatorAddress, operatorABI, signer) as Operator

        // Juuso asked to put a big value in the second parameter - big enough to pay out the whole queue after unstaking
        const tx = await contract.forceUnstake(sponsorshipId, 1000000)
        const receipt = await tx.wait()
        saveLastBlockNumber(receipt.blockNumber)
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
        const address = addresses[i].toLowerCase()

        const value = toBN(earnings[i])

        if (!value.isFinite()) {
            console.warn(
                `Invalid earnings for ${address} (expecting finite BN)`,
                earnings[i],
            )

            result[address] = toBN(0)

            continue
        }

        result[address] = value
    }
    return result
}

export async function collectEarnings(
    sponsorshipId: string,
    operatorAddress: string,
): Promise<void> {
    const chainId = getSponsorshipChainId()
    await networkPreflight(chainId)

    const signer = await getSigner()

    const contract = new Contract(operatorAddress, operatorABI, signer) as Operator

    await toastedOperation('Collect earnings', async () => {
        const tx = await contract.withdrawEarningsFromSponsorships([sponsorshipId])
        const receipt = await tx.wait()
        saveLastBlockNumber(receipt.blockNumber)
    })
}
