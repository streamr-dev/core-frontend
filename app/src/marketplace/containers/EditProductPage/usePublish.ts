import { $Values } from 'utility-types'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import BN from 'bignumber.js'
import { useClient } from 'streamr-client-react'
import type { Project, SmartContractProduct } from '$mp/types/project-types'
import { transactionStates, transactionTypes } from '$shared/utils/constants'
import {
    getProductFromContract,
    createContractProduct,
    updateContractProduct,
    deleteProduct,
    redeployProduct,
    setRequiresWhitelist,
} from '$mp/modules/contractProduct/services'
import { putProduct, postUndeployFree, postSetUndeploying, postDeployFree, postSetDeploying } from '$mp/modules/product/services'
import { getDataUnionOwner, setAdminFee } from '$mp/modules/dataUnion/services'
import ActionQueue from '$mp/utils/actionQueue'
import { isPaidProject } from '$mp/utils/product'
import { addTransaction } from '$mp/modules/transactions/actions'
import Activity, { actionTypes, resourceTypes } from '$shared/utils/Activity'
import { getChainIdFromApiString } from '$shared/utils/chains'
import { getCustomTokenDecimals } from '$mp/utils/web3'
import { calculatePendingChanges, getNextMode, PublishMode } from './usePendingChanges'

export const actionsTypes = {
    UPDATE_ADMIN_FEE: 'updateAdminFee',
    UPDATE_CONTRACT_PRODUCT: 'updateContractProduct',
    CREATE_CONTRACT_PRODUCT: 'createContractProduct',
    REDEPLOY_PAID: 'publishPaid',
    UNDEPLOY_CONTRACT_PRODUCT: 'undeployContractProduct',
    PUBLISH_FREE: 'publishFree',
    UNPUBLISH_FREE: 'unpublishFree',
    PUBLISH_PENDING_CHANGES: 'publishPendingChanges',
    SET_REQUIRES_WHITELIST: 'setRequiresWhitelist',
}

