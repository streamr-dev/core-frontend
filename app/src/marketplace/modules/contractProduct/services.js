// @flow

import { I18n } from 'react-redux-i18n'

import { getContract, call, hexEqualsZero } from '$mp/utils/smartContract'
import getConfig from '$shared/web3/config'
import type { SmartContractProduct, ProductId } from '$mp/flowtype/product-types'
import type { SmartContractCall } from '$shared/flowtype/web3-types'
import { getValidId, mapProductFromContract } from '$mp/utils/product'
import { getWeb3, getPublicWeb3 } from '$shared/web3/web3Provider'

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

export const getSubscriberCount = async (id: ProductId, usePublicNode: boolean = false) => {
    const contract = getContract(getConfig().marketplace, usePublicNode)
    const events = await contract.getPastEvents('Subscribed', {
        filter: {
            productId: getValidId(id),
        },
        fromBlock: 0,
        toBlock: 'latest',
    })
    return events.length
}

export const getMostRecentPurchase = async (id: ProductId, usePublicNode: boolean = false) => {
    const web3 = usePublicNode ? getPublicWeb3() : getWeb3()
    const contract = getContract(getConfig().marketplace, usePublicNode)
    const events = await contract.getPastEvents('Subscribed', {
        filter: {
            productId: getValidId(id),
        },
        fromBlock: 0,
        toBlock: 'latest',
    })

    if (events.length === 0) {
        return null
    }

    const lastEvent = events[events.length - 1]
    const lastBlock = await web3.eth.getBlock(lastEvent.blockHash)
    return new Date(lastBlock.timestamp * 1000)
}
