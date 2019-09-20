// @flow

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import EventEmitter from 'events'
import { useDispatch } from 'react-redux'

import type { Product } from '$mp/flowtype/product-types'
// import { isPaidProduct } from '$mp/utils/product'
import { productStates, transactionStates, transactionTypes } from '$shared/utils/constants'
import useModal from '$shared/hooks/useModal'
import { getProductById } from '$mp/modules/product/services'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import { isUpdateContractProductRequired } from '$mp/utils/smartContract'

import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import Dialog from '$shared/components/Dialog'
import ReadyToPublishDialog from '$mp/components/Modal/ReadyToPublishDialog'
import ReadyToUnpublishDialog from '$mp/components/Modal/ReadyToUnpublishDialog'
import ConfirmPublishTransaction from '$mp/components/Modal/ConfirmPublishTransaction'
import { updateContractProduct } from '$mp/modules/createContractProduct/services'
import { addTransaction } from '$mp/modules/transactions/actions'

/* const steps = {
    INITIAL: 'initial',
} */

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

const actionsTypes = {
    UPDATE_ADMIN_FEE: 'updateAdminFee',
    UPDATE_CONTRACT_PRODUCT: 'updateContractProduct',
    PUBLISH_PAID: 'publishPaid',
    PUBLISH_FREE: 'publishFree',
    UNDEPLOY_CONTRACT_PRODUCT: 'undeployContractProduct',
    UNPUBLISH_FREE: 'unpublishFree',
}

/*
const delayed = (delay) => (
    new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, delay)
    })
)
*/

function delayed(t) {
    return new Promise((resolve) => {
        setTimeout(resolve, t)
    })
}

class Queue {
    emitter = new EventEmitter()
    actions = []

    subscribe(event, handler) {
        this.emitter.on(event, handler)

        return this
    }

    unsubscribeAll() {
        this.emitter.removeAllListeners()

        return this
    }

    add(action) {
        this.actions.push(action)
    }

    startAction(id, nextAction) {
        return new Promise((resolve) => {
            const update = (...args) => this.emitter.emit('status', ...args)
            const done = (...args) => {
                this.emitter.emit('ready', ...args)
                resolve()
            }
            return nextAction.call(
                null,
                update.bind(this, id),
                done.bind(this, id),
            )
        })
    }

    async start() {
        for (let i = 0; i < this.actions.length; i += 1) {
            const { id, handler } = this.actions[i]

            this.emitter.emit('started', id)

            // eslint-disable-next-line no-await-in-loop
            await this.startAction(id, handler)
        }

        this.emitter.emit('finish')
    }
}

const PublishOrUnpublishModal = ({ product, api }: Props) => {
    const queueRef = useRef(new Queue())
    const dispatch = useDispatch()

    const [mode, setMode] = useState(null)
    const [step, setStep] = useState(steps.CONFIRM)
    const [currentAction, setCurrentAction] = useState(-1)
    const [status, setStatus] = useState({})

    const setActionStatus = useCallback((name, s) => {
        setStatus((prevStatus) => ({
            ...prevStatus,
            [name]: s,
        }))
    }, [setStatus])

    const productId = product.id

    useEffect(() => {
        const queue = queueRef.current
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

        async function fetchProduct() {
            // load product
            // $FlowFixMe
            const p = await getProductById(productId || '')

            if (!p) {
                // throw error
            }

            // load contract product
            let contractProduct
            try {
                contractProduct = await getProductFromContract(productId || '', true)
            } catch (e) {
                // no contract product
            }

            const community = null

            const { state: productState } = p

            const { adminFee } = p.pendingChanges || {}
            const hasAdminFeeChanged = !!community && (community.adminFee !== adminFee)
            // $FlowFixMe
            const hasPriceChanged = !!contractProduct && isUpdateContractProductRequired(contractProduct, p)
            const hasPendingChanges = hasAdminFeeChanged || hasPriceChanged

            let nextMode
            // is published and has pending changes?
            if (productState === productStates.DEPLOYED) {
                nextMode = hasPendingChanges ? modes.REPUBLISH : modes.UNPUBLISH
            } else if (productState === productStates.NOT_DEPLOYED) {
                nextMode = contractProduct ? modes.REDEPLOY : modes.PUBLISH
            } else {
                nextMode = modes.ERROR
            }

            queue.add({
                id: actionsTypes.UPDATE_ADMIN_FEE,
                handler: (update, done) => {
                    delayed(2000)
                        .then(() => {
                            update(transactionStates.CONFIRMED)
                            done()
                        })
                },
            })

            queue.add({
                id: actionsTypes.UPDATE_CONTRACT_PRODUCT,
                handler: (update, done) => (
                    updateContractProduct({
                        ...p,
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

            /*
            if ([modes.REPUBLISH, modes.REDEPLOY, modes.PUBLISH].includes(nextMode)) {
                if (community && community.adminFee !== adminFee) {
                    queue.add({
                        id: actionsTypes.UPDATE_ADMIN_FEE,
                        handler: (update, done) => {
                            delayed(200)
                                .then(() => {
                                    update(transactionStates.CONFIRMED)
                                    done()
                                })
                        },
                    })
                }
            }

            if ([modes.REPUBLISH, modes.REDEPLOY].includes(nextMode)) {
                if (hasPriceChanged) {
                    queue.add(actionsTypes.UPDATE_CONTRACT_PRODUCT)
                }
            }

            if ([modes.REDEPLOY, modes.PUBLISH].includes(nextMode)) {
                if (isPaidProduct(p)) {
                    queue.add(actionsTypes.PUBLISH_PAID)
                } else {
                    queue.add(actionsTypes.PUBLISH_FREE)
                }
            }

            if (nextMode === modes.UNPUBLISH) {
                if (contractProduct) {
                    queue.add(actionsTypes.UNDEPLOY_CONTRACT_PRODUCT)
                } else {
                    queue.add(actionsTypes.UNPUBLISH_FREE)
                }
            }
            */

            setMode(nextMode)
        }

        fetchProduct()

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

    /*
    const isPaid =
    const isCommunity =
    const isPublished =
    const isDeployed = */

    // if community, check required members

    /* useEffect(() => {
        await loadProduct
        await loadContractProduct
        await loadCommunity
    }, []) */

    return (
        <PublishOrUnpublishModal
            product={product}
            api={api}
        />
    )
}
