// @flow

import EventEmitter from 'events'
import { I18n } from 'react-redux-i18n'
import BN from 'bignumber.js'
import StreamrClient from 'streamr-client'
import { getToken } from '$shared/utils/sessionToken'

import { getContract, call, calculateContractAddress } from '$mp/utils/smartContract'
import getConfig from '$shared/web3/config'
import type { SmartContractDeployTransaction, SmartContractTransaction, Address } from '$shared/flowtype/web3-types'
import type { Stream, NewStream } from '$shared/flowtype/stream-types'
import type { ProductId, DataUnionId } from '$mp/flowtype/product-types'
import type { Permission } from '$userpages/flowtype/permission-types'
import type { ApiResult } from '$shared/flowtype/common-types'
import { checkEthereumNetworkIsCorrect } from '$shared/utils/web3'

import { post, del, get, put } from '$shared/utils/api'
import { postStream, getStream } from '$userpages/modules/userPageStreams/services'
import {
    getResourcePermissions,
    addResourcePermission,
    removeResourcePermission,
} from '$userpages/modules/permission/services'
import { getWeb3, getPublicWeb3 } from '$shared/web3/web3Provider'
import DeployTransaction from '$shared/utils/DeployTransaction'
import TransactionError from '$shared/errors/TransactionError'
import Transaction from '$shared/utils/Transaction'
import routes from '$routes'
import type { Secret } from './types'

export const getStreamrEngineAddresses = (): Array<string> => {
    const addressesString = process.env.STREAMR_ENGINE_NODE_ADDRESSES || ''
    const addresses = addressesString.split(',')
    return addresses
}

export const createJoinPartStream = async (account: Address, productId: ProductId): Promise<Stream> => {
    const newStream: NewStream = {
        id: `${account}/dataunions/${productId}/joinPartStream`,
        description: 'Automatically created JoinPart stream for data union',
    }

    let stream
    try {
        try {
            stream = await getStream(newStream.id)
        } finally {
            if (stream == null || stream.id == null) {
                stream = await postStream(newStream)
            }
        }
    } catch (e) {
        console.error('Could not create a new JoinPart stream or get an existing one', e)
        throw e
    }

    // Add public read permission
    try {
        await Promise.all([
            addResourcePermission({
                resourceType: 'STREAM',
                resourceId: stream.id,
                data: {
                    anonymous: true,
                    operation: 'stream_get',
                    user: null,
                },
            }),
            addResourcePermission({
                resourceType: 'STREAM',
                resourceId: stream.id,
                data: {
                    anonymous: true,
                    operation: 'stream_subscribe',
                    user: null,
                },
            }),
        ])
    } catch (e) {
        console.error('Could not add public read permission for JoinPart stream', e)
        throw e
    }

    // Add write permissions for all Streamr Engine nodes
    try {
        const nodeAddresses = getStreamrEngineAddresses()

        // Process node addresses and add share & write permissions for each of them.
        // We need to add permissions in series because adding them in parallel causes
        // a race condition on backend and some of the calls will fail.
        // eslint-disable-next-line no-restricted-syntax
        for (const address of nodeAddresses) {
            // Share permission is not strictly necessary but needed to avoid error when
            // removing user's share permission (must have at least one share permission)
            // eslint-disable-next-line no-await-in-loop
            await Promise.all([
                addResourcePermission({
                    resourceType: 'STREAM',
                    resourceId: stream.id,
                    data: {
                        operation: 'stream_get',
                        user: address,
                    },
                }),
                addResourcePermission({
                    resourceType: 'STREAM',
                    resourceId: stream.id,
                    data: {
                        operation: 'stream_publish',
                        user: address,
                    },
                }),
            ])
        }
    } catch (e) {
        console.error('Could not add write keys to JoinPart stream', e)
        throw e
    }

    // Remove share & edit permission to prevent deleting the stream
    try {
        const myPermissions: Array<Permission> = await getResourcePermissions({
            resourceType: 'STREAM',
            resourceId: stream.id,
        })
        const deletedTypes = new Set(['stream_edit', 'stream_delete'])
        const deletedPermissions = myPermissions.filter((p) => deletedTypes.has(p.operation))

        if (deletedPermissions && deletedPermissions.length > 0) {
            await Promise.all([
                ...deletedPermissions.map(async ({ id }) => removeResourcePermission({
                    resourceType: 'STREAM',
                    resourceId: stream.id,
                    id,
                })),
            ])
        }
    } catch (e) {
        console.error('Could not remove share permission from JoinPart stream', e)
    }

    return stream
}

