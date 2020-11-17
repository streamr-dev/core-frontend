// @flow

import { getPublicWeb3 } from '$shared/web3/web3Provider'
import { get, post, del, put } from '$shared/utils/api'
import routes from '$routes'
import type { ApiResult } from '$shared/flowtype/common-types'
import {
    BalanceType,
    type IntegrationKeyId,
    type IntegrationKey,
    type Challenge,
    type CreateIdentity,
} from '$shared/flowtype/integration-key-types'
import type { Address, Hash } from '$shared/flowtype/web3-types'
import { integrationKeyServices } from '$shared/utils/constants'
import { getDataTokenBalance, getEthBalance } from '$mp/utils/web3'

import {
    ChallengeFailedError,
    CreateIdentityFailedError,
    IdentityExistsError,
} from '$shared/errors/Web3'

const GRAPH_API_URL = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens'

export const getIntegrationKeys = (): ApiResult<Array<IntegrationKey>> => get({
    url: routes.api.integrationKeys.index(),
})

export const createPrivateKey = (name: string): ApiResult<IntegrationKey> => {
    const web3 = getPublicWeb3()

    const { privateKey } = web3.eth.accounts.create()

    return post({
        url: routes.api.integrationKeys.index(),
        data: {
            name,
            service: integrationKeyServices.PRIVATE_KEY,
            json: {
                privateKey,
            },
        },
    })
}

export const editIntegrationKey = (id: IntegrationKeyId, name: string): ApiResult<IntegrationKey> =>
    put({
        url: routes.api.integrationKeys.show({
            id,
        }),
        data: {
            name,
        },
    })

export const createChallenge = (account: Address): ApiResult<Challenge> => post({
    url: routes.api.loginChallenge({
        account,
    }),
})

export const createEthereumIdentity = (
    name: string,
    address: Address,
    challenge: Challenge,
    signature: Hash,
): ApiResult<IntegrationKey> => post({
    url: routes.api.integrationKeys.index(),
    data: {
        name,
        service: integrationKeyServices.ETHEREREUM_IDENTITY,
        challenge,
        signature,
        address,
    },
})

export const createIdentity = async ({ name, address, signChallenge }: CreateIdentity) => {
    let response
    let challenge
    let signature

    try {
        response = await createChallenge(address)
        challenge = response && response.challenge
        signature = await signChallenge(challenge)
    } catch (error) {
        console.warn(error)
        throw new ChallengeFailedError()
    }

    try {
        return await createEthereumIdentity(name, address, response, signature)
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
    url: routes.api.integrationKeys.show({
        id,
    }),
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

export const getEnsDomains = ({ addresses }: {
    addresses: Array<Address>,
}): ApiResult<IntegrationKey> => post({
    url: GRAPH_API_URL,
    data: {
        query: `
            query {
                domains(
                    where: { owner_in: [${(addresses || []).map((address) => `"${address}"`).join(', ')}]}
                    orderBy: name
                ) {
                    id
                    name
                    labelName
                    labelhash
                }
            }
        `,
    },
    useAuthorization: false,
})
