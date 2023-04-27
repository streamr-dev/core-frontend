import { $Values } from 'utility-types'
import { BalanceType } from '$shared/types/user-types'
import {Abi, Address} from '$shared/types/web3-types'
import { getDataTokenBalance, getNativeTokenBalance } from '$mp/utils/web3'
import reverseRecordsAbi from '$shared/web3/abis/reverseRecords.json'
import {call, getContract} from "$mp/utils/smartContract"
import getCoreConfig from "$app/src/getters/getCoreConfig"

const config = getCoreConfig()

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

export const lookupEnsName = async (address: Address): Promise<string> => {
    const contract = getContract({abi: reverseRecordsAbi as Abi, address: config.reverseRecordsAddress}, true, 1)
    const response = await call(contract.methods.getNames([address]))
    return response[0]
}