const getAdminFeeInEther = (adminFee: number) => {
    if (adminFee <= 0 || adminFee > 1) {
        throw new Error(`${adminFee} is not a valid admin fee`)
    }

    const web3 = getWeb3()
    return web3.utils.toWei(`${adminFee}`, 'ether')
}

// eslint-disable-next-line camelcase
const deprecated_deployContract = (productId: ProductId, adminFee: number): SmartContractDeployTransaction => {
    const web3 = getWeb3()
    const emitter = new EventEmitter()
    const errorHandler = (error: Error) => {
        emitter.emit('error', error)
    }
    const tx = new DeployTransaction(emitter)
    const contract = getConfig().communityProduct
    const operatorAddress = process.env.DATA_UNION_OPERATOR_ADDRESS
    const tokenAddress = process.env.DATA_TOKEN_CONTRACT_ADDRESS
    const blockFreezePeriodSeconds = process.env.DATA_UNION_BLOCK_FREEZE_PERIOD_SECONDS || 1

    Promise.all([
        web3.getDefaultAccount(),
        checkEthereumNetworkIsCorrect(web3),
    ])
        .then(([account]) => Promise.all([
            Promise.resolve(account),
            // Calculate future address of the contract so that we don't have to wait
            // for the transaction to be confirmed.
            calculateContractAddress(account),
            // create join part stream
            createJoinPartStream(account, productId),
        ]))
        .then(([account, futureAddress, joinPartStream]) => {
            const args = [
                operatorAddress,
                joinPartStream.id,
                tokenAddress,
                blockFreezePeriodSeconds,
                getAdminFeeInEther(adminFee),
            ]
            const web3Contract = new web3.eth.Contract(contract.abi)
            const deployer = web3Contract.deploy({
                data: contract.bytecode,
                arguments: args,
            })
            deployer
                .send({
                    from: account,
                })
                .on('error', errorHandler)
                .on('transactionHash', (hash) => {
                    emitter.emit('transactionHash', hash, futureAddress)
                })
                .on('receipt', (receipt) => {
                    if (parseInt(receipt.status, 16) === 0) {
                        errorHandler(new TransactionError(I18n.t('error.txFailed'), receipt))
                    } else {
                        emitter.emit('receipt', receipt)
                    }
                })
        }, errorHandler)
        .catch(errorHandler)

    return tx
}

const privateKey = '5e98cce00cff5dea6b454889f359a4ec06b9fa6b88e9d69b86de8e1c81887da0'

export const createClient = (usePublicNode: boolean = false) => new StreamrClient({
    url: process.env.STREAMR_WS_URL,
    restUrl: process.env.STREAMR_API_URL,
    factoryMainnetAddress: process.env.DATA_UNION_FACTORY_MAINNET_ADDRESS,
    autoConnect: false,
    autoDisconnect: false,
    auth: {
        sessionToken: getToken(),
        privateKey,
    },
    sidechain: {
        url: process.env.DATA_UNION_SIDECHAIN_PROVIDER,
    },
    mainnet: {
        url: process.env.WEB3_PUBLIC_HTTP_PROVIDER,
    },
})

export const calculateDataUnionAddress = async (productId: ProductId, owner: Address, usePublicNode: boolean = false) => {
    const client = createClient(usePublicNode)

    return client.calculateDataUnionMainnetAddress(productId, owner)
}

