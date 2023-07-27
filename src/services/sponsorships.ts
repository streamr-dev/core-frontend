import { TestToken, tokenABI, ERC677ABI, ERC677 } from '@streamr/network-contracts'
import { BigNumber, Contract } from 'ethers'
import { defaultAbiCoder, parseEther } from 'ethers/lib/utils'
import { getConfigForChainByName, getConfigForChain } from '~/shared/web3/config'
import networkPreflight from '~/utils/networkPreflight'
import { getSigner } from '~/shared/stores/wallet'
import { BNish, toBN } from '~/utils/bn'
import getCoreConfig from '~/getters/getCoreConfig'

const getSponsorshipChainId = () => {
    // TODO: add to .toml
    const sponsorshipChainName = 'dev1'
    const chainConfig = getConfigForChainByName(sponsorshipChainName)
    return chainConfig.id
}

export type SponsorshipParams = {
    minOperatorCount: number
    maxOperatorCount?: number
    payoutRate: BNish // tokens per second
    minimumStakeTime: BNish // seconds
    initialFunding: BNish // wei
    streamId: string
    metadata?: object
}

export async function createSponsorship({
    minOperatorCount,
    maxOperatorCount,
    payoutRate,
    minimumStakeTime,
    initialFunding,
    streamId,
    metadata = {},
}: SponsorshipParams): Promise<void> {
    const chainId = getSponsorshipChainId()

    const chainConfig = getConfigForChain(chainId)

    const paymentTokenSymbolFromConfig = getCoreConfig().sponsorshipPaymentToken as string

    await networkPreflight(chainId)

    const signer = await getSigner()

    const policies = [
        chainConfig.contracts.SponsorshipStakeWeightedAllocationPolicy,
        chainConfig.contracts.SponsorshipDefaultLeavePolicy,
    ]

    const policyParams = [payoutRate.toString(), minimumStakeTime.toString()]

    if (maxOperatorCount) {
        policies.push(chainConfig.contracts.SponsorshipMaxOperatorsJoinPolicy)
        policyParams.push(maxOperatorCount.toString())
    }

    const data = defaultAbiCoder.encode(
        ['uint', 'uint32', 'uint32', 'string', 'string', 'address[]', 'uint[]'],
        [
            parseEther('60'), // initialMinimumStakeWei - hardcoded for now
            0, // initialMinHorizonSeconds - hardcoded for now
            minOperatorCount,
            streamId,
            JSON.stringify(metadata),
            policies,
            policyParams,
        ],
    )

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

    /* You may wonder why we are accessing the SECOND transfer event, that's because first the funds are being transferred to
     *  the sponsorship factory and then the factory transfers them to the sponsorship contract */
    const newSponsorshipAddress = sponsorshipDeployReceipt.events?.filter(
        (e) => e.event === 'Transfer',
    )[1]?.args?.to

    if (!newSponsorshipAddress) {
        throw new Error('Sponsorship deployment failed')
    }
}

export async function fundSponsorship(sponsorshipId: string, amount: BNish) {
    const chainId = getSponsorshipChainId()

    const chainConfig = getConfigForChain(chainId)

    await networkPreflight(chainId)

    const signer = await getSigner()

    const dataTokenContract = new Contract(
        chainConfig.contracts['DATA'],
        tokenABI,
        signer,
    ) as TestToken

    const tx = await dataTokenContract.transferAndCall(
        sponsorshipId,
        toBN(amount).toString(),
        '0x',
    )

    await tx.wait()
}
