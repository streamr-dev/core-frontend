// @flow

import { getContract, call } from '../../utils/smartContract'
import getConfig from '../../web3/config'

import type { SmartContractProduct, ProductId } from '../../flowtype/product-types'
import type { SmartContractCall } from '../../flowtype/web3-types'
import { mapProductFromContract } from '../../utils/product'

const contractMethods = () => getContract(getConfig().marketplace).methods

export const getProductFromContract = (id: ProductId): SmartContractCall<SmartContractProduct> => call(contractMethods().getProduct(`0x${id}`))
    .then((result) => mapProductFromContract(id, result))