export const deployDataUnion2 = (productId: ProductId, adminFee: number): SmartContractDeployTransaction => {
    const web3 = getWeb3()
    const emitter = new EventEmitter()
    const errorHandler = (error: Error) => {
        emitter.emit('error', error)
    }
    const tx = new DeployTransaction(emitter)

    const client = createClient()

    Promise.all([
        web3.getDefaultAccount(),
        checkEthereumNetworkIsCorrect(web3),
        client.ensureConnected(),
    ])
        .then(([account]) => Promise.all([
            Promise.resolve(account),
            calculateDataUnionAddress(productId, account),
        ]))
        .then(([account, futureAddress]) => {
            debugger
            emitter.emit('transactionHash', '0x0', futureAddress)

            return Promise.all([
                Promise.resolve(account),
                client.deployDataUnion({
                    dataUnionName: productId,
                    adminFee,
                }),
            ])
        })
        .then(([account, dataUnion]) => {
            debugger
            return dataUnion.isReady().then(() => {
                emitter.emit('receipt')
            }, () => {
                errorHandler(new TransactionError(I18n.t('error.txFailed')))
            })
        }, errorHandler)
        .catch(errorHandler)

    return tx
}

type DeployContract = {
    productId: ProductId,
    adminFee: number,
    version?: number,
}

export const deployContract = ({ productId, adminFee, version = 1 }: DeployContract): SmartContractDeployTransaction => {
    if (version !== 2) {
        return deprecated_deployContract(productId, adminFee)
    }

    return deployDataUnion2(productId, adminFee)
}

// eslint-disable-next-line camelcase
const deprecated_getCommunityContract = (address: DataUnionId, usePublicNode: boolean = false) => {
    const { abi } = getConfig().communityProduct

    return getContract({
        abi,
        address,
    }, usePublicNode)
}

const whitelist = [
    '0xCe4302EE40D8BA2EfE3D973bd585D1C0ED90b374',
    '0xaF79F2DE50AC857320098331B09f0b05a5CB5C50',
].map((s) => s.toLowerCase())

export const getDataUnionVersion = async (address: DataUnionId, usePublicNode: boolean = false) => {
    if (whitelist.includes(address.toLowerCase())) {
        return 2
    }

    const client = createClient(usePublicNode)
    const version = await client.getDataUnionVersion(address)

    return version || 0
}

// eslint-disable-next-line camelcase
const deprecated_getDataUnionOwner = async (address: DataUnionId, usePublicNode: boolean = false) => {
    const contract = deprecated_getCommunityContract(address, usePublicNode)
    const owner = await call(contract.methods.owner)

    return owner
}

export const getDataUnionOwner = async (address: DataUnionId, usePublicNode: boolean = false) => {
    const version = await getDataUnionVersion(address, usePublicNode)

    if (version === 2) {
        const client = createClient()
        return client.getAdminAddress({
            dataUnionAddress: address,
        })
    } else if (version === 1) {
        return deprecated_getDataUnionOwner(address, usePublicNode)
    }

    throw new Error('unknow DU version')
}

// eslint-disable-next-line camelcase
const deprecated_getAdminFee = async (address: DataUnionId, usePublicNode: boolean = false) => {
    const web3 = usePublicNode ? getPublicWeb3() : getWeb3()

    const contract = deprecated_getCommunityContract(address, usePublicNode)
    const adminFee = await call(contract.methods.adminFee())

    return web3.utils.fromWei(web3.utils.toBN(adminFee), 'ether')
}

export const getAdminFee = async (address: DataUnionId, usePublicNode: boolean = false) => {
    const version = await getDataUnionVersion(address, usePublicNode)
    const web3 = usePublicNode ? getPublicWeb3() : getWeb3()

    if (version === 2) {
        const client = createClient()
        const dataUnion = await client.getDataUnionContract({
            dataUnionAddress: address,
        })
        const adminFee = await dataUnion.adminFeeFraction()

        return web3.utils.fromWei(adminFee.toString(), 'ether')
    } else if (version === 1) {
        return deprecated_getAdminFee(address, usePublicNode)
    }

    throw new Error('unknow DU version')
}

