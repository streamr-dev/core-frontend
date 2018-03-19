// @flow

import type { ContractProductId, SmartContractCall } from '../../flowtype/web3-types'

export const getContractProductById = (id: ContractProductId): SmartContractCall => new Promise(resolve => {
    setTimeout(resolve, 2000, {
        id,
    }) // TODO(mr): Use the real thing.
})
