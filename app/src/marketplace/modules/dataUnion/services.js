// @flow

import { deploy, getContract, call, send } from '$mp/utils/smartContract'
import getConfig from '$shared/web3/config'

import type { SmartContractDeployTransaction, SmartContractTransaction, Address } from '$shared/flowtype/web3-types'
import type {
    StreamId,
    Stream,
    NewStream,
} from '$shared/flowtype/stream-types'
import type { ProductId, DataUnionId } from '$mp/flowtype/product-types'
import type { Permission } from '$userpages/flowtype/permission-types'
import type { ApiResult } from '$shared/flowtype/common-types'
import { gasLimits } from '$shared/utils/constants'

import { post, del, get, put } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import { postStream, getMyStreamPermissions } from '$userpages/modules/userPageStreams/services'
import { getWeb3, getPublicWeb3 } from '$shared/web3/web3Provider'

import type { Secret } from './types'

export const getStreamrEngineAddresses = (): Array<string> => {
    const addressesString = process.env.STREAMR_ENGINE_NODE_ADDRESSES || ''
    const addresses = addressesString.split(',')
    return addresses
}

export const addPermission = (id: StreamId, permission: Permission): ApiResult<Array<Permission>> => post({
    url: formatApiUrl('streams', id, 'permissions'),
    data: permission,
})

export const deletePermission = (id: StreamId, permissionId: $PropertyType<Permission, 'id'>): ApiResult<Array<Permission>> => del({
    url: formatApiUrl('streams', id, 'permissions', permissionId),
})

export const createJoinPartStream = async (productId: ?ProductId = undefined): Promise<Stream> => {
    const newStream: NewStream = {
        name: productId ? `JoinPart stream for data union ${productId}` : 'JoinPart stream',
        description: 'Automatically created JoinPart stream for data union',
    }

    let stream
    try {
        stream = await postStream(newStream)
    } catch (e) {
        console.error('Could not create JoinPart stream', e)
        throw e
    }

    // Add public read permission
    try {
        await addPermission(stream.id, {
            anonymous: true,
            operation: 'read',
            user: null,
        })
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
            await addPermission(stream.id, {
                operation: 'share',
                user: address,
            })

            // eslint-disable-next-line no-await-in-loop
            await addPermission(stream.id, {
                operation: 'write',
                user: address,
            })
        }
    } catch (e) {
        console.error('Could not add write keys to JoinPart stream', e)
        throw e
    }

    // Remove share permission to prevent deleting the stream
    try {
        const myPermissions = await getMyStreamPermissions(stream.id)
        const sharePermission = myPermissions.find((p) => p.operation === 'share')
        if (sharePermission) {
            await deletePermission(stream.id, sharePermission.id)
        }
    } catch (e) {
        console.error('Could not remove share permission from JoinPart stream', e)
    }

    return stream
}

export const getAdminFeeInEther = (adminFee: number) => {
    if (adminFee <= 0 || adminFee > 1) {
        throw new Error(`${adminFee} is not a valid admin fee`)
    }

    const web3 = getWeb3()
    return web3.utils.toWei(`${adminFee}`, 'ether')
}

export const deployContract = (joinPartStreamId: string, adminFee: number): SmartContractDeployTransaction => {
    const operatorAddress = process.env.DATA_UNION_OPERATOR_ADDRESS
    const tokenAddress = process.env.DATA_TOKEN_CONTRACT_ADDRESS
    const blockFreezePeriodSeconds = process.env.DATA_UNION_BLOCK_FREEZE_PERIOD_SECONDS || 1
    return deploy(getConfig().communityProduct, [
        operatorAddress,
        joinPartStreamId,
        tokenAddress,
        blockFreezePeriodSeconds,
        getAdminFeeInEther(adminFee),
    ])
}

export const getCommunityContract = (address: DataUnionId, usePublicNode: boolean = false) => {
    const { abi } = getConfig().communityProduct

    return getContract({
        abi,
        address,
    }, usePublicNode)
}

export const getDataUnionOwner = async (address: DataUnionId, usePublicNode: boolean = false) => {
    const contract = getCommunityContract(address, usePublicNode)
    const owner = await call(contract.methods.owner)

    return owner
}

export const isDataUnionDeployed = async (address: DataUnionId, usePublicNode: boolean = false) => (
    !!getDataUnionOwner(address, usePublicNode)
)

