// @flow

import getWeb3 from './web3Provider'
import {smartContracts} from './web3Config'
import { getContract, call, send } from '../utils/smartContract'
import type {ProductId} from '../flowtype/product-types'
import type { SmartContractCall } from '../flowtype/web3-types'

const {marketplace} = smartContracts

const web3 = getWeb3()

export const contract = () => getContract(web3, marketplace.address, marketplace.abi)

const hexEqualsZero = (hex: string) => hex.match(/^0x0+$/)

// https://github.com/streamr-dev/marketplace-contracts/blob/master/contracts/Marketplace.sol
export const marketplaceContract = {
    getProduct: (id: ProductId): SmartContractCall => new Promise((resolve, reject) => {
        contract()
            .then(c => call(c.methods.getProduct(web3.utils.asciiToHex(id))))
            .then(result => {
                if (hexEqualsZero(result.owner)) {
                    reject(new Error(`No product found with id ${id}`))
                }
                resolve(result)
            })
    }),
    buy: (id: ProductId, timeInSeconds: number, onHash: (string) => void): SmartContractCall => {
        return contract().then(c => send(c.methods.buy(web3.utils.asciiToHex(id), timeInSeconds), onHash))
    },
}
