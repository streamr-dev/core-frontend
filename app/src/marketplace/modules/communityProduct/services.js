// @flow

import { deploy } from '$mp/utils/smartContract'
import getConfig from '$shared/web3/config'

import type { SmartContractDeployTransaction } from '$shared/flowtype/web3-types'
import type {
    StreamId,
    Stream,
    NewStream,
} from '$shared/flowtype/stream-types'
import type { ProductId } from '$mp/flowtype/product-types'
import type { Permission } from '$userpages/flowtype/permission-types'
import type { ApiResult } from '$shared/flowtype/common-types'

import { post, del } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import { postStream /* , getMyStreamPermissions */ } from '$userpages/modules/userPageStreams/services'
import { addStreamResourceKey } from '$shared/modules/resourceKey/services'

export const getStreamrEngineAddresses = (): Array<string> => {
    const addressesString = process.env.STREAMR_ENGINE_NODE_ADDRESSES || ''
    const addresses = addressesString.split(',')
    return addresses
}

export const addPermission = (id: StreamId, permission: Permission): ApiResult<Array<Permission>> =>
    post(formatApiUrl('streams', id, 'permissions'), permission)

export const deletePermission = (id: StreamId, permissionId: string): ApiResult<Array<Permission>> =>
    del(formatApiUrl('streams', id, 'permissions', permissionId))

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
        const addWriteKeyPromises = getStreamrEngineAddresses().map((address) => (
            addStreamResourceKey(stream.id, address, 'write')
        ))
        await Promise.all(addWriteKeyPromises)
    } catch (e) {
        console.error('Could not add write keys to JoinPart stream', e)
        throw e
    }

    // Remove share permission to prevent deleting the stream
    // TODO: Backend will throw error because there must at least one 'share' permission.
    /*
    try {
        // $FlowFixMe
        const myPermissions = await getMyStreamPermissions(stream.id)
        const sharePermission = myPermissions.find((p) => p.operation === 'share')
        if (sharePermission) {
            await deletePermission(stream.id, sharePermission.id)
        }
    } catch (e) {
        console.error('Could not remove share permission from JoinPart stream', e)
    }
    */

    return stream
}

export const deployContract = (joinPartStreamId: StreamId): SmartContractDeployTransaction => {
    const operatorAddress = process.env.COMMUNITY_PRODUCT_OPERATOR_ADDRESS
    const tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS
    const blockFreezePeriodSeconds = process.env.COMMUNITY_PRODUCT_BLOCK_FREEZE_PERIOD_SECONDS || 1
    const contractArguments = [operatorAddress, joinPartStreamId, tokenAddress, blockFreezePeriodSeconds]

    return deploy(getConfig().communityProduct, contractArguments)
}
