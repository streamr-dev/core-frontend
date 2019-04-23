// @flow

import getWeb3 from '$shared/web3/web3Provider'
import { get, post, del, put } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { IntegrationKeyId, IntegrationKey, Challenge } from '$shared/flowtype/integration-key-types'
import type { Address, Hash } from '$shared/flowtype/web3-types'
import { integrationKeyServices } from '$shared/utils/constants'
import {
    Web3NotEnabledError,
    ChallengeFailedError,
    CreateIdentityFailedError,
    IdentityExistsError,
} from '$shared/errors/Web3'

export const getIntegrationKeys = (): ApiResult<Array<IntegrationKey>> => get(formatApiUrl('integration_keys'))

export const createPrivateKey = (name: string, privateKey: Address): ApiResult<IntegrationKey> =>
    post(formatApiUrl('integration_keys'), {
        name,
        service: integrationKeyServices.PRIVATE_KEY,
        json: {
            privateKey,
        },
    })

export const editIntegrationKey = (keyId: IntegrationKeyId, name: string): ApiResult<IntegrationKey> =>
    put(formatApiUrl('integration_keys', keyId), {
        name,
    })

export const createChallenge = (account: Address): ApiResult<Challenge> => post(formatApiUrl('login', 'challenge', account))

export const createEthereumIdentity = (
    name: string,
    address: Address,
    challenge: Challenge,
    signature: Hash,
): ApiResult<IntegrationKey> => post(formatApiUrl('integration_keys'), {
    name,
    service: integrationKeyServices.ETHEREREUM_IDENTITY,
    challenge,
    signature,
    address,
})

export const createIdentity = async (name: string): ApiResult<IntegrationKey> => {
    const ownWeb3 = getWeb3()

    if (!ownWeb3.isEnabled()) {
        throw new Web3NotEnabledError()
    }

    let account
    let response
    let challenge
    let signature

    try {
        account = await ownWeb3.getDefaultAccount()
        response = await createChallenge(account)
        challenge = response && response.challenge
        signature = await ownWeb3.eth.personal.sign(challenge, account)
    } catch (error) {
        console.warn(error)
        throw new ChallengeFailedError()
    }

    try {
        return await createEthereumIdentity(name, account, response, signature)
    } catch (error) {
        if (error.code === 'DUPLICATE_NOT_ALLOWED') {
            throw new IdentityExistsError()
        } else {
            console.warn(error)
            throw new CreateIdentityFailedError()
        }
    }
}

export const deleteIntegrationKey = (id: IntegrationKeyId): ApiResult<null> => del(formatApiUrl('integration_keys', id))
