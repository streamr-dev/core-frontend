// @flow

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Translate } from 'react-redux-i18n'

import type { Product } from '$mp/flowtype/product-types'
import { transactionStates } from '$shared/utils/constants'
import useModal from '$shared/hooks/useModal'
import { getProductById } from '$mp/modules/product/services'
import { areAddressesEqual } from '$mp/utils/smartContract'

import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import Dialog from '$shared/components/Dialog'
import ReadyToPublishDialog from '$mp/components/Modal/ReadyToPublishDialog'
import ReadyToUnpublishDialog from '$mp/components/Modal/ReadyToUnpublishDialog'
import PublishTransactionProgress from '$mp/components/Modal/PublishTransactionProgress'
import Web3ErrorDialog from '$shared/components/Web3ErrorDialog'
import useWeb3Status from '$shared/hooks/useWeb3Status'
import UnlockWalletDialog from '$shared/components/Web3ErrorDialog/UnlockWalletDialog'
import usePublish from './usePublish'

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

export const PublishOrUnpublishModal = ({ product, api }: Props) => {
    const { publish } = usePublish()
    const publishRef = useRef(publish)
    publishRef.current = publish

    const [queue, setQueue] = useState(undefined)
    const [mode, setMode] = useState(null)
    const [step, setStep] = useState(steps.CONFIRM)
    const [currentAction, setCurrentAction] = useState(undefined)
    const [status, setStatus] = useState({})
    const [modalError, setModalError] = useState(null)
    const [requireWeb3, setRequireWeb3] = useState(false)
    const [requiredOwner, setRequiredOwner] = useState(null)
    const { web3Error, checkingWeb3, account } = useWeb3Status(requireWeb3)

    const setActionStatus = useCallback((name, s) => {
        setStatus((prevStatus) => ({
            ...prevStatus,
            [name]: s,
        }))
    }, [setStatus])

    const productId = product.id

    useEffect(() => {
        if (!productId || !publishRef.current) { return }

        try {
            getProductById(productId || '')
                .then(publishRef.current)
                .then(
                    ({ queue: nextQueue, mode: nextMode }) => {
                        setMode(nextMode)
                        setQueue(nextQueue)
                    },
                    (e) => {
                        setModalError(e)
                    },
                )
        } catch (e) {
            setModalError(e)
        }
    }, [productId])

    useEffect(() => {
        if (!queue) { return () => {} }

        const owners = queue.needsOwner()
        // validate metamask based on queued actions
        setRequireWeb3(queue.needsWeb3())
        setRequiredOwner(owners && owners.length > 0 && owners[0])

        queue
            .subscribe('started', (id) => {
                setCurrentAction(id)
                setActionStatus(id, transactionStates.STARTED)
            })
            .subscribe('status', (id, nextStatus) => {
                setActionStatus(id, nextStatus)
            })
            .subscribe('finish', () => {
                setStep((currentStep) => (currentStep !== steps.COMPLETE ? steps.COMPLETE : currentStep))
            })

        return () => {
            queue.unsubscribeAll()
        }
    }, [setActionStatus, queue])

    const onClose = useCallback(() => {
        api.close([steps.ACTIONS, steps.COMPLETE].includes(step))
    }, [api, step])

    const currentStatus = useMemo(() => (currentAction && status[currentAction] ? status[currentAction] : undefined), [status, currentAction])

    const onConfirm = useCallback(() => {
        setStep(steps.ACTIONS)
        if (queue) {
            queue.start()
        }
    }, [queue, setStep])

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
            <UnlockWalletDialog onClose={onClose} requiredAddress={requiredOwner}>
                <Translate
                    value="unlockWalletDialog.message"
                    tag="p"
                />
            </UnlockWalletDialog>
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
            <PublishTransactionProgress
                isUnpublish={mode === modes.UNPUBLISH}
                status={status}
                onCancel={onClose}
                activeTask={currentAction}
            />
        )
    } else if (step === steps.COMPLETE) {
        return (
            <PublishTransactionProgress
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
