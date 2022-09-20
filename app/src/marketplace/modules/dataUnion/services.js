// @flow

import EventEmitter from 'events'
import DataUnionClient from '@dataunions/client'
import BN from 'bignumber.js'
import { hexToNumber } from 'web3-utils'

import getClientConfig from '$app/src/getters/getClientConfig'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import getConfig, { getConfigForChain } from '$shared/web3/config'

import type { SmartContractTransaction, Address } from '$shared/flowtype/web3-types'
import type { ProductId, DataUnionId } from '$mp/flowtype/product-types'
import type { ApiResult } from '$shared/flowtype/common-types'
import { checkEthereumNetworkIsCorrect } from '$shared/utils/web3'
import { getBlockNumberForTimestamp } from '$shared/utils/ethereum'

import { post, del, get, put } from '$shared/utils/api'
import { getContractEvents } from '$shared/utils/contractEvents'
import getWeb3 from '$utils/web3/getWeb3'
import getPublicWeb3 from '$utils/web3/getPublicWeb3'
import TransactionError from '$shared/errors/TransactionError'
import Transaction from '$shared/utils/Transaction'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import routes from '$routes'
import type { Secret } from './types'

const createClient = (chainId: number) => {
    const provider = getWeb3().currentProvider
    const config = getConfigForChain(chainId)
    const providerUrl = config.rpcEndpoints.find((rpc) => rpc.url.startsWith('http'))?.url
    const factoryAddress = config.contracts.DataUnionFactory

    if (factoryAddress == null) {
        throw new Error(`No contract address for DataUnionFactory found for chain ${chainId}. Try a different chain.`)
    }

    const providerChainId = hexToNumber(provider.chainId)
    if (providerChainId !== chainId) {
        console.warn(`Current MetaMask provider is connected to ${providerChainId}. DU lives in ${chainId}.`)
    }

    const clientConfig = getClientConfig({
        auth: {
            ethereum: provider,
        },
        network: {
            chainId,
            rpcs: [{
                url: providerUrl,
                timeout: 120 * 1000,
            }],
        },
        dataUnion: {
            factoryAddress,
        },
        joinServerUrl: 'http://localhost:5555',
    })
    return new DataUnionClient(clientConfig)
}

const getDataunionSubgraphUrlForChain = (chainId: number): string => {
    const { theGraphUrl } = getCoreConfig()
    const map = getCoreConfig().dataunionGraphNames
    const item = map.find((i) => i.chainId === chainId)

    if (item == null || item.name == null) {
        throw new Error(`No dataunionGraphNames defined in config for chain ${chainId}!`)
    }

    const url = `${theGraphUrl}/subgraphs/name/${item.name}`
    console.log(url)
    return url
}

// ----------------------
// smart contract queries
// ----------------------

const getDataUnionObject = async (address: string, chainId: number) => {
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

export const getDataUnionStats = async (address: DataUnionId, chainId: number): ApiResult<Object> => {
    const dataUnion = await getDataUnionObject(address, chainId)
    const { activeMemberCount, inactiveMemberCount, totalEarnings } = await dataUnion.getStats()

    const active = (activeMemberCount && BN(activeMemberCount.toString()).toNumber()) || 0
    const inactive = (inactiveMemberCount && BN(inactiveMemberCount.toString()).toNumber()) || 0
    return {
        memberCount: {
            active,
            inactive,
            total: active + inactive,
        },
        totalEarnings: totalEarnings && BN(totalEarnings.toString()).toNumber(),
    }
}

export const getDataUnion = async (id: DataUnionId, chainId: number): ApiResult<Object> => {
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
    productId: ProductId,
    adminFee: string,
    chainId: number,
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
    ])
        .then(([dataUnion]) => {
            emitter.emit('transactionHash')

            dataUnion.setAdminFee(+adminFee)
                .then((receipt) => {
                    if (parseInt(receipt.status, 16) === 0) {
                        errorHandler(new TransactionError('Transaction failed', receipt))
                    } else {
                        emitter.emit('receipt', receipt)
                    }
                }, errorHandler)
        }, errorHandler)
    return tx
}

