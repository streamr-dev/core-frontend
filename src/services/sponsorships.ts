import BN from 'bignumber.js'
import { AbiItem } from 'web3-utils'
import { gql } from '@apollo/client'
import { sponsorshipFactoryABI, tokenABI } from '@streamr/network-contracts'
import { getConfigForChainByName, getConfigForChain } from '~/shared/web3/config'
import getDefaultWeb3Account from '~/utils/web3/getDefaultWeb3Account'
import networkPreflight from '~/utils/networkPreflight'
import { getWalletWeb3Provider } from '~/shared/stores/wallet'
import { Address } from '~/shared/types/web3-types'

const getSponsorshipChainId = () => {
    // TODO: add to .toml
    const sponsorshipChainName = 'dev1'
    const chainConfig = getConfigForChainByName(sponsorshipChainName)
    return chainConfig.id
}

gql`
    fragment SponsorshipFields on Sponsorship {
        id
        stream {
            id
            metadata
        }
        metadata
        isRunning
        totalPayoutWeiPerSec
        stakes {
            operator {
                id
            }
            amount
            allocatedWei
            date
        }
        operatorCount
        totalStakedWei
        unallocatedWei
        projectedInsolvency
        creator
    }

    query getAllSponsorships($first: Int, $skip: Int, $streamContains: String) {
        sponsorships(
            first: $first
            skip: $skip
            where: { stream_contains: $streamContains }
        ) {
            ...SponsorshipFields
        }
    }

    query getSponsorshipsByCreator(
        $first: Int
        $skip: Int
        $streamContains: String
        $creator: String!
    ) {
        sponsorships(
            first: $first
            skip: $skip
            where: { creator: $creator, stream_contains: $streamContains }
        ) {
            ...SponsorshipFields
        }
    }
`

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
    const from = await getDefaultWeb3Account()
    await networkPreflight(chainId)
    const web3 = await getWalletWeb3Provider()

    const factory = new web3.eth.Contract(
        sponsorshipFactoryABI as AbiItem[],
        chainConfig.contracts['SponsorshipFactory'],
    )

    return new Promise<void>((resolve, reject) => {
        factory.methods
            .deploySponsorship(
                initialMinimumStakeWei,
                initialMinHorizonSeconds,
                initialMinOperatorCount,
                streamId,
                metadata,
                policies,
                initParams,
            )
            .send({
                from,
                maxPriorityFeePerGas: null,
                maxFeePerGas: null,
            })
            .on('error', (error: unknown) => {
                reject(error)
            })
            .once('confirmation', () => {
                resolve()
            })
    })
}

export async function fundSponsorship(sponsorshipId: string, amount: BN) {
    const chainId = getSponsorshipChainId()
    const chainConfig = getConfigForChain(chainId)
    const from = await getDefaultWeb3Account()
    await networkPreflight(chainId)
    const web3 = await getWalletWeb3Provider()

    const dataContract = new web3.eth.Contract(
        tokenABI as AbiItem[],
        chainConfig.contracts['DATA'],
    )

    return new Promise<void>((resolve, reject) => {
        dataContract.methods
            .transferAndCall(sponsorshipId, amount, '0x')
            .send({
                from,
                maxPriorityFeePerGas: null,
                maxFeePerGas: null,
            })
            .on('error', (error: unknown) => {
                reject(error)
            })
            .once('confirmation', () => {
                resolve()
            })
    })
}
