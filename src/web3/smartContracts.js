// @flow

import getWeb3 from './web3Provider'
import {smartContracts} from './web3Config'
import { getContract, call, send } from '../utils/smartContract'
import type {ProductId} from '../flowtype/product-types'
import type { SmartContractCall, SmartContractTransaction } from '../flowtype/web3-types'

const {marketplace} = smartContracts

const web3 = getWeb3()

export const getMarketplaceContract = () => getContract(web3, marketplace.address, marketplace.abi)

const hexEqualsZero = (hex: string) => /^0x0+$/.test(hex)

// https://github.com/streamr-dev/marketplace-contracts/blob/master/contracts/Marketplace.sol
export const marketplaceContract = {
    getProduct: (id: ProductId): SmartContractCall => getMarketplaceContract()
        .then(c => call(c.methods.getProduct(web3.utils.asciiToHex(id))))
        .then(result => {
            if (hexEqualsZero(result.owner)) {
                throw new Error(`No product found with id ${id}`)
            }
            return result
        }),

    buy: (): SmartContractTransaction => send(() => getMarketplaceContract().then(c => c.methods.buy())),
}
