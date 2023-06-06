import { DataUnionClient } from '@dataunions/client'
import { DataUnionClientConfig } from '@dataunions/client/types/src/Config'
import BN from 'bignumber.js'
import EventEmitter from 'events'
import { hexToNumber } from 'web3-utils'
import getClientConfig from '$app/src/getters/getClientConfig'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import { getConfigForChain, getConfigForChainByName } from '$shared/web3/config'
import { SmartContractTransaction, Address } from '$shared/types/web3-types'
import { ProjectId, DataUnionId } from '$mp/types/project-types'
import { ApiResult } from '$shared/types/common-types'
import { checkEthereumNetworkIsCorrect } from '$shared/utils/web3'
import { post } from '$shared/utils/api'
import getWeb3 from '$utils/web3/getWeb3'
import TransactionError from '$shared/errors/TransactionError'
import Transaction from '$shared/utils/Transaction'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import { Secret } from './types'

const createClient = async (chainId: number): Promise<DataUnionClient> => {
    const provider: any = getWeb3().currentProvider
    const config = getConfigForChain(chainId)
    const { dataUnionJoinServerUrl } = getCoreConfig()
    const providerUrl = config.rpcEndpoints.find((rpc) => rpc.url.startsWith('http'))?.url
    const factoryAddress = config.contracts.DataUnionFactory

    if (factoryAddress == null) {
        console.warn(`No contract address for DataUnionFactory found for chain ${chainId}.`)
    }

    const providerChainId = hexToNumber(provider.chainId)
    const isProviderInCorrectChain = providerChainId === chainId

    // Account needs to be unlocked so that DataUnionClient works as expected
    let isLocked = true
    try {
        await getDefaultWeb3Account()
        isLocked = false
    } catch (e) {
        // account was locked
    }
    const isInCorrectChainAndUnlocked = isProviderInCorrectChain && !isLocked

    const clientConfig = getClientConfig({
        auth: {
            // If MetaMask is in right chain, use it to enable signing
            ethereum: isInCorrectChainAndUnlocked ? provider : undefined,
            // Otherwise use a throwaway private key to authenticate and allow read-only mode
            privateKey: !isInCorrectChainAndUnlocked ? '531479d5645596f264e7e3cbe80c4a52a505d60fad45193d1f6b8e4724bf0304' : undefined,
        },
        network: {
            chainId,
            rpcs: [
                {
                    url: providerUrl,
                    timeout: 120 * 1000,
                },
            ],
        },
        dataUnion: {
            factoryAddress,
        },
        ...(dataUnionJoinServerUrl
            ? {
                joinServerUrl: dataUnionJoinServerUrl,
            }
            : {}),
    })
    return new DataUnionClient(clientConfig as DataUnionClientConfig)
}

const getDataunionSubgraphUrlForChain = (chainId: number): string => {
    const { theGraphUrl } = getCoreConfig()
    const map = getCoreConfig().dataunionGraphNames
    const item = map.find((i: any) => i.chainId === chainId)

    if (item == null || item.name == null) {
        throw new Error(`No dataunionGraphNames defined in config for chain ${chainId}!`)
    }

    const url = `${theGraphUrl}/subgraphs/name/${item.name}`
    return url
}

// ----------------------
// smart contract queries
// ----------------------
export const getDataUnionObject = async (address: string, chainId: number) => {
    const client = await createClient(chainId)
    const dataUnion = await client.getDataUnion(address)
    return dataUnion
}

