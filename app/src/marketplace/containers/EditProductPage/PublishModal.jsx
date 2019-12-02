// @flow

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import type { Product } from '$mp/flowtype/product-types'
import { isPaidProduct } from '$mp/utils/product'
import { productStates, transactionStates, transactionTypes } from '$shared/utils/constants'
import useModal from '$shared/hooks/useModal'
import { getProductById } from '$mp/modules/product/services'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import { getCommunityOwner, getAdminFee, setAdminFee } from '$mp/modules/communityProduct/services'
import { areAddressesEqual, isUpdateContractProductRequired } from '$mp/utils/smartContract'
import { putProduct } from '$mp/modules/deprecated/editProduct/services'

import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import Dialog from '$shared/components/Dialog'
import ReadyToPublishDialog from '$mp/components/Modal/ReadyToPublishDialog'
import ReadyToUnpublishDialog from '$mp/components/Modal/ReadyToUnpublishDialog'
import ConfirmPublishTransaction from '$mp/components/Modal/ConfirmPublishTransaction'
import CompletePublishTransaction from '$mp/components/Modal/CompletePublishTransaction'
import Web3ErrorDialog from '$shared/components/Web3ErrorDialog'
import { createContractProduct, updateContractProduct } from '$mp/modules/createContractProduct/services'
import { addTransaction } from '$mp/modules/transactions/actions'
import { postSetDeploying, postDeployFree, redeployProduct } from '$mp/modules/publish/services'
import { postSetUndeploying, postUndeployFree, deleteProduct } from '$mp/modules/unpublish/services'
import useWeb3Status from '$shared/hooks/useWeb3Status'
import UnlockWalletDialog from '$mp/components/Modal/UnlockWalletDialog'

