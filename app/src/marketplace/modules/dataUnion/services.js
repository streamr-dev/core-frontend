// @flow

import EventEmitter from 'events'
import StreamrClient from 'streamr-client'
import BN from 'bignumber.js'
import Web3 from 'web3'

import getClientConfig from '$app/src/getters/getClientConfig'
import getConfig from '$shared/web3/config'

import type { SmartContractTransaction, Address } from '$shared/flowtype/web3-types'
import type { ProductId, DataUnionId } from '$mp/flowtype/product-types'
import type { ApiResult } from '$shared/flowtype/common-types'
import { checkEthereumNetworkIsCorrect } from '$shared/utils/web3'
import { getBlockNumberForTimestamp } from '$shared/utils/ethereum'

import getCoreConfig from '$app/src/getters/getCoreConfig'
import { post, del, get, put } from '$shared/utils/api'
import getWeb3 from '$utils/web3/getWeb3'
import TransactionError from '$shared/errors/TransactionError'
import Transaction from '$shared/utils/Transaction'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import routes from '$routes'
import type { Secret } from './types'

type CreateClient = {
    usePublicNode?: boolean,
}

function createClient({ usePublicNode = false }: CreateClient = {}) {
    const web3 = usePublicNode ? undefined : getWeb3()

    return new StreamrClient(getClientConfig({
        auth: {
            ethereum: web3 && web3.metamaskProvider,
        },
    }))
}

// ----------------------
// smart contract queries
// ----------------------

const getDataUnionObject = async (address: string, usePublicNode: boolean = false) => {
    const client = createClient({
        usePublicNode,
    })
    const dataUnion = await client.getDataUnion(address)
    const version = await dataUnion.getVersion()
    if (version !== 2) {
        throw new Error(`Unsupported DU version: ${version}`)
    }
    return dataUnion
}

export const getDataUnionOwner = async (address: DataUnionId, usePublicNode: boolean = false) => {
    const dataUnion = await getDataUnionObject(address, usePublicNode)
    return dataUnion.getAdminAddress()
}

export const getAdminFee = async (address: DataUnionId, usePublicNode: boolean = false) => {
    const dataUnion = await getDataUnionObject(address, usePublicNode)
    const adminFee = await dataUnion.getAdminFee()
    return `${adminFee}`
}

