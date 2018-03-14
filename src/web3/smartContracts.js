// @flow

import getWeb3 from './web3Provider'
import {smartContracts} from './web3Config'
import {getContract, wrapConstantCall, wrapTransactionCall} from '../utils/smartContract'
import type {ProductId} from '../flowtype/product-types'
import type {SmartContractConstantCall, SmartContractTransactionCall} from '../flowtype/web3-types'

const {marketplace} = smartContracts

const web3 = getWeb3()

export const originalMarketplaceContract = () => getContract(web3, marketplace.address, marketplace.abi)

// https://github.com/streamr-dev/marketplace-contracts/blob/master/contracts/Marketplace.sol
export const marketplaceContract = {
    getProduct: (id: ProductId): SmartContractConstantCall => originalMarketplaceContract().then(c => wrapConstantCall(c.methods.getProduct(id))),
    buy: (id: ProductId, timeInSeconds: number): SmartContractTransactionCall => originalMarketplaceContract().then(c => wrapTransactionCall(c.methods.buy(id, timeInSeconds)))
}
