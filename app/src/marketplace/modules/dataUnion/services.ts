import EventEmitter from 'events'
import DataUnionClient, { ContractReceipt } from '@dataunions/client'
import BN from 'bignumber.js'
import {DataUnionClientConfig} from "@dataunions/client/types/src/Config"
import { hexToNumber } from 'web3-utils'
import getClientConfig from '$app/src/getters/getClientConfig'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import { getConfigForChain, getConfigForChainByName } from '$shared/web3/config'
import { SmartContractTransaction, Address } from '$shared/types/web3-types'
import { ProjectId, DataUnionId } from '$mp/types/project-types'
import { ApiResult } from '$shared/types/common-types'
import { checkEthereumNetworkIsCorrect } from '$shared/utils/web3'
import { post, del, get, put } from '$shared/utils/api'
import getWeb3 from '$utils/web3/getWeb3'
import TransactionError from '$shared/errors/TransactionError'
import Transaction from '$shared/utils/Transaction'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import routes from '$routes'
import { Secret } from './types'

const createClient = (chainId: number) => {
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
    const clientConfig = getClientConfig({
        auth: {
            // If MetaMask is in right chain, use it to enable signing
            ethereum: isProviderInCorrectChain ? provider : undefined,
            // Otherwise use a throwaway private key to authenticate and allow read-only mode
            privateKey: !isProviderInCorrectChain ? '531479d5645596f264e7e3cbe80c4a52a505d60fad45193d1f6b8e4724bf0304' : undefined,
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
    const client = createClient(chainId)
    const dataUnion = await client.getDataUnion(address)
    return dataUnion
}

export const getDataUnionOwner = async (address: DataUnionId, chainId: number) => {
    const dataUnion = await getDataUnionObject(address, chainId)
    return dataUnion.getAdminAddress()
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
export const getDataUnion = async (id: DataUnionId, chainId: number): ApiResult<Record<string, any>> => {
    const adminFee = await getAdminFee(id, chainId)
    const owner = await getDataUnionOwner(id, chainId)
    return {
        id: id.toLowerCase(),
        adminFee,
        owner,
        version: 2,
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
    ])
        .then(() => {
            const client = createClient(chainId)
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
export const setAdminFee = (address: DataUnionId, chainId: number, adminFee: string): SmartContractTransaction => {
    const emitter = new EventEmitter()

    const errorHandler = (error: Error) => {
        console.warn(error)
        emitter.emit('error', error)
    }

    const tx = new Transaction(emitter)
    Promise.all([
        getDataUnionObject(address, chainId),
        checkEthereumNetworkIsCorrect({
            network: chainId,
        }),
    ]).then(([dataUnion]) => {
        emitter.emit('transactionHash')
        dataUnion.setAdminFee(+adminFee).then((receipt) => {
            if (receipt.status === 0) {
                errorHandler(new TransactionError('Transaction failed', receipt as any))
            } else {
                emitter.emit('receipt', receipt)
            }
        }, errorHandler)
    }, errorHandler)
    return tx
}

export const addMembers = async (id: DataUnionId, chainId: number, memberAddresses: string[]): Promise<ContractReceipt> => {
    const dataUnion = await getDataUnionObject(id, chainId)
    const receipt = await dataUnion.addMembers(memberAddresses)
    return receipt
}

export const removeMembers = async (id: DataUnionId, chainId: number, memberAddresses: string[]): Promise<ContractReceipt> => {
    const dataUnion = await getDataUnionObject(id, chainId)
    const receipt = await dataUnion.removeMembers(memberAddresses)
    return receipt
}

export const getDataUnionStatistics = async (id: DataUnionId, chainId: number, fromTimestamp: number, toTimestamp?: number): Promise<Array<any>> => {
    const theGraphUrl = getDataunionSubgraphUrlForChain(chainId)
    const accuracy = 'HOUR' // HOUR or DAY

    let toTimestampFixed = toTimestamp || Date.now()
    // Make sure we take buckets that extend into the future into account
    // const offset: number = (accuracy === 'DAY') ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000
    const offset: number = 60 * 60 * 1000
    toTimestampFixed = Date.now() + offset
    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                query {
                    dataUnionStatsBuckets(
                        where: {
                            dataUnion: "${id.toLowerCase()}",
                            type: "${accuracy}",
                            startDate_gte: ${Math.floor(fromTimestamp / 1000)},
                            endDate_lte: ${Math.ceil(toTimestampFixed / 1000)}
                        },
                        orderBy: startDate,
                    ) {
                        startDate,
                        endDate,
                        memberCountAtStart,
                        memberCountChange,
                        revenueAtStartWei,
                        revenueChangeWei,
                    }
                }
            `,
        }
    })
    return result.data.dataUnionStatsBuckets
}

export const getDataUnionChainIds = (): Array<number> => {
    const { dataunionChains } = getCoreConfig()
    return dataunionChains.map((chain: string) => {
        return getConfigForChainByName(chain).id
    })
}

export const getDataUnionsOwnedBy = async (user: Address): Promise<Array<TheGraphDataUnion>> => {
    let result: Array<TheGraphDataUnion> = []

    for (const chainId of getDataUnionChainIds()) {
        const ownedDus = await getDataUnionsOwnedByInChain(user, chainId)
        result = result.concat(ownedDus)
    }

    return result
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
export const getDataUnionMembers = async (id: DataUnionId, chainId: number, limit = 100): Promise<Array<string>> => {
    const theGraphUrl = getDataunionSubgraphUrlForChain(chainId)
    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                query {
                    dataUnions(where: { id: "${id.toLowerCase()}" }) {
                        members(first: ${Math.floor(limit)}, orderBy: address, orderDirection: asc) {
                            address
                        }
                    }
                }
            `,
        }
    })

    if (result.data.dataUnions.length > 0) {
        return result.data.dataUnions[0].members.map((m: any) => m.address)
    }

    return []
}
export const searchDataUnionMembers = async (id: DataUnionId, query: string, chainId: number, limit = 100): Promise<Array<string>> => {
    const theGraphUrl = getDataunionSubgraphUrlForChain(chainId)
    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                query {
                    members(where: { address_contains: "${query}"}, first: ${Math.floor(limit)}) {
                        address
                        dataUnion {
                            id
                        }
                    }
                }
            `,
        }
    })

    if (result && result.data && result.data.members) {
        // With limitations in full text search in The Graph,
        // we cannot do filtering on the query itself so we
        // have to manually pick results only for this dataunion.
        const members = result.data.members
            .filter((m) => m.dataUnion.id.toLowerCase() === id.toLowerCase())
            .map((m) => m.address)
        return members
    }

    return []
}
export async function getSelectedMemberStatuses(id: DataUnionId, members: Array<string>, chainId: number): Promise<any> {
    const statuses = []

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for await (const status of getMemberStatusesWithClient(id, members, chainId)) {
        statuses.push(status)
    }

    /* eslint-enable no-restricted-syntax, no-await-in-loop */
    return statuses
}

async function* getMemberStatusesWithClient(id: DataUnionId, members: Array<string>, chainId: number): AsyncGenerator {
    const client = createClient(chainId)

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const memberAddress of members) {
        const dataUnion = await client.getDataUnion(id)
        const memberData = await dataUnion.getMemberStats(memberAddress)
        yield { ...memberData, address: memberAddress }
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
}

export async function* getMemberStatusesFromTheGraph(id: DataUnionId, chainId: number): AsyncGenerator {
    const members = await getDataUnionMembers(id, chainId)
    yield* getMemberStatusesWithClient(id, members, chainId)
}
export async function* getMemberStatuses(id: DataUnionId, chainId: number): AsyncGenerator {
    yield* getMemberStatusesFromTheGraph(id, chainId)
}
// ----------------------
// calls to core-api
// ----------------------
type GetSecrets = {
    dataUnionId: DataUnionId
    chainId: number
}
export const getSecrets = async ({ dataUnionId, chainId }: GetSecrets): Promise<Array<Secret>> => {
    const client = createClient(chainId)
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
    const client = createClient(chainId)
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
    const client = createClient(chainId)
    const dataUnion = await client.getDataUnion(dataUnionId)
    // @ts-ignore
    const result = await dataUnion.editSecret(id, name)
    return result
}
type DeleteSecrect = {
    dataUnionId: DataUnionId
    id: string
    chainId: number
}
export const deleteSecret = async ({ dataUnionId, id, chainId }: DeleteSecrect): Promise<void> => {
    const client = createClient(chainId)
    const dataUnion = await client.getDataUnion(dataUnionId)
    await dataUnion.deleteSecret(id)
}
type GetJoinRequests = {
    dataUnionId: DataUnionId
    params?: any
}
export const getJoinRequests = ({ dataUnionId, params }: GetJoinRequests): ApiResult<any> =>
    get({
        url: routes.api.dataunions.joinRequests.index({
            dataUnionId,
        }),
        options: {
            params,
        },
    })
type PutJoinRequest = {
    dataUnionId: DataUnionId
    joinRequestId: string
    state: 'ACCEPTED' | 'REJECTED' | 'PENDING'
}
export const updateJoinRequest = async ({ dataUnionId, joinRequestId: id, state }: PutJoinRequest): ApiResult<any> =>
    put({
        url: routes.api.dataunions.joinRequests.show({
            dataUnionId,
            id,
        }),
        data: {
            state,
        },
    })
type PostJoinRequest = {
    dataUnionId: DataUnionId
    memberAddress: Address
}
export const addJoinRequest = async ({ dataUnionId, memberAddress }: PostJoinRequest): ApiResult<any> =>
    post({
        url: routes.api.dataunions.joinRequests.index({
            dataUnionId,
        }),
        data: {
            memberAddress,
        },
    })
type DeleteJoinRequest = {
    dataUnionId: DataUnionId
    joinRequestId: string
}
export const removeJoinRequest = async ({ dataUnionId, joinRequestId: id }: DeleteJoinRequest): ApiResult<void> =>
    del({
        url: routes.api.dataunions.joinRequests.show({
            dataUnionId,
            id,
        }),
    })