export const getAdminFee = async (address: DataUnionId, chainId: number) => {
    const dataUnion = await getDataUnionObject(address, chainId)
    const adminFee = await dataUnion.getAdminFee()
    return `${adminFee}`
}
export const getDataUnionStats = async (address: DataUnionId, chainId: number): ApiResult<Record<string, any>> => {
    const dataUnion = await getDataUnionObject(address, chainId)
    const { activeMemberCount, inactiveMemberCount, totalEarnings } = await dataUnion.getStats()
    const active = (activeMemberCount && new BN(activeMemberCount.toString()).toNumber()) || 0
    const inactive = (inactiveMemberCount && new BN(inactiveMemberCount.toString()).toNumber()) || 0
    return {
        memberCount: {
            active,
            inactive,
            total: active + inactive,
        },
        totalEarnings: totalEarnings && new BN(totalEarnings.toString()).toNumber(),
    }
}
// ----------------------
// transactions
// ----------------------
type DeployDataUnion = {
    productId: ProjectId
    adminFee: string
    chainId: number
}
export const deployDataUnion = ({ productId, adminFee, chainId }: DeployDataUnion): SmartContractTransaction => {
    const emitter = new EventEmitter()

    const errorHandler = (error: Error) => {
        emitter.emit('error', error)
    }

    const tx = new Transaction(emitter)
    Promise.all([
        getDefaultWeb3Account(),
        checkEthereumNetworkIsCorrect({
            network: chainId,
        }),
        createClient(chainId),
    ])
        .then(([_, __, client]) => {
            return client.deployDataUnion({
                dataUnionName: productId,
                adminFee: +adminFee,
            })
        })
        .then((dataUnion) => {
            if (!dataUnion || !dataUnion.getAddress()) {
                errorHandler(new TransactionError('Transaction failed'))
            } else {
                emitter.emit('transactionHash', dataUnion.getAddress())
                emitter.emit('receipt', {
                    contractAddress: dataUnion.getAddress(),
                })
            }
        }, errorHandler)
        .catch(errorHandler)
    return tx
}
export const getDataUnionChainIds = (): Array<number> => {
    const { dataunionChains } = getCoreConfig()
    return dataunionChains.map((chain: string) => {
        return getConfigForChainByName(chain).id
    })
}

export type TheGraphDataUnion = {
    id: string,
    owner: string,
    memberCount: number,
    revenueWei: string,
    creationDate: string,
    chainId: number,
}

export const getDataUnionsOwnedByInChain = async (user: Address, chainId: number): Promise<Array<TheGraphDataUnion>> => {
    const theGraphUrl = getDataunionSubgraphUrlForChain(chainId)
    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                query {
                    dataUnions(where: { owner: "${user.toLowerCase()}" }) {
                        id,
                        owner,
                        memberCount,
                        revenueWei,
                        creationDate,
                    }
                }
            `,
        }
    })

    if (result.data.dataUnions.length > 0) {
        return result.data.dataUnions.map((du) => ({
            ...du,
            chainId,
        }))
    }

    return []
}

export const getDataUnionChainIdByAddress = async (id: DataUnionId): Promise<number> => {
    for (const chainId of getDataUnionChainIds()) {
        const theGraphUrl = getDataunionSubgraphUrlForChain(chainId)
        const result = await post({
            url: theGraphUrl,
            data: {
                query: `
                    query {
                        dataUnions(where: { id: "${id.toLowerCase()}" }) {
                            id
                        }
                    }
                `,
            }
        })

        if (result.data.dataUnions.length > 0) {
            return chainId
        }
    }

    return -1
}

type GetSecrets = {
    dataUnionId: DataUnionId
    chainId: number
}

export const getSecrets = async ({ dataUnionId, chainId }: GetSecrets): Promise<Array<Secret>> => {
    const client = await createClient(chainId)
    const dataUnion = await client.getDataUnion(dataUnionId)
    const secrets = await dataUnion.listSecrets()
    return secrets
}

type CreateSecret = {
    dataUnionId: DataUnionId
    name: string
    chainId: number
}

export const createSecret = async ({ dataUnionId, name, chainId }: CreateSecret): Promise<Secret> => {
    const client = await createClient(chainId)
    const dataUnion = await client.getDataUnion(dataUnionId)
    const secret = await dataUnion.createSecret(name)
    return secret
}

type EditSecret = {
    dataUnionId: DataUnionId
    id: string
    name: string
    chainId: number
}

export const editSecret = async ({ dataUnionId, id, name, chainId }: EditSecret): Promise<Secret> => {
    const client = await createClient(chainId)
    const dataUnion = await client.getDataUnion(dataUnionId)
    // @ts-expect-error 2339
    const result = await dataUnion.editSecret(id, name)
    return result
}

type DeleteSecrect = {
    dataUnionId: DataUnionId
    id: string
    chainId: number
}

export const deleteSecret = async ({ dataUnionId, id, chainId }: DeleteSecrect): Promise<void> => {
    const client = await createClient(chainId)
    const dataUnion = await client.getDataUnion(dataUnionId)
    await dataUnion.deleteSecret(id)
}
