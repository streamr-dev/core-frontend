// @flow

import { deploy, getContract, call, send } from '$mp/utils/smartContract'
import getConfig from '$shared/web3/config'

import type { SmartContractDeployTransaction, SmartContractTransaction } from '$shared/flowtype/web3-types'
import type {
    StreamId,
    Stream,
    NewStream,
} from '$shared/flowtype/stream-types'
import type { ProductId, CommunityId } from '$mp/flowtype/product-types'
import type { Permission } from '$userpages/flowtype/permission-types'
import type { ApiResult } from '$shared/flowtype/common-types'
import { gasLimits } from '$shared/utils/constants'

import { post, del, get, put } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import { postStream, getMyStreamPermissions } from '$userpages/modules/userPageStreams/services'
import { addStreamResourceKey } from '$shared/modules/resourceKey/services'
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
        name: productId ? `JoinPart stream for product ${productId}` : 'JoinPart stream',
        description: 'Automatically created JoinPart stream for community product contract',
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
        const addEngineKeyPromises = [
            ...getStreamrEngineAddresses().map((address) => (
                addStreamResourceKey(stream.id, address, 'share')
            )),
            ...getStreamrEngineAddresses().map((address) => (
                addStreamResourceKey(stream.id, address, 'write')
            )),
        ]
        await Promise.all(addEngineKeyPromises)
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
    const operatorAddress = process.env.COMMUNITY_PRODUCT_OPERATOR_ADDRESS
    const tokenAddress = process.env.DATA_TOKEN_CONTRACT_ADDRESS
    const blockFreezePeriodSeconds = process.env.COMMUNITY_PRODUCT_BLOCK_FREEZE_PERIOD_SECONDS || 1
    return deploy(getConfig().communityProduct, [
        operatorAddress,
        joinPartStreamId,
        tokenAddress,
        blockFreezePeriodSeconds,
        getAdminFeeInEther(adminFee),
    ])
}

export const getCommunityContract = (address: CommunityId, usePublicNode: boolean = false) => {
    const { abi } = getConfig().communityProduct

    return getContract({
        abi,
        address,
    }, usePublicNode)
}

export const getCommunityOwner = async (address: CommunityId, usePublicNode: boolean = false) => {
    const contract = getCommunityContract(address, usePublicNode)
    const owner = await call(contract.methods.owner)

    return owner
}

export const isCommunityDeployed = async (address: CommunityId, usePublicNode: boolean = false) => (
    !!getCommunityOwner(address, usePublicNode)
)

export const getAdminFee = async (address: CommunityId, usePublicNode: boolean = false) => {
    const web3 = usePublicNode ? getPublicWeb3() : getWeb3()
    const contract = getCommunityContract(address, usePublicNode)
    const adminFee = await call(contract.methods.adminFee)

    return web3.utils.fromWei(web3.utils.toBN(adminFee), 'ether')
}

export const setAdminFee = (address: CommunityId, adminFee: number): SmartContractTransaction => (
    send(getCommunityContract(address).methods.setAdminFee(getAdminFeeInEther(adminFee)), {
        gas: gasLimits.UPDATE_ADMIN_FEE,
    })
)

export const getJoinPartStreamId = (address: CommunityId, usePublicNode: boolean = false) =>
    call(getCommunityContract(address, usePublicNode).methods.joinPartStream())

export const getCommunityStats = (id: CommunityId): ApiResult<Object> => get({
    url: formatApiUrl('communities', id, 'stats'),
    useAuthorization: false,
})

export const getCommunities = async (): ApiResult<Array<Object>> => {
    const { communities } = await get({
        url: formatApiUrl('communities'),
        useAuthorization: false,
    })

    return Object.keys(communities || {}).map((id) => ({
        id: id.toLowerCase(),
        ...communities[id],
    }))
}

export const getCommunityData = async (id: CommunityId, usePublicNode: boolean = true): ApiResult<Object> => {
    const adminFee = await getAdminFee(id, usePublicNode)
    const joinPartStreamId = await getJoinPartStreamId(id, usePublicNode)
    const owner = await getCommunityOwner(id, usePublicNode)

    return {
        id,
        adminFee,
        joinPartStreamId,
        owner,
    }
}

export const getSecrets = (communityId: string): ApiResult<Array<Secret>> =>
    get({
        url: formatApiUrl('communities', communityId, 'secrets'),
    })

export const postSecret = (communityId: string, name: string, secret: string): ApiResult<Secret> =>
    post({
        url: formatApiUrl('communities', communityId, 'secrets'),
        data: {
            name,
            secret,
        },
    })

export const putSecret = (communityId: string, secretId: string, name: string): ApiResult<Secret> =>
    put({
        url: formatApiUrl('communities', communityId, 'secrets', secretId),
        data: {
            name,
        },
    })

export const deleteSecret = (communityId: string, secretId: string): ApiResult<void> =>
    del({
        url: formatApiUrl('communities', communityId, 'secrets', secretId),
    })
