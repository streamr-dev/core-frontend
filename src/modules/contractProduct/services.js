// @flow

import {
    getContract,
    call,
    hexEqualsZero,
} from '../../utils/smartContract'
import getConfig from '../../web3/config'
import { currencies, productStates } from '../../utils/constants'

import type { SmartContractProduct, ProductId } from '../../flowtype/product-types'
import type { SmartContractCall } from '../../flowtype/web3-types'
import { mapPriceFromContract } from '../../utils/product'

const contractMethods = () => getContract(getConfig().marketplace).methods

export const getProductFromContract = (id: ProductId): SmartContractCall<SmartContractProduct> => call(contractMethods().getProduct(`0x${id}`))
    .then((result) => {
        if (hexEqualsZero(result.owner)) {
            throw new Error(`No product found with id ${id}`)
        }
        const state = Object.keys(productStates)[result.state]
        const currency = Object.keys(currencies)[result.currency]
        const pricePerSecond = mapPriceFromContract(result.pricePerSecond)
        return {
            ...result,
            pricePerSecond,
            state,
            currency,
        }
    })
