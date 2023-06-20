import BN from 'bignumber.js'
import { AbiItem } from 'web3-utils'
import { gql } from '@graphql-mesh/utils'
import { operatorFactoryABI, tokenABI, operatorABI } from '@streamr/network-contracts'
import { getBuiltGraphSDK } from '$app/../.graphclient'
import { getConfigForChainByName, getConfigForChain } from '$shared/web3/config'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import networkPreflight from '$utils/networkPreflight'
import { getWalletWeb3Provider } from '$shared/stores/wallet'
import { Address } from '$shared/types/web3-types'

const getOperatorChainId = () => {
    // TODO: add to .toml
    const sponsorshipChainName = 'dev1'
    const chainConfig = getConfigForChainByName(sponsorshipChainName)
    return chainConfig.id
}

gql`
    fragment OperatorFields on Operator {
        id
        stakes {
            operator {
                id
            }
            amount
            allocatedWei
            date
            sponsorship {
                id
            }
        }
        delegators {
            operator {
                id
            }
            poolTokenWei
        }
        delegatorCount
        poolValue
        totalValueInSponsorshipsWei
        freeFundsWei
        poolValueTimestamp
        poolValueBlockNumber
        poolTokenTotalSupplyWei
        exchangeRate
        metadataJsonString
        owner
    }

    query getAllOperators($first: Int, $skip: Int) {
        operators(first: $first, skip: $skip) {
            ...OperatorFields
        }
    }
`

export const { getAllOperators } = getBuiltGraphSDK()

export type OperatorParams = {
    stringArgs: [string, string]
    policies: [Address, Address, Address]
    initParams: [number, number, number, number, number, number]
}

export async function createOperator({
    stringArgs,
    policies,
    initParams,
}: OperatorParams) {
    const chainId = getOperatorChainId()
    const chainConfig = getConfigForChain(chainId)
    const from = await getDefaultWeb3Account()
    await networkPreflight(chainId)
    const web3 = await getWalletWeb3Provider()

    const factory = new web3.eth.Contract(
        operatorFactoryABI as AbiItem[],
        chainConfig.contracts['OperatorFactory'],
    )

    return new Promise<void>((resolve, reject) => {
        factory.methods
            .deployOperator(stringArgs, policies, initParams)
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

export async function delegateToOperator(operatorId: string, amount: BN) {
    const chainId = getOperatorChainId()
    const chainConfig = getConfigForChain(chainId)
    const from = await getDefaultWeb3Account()
    await networkPreflight(chainId)
    const web3 = await getWalletWeb3Provider()

    const dataContract = new web3.eth.Contract(
        tokenABI as AbiItem[],
        chainConfig.contracts['DATA'],
    )

    // 1. Approve transfer
    await new Promise<void>((resolve, reject) => {
        dataContract.methods
            .approve(operatorId, amount)
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

    const operatorContract = new web3.eth.Contract(operatorABI as AbiItem[], operatorId)

    // 2. Delegate
    await new Promise<void>((resolve, reject) => {
        operatorContract.methods
            .delegate(amount)
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
