// @flow

import getWeb3 from '$shared/web3/web3Provider'
import { get, post, del } from '$shared/utils/api'
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

export const createIdentity = (name: string): ApiResult<IntegrationKey> => new Promise((resolve, reject) => {
    const ownWeb3 = getWeb3()

    if (!ownWeb3.isEnabled()) {
        reject(new Web3NotEnabledError())
    }

    return ownWeb3.getDefaultAccount()
        .then((account) => (
            createChallenge(account)
                .then((response) => {
                    const challenge = response && response.challenge
                    return ownWeb3.eth.personal.sign(challenge, account)
                        .then((signature) => (
                            createEthereumIdentity(name, account, response, signature)
                                .then(resolve, (error) => {
                                    if (error.code === 'DUPLICATE_NOT_ALLOWED') {
                                        reject(new IdentityExistsError())
                                    } else {
                                        reject(new CreateIdentityFailedError())
                                    }
                                })
                        ), () => {
                            reject(new ChallengeFailedError())
                        })
                }, () => {
                    reject(new ChallengeFailedError())
                })
        ), () => {
            reject(new ChallengeFailedError())
        })
})

export const deleteIntegrationKey = (id: IntegrationKeyId): ApiResult<null> => del(formatApiUrl('integration_keys', id))
