// @flow

import { get, post, put, del } from '$shared/utils/api'
import type { ApiResult } from '$shared/flowtype/common-types'
import { type User, type Challenge, BalanceType } from '$shared/flowtype/user-types'
import type { Address } from '$shared/flowtype/web3-types'
import { getDataTokenBalance, getEthBalance } from '$mp/utils/web3'
import routes from '$routes'

const GRAPH_API_URL = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens'

export const getUserData = (): ApiResult<User> => get({
    url: routes.api.currentUser.index({
        noCache: Date.now(),
    }),
})

export const putUser = (user: User): ApiResult<User> => put({
    url: routes.api.currentUser.index(),
    data: user,
})

export const uploadProfileAvatar = (image: File): Promise<void> => {
    const options = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }

    const data = new FormData()
    data.append('file', image, image.name)

    return post({
        url: routes.api.currentUser.image(),
        data,
        options,
    })
}

export const deleteUserAccount = (): ApiResult<null> => del({
    url: routes.api.currentUser.index(),
})

export const createChallenge = (account: Address): ApiResult<Challenge> => post({
    url: routes.api.loginChallenge({
        account,
    }),
    useAuthorization: false,
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

type Domains = {
    data: {
        domains: Array<{
            name: string,
        }>
    },
}

export const getEnsDomains = ({ addresses }: {
    addresses: Array<Address>,
}): ApiResult<Domains> => post({
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