export const setAdminFee = (address: DataUnionId, adminFee: number): SmartContractTransaction => {
    const web3 = getWeb3()
    const emitter = new EventEmitter()
    const errorHandler = (error: Error) => {
        console.warn(error)
        emitter.emit('error', error)
    }
    const tx = new Transaction(emitter)
    Promise.all([
        web3.getDefaultAccount(),
        getDataUnionVersion(address),
        checkEthereumNetworkIsCorrect(web3),
    ])
        .then(([account, version]) => {
            if (version === 2) {
                const client = createClient()

                emitter.emit('transactionHash')

                client.setAdminFee(getAdminFeeInEther(adminFee), {
                    dataUnionAddress: address,
                })
                    .then((receipt) => {
                        if (parseInt(receipt.status, 16) === 0) {
                            errorHandler(new TransactionError(I18n.t('error.txFailed'), receipt))
                        } else {
                            emitter.emit('receipt', receipt)
                        }
                    }, errorHandler)
            } else if (version === 1) {
                const method = deprecated_getCommunityContract(address).methods.setAdminFee(getAdminFeeInEther(adminFee))
                method.send({
                    from: account,
                })
                    .on('error', (error, receipt) => {
                        if (receipt) {
                            errorHandler(new TransactionError(error.message, receipt))
                        } else {
                            errorHandler(error)
                        }
                    })
                    .on('transactionHash', (hash) => {
                        emitter.emit('transactionHash', hash)
                    })
                    .on('receipt', (receipt) => {
                        if (parseInt(receipt.status, 16) === 0) {
                            errorHandler(new TransactionError(I18n.t('error.txFailed'), receipt))
                        } else {
                            emitter.emit('receipt', receipt)
                        }
                    })
                    .catch(errorHandler)
            } else {
                throw new Error('Unknow DU version')
            }
        }, errorHandler)

    return tx
}

// eslint-disable-next-line camelcase
const deprecated_getDataUnionStats = (id: DataUnionId): ApiResult<Object> => get({
    url: routes.api.dataunions.stats({
        id,
    }),
    useAuthorization: false,
})

export const getDataUnionStats = async (id: DataUnionId): ApiResult<Object> => {
    const version = await getDataUnionVersion(id)

    if (version === 2) {
        const client = createClient()

        const stats = await client.getDataUnionStats({
            dataUnionAddress: id,
        })
        const { memberCount, totalEarnings } = stats

        return {
            memberCount: {
                total: memberCount && BN(memberCount.toString()).toNumber(),
                active: undefined, // todo: missing in contract?
                inactive: undefined, // todo: missing in contract?
            },
            totalEarnings: totalEarnings && BN(totalEarnings.toString()).toNumber(),
        }
    } else if (version === 1) {
        return deprecated_getDataUnionStats(id)
    }

    throw new Error('unknow DU version')
}

// eslint-disable-next-line camelcase
const deprecated_getJoinPartStreamId = (address: DataUnionId, usePublicNode: boolean = false) =>
    call(deprecated_getCommunityContract(address, usePublicNode).methods.joinPartStream())

// eslint-disable-next-line camelcase
const deprecated_getDataUnion = async (id: DataUnionId, usePublicNode: boolean = true): ApiResult<Object> => {
    const adminFee = await deprecated_getAdminFee(id, usePublicNode)
    const joinPartStreamId = await deprecated_getJoinPartStreamId(id, usePublicNode)
    const owner = await deprecated_getDataUnionOwner(id, usePublicNode)

    return {
        id: id.toLowerCase(),
        adminFee,
        joinPartStreamId,
        owner,
    }
}

export const getDataUnion = async (id: DataUnionId, usePublicNode: boolean = true): ApiResult<Object> => {
    const version = await getDataUnionVersion(id, usePublicNode)

    if (version === 2) {
        const adminFee = await getAdminFee(id, usePublicNode)
        const owner = await getDataUnionOwner(id, usePublicNode)

        return {
            id: id.toLowerCase(),
            adminFee,
            owner,
            version,
        }
    } else if (version === 1) {
        const du = await deprecated_getDataUnion(id, usePublicNode)

        return {
            ...du,
            version,
        }
    }

    throw new Error('Unknow DU version')
}

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