export const removeMembers = async (id: DataUnionId, chainId: number, memberAddresses: string[]) => {
    const dataUnion = await getDataUnionObject(id, chainId)
    const receipt = await dataUnion.removeMembers(memberAddresses)
    return receipt
}

// ----------------------
// getting events (TODO: move to streamr-client)
// ----------------------

async function* getEvents(address: string, chainId: number, eventName: string, fromBlock: number): any {
    const web3 = getPublicWeb3(chainId)
    const { dataunionsChain } = getConfig()
    yield* getContractEvents(web3, dataunionsChain.dataUnionAbi, address, chainId, eventName, fromBlock)
}

export async function* getJoinsAndParts(id: DataUnionId, chainId: number, fromTimestamp: number): any {
    const web3 = getPublicWeb3(chainId)
    const fromBlock = await getBlockNumberForTimestamp(web3, Math.floor(fromTimestamp / 1000))

    const handleEvent = async (e, type) => {
        // eslint-disable-next-line no-await-in-loop
        const block = await web3.eth.getBlock(e.blockHash)
        if (block && block.timestamp && (block.timestamp * 1000 >= fromTimestamp)) {
            const event = {
                timestamp: block.timestamp * 1000,
                diff: type === 'join' ? 1 : -1,
            }
            return event
        }

        return null
    }

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for await (const joins of getEvents(id, chainId, 'MemberJoined', fromBlock)) {
        for (const join of joins) {
            const result = await handleEvent(join, 'join')
            yield result
        }
    }

    for await (const parts of getEvents(id, chainId, 'MemberParted', fromBlock)) {
        for (const part of parts) {
            const result = await handleEvent(part, 'part')
            yield result
        }
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
}

export const getMemberStatistics = async (id: DataUnionId, chainId: number, fromTimestamp: number, toTimestamp: ?number): Promise<Array<any>> => {
    const theGraphUrl = getDataunionSubgraphUrlForChain(chainId)
    const accuracy = 'HOUR' // HOUR or DAY
    let toTimestampFixed = toTimestamp || Date.now()

    // Make sure we take buckets that extend into the future into account
    const offset = accuracy === 'DAY' ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000
    toTimestampFixed = Date.now() + offset

    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                query {
                    dataUnionStatsBuckets(
                        where: {
                            dataUnionAddress: "${id.toLowerCase()}",
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
                    }
                }
            `,
        },
        useAuthorization: false,
    })
    return result.data.dataUnionStatsBuckets
}

export const getDataUnionMembers = async (id: DataUnionId, chainId: number, limit: number = 100): Promise<Array<string>> => {
    const theGraphUrl = getDataunionSubgraphUrlForChain(chainId)
    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                query {
                    dataUnions(where: { mainchainAddress: "${id.toLowerCase()}" }) {
                        members(first: ${Math.floor(limit)}, orderBy: address, orderDirection: asc) {
                            address
                        }
                    }
                }
            `,
        },
        useAuthorization: false,
    })
    if (result.data.dataUnions.length > 0) {
        return result.data.dataUnions[0].members.map((m) => m.address)
    }
    return []
}

