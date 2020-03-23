// @flow

import getWeb3, { getPublicWeb3 } from '$shared/web3/web3Provider'
import { get, post, del, put } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import {
    BalanceType,
    type IntegrationKeyId,
    type IntegrationKey,
    type Challenge,
} from '$shared/flowtype/integration-key-types'
import type { Address, Hash } from '$shared/flowtype/web3-types'
import { integrationKeyServices } from '$shared/utils/constants'
import { getDataTokenBalance, getEthBalance } from '$mp/utils/web3'

import {
    Web3NotEnabledError,
    ChallengeFailedError,
    CreateIdentityFailedError,
    IdentityExistsError,
} from '$shared/errors/Web3'

export const getIntegrationKeys = (): ApiResult<Array<IntegrationKey>> => get({
    url: formatApiUrl('integration_keys'),
})

export const createPrivateKey = (name: string): ApiResult<IntegrationKey> => {
    const web3 = getPublicWeb3()

    const { privateKey } = web3.eth.accounts.create()

    return post({
        url: formatApiUrl('integration_keys'),
        data: {
            name,
            service: integrationKeyServices.PRIVATE_KEY,
            json: {
                privateKey,
            },
        },
    })
}

export const editIntegrationKey = (keyId: IntegrationKeyId, name: string): ApiResult<IntegrationKey> =>
    put({
        url: formatApiUrl('integration_keys', keyId),
        data: {
            name,
        },
    })

export const createChallenge = (account: Address): ApiResult<Challenge> => post({
    url: formatApiUrl('login', 'challenge', account),
})

export const createEthereumIdentity = (
    name: string,
    address: Address,
    challenge: Challenge,
    signature: Hash,
): ApiResult<IntegrationKey> => post({
    url: formatApiUrl('integration_keys'),
    data: {
        name,
        service: integrationKeyServices.ETHEREREUM_IDENTITY,
        challenge,
        signature,
        address,
    },
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
        signature = await ownWeb3.eth.personal.sign(
            challenge,
            account,
            '', // required, but MetaMask will ignore the password argument here
        )
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

export const deleteIntegrationKey = (id: IntegrationKeyId): ApiResult<null> => del({
    url: formatApiUrl('integration_keys', id),
})

type GetBalance = {
    address: Address,
    type: $Values<typeof BalanceType>,
    usePublicNode?: boolean,
}

export async function getBalance({ address, type, usePublicNode = false }: GetBalance) {
    let balance

    if (type === BalanceType.ETH) {
        balance = await getEthBalance(address, usePublicNode)
    } else if (type === BalanceType.DATA) {
        balance = await getDataTokenBalance(address, usePublicNode)
    } else {
        throw new Error('Unknown balance type!')
    }

    return balance
}
