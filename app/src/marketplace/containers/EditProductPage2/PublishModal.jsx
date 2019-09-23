// @flow

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { validateWeb3, getWeb3 } from '$shared/web3/web3Provider'

import type { Product } from '$mp/flowtype/product-types'
import { isPaidProduct } from '$mp/utils/product'
import { productStates, transactionStates, transactionTypes } from '$shared/utils/constants'
import useModal from '$shared/hooks/useModal'
import { getProductById } from '$mp/modules/product/services'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import { getAdminFee, setAdminFee } from '$mp/modules/communityProduct/services'
import { isUpdateContractProductRequired } from '$mp/utils/smartContract'

import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import Dialog from '$shared/components/Dialog'
import ReadyToPublishDialog from '$mp/components/Modal/ReadyToPublishDialog'
import ReadyToUnpublishDialog from '$mp/components/Modal/ReadyToUnpublishDialog'
import ConfirmPublishTransaction from '$mp/components/Modal/ConfirmPublishTransaction'
import { createContractProduct, updateContractProduct } from '$mp/modules/createContractProduct/services'
import { addTransaction } from '$mp/modules/transactions/actions'
import { postSetDeploying, postDeployFree, redeployProduct } from '$mp/modules/publish/services'
import { postSetUndeploying, postUndeployFree, deleteProduct } from '$mp/modules/unpublish/services'

import PublishQueue, { actionsTypes } from './publishQueue'

type Props = {
    product: Product,
    api: Object,
}

const modes = {
    REPUBLISH: 'republish', // live product update
    REDEPLOY: 'redeploy', // unpublished, but published at least once
    PUBLISH: 'publish', // unpublished, publish for the first time
    UNPUBLISH: 'unpublish',
    ERROR: 'error',
}

const steps = {
    CONFIRM: 'confirm',
    ACTIONS: 'actions',
    COMPLETE: 'complete',
}

