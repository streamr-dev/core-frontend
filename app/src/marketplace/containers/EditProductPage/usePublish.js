// @flow

import { useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import type { Product } from '$mp/flowtype/product-types'
import { productStates, transactionStates, transactionTypes } from '$shared/utils/constants'
import {
    getProductFromContract,
    createContractProduct,
    updateContractProduct,
    deleteProduct,
    redeployProduct,
} from '$mp/modules/contractProduct/services'
import {
    putProduct,
    postUndeployFree,
    postSetUndeploying,
    postDeployFree,
    postSetDeploying,
} from '$mp/modules/product/services'
import { getDataUnionOwner, getAdminFee, setAdminFee } from '$mp/modules/dataUnion/services'
import { getPendingChanges, withPendingChanges } from './state'
import { isUpdateContractProductRequired } from '$mp/utils/smartContract'
import PublishQueue, { actionsTypes } from './publishQueue'
import { isPaidProduct } from '$mp/utils/product'
import { addTransaction } from '$mp/modules/transactions/actions'
import Activity, { actionTypes } from '$shared/utils/Activity'

export const publishModes = {
    REPUBLISH: 'republish', // live product update
    REDEPLOY: 'redeploy', // unpublished, but published at least once
    PUBLISH: 'publish', // unpublished, publish for the first time
    UNPUBLISH: 'unpublish',
    ERROR: 'error',
}

export type PublishMode = $Values<typeof publishModes>

export default function usePublish() {
    const dispatch = useDispatch()

    const publish = useCallback(async (product: Product) => {
        if (!product) {
            throw new Error('no product')
        }

        // load contract product
        let contractProduct
        try {
            contractProduct = await getProductFromContract(product.id || '', true)
        } catch (e) {
            // don't need to do anything with this error necessarily,
            // it just means that the product wasn't deployed
        }

        let currentAdminFee
        let dataUnionOwner
        try {
            currentAdminFee = await getAdminFee(product.beneficiaryAddress)
            dataUnionOwner = await getDataUnionOwner(product.beneficiaryAddress)
        } catch (e) {
            // ignore error, assume contract has not been deployed
        }

        const { state: productState } = product

        const pendingChanges = getPendingChanges(product)
        const productWithPendingChagnes = withPendingChanges(product)
        const {
            adminFee,
            pricePerSecond,
            beneficiaryAddress,
            priceCurrency,
            ...productDataChanges
        } = pendingChanges || {}
        const hasAdminFeeChanged = !!currentAdminFee && adminFee && currentAdminFee !== adminFee
        const hasPriceChanged = !!contractProduct && isUpdateContractProductRequired(contractProduct, productWithPendingChagnes)
        const hasPendingChanges = Object.keys(productDataChanges).length > 0 || hasAdminFeeChanged || hasPriceChanged

        let nextMode

        // is published and has pending changes?
        if (productState === productStates.DEPLOYED) {
            nextMode = hasPendingChanges ? publishModes.REPUBLISH : publishModes.UNPUBLISH
        } else if (productState === productStates.NOT_DEPLOYED) {
            nextMode = contractProduct ? publishModes.REDEPLOY : publishModes.PUBLISH
        } else {
            // product is either being deployed to contract or being undeployed
            throw new Error('Invalid product state')
        }

        const queue = new PublishQueue()

        // update admin fee if it has changed
        if ([publishModes.REPUBLISH, publishModes.REDEPLOY, publishModes.PUBLISH].includes(nextMode)) {
            if (adminFee && hasAdminFeeChanged) {
                queue.add({
                    id: actionsTypes.UPDATE_ADMIN_FEE,
                    requireWeb3: true,
                    requireOwner: dataUnionOwner,
                    handler: (update, done) => {
                        try {
                            return setAdminFee(product.beneficiaryAddress, adminFee)
                                .onTransactionHash((hash) => {
                                    update(transactionStates.PENDING)
                                    dispatch(addTransaction(hash, transactionTypes.UPDATE_ADMIN_FEE))
                                    done()
                                })
                                .onTransactionComplete(() => {
                                    update(transactionStates.CONFIRMED)
                                })
                                .onError((error) => {
                                    done()
                                    update(transactionStates.FAILED, error)
                                })
                        } catch (e) {
                            done()
                            update(transactionStates.FAILED, e)
                        }

                        return null
                    },
                })
            }
        }

        // update price, currency & beneficiary if changed. This will also
        // do republish for products that have been at some point deployed
        if ([publishModes.REPUBLISH, publishModes.REDEPLOY].includes(nextMode)) {
            if (hasPriceChanged && contractProduct) {
                const isRedeploy = !!(nextMode === publishModes.REDEPLOY)

                queue.add({
                    id: actionsTypes.UPDATE_CONTRACT_PRODUCT,
                    requireWeb3: true,
                    requireOwner: contractProduct.ownerAddress,
                    handler: (update, done) => {
                        if (!contractProduct) {
                            return null
                        }

                        try {
                            return updateContractProduct({
                                ...contractProduct,
                                pricePerSecond: pricePerSecond || product.pricePerSecond,
                                beneficiaryAddress: beneficiaryAddress || product.beneficiaryAddress,
                                priceCurrency: priceCurrency || product.priceCurrency,
                            }, isRedeploy)
                                .onTransactionHash((hash) => {
                                    update(transactionStates.PENDING)
                                    done()
                                    dispatch(addTransaction(hash, transactionTypes.UPDATE_CONTRACT_PRODUCT))

                                    if (isRedeploy) {
                                        postSetDeploying(product.id || '', hash)
                                    }
                                    Activity.push({
                                        action: actionTypes.PUBLISH,
                                        txHash: hash,
                                        productId: product.id,
                                    })
                                })
                                .onTransactionComplete(() => {
                                    update(transactionStates.CONFIRMED)
                                })
                                .onError((error) => {
                                    done()
                                    update(transactionStates.FAILED, error)
                                })
                        } catch (e) {
                            done()
                            update(transactionStates.FAILED, e)
                        }

                        return null
                    },
                })
            }
        }

        // do the actual publish action
        if (nextMode === publishModes.PUBLISH) {
            if (isPaidProduct(product)) {
                // TODO: figure out a better to detect if deploying data union for the first time
                // force data union product to be published by the same account as the data union itself
                queue.add({
                    id: actionsTypes.CREATE_CONTRACT_PRODUCT,
                    requireWeb3: true,
                    requireOwner: dataUnionOwner,
                    handler: (update, done) => {
                        try {
                            return createContractProduct({
                                id: product.id || '',
                                name: product.name,
                                beneficiaryAddress: product.beneficiaryAddress,
                                pricePerSecond: product.pricePerSecond,
                                priceCurrency: product.priceCurrency,
                                minimumSubscriptionInSeconds: product.minimumSubscriptionInSeconds,
                                state: product.state,
                                ownerAddress: '', // owner address is not needed when creating
                            })
                                .onTransactionHash((hash) => {
                                    update(transactionStates.PENDING)
                                    done()
                                    dispatch(addTransaction(hash, transactionTypes.CREATE_CONTRACT_PRODUCT))
                                    postSetDeploying(product.id || '', hash)

                                    Activity.push({
                                        action: actionTypes.PUBLISH,
                                        txHash: hash,
                                        productId: product.id,
                                    })
                                })
                                .onTransactionComplete(() => {
                                    update(transactionStates.CONFIRMED)
                                })
                                .onError((error) => {
                                    update(transactionStates.FAILED, error)
                                    done()
                                })
                        } catch (e) {
                            update(transactionStates.FAILED, e)
                            done()
                        }

                        return null
                    },
                })
            } else {
                queue.add({
                    id: actionsTypes.PUBLISH_FREE,
                    handler: (update, done) => {
                        try {
                            return postDeployFree(product.id || '').then(() => {
                                update(transactionStates.CONFIRMED)
                                done()

                                Activity.push({
                                    action: actionTypes.PUBLISH,
                                    productId: product.id,
                                })
                            }, (error) => {
                                update(transactionStates.FAILED, error)
                                done()
                            })
                        } catch (e) {
                            update(transactionStates.FAILED, e)
                            done()
                        }

                        return null
                    },
                })
            }
        }

        // do a separate republish for products that have been at some point deployed
        // and we didn't do a contract update above
        if (nextMode === publishModes.REDEPLOY && !hasPriceChanged && contractProduct) {
            queue.add({
                id: actionsTypes.REDEPLOY_PAID,
                requireWeb3: true,
                requireOwner: contractProduct.ownerAddress,
                handler: (update, done) => {
                    try {
                        return redeployProduct(product.id || '')
                            .onTransactionHash((hash) => {
                                update(transactionStates.PENDING)
                                done()
                                dispatch(addTransaction(hash, transactionTypes.REDEPLOY_PRODUCT))
                                postSetDeploying(product.id || '', hash)

                                Activity.push({
                                    action: actionTypes.PUBLISH,
                                    txHash: hash,
                                    productId: product.id,
                                })
                            })
                            .onTransactionComplete(() => {
                                update(transactionStates.CONFIRMED)
                            })
                            .onError((error) => {
                                update(transactionStates.FAILED, error)
                                done()
                            })
                    } catch (e) {
                        update(transactionStates.FAILED, e)
                        done()
                    }

                    return null
                },
            })
        }

        // do unpublish
        if (nextMode === publishModes.UNPUBLISH) {
            if (contractProduct) {
                queue.add({
                    id: actionsTypes.UNDEPLOY_CONTRACT_PRODUCT,
                    requireWeb3: true,
                    requireOwner: contractProduct.ownerAddress,
                    handler: (update, done) => {
                        try {
                            return deleteProduct(product.id || '')
                                .onTransactionHash((hash) => {
                                    update(transactionStates.PENDING)
                                    done()
                                    dispatch(addTransaction(hash, transactionTypes.UNDEPLOY_PRODUCT))
                                    postSetUndeploying(product.id || '', hash)
                                })
                                .onTransactionComplete(() => {
                                    update(transactionStates.CONFIRMED)
                                })
                                .onError((error) => {
                                    update(transactionStates.FAILED, error)
                                    done()
                                })
                        } catch (e) {
                            update(transactionStates.FAILED, e)
                            done()
                        }

                        return null
                    },
                })
            } else {
                queue.add({
                    id: actionsTypes.UNPUBLISH_FREE,
                    handler: (update, done) => {
                        try {
                            return postUndeployFree(product.id || '').then(() => {
                                update(transactionStates.CONFIRMED)
                                done()

                                Activity.push({
                                    action: actionTypes.UNPUBLISH,
                                    productId: product.id,
                                })
                            }, (error) => {
                                update(transactionStates.FAILED, error)
                                done()
                            })
                        } catch (e) {
                            update(transactionStates.FAILED, e)
                            done()
                        }

                        return null
                    },
                })
            }
        }

        // finally update product data
        if (nextMode === publishModes.REPUBLISH) {
            queue.add({
                id: actionsTypes.PUBLISH_PENDING_CHANGES,
                handler: (update, done) => {
                    try {
                        return putProduct({
                            ...product,
                            ...productDataChanges,
                            pendingChanges: undefined,
                        }, product.id || '').then(() => {
                            update(transactionStates.CONFIRMED)
                            done()
                        }, (error) => {
                            update(transactionStates.FAILED, error)
                            done()
                        })
                    } catch (e) {
                        update(transactionStates.FAILED, e)
                        done()
                    }

                    return null
                },
            })
        }

        return {
            mode: nextMode,
            queue,
        }
    }, [dispatch])

    return useMemo(() => ({
        publish,
    }), [
        publish,
    ])
}
