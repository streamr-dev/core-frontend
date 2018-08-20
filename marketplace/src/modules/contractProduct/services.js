// @flow

import { I18n } from '@streamr/streamr-layout'

import { getContract, call, hexEqualsZero } from '../../utils/smartContract'
import getConfig from '../../web3/config'
import type { SmartContractProduct, ProductId } from '../../flowtype/product-types'
import type { SmartContractCall } from '../../flowtype/web3-types'
import { getValidId, mapProductFromContract } from '../../utils/product'

const contractMethods = () => getContract(getConfig().marketplace).methods

export const getProductFromContract = async (id: ProductId): SmartContractCall<SmartContractProduct> => (
    call(contractMethods().getProduct(getValidId(id)))
        .then((result) => {
            if (hexEqualsZero(result.owner)) {
                throw new Error(I18n.t('error.productNotFound', {
                    id,
                }))
            }
            return mapProductFromContract(id, result)
        })
)