export default function usePublish() {
    const dispatch = useDispatch()
    const client = useClient()
    return useCallback(
        async (product: Project) => {
            if (!product) {
                throw new Error('no product')
            }

            const chainId = getChainIdFromApiString(product.chain)

            // Load contract product
            let contractProduct: SmartContractProduct

            try {
                contractProduct = await getProductFromContract(product.id || '', true, chainId)
            } catch (e) {
                // don't need to do anything with this error necessarily,
                // it just means that the product wasn't deployed
            }

            // Load Data Union owner
            let dataUnionOwner

            try {
                dataUnionOwner = await getDataUnionOwner(product.beneficiaryAddress, chainId)
            } catch (e) {
                // ignore error, assume contract has not been deployed
            }

            const { state: productState } = product

            const {
                hasPendingChanges,
                hasAdminFeeChanged,
                hasContractProductChanged,
                adminFee,
                pricePerSecond,
                beneficiaryAddress,
                priceCurrency,
                requiresWhitelist,
                pricingTokenAddress,
                productDataChanges,
            } = await calculatePendingChanges(product, contractProduct, chainId)

            let pricingTokenDecimals: number | BN = 18
            if (pricingTokenAddress || (contractProduct && contractProduct.pricingTokenAddress)) {
                const address = pricingTokenAddress || (contractProduct && contractProduct.pricingTokenAddress)
                pricingTokenDecimals = await getCustomTokenDecimals(address, chainId)
            }

            const nextMode = getNextMode(productState, contractProduct, hasPendingChanges)
            if (nextMode === PublishMode.ERROR) {
                throw new Error('Invalid product state')
            }

            const queue = new ActionQueue()

            // update product data if needed
            if (nextMode === PublishMode.REPUBLISH || (nextMode === PublishMode.PUBLISH && Object.keys(productDataChanges).length > 0)) {
                const nextProduct = { ...product, ...productDataChanges, pendingChanges: undefined as any }
                delete nextProduct.state
                queue.add({
                    id: actionsTypes.PUBLISH_PENDING_CHANGES,
                    handler: async (update, done) => {
                        try {
                            // Get all streams and verify that the added streams actually exist,
                            // otherwise the product update will fail
                            const gen = client.searchStreams(undefined, {
                                user: await client.getAddress(),
                                allowPublic: false,
                            })
                            const streams = []

                            // eslint-disable-next-line no-restricted-syntax
                            for await (const stream of gen) {
                                streams.push(stream)
                            }

                            const streamIds = new Set(streams.map(({ id }) => id))
                            nextProduct.streams = (nextProduct.streams || []).filter((id) => streamIds.has(id))
                            await putProduct(nextProduct, product.id || '')
                            update(transactionStates.CONFIRMED)
                            done()
                        } catch (e) {
                            update(transactionStates.FAILED, e)
                            done()
                        }

                        return null
                    },
                })
            }

            // update admin fee if it has changed
            if ([PublishMode.REPUBLISH, PublishMode.REDEPLOY, PublishMode.PUBLISH].includes(nextMode)) {
                if (adminFee && hasAdminFeeChanged) {
                    queue.add({
                        id: actionsTypes.UPDATE_ADMIN_FEE,
                        requireWeb3: true,
                        requireOwner: dataUnionOwner,
                        handler: (update, done) => {
                            try {
                                return setAdminFee(product.beneficiaryAddress, chainId, adminFee)
                                    .onTransactionHash((hash) => {
                                        update(transactionStates.PENDING)

                                        if (hash) {
                                            dispatch(addTransaction(hash, transactionTypes.UPDATE_ADMIN_FEE))
                                        }

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

            // update price, currency & beneficiary if changed
            if ([PublishMode.REPUBLISH, PublishMode.REDEPLOY].includes(nextMode)) {
                if (hasContractProductChanged && contractProduct) {
                    const isRedeploy = !!(nextMode === PublishMode.REDEPLOY)
                    queue.add({
                        id: actionsTypes.UPDATE_CONTRACT_PRODUCT,
                        requireWeb3: true,
                        requireOwner: contractProduct.ownerAddress,
                        handler: (update, done) => {
                            if (!contractProduct) {
                                return null
                            }

                            try {
                                return updateContractProduct(
                                    {
                                        ...contractProduct,
                                        pricePerSecond: pricePerSecond || contractProduct.pricePerSecond,
                                        beneficiaryAddress: beneficiaryAddress || product.beneficiaryAddress,
                                        priceCurrency: priceCurrency || product.priceCurrency,
                                        chainId,
                                        pricingTokenAddress: pricingTokenAddress || contractProduct.pricingTokenAddress,
                                        pricingTokenDecimals,
                                    } as any,
                                    isRedeploy,
                                )
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
                                            resourceId: product.id,
                                            resourceType: resourceTypes.PRODUCT,
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
            if (nextMode === PublishMode.PUBLISH) {
                if (isPaidProject(product)) {
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
                                    ownerAddress: '',
                                    // owner address is not needed when creating
                                    requiresWhitelist,
                                    chainId,
                                    pricingTokenAddress,
                                    pricingTokenDecimals: pricingTokenDecimals,
                                } as any)
                                    .onTransactionHash((hash) => {
                                        update(transactionStates.PENDING)
                                        done()
                                        dispatch(addTransaction(hash, transactionTypes.CREATE_CONTRACT_PRODUCT))
                                        postSetDeploying(product.id || '', hash)
                                        Activity.push({
                                            action: actionTypes.PUBLISH,
                                            txHash: hash,
                                            resourceId: product.id,
                                            resourceType: resourceTypes.PRODUCT,
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
                                return postDeployFree(product.id || '').then(
                                    () => {
                                        update(transactionStates.CONFIRMED)
                                        done()
                                        Activity.push({
                                            action: actionTypes.PUBLISH,
                                            resourceId: product.id,
                                            resourceType: resourceTypes.PRODUCT,
                                        })
                                    },
                                    (error) => {
                                        update(transactionStates.FAILED, error)
                                        done()
                                    },
                                )
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
            if (nextMode === PublishMode.REDEPLOY && !hasContractProductChanged && contractProduct) {
                queue.add({
                    id: actionsTypes.REDEPLOY_PAID,
                    requireWeb3: true,
                    requireOwner: contractProduct.ownerAddress,
                    handler: (update, done) => {
                        try {
                            return redeployProduct(product.id || '', chainId)
                                .onTransactionHash((hash) => {
                                    update(transactionStates.PENDING)
                                    done()
                                    dispatch(addTransaction(hash, transactionTypes.REDEPLOY_PRODUCT))
                                    postSetDeploying(product.id || '', hash)
                                    Activity.push({
                                        action: actionTypes.PUBLISH,
                                        txHash: hash,
                                        resourceId: product.id,
                                        resourceType: resourceTypes.PRODUCT,
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
            if (nextMode === PublishMode.UNPUBLISH) {
                if (contractProduct) {
                    queue.add({
                        id: actionsTypes.UNDEPLOY_CONTRACT_PRODUCT,
                        requireWeb3: true,
                        requireOwner: contractProduct.ownerAddress,
                        handler: (update, done) => {
                            try {
                                return deleteProduct(product.id || '', chainId)
                                    .onTransactionHash((hash) => {
                                        update(transactionStates.PENDING)
                                        done()
                                        dispatch(addTransaction(hash, transactionTypes.UNDEPLOY_PRODUCT))
                                        postSetUndeploying(product.id || '', hash)
                                        Activity.push({
                                            action: actionTypes.UNPUBLISH,
                                            resourceId: product.id,
                                            resourceType: resourceTypes.PRODUCT,
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
                        id: actionsTypes.UNPUBLISH_FREE,
                        handler: (update, done) => {
                            try {
                                return postUndeployFree(product.id || '').then(
                                    () => {
                                        update(transactionStates.CONFIRMED)
                                        done()
                                        Activity.push({
                                            action: actionTypes.UNPUBLISH,
                                            resourceId: product.id,
                                            resourceType: resourceTypes.PRODUCT,
                                        })
                                    },
                                    (error) => {
                                        update(transactionStates.FAILED, error)
                                        done()
                                    },
                                )
                            } catch (e) {
                                update(transactionStates.FAILED, e)
                                done()
                            }

                            return null
                        },
                    })
                }
            }

            return {
                mode: nextMode,
                queue,
            }
        },
        [client, dispatch],
    )
}
