// @flow

import { post } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import { getContract, send } from '$mp/utils/smartContract'
import getConfig from '$shared/web3/config'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { ProductId, Product } from '$mp/flowtype/product-types'
import type { SmartContractTransaction, Hash } from '$shared/flowtype/web3-types'
import { gasLimits } from '$shared/utils/constants'
import { getValidId, mapProductFromApi } from '$mp/utils/product'

export const postUndeployFree = async (id: ProductId): ApiResult<Product> => post({
    url: formatApiUrl('products', getValidId(id, false), 'undeployFree'),
})
    .then(mapProductFromApi)

export const postSetUndeploying = async (id: ProductId, txHash: Hash): ApiResult<Product> => post({
    url: formatApiUrl('products', getValidId(id, false), 'setUndeploying'),
    data: {
        transactionHash: txHash,
    },
}).then(mapProductFromApi)

const contractMethods = () => getContract(getConfig().marketplace).methods

export const deleteProduct = (id: ProductId): SmartContractTransaction => (
    send(contractMethods().deleteProduct(getValidId(id)), {
        gas: gasLimits.DELETE_PRODUCT,
    })
)