export const getDataUnionStats = async (address: DataUnionId, usePublicNode: boolean = false): ApiResult<Object> => {
    const dataUnion = await getDataUnionObject(address, usePublicNode)
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

export const getDataUnion = async (id: DataUnionId, usePublicNode: boolean = true): ApiResult<Object> => {
    const adminFee = await getAdminFee(id, usePublicNode)
    const owner = await getDataUnionOwner(id, usePublicNode)
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
}

export const deployDataUnion = ({ productId, adminFee }: DeployDataUnion): SmartContractTransaction => {
    const web3 = getWeb3()
    const emitter = new EventEmitter()
    const errorHandler = (error: Error) => {
        emitter.emit('error', error)
    }
    const tx = new Transaction(emitter)

    const client = createClient()

    Promise.all([
        getDefaultWeb3Account(web3),
        checkEthereumNetworkIsCorrect({
            web3,
        }),
    ])
        .then(([account]) => {
            const { mainnetAddress } = client.calculateDataUnionAddresses(productId, account)
            return mainnetAddress
        })
        .then((futureAddress) => {
            // send calculated contract address as the transaction hash,
            // streamr-client doesn't tell us the actual tx hash
            emitter.emit('transactionHash', futureAddress)

            return client.deployDataUnion({
                dataUnionName: productId,
                adminFee: +adminFee,
            })
        })
        .then((dataUnion) => {
            if (!dataUnion || !dataUnion.contractAddress) {
                errorHandler(new TransactionError('Transaction failed'))
            } else {
                emitter.emit('receipt', {
                    contractAddress: dataUnion.getAddress(),
                })
            }
        }, errorHandler)
        .catch(errorHandler)

    return tx
}

export const setAdminFee = (address: DataUnionId, adminFee: string): SmartContractTransaction => {
    const web3 = getWeb3()
    const emitter = new EventEmitter()
    const errorHandler = (error: Error) => {
        console.warn(error)
        emitter.emit('error', error)
    }
    const tx = new Transaction(emitter)
    Promise.all([
        getDataUnionObject(address),
        checkEthereumNetworkIsCorrect({
            web3,
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

export const removeMembers = async (id: DataUnionId, memberAddresses: string[]) => {
    const dataUnion = await getDataUnionObject(id, true)
    const receipt = await dataUnion.removeMembers(memberAddresses)
    return receipt
}

// ----------------------
// getting events (TODO: move to streamr-client)
// ----------------------

const getDataUnionChainWeb3 = () => {
    const { dataUnionChainRPC: { url } } = getClientConfig()
    return new Web3(new Web3.providers.HttpProvider(url))
}

export async function* getSidechainEvents(address: string, eventName: string, fromBlock: number): any {
    const dataUnion = await getDataUnionObject(address, true)
    const sidechainAddress = await dataUnion.getSidechainAddress()

    const web3 = getDataUnionChainWeb3()
    const { dataunionsChain } = getConfig()
    const contract = new web3.eth.Contract(dataunionsChain.dataUnionAbi, sidechainAddress)
    const latestBlock = await web3.eth.getBlock('latest')

    // Get events in batches since xDai RPC seems to timeout if fetching too large sets
    const batchSize = 10000

    for (let blockNumber = fromBlock; blockNumber < latestBlock.number; blockNumber += (batchSize + 1)) {
        let toBlockNumber = blockNumber + batchSize
        if (toBlockNumber > latestBlock.number) {
            toBlockNumber = latestBlock.number
        }

        // eslint-disable-next-line no-await-in-loop
        const events = await contract.getPastEvents(eventName, {
            fromBlock: blockNumber,
            toBlock: toBlockNumber,
        })
        yield events
    }
}

export async function* getJoinsAndParts(id: DataUnionId, fromTimestamp: number): any {
    const web3 = getDataUnionChainWeb3()
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
    for await (const joins of getSidechainEvents(id, 'MemberJoined', fromBlock)) {
        for (const join of joins) {
            const result = await handleEvent(join, 'join')
            yield result
        }
    }

    for await (const parts of getSidechainEvents(id, 'MemberParted', fromBlock)) {
        for (const part of parts) {
            const result = await handleEvent(part, 'part')
            yield result
        }
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
}

export async function* getMemberEventsFromBlock(id: DataUnionId, blockNumber: number): any {
    const client = createClient()
    const web3 = getDataUnionChainWeb3()

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for await (const joins of getSidechainEvents(id, 'MemberJoined', blockNumber)) {
        for (const e of joins) {
            const memberAddress = e.returnValues.member
            const block = await web3.eth.getBlock(e.blockHash)
            if (block) {
                const dataUnion = await client.getDataUnion(id)
                const memberData = await dataUnion.getMemberStats(memberAddress)
                yield {
                    ...memberData,
                    address: memberAddress,
                }
            }
        }
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
}

export async function* getMemberEventsFromTimestamp(id: DataUnionId, timestamp: number = 0): any {
    const web3 = getDataUnionChainWeb3()
    const fromBlock = await getBlockNumberForTimestamp(web3, Math.floor(timestamp / 1000))

    yield* getMemberEventsFromBlock(id, fromBlock)
}

export async function* getAllMemberEvents(id: DataUnionId): any {
    yield* getMemberEventsFromBlock(id, getCoreConfig().dataUnionFactorySidechainCreationBlock)
}

// ----------------------
// calls to core-api
// ----------------------

type GetSecrets = {
    dataUnionId: DataUnionId,
}

export const getSecrets = ({ dataUnionId }: GetSecrets): ApiResult<Array<Secret>> => get({
    url: routes.api.dataunions.secrets.index({
        dataUnionId,
    }),
})

type PostSecrect = {
    dataUnionId: DataUnionId,
    name: string,
}

export const postSecret = ({ dataUnionId, name }: PostSecrect): ApiResult<Secret> => post({
    url: routes.api.dataunions.secrets.index({
        dataUnionId,
    }),
    data: {
        name,
    },
})

type PutSecrect = {
    dataUnionId: DataUnionId,
    id: string,
    name: string,
}

export const putSecret = ({ dataUnionId, id, name }: PutSecrect): ApiResult<Secret> => put({
    url: routes.api.dataunions.secrets.show({
        dataUnionId,
        id,
    }),
    data: {
        name,
    },
})

type DeleteSecrect = {
    dataUnionId: DataUnionId,
    id: string,
}

export const deleteSecret = ({ dataUnionId, id }: DeleteSecrect): ApiResult<void> => del({
    url: routes.api.dataunions.secrets.show({
        dataUnionId,
        id,
    }),
})

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
