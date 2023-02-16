import { $Values } from 'utility-types'
import { post } from '$shared/utils/api'
import type { ApiResult } from '$shared/types/common-types'
import { BalanceType } from '$shared/types/user-types'
import type { Address } from '$shared/types/web3-types'
import { getDataTokenBalance, getNativeTokenBalance } from '$mp/utils/web3'
const GRAPH_API_URL = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens'

type GetBalance = {
    address: Address
    type: $Values<typeof BalanceType>
    usePublicNode?: boolean
    chainId?: number
}
export async function getBalance({ address, type, usePublicNode = false, chainId }: GetBalance) {
    let balance

    if (type === BalanceType.ETH) {
        balance = await getNativeTokenBalance(address, usePublicNode)
    } else if (type === BalanceType.DATA) {
        if (chainId == null) {
            throw new Error('chainId must be provided!')
        }

        balance = await getDataTokenBalance(address, usePublicNode, chainId)
    } else {
        throw new Error(`Unknown balance type ${type}!`)
    }

    return balance
}
type Domains = {
    data: {
        domains: Array<{
            name: string
        }>
    }
}
export const getEnsDomains = ({ addresses }: { addresses: Array<Address> }): ApiResult<Domains> =>
    post({
        url: GRAPH_API_URL,
        data: {
            query: `
            query {
                domains(
                    where: { owner_in: [${(addresses || []).map((address) => `"${address.toLowerCase()}"`).join(', ')}]}
                    orderBy: name
                ) {
                    id
                    name
                    labelName
                    labelhash
                }
            }
        `,
        }
    })
