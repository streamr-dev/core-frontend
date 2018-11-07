// @flow

import { getPublicWeb3 } from '$shared/web3/web3Provider'
import type { Hash, HashList, TransactionEntity } from '$shared/flowtype/web3-types'

export const getTransactions = (address: Hash | HashList): Promise<TransactionEntity> => {
    const web3 = getPublicWeb3()

    return web3.eth.getPastLogs({
        address,
        fromBlock: '0x1',
        toBlock: 'pending',
    })
}
