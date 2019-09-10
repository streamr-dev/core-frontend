// @flow

import { deploy } from '$mp/utils/smartContract'
import getConfig from '$shared/web3/config'

import type { SmartContractDeployTransaction } from '$shared/flowtype/web3-types'
import type {
    StreamId,
    Stream,
    NewStream,
} from '$shared/flowtype/stream-types'
import type { Permission } from '$userpages/flowtype/permission-types'
import type { ApiResult } from '$shared/flowtype/common-types'

import { post } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import { postStream } from '$userpages/modules/userPageStreams/services'

export const getStreamrEngineAddresses = (): Array<string> => {
    const addressesString = process.env.STREAMR_ENGINE_NODE_ADDRESSES || ''
    const addresses = addressesString.split(',')
    return addresses
}

export const addPermission = (id: StreamId, permission: Permission): ApiResult<Array<Permission>> =>
    post(formatApiUrl('streams', id, 'permissions'), permission)

export const addKey = (id: StreamId, key: Object): ApiResult<Object> =>
    post(formatApiUrl('streams', id, 'keys'), key)

export const createJoinPartStream = async (productName: string): Promise<Stream | null> => {
    const newStream: NewStream = {
        name: `JoinPart stream for ${productName}`,
        description: 'Automatically created JoinPart stream for community product contract',
    }
    const stream = await postStream(newStream)
    if (stream == null) {
        console.error('Could not create JoinPart stream')
        return null
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
    }

    // Add write permissions for all Streamr Engine nodes
    try {
        const addWriteKeyPromises = getStreamrEngineAddresses().map((address) => (
            addKey(stream.id, {
                name: address,
                permission: 'write',
            })
        ))
        await Promise.all(addWriteKeyPromises)
    } catch (e) {
        console.error('Could not add write keys to JoinPart stream', e)
    }

    return stream
}

export const deployContract = (joinPartStreamId: string): SmartContractDeployTransaction => {
    const operatorAddress = process.env.COMMUNITY_PRODUCT_OPERATOR_ADDRESS
    const tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS
    const blockFreezePeriodSeconds = 1
    const contractArguments = [operatorAddress, joinPartStreamId, tokenAddress, blockFreezePeriodSeconds]
    return deploy(getConfig().communityProduct, contractArguments)
}
