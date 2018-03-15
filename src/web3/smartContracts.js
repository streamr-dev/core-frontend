// @flow

import getWeb3 from './web3Provider'
import {smartContracts} from './web3Config'
import { getContract, call, send } from '../utils/smartContract'
import type {ProductId} from '../flowtype/product-types'
import type { SmartContractCall } from '../flowtype/web3-types'

const {marketplace} = smartContracts

const web3 = getWeb3()

export const contract = () => getContract(web3, marketplace.address, marketplace.abi)

// https://github.com/streamr-dev/marketplace-contracts/blob/master/contracts/Marketplace.sol
export const marketplaceContract = {
    getProduct: (id: ProductId): SmartContractCall => {
        return contract().then(c => call(c.methods.getProduct(id)))
    },
    buy: (id: ProductId, onHash: (string) => void, timeInSeconds: number): SmartContractCall => {
        return contract().then(c => send(c.methods.buy(id, timeInSeconds), onHash))
    },
}