const PublishOrUnpublishModal = ({ product, api }: Props) => {
    const queueRef = useRef(new PublishQueue())
    const dispatch = useDispatch()

    const [mode, setMode] = useState(null)
    const [step, setStep] = useState(steps.CONFIRM)
    const [currentAction, setCurrentAction] = useState(-1)
    const [status, setStatus] = useState({})
    const [modalError, setModalError] = useState(null)

    const setActionStatus = useCallback((name, s) => {
        setStatus((prevStatus) => ({
            ...prevStatus,
            [name]: s,
        }))
    }, [setStatus])

    const productId = product.id

    useEffect(() => {
        const queue = queueRef.current

        async function fetchProduct() {
            // load product
            const p: Product = await getProductById(productId || '')

            if (!p) {
                throw new Error('no product')
            }

            // load contract product
            let contractProduct
            try {
                contractProduct = await getProductFromContract(productId || '', true)
            } catch (e) {
                console.log(e)
            }

            let currentAdminFee
            try {
                currentAdminFee = await getAdminFee(p.beneficiaryAddress)
            } catch (e) {
                console.log(e)
            }

            const { state: productState } = p

            const { adminFee } = p.pendingChanges || {}
            const hasAdminFeeChanged = !!currentAdminFee && adminFee && currentAdminFee !== adminFee
            const hasPriceChanged = !!contractProduct && isUpdateContractProductRequired(contractProduct, p)
            const hasPendingChanges = hasAdminFeeChanged || hasPriceChanged

            let nextMode
            // is published and has pending changes?
            if (productState === productStates.DEPLOYED) {
                nextMode = hasPendingChanges ? modes.REPUBLISH : modes.UNPUBLISH
            } else if (productState === productStates.NOT_DEPLOYED) {
                nextMode = contractProduct ? modes.REDEPLOY : modes.PUBLISH
            } else {
                throw new Error('Invalid product state')
            }

            if ([modes.REPUBLISH, modes.REDEPLOY, modes.PUBLISH].includes(nextMode)) {
                if (adminFee && hasAdminFeeChanged) {
                    queue.add({
                        id: actionsTypes.UPDATE_ADMIN_FEE,
                        handler: (update, done) => (
                            setAdminFee(p.beneficiaryAddress, adminFee)
                                .onTransactionHash((hash) => {
                                    update(transactionStates.PENDING)
                                    done()
                                    dispatch(addTransaction(hash, transactionTypes.UPDATE_ADMIN_FEE))
                                })
                                .onTransactionComplete(() => {
                                    update(transactionStates.CONFIRMED)
                                })
                                .onError((error) => {
                                    done()
                                    update(transactionStates.FAILED, error)
                                })
                        ),
                    })
                }
            }

            if ([modes.REPUBLISH, modes.REDEPLOY].includes(nextMode)) {
                if (hasPriceChanged) {
                    queue.add({
                        id: actionsTypes.UPDATE_CONTRACT_PRODUCT,
                        handler: (update, done) => (
                            updateContractProduct({
                                ...contractProduct,
                                pricePerSecond: p.pricePerSecond,
                                beneficiaryAddress: p.beneficiaryAddress,
                                priceCurrency: p.priceCurrency,
                            })
                                .onTransactionHash((hash) => {
                                    update(transactionStates.PENDING)
                                    done()
                                    dispatch(addTransaction(hash, transactionTypes.UPDATE_CONTRACT_PRODUCT))
                                })
                                .onTransactionComplete(() => {
                                    update(transactionStates.CONFIRMED)
                                })
                                .onError((error) => {
                                    done()
                                    update(transactionStates.FAILED, error)
                                })
                        ),
                    })
                }
            }

            if (nextMode === modes.PUBLISH) {
                if (isPaidProduct(p)) {
                    queue.add({
                        id: actionsTypes.CREATE_CONTRACT_PRODUCT,
                        handler: (update, done) => (
                            createContractProduct({
                                id: p.id || '',
                                name: p.name,
                                ownerAddress: p.ownerAddress,
                                beneficiaryAddress: p.beneficiaryAddress,
                                pricePerSecond: p.pricePerSecond,
                                priceCurrency: p.priceCurrency,
                                minimumSubscriptionInSeconds: p.minimumSubscriptionInSeconds,
                                state: p.state,
                            })
                                .onTransactionHash((hash) => {
                                    update(transactionStates.PENDING)
                                    done()
                                    dispatch(addTransaction(hash, transactionTypes.CREATE_CONTRACT_PRODUCT))
                                    postSetDeploying(productId || '', hash)
                                })
                                .onTransactionComplete(() => {
                                    update(transactionStates.CONFIRMED)
                                })
                                .onError((error) => {
                                    update(transactionStates.FAILED, error)
                                    done()
                                })
                        ),
                    })
                } else {
                    queue.add({
                        id: actionsTypes.PUBLISH_FREE,
                        handler: (update, done) => (
                            postDeployFree(productId || '').then(() => {
                                update(transactionStates.CONFIRMED)
                                done()
                            }, (error) => {
                                update(transactionStates.FAILED, error)
                                done()
                            })
                        ),
                    })
                }
            }

            if (nextMode === modes.REDEPLOY) {
                queue.add({
                    id: actionsTypes.REDEPLOY_PAID,
                    handler: (update, done) => (
                        redeployProduct(productId || '')
                            .onTransactionHash((hash) => {
                                update(transactionStates.PENDING)
                                done()
                                dispatch(addTransaction(hash, transactionTypes.REDEPLOY_PRODUCT))
                                postSetDeploying(productId || '', hash)
                            })
                            .onTransactionComplete(() => {
                                update(transactionStates.CONFIRMED)
                            })
                            .onError((error) => {
                                update(transactionStates.FAILED, error)
                                done()
                            })
                    ),
                })
            }

            if (nextMode === modes.UNPUBLISH) {
                if (contractProduct) {
                    queue.add({
                        id: actionsTypes.UNDEPLOY_CONTRACT_PRODUCT,
                        handler: (update, done) => (
                            deleteProduct(productId || '')
                                .onTransactionHash((hash) => {
                                    update(transactionStates.PENDING)
                                    done()
                                    dispatch(addTransaction(hash, transactionTypes.UNDEPLOY_PRODUCT))
                                    postSetUndeploying(productId || '', hash)
                                })
                                .onTransactionComplete(() => {
                                    update(transactionStates.CONFIRMED)
                                })
                                .onError((error) => {
                                    update(transactionStates.FAILED, error)
                                    done()
                                })
                        ),
                    })
                } else {
                    queue.add({
                        id: actionsTypes.UNPUBLISH_FREE,
                        handler: (update, done) => (
                            postUndeployFree(productId || '').then(() => {
                                update(transactionStates.CONFIRMED)
                                done()
                            }, (error) => {
                                update(transactionStates.FAILED, error)
                                done()
                            })
                        ),
                    })
                }
            }

            if (queue.needsWeb3()) {
                await validateWeb3({
                    web3: getWeb3(),
                })
            }

            setMode(nextMode)
        }

        fetchProduct()
            .then(
                () => {
                    queue
                        .subscribe('started', (id) => {
                            setCurrentAction(id)
                            setActionStatus(id, transactionStates.STARTED)
                        })
                        .subscribe('status', (id, nextStatus) => {
                            setActionStatus(id, nextStatus)
                        })
                        .subscribe('ready', (id) => {
                            setCurrentAction((action) => (action === id ? null : action))
                        })
                        .subscribe('finish', () => {
                            setStep((currentStep) => (currentStep !== steps.COMPLETE ? steps.COMPLETE : currentStep))
                        })
                },
                (e) => {
                    setModalError(e)
                },
            )

        return () => {
            queue.unsubscribeAll()
        }
    }, [queueRef, setActionStatus, productId, dispatch])

    const onClose = useCallback(() => {
        api.close(false)
    }, [api])

    const currentStatus = useMemo(() => (currentAction && status[currentAction] ? status[currentAction] : undefined), [status, currentAction])
    const isApiCall = useMemo(() => [
        actionsTypes.UPDATE_ADMIN_FEE,
        actionsTypes.PUBLISH_FREE,
        actionsTypes.UNPUBLISH_FREE,
    ].includes(currentAction), [currentAction])

    const onConfirm = useCallback(() => {
        setStep(steps.ACTIONS)
        queueRef.current.start()
    }, [setStep])

    if (modalError) {
        return (
            <ErrorDialog
                message={modalError.message}
                onClose={onClose}
            />
        )
    }

    if (step === steps.CONFIRM) {
        if (!mode) {
            return (
                <Dialog
                    waiting
                    onClose={onClose}
                />
            )
        }

        if (mode === modes.UNPUBLISH) {
            return (
                <ReadyToUnpublishDialog onUnpublish={onConfirm} onCancel={onClose} />
            )
        }

        return (
            <ReadyToPublishDialog
                onPublish={onConfirm}
                onCancel={onClose}
            />
        )
    } else if (step === steps.ACTIONS) {
        return (
            <ConfirmPublishTransaction
                waiting={!currentAction || isApiCall}
                publishState={currentStatus}
                onCancel={onClose}
            />
        )
    } else if (step === steps.COMPLETE) {
        return (
            <Dialog
                title="result"
                onClose={onClose}
            >
                {Object.keys(status).map((key) => (
                    <div key={key}>{key}: {status[key]}</div>
                ))}
            </Dialog>
        )
    }

    return (
        <ErrorDialog
            message="error.message"
            onClose={onClose}
        />
    )
}

export default () => {
    const { isOpen, api, value } = useModal('publish')

    if (!isOpen) {
        return null
    }

    const { product } = value || {}

    return (
        <PublishOrUnpublishModal
            product={product}
            api={api}
        />
    )
}