import PublishQueue, { actionsTypes } from './publishQueue'
import { getPendingChanges, withPendingChanges } from './state'

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
    const [currentAction, setCurrentAction] = useState(null)
    const [status, setStatus] = useState({})
    const [modalError, setModalError] = useState(null)
    const [requireWeb3, setRequireWeb3] = useState(false)
    const [requiredOwner, setRequiredOwner] = useState(null)
    const { web3Error, checkingWeb3, account } = useWeb3Status(requireWeb3)
    const accountRef = useRef()
    accountRef.current = account

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
                // don't need to do anything with this error necessarily,
                // it just means that the product wasn't deployed
            }

            let currentAdminFee
            let communityOwner
            try {
                currentAdminFee = await getAdminFee(p.beneficiaryAddress)
                communityOwner = await getCommunityOwner(p.beneficiaryAddress)
            } catch (e) {
                // ignore error, assume contract has not been deployed
            }

            const { state: productState } = p

            const pendingChanges = getPendingChanges(p)
            const productWithPendingChagnes = withPendingChanges(p)
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
                nextMode = hasPendingChanges ? modes.REPUBLISH : modes.UNPUBLISH
            } else if (productState === productStates.NOT_DEPLOYED) {
                nextMode = contractProduct ? modes.REDEPLOY : modes.PUBLISH
            } else {
                // product is either being deployed to contract or being undeployed
                throw new Error('Invalid product state')
            }

            let requireOwner = null

            // update admin fee if it has changed
            if ([modes.REPUBLISH, modes.REDEPLOY, modes.PUBLISH].includes(nextMode)) {
                if (adminFee && hasAdminFeeChanged) {
                    requireOwner = communityOwner

                    queue.add({
                        id: actionsTypes.UPDATE_ADMIN_FEE,
                        handler: (update, done) => (
                            setAdminFee(p.beneficiaryAddress, adminFee)
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
                        ),
                    })
                }
            }

            // update price, currency & beneficiary if changed
            if ([modes.REPUBLISH, modes.REDEPLOY].includes(nextMode)) {
                if (hasPriceChanged && contractProduct) {
                    requireOwner = contractProduct.ownerAddress

                    queue.add({
                        id: actionsTypes.UPDATE_CONTRACT_PRODUCT,
                        handler: (update, done) => (
                            updateContractProduct({
                                ...contractProduct,
                                pricePerSecond: pricePerSecond || p.pricePerSecond,
                                beneficiaryAddress: beneficiaryAddress || p.beneficiaryAddress,
                                priceCurrency: priceCurrency || p.priceCurrency,
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

            // do the actual publish action
            if (nextMode === modes.PUBLISH) {
                if (isPaidProduct(p)) {
                    // TODO: figure out a better to detect if deploying community for the first time
                    // force community product to be published by the same account as the community
                    if (communityOwner) {
                        requireOwner = communityOwner
                    }

                    queue.add({
                        id: actionsTypes.CREATE_CONTRACT_PRODUCT,
                        handler: (update, done) => (
                            createContractProduct({
                                id: p.id || '',
                                name: p.name,
                                ownerAddress: accountRef.current || '',
                                beneficiaryAddress: p.beneficiaryAddress,
                                pricePerSecond: p.pricePerSecond,
                                priceCurrency: p.priceCurrency,
                                minimumSubscriptionInSeconds: p.minimumSubscriptionInSeconds,
                                requiresWhitelist: false,
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

            // do republish for products that have been at some point deployed
            if (nextMode === modes.REDEPLOY) {
                // $FlowFixMe
                requireOwner = contractProduct.ownerAddress

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

            // do unpublish
            if (nextMode === modes.UNPUBLISH) {
                if (contractProduct) {
                    requireOwner = contractProduct.ownerAddress
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

            // finally update product data
            if (nextMode === modes.REPUBLISH) {
                queue.add({
                    id: actionsTypes.PUBLISH_PENDING_CHANGES,
                    handler: (update, done) => (
                        putProduct({
                            ...p,
                            ...productDataChanges,
                            pendingChanges: undefined,
                        }, p.id || '').then(() => {
                            update(transactionStates.CONFIRMED)
                            done()
                        }, (error) => {
                            update(transactionStates.FAILED, error)
                            done()
                        })
                    ),
                })
            }

            // validate metamask based on queued actions
            setRequireWeb3(queue.needsWeb3())
            setRequiredOwner(requireOwner)
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
    }, [queueRef, setActionStatus, productId, dispatch, accountRef])

    const onClose = useCallback(() => {
        api.close(false)
    }, [api])

    const currentStatus = useMemo(() => (currentAction && status[currentAction] ? status[currentAction] : undefined), [status, currentAction])

    const onConfirm = useCallback(() => {
        setStep(steps.ACTIONS)
        queueRef.current.start()
    }, [setStep])

    if (!!requireWeb3 && (checkingWeb3 || web3Error)) {
        return (
            <Web3ErrorDialog
                waiting={checkingWeb3}
                onClose={onClose}
                error={web3Error}
            />
        )
    }

    if (!!requireWeb3 && !!requiredOwner && (!account || !areAddressesEqual(account, requiredOwner))) {
        return (
            <UnlockWalletDialog
                onClose={onClose}
                message={I18n.t('unlockWalletDialog.message', {
                    address: requiredOwner,
                })}
            />
        )
    }

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

        const ConfirmComponent = (mode === modes.UNPUBLISH) ? ReadyToUnpublishDialog : ReadyToPublishDialog

        return (
            <ConfirmComponent
                onContinue={onConfirm}
                onCancel={onClose}
            />
        )
    } else if (step === steps.ACTIONS) {
        return (
            <ConfirmPublishTransaction
                isUnpublish={mode === modes.UNPUBLISH}
                action={currentAction}
                waiting={!currentAction}
                publishState={currentStatus}
                onCancel={onClose}
            />
        )
    } else if (step === steps.COMPLETE) {
        return (
            <CompletePublishTransaction
                isUnpublish={mode === modes.UNPUBLISH}
                status={status}
                onCancel={onClose}
            />
        )
    }

    return null
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