export const getAdminFee = async (address: DataUnionId, usePublicNode: boolean = false) => {
    const web3 = usePublicNode ? getPublicWeb3() : getWeb3()
    const contract = getCommunityContract(address, usePublicNode)
    const adminFee = await call(contract.methods.adminFee)

    return web3.utils.fromWei(web3.utils.toBN(adminFee), 'ether')
}

export const setAdminFee = (address: DataUnionId, adminFee: number): SmartContractTransaction => (
    send(getCommunityContract(address).methods.setAdminFee(getAdminFeeInEther(adminFee)), {
        gas: gasLimits.UPDATE_ADMIN_FEE,
    })
)

export const getJoinPartStreamId = (address: DataUnionId, usePublicNode: boolean = false) =>
    call(getCommunityContract(address, usePublicNode).methods.joinPartStream())

export const getDataUnionStats = (id: DataUnionId): ApiResult<Object> => get({
    url: formatApiUrl('dataunions', id, 'stats'),
    useAuthorization: false,
})

export const getDataUnions = async (): ApiResult<Array<Object>> => {
    const { dataunions } = await get({
        url: formatApiUrl('dataunions'),
        useAuthorization: false,
    })

    return Object.keys(dataunions || {}).map((id) => ({
        id: id.toLowerCase(),
        ...dataunions[id],
    }))
}

export const getDataUnion = async (id: DataUnionId, usePublicNode: boolean = true): ApiResult<Object> => {
    const adminFee = await getAdminFee(id, usePublicNode)
    const joinPartStreamId = await getJoinPartStreamId(id, usePublicNode)
    const owner = await getDataUnionOwner(id, usePublicNode)

    return {
        id,
        adminFee,
        joinPartStreamId,
        owner,
    }
}

type GetSecrets = {
    dataUnionId: DataUnionId,
}

export const getSecrets = ({ dataUnionId }: GetSecrets): ApiResult<Array<Secret>> => get({
    url: formatApiUrl('dataunions', dataUnionId, 'secrets'),
})

type PostSecrect = {
    dataUnionId: DataUnionId,
    name: string,
    secret: string
}

export const postSecret = ({ dataUnionId, name, secret }: PostSecrect): ApiResult<Secret> => post({
    url: formatApiUrl('dataunions', dataUnionId, 'secrets'),
    data: {
        name,
        secret,
    },
})

type PutSecrect = {
    dataUnionId: DataUnionId,
    secretId: string,
    name: string,
}

export const putSecret = ({ dataUnionId, secretId, name }: PutSecrect): ApiResult<Secret> => put({
    url: formatApiUrl('dataunions', dataUnionId, 'secrets', secretId),
    data: {
        name,
    },
})

type DeleteSecrect = {
    dataUnionId: DataUnionId,
    secretId: string,
}

export const deleteSecret = ({ dataUnionId, secretId }: DeleteSecrect): ApiResult<void> => del({
    url: formatApiUrl('dataunions', dataUnionId, 'secrets', secretId),
})

type GetJoinRequests = {
    dataUnionId: DataUnionId,
    params?: any,
}

export const getJoinRequests = ({ dataUnionId, params }: GetJoinRequests): ApiResult<any> => get({
    url: formatApiUrl('dataunions', dataUnionId, 'joinRequests'),
    options: {
        params,
    },
})

type PutJoinRequest = {
    dataUnionId: DataUnionId,
    joinRequestId: string,
    state: 'ACCEPTED' | 'REJECTED' | 'PENDING',
}

export const updateJoinRequest = async ({ dataUnionId, joinRequestId, state }: PutJoinRequest): ApiResult<any> => put({
    url: formatApiUrl('dataunions', dataUnionId, 'joinRequests', joinRequestId),
    data: {
        state,
    },
})

type PostJoinRequest = {
    dataUnionId: DataUnionId,
    memberAddress: Address,
}

export const addJoinRequest = async ({ dataUnionId, memberAddress }: PostJoinRequest): ApiResult<any> => post({
    url: formatApiUrl('dataunions', dataUnionId, 'joinRequests'),
    data: {
        memberAddress,
    },
})

type DeleteJoinRequest = {
    dataUnionId: DataUnionId,
    joinRequestId: string,
}

export const removeJoinRequest = async ({ dataUnionId, joinRequestId }: DeleteJoinRequest): ApiResult<void> => del({
    url: formatApiUrl('dataunions', dataUnionId, 'joinRequests', joinRequestId),
})