export const searchDataUnionMembers = async (id: DataUnionId, query: string, chainId: number, limit: number = 100): Promise<Array<string>> => {
    const theGraphUrl = getDataunionSubgraphUrlForChain(chainId)
    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                query {
                    members(where: { addressString_contains: "${query}"}, first: ${Math.floor(limit)}) {
                        address
                        dataunion {
                            mainchainAddress
                        }
                    }
                }
            `,
        },
        useAuthorization: false,
    })
    if (result && result.data && result.data.members) {
        // With limitations in full text search in The Graph,
        // we cannot do filtering on the query itself so we
        // have to manually pick results only for this dataunion.
        const members = result.data.members
            .filter((m) => m.dataunion.mainchainAddress === id)
            .map((m) => m.address)
        return members
    }
    return []
}

export async function getSelectedMemberStatuses(id: DataUnionId, members: Array<string>, chainId: number): any {
    const statuses = []

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for await (const status of getMemberStatusesWithClient(id, members, chainId)) {
        statuses.push(status)
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */

    return statuses
}

async function* getMemberStatusesWithClient(id: DataUnionId, members: Array<string>, chainId: number): any {
    const client = createClient(chainId)

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const memberAddress of members) {
        const dataUnion = await client.getDataUnion(id)
        const memberData = await dataUnion.getMemberStats(memberAddress)
        yield {
            ...memberData,
            address: memberAddress,
        }
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
}

export async function* getMemberStatusesFromTheGraph(id: DataUnionId, chainId: number): any {
    const members = await getDataUnionMembers(id, chainId)
    yield* getMemberStatusesWithClient(id, members, chainId)
}

export async function* getMemberStatuses(id: DataUnionId, chainId: number): any {
    yield* getMemberStatusesFromTheGraph(id, chainId)
}

// ----------------------
// calls to core-api
// ----------------------

type GetSecrets = {
    dataUnionId: DataUnionId,
    chainId: number,
}

export const getSecrets = async ({ dataUnionId, chainId }: GetSecrets): Promise<Array<Secret>> => {
    const client = createClient(chainId)
    const dataUnion = await client.getDataUnion(dataUnionId)
    const secrets = await dataUnion.listSecrets()
    return secrets
}

type CreateSecret = {
    dataUnionId: DataUnionId,
    name: string,
    chainId: number,
}

export const createSecret = async ({ dataUnionId, name, chainId }: CreateSecret): Promise<Secret> => {
    const client = createClient(chainId)
    const dataUnion = await client.getDataUnion(dataUnionId)
    const secret = await dataUnion.createSecret(name)
    return secret
}

type EditSecret = {
    dataUnionId: DataUnionId,
    id: string,
    name: string,
    chainId: number,
}

export const editSecret = async ({ dataUnionId, id, name, chainId }: EditSecret): Promise<Secret> => {
    const client = createClient(chainId)
    const dataUnion = await client.getDataUnion(dataUnionId)
    const result = await dataUnion.editSecret(id, name)
    return result
}

type DeleteSecrect = {
    dataUnionId: DataUnionId,
    id: string,
    chainId: number,
}

export const deleteSecret = async ({ dataUnionId, id, chainId }: DeleteSecrect): Promise<void> => {
    const client = createClient(chainId)
    const dataUnion = await client.getDataUnion(dataUnionId)
    await dataUnion.deleteSecret(id)
}

type GetJoinRequests = {
    dataUnionId: DataUnionId,
    params?: any,
}

export const getJoinRequests = ({ dataUnionId, params }: GetJoinRequests): ApiResult<any> => get({
    url: routes.api.dataunions.joinRequests.index({
        dataUnionId,
    }),
    options: {
        params,
    },
})

type PutJoinRequest = {
    dataUnionId: DataUnionId,
    joinRequestId: string,
    state: 'ACCEPTED' | 'REJECTED' | 'PENDING',
}

export const updateJoinRequest = async ({ dataUnionId, joinRequestId: id, state }: PutJoinRequest): ApiResult<any> => put({
    url: routes.api.dataunions.joinRequests.show({
        dataUnionId,
        id,
    }),
    data: {
        state,
    },
})

type PostJoinRequest = {
    dataUnionId: DataUnionId,
    memberAddress: Address,
}

export const addJoinRequest = async ({ dataUnionId, memberAddress }: PostJoinRequest): ApiResult<any> => post({
    url: routes.api.dataunions.joinRequests.index({
        dataUnionId,
    }),
    data: {
        memberAddress,
    },
})

type DeleteJoinRequest = {
    dataUnionId: DataUnionId,
    joinRequestId: string,
}

export const removeJoinRequest = async ({ dataUnionId, joinRequestId: id }: DeleteJoinRequest): ApiResult<void> => del({
    url: routes.api.dataunions.joinRequests.show({
        dataUnionId,
        id,
    }),
})
