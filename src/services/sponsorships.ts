import {
    SponsorshipFactory,
    TestToken,
    sponsorshipFactoryABI,
    tokenABI,
} from '@streamr/network-contracts'
import { Contract } from 'ethers'
import { getConfigForChainByName, getConfigForChain } from '~/shared/web3/config'
import networkPreflight from '~/utils/networkPreflight'
import { getSigner } from '~/shared/stores/wallet'
import { Address } from '~/shared/types/web3-types'
import { BNish, toBN } from '~/utils/bn'

const getSponsorshipChainId = () => {
    // TODO: add to .toml
    const sponsorshipChainName = 'dev1'
    const chainConfig = getConfigForChainByName(sponsorshipChainName)
    return chainConfig.id
}

export type SponsorshipParams = {
    initialMinimumStakeWei: number
    initialMinHorizonSeconds: number
    initialMinOperatorCount: number
    streamId: string
    metadata: object
    policies: Address[]
    initParams: number[]
}

export async function createSponsorship({
    initialMinimumStakeWei,
    initialMinHorizonSeconds,
    initialMinOperatorCount,
    streamId,
    metadata,
    policies,
    initParams,
}: SponsorshipParams) {
    const chainId = getSponsorshipChainId()

    const chainConfig = getConfigForChain(chainId)

    await networkPreflight(chainId)

    const signer = await getSigner()

    const factory = new Contract(
        chainConfig.contracts['SponsorshipFactory'],
        sponsorshipFactoryABI,
        signer,
    ) as SponsorshipFactory

    const tx = await factory.deploySponsorship(
        initialMinimumStakeWei,
        initialMinHorizonSeconds,
        initialMinOperatorCount,
        streamId,
        JSON.stringify(metadata),
        policies,
        initParams,
    )

    await tx.wait()
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
