// @flow

import { I18n } from 'react-redux-i18n'

import { getContract, call, hexEqualsZero } from '$mp/utils/smartContract'
import getConfig from '$shared/web3/config'
import type { SmartContractProduct, ProductId } from '$mp/flowtype/product-types'
import type { SmartContractCall } from '$shared/flowtype/web3-types'
import { getValidId, mapProductFromContract } from '$mp/utils/product'

const contractMethods = (usePublicNode: boolean = false) => getContract(getConfig().marketplace, usePublicNode).methods

export const getProductFromContract = async (id: ProductId, usePublicNode: boolean = false): SmartContractCall<SmartContractProduct> => (
    call(contractMethods(usePublicNode).getProduct(getValidId(id)))
        .then((result) => {
            if (!result || hexEqualsZero(result.owner)) {
                throw new Error(I18n.t('error.productNotFound', {
                    id,
                }))
            }
            return mapProductFromContract(id, result)
        })
)
