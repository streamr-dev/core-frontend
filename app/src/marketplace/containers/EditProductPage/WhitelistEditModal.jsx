// @flow

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Translate } from 'react-redux-i18n'

import useModal from '$shared/hooks/useModal'
import useWeb3Status from '$shared/hooks/useWeb3Status'
import Web3ErrorDialog from '$shared/components/Web3ErrorDialog'
import UnlockWalletDialog from '$shared/components/Web3ErrorDialog/UnlockWalletDialog'
import { areAddressesEqual } from '$mp/utils/smartContract'
import usePending from '$shared/hooks/usePending'
import { transactionStates } from '$shared/utils/constants'
import type { Address } from '$shared/flowtype/web3-types'
import type { ProductId } from '$mp/flowtype/product-types'
import { getProductFromContract } from '$mp/modules/contractProduct/services'

import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import AddWhitelistedAddressDialog from '$mp/components/Modal/AddWhitelistedAddressDialog'
import RemoveWhitelistedAddressDialog from '$mp/components/Modal/RemoveWhitelistedAddressDialog'
import WhitelistEditProgressDialog from '$mp/components/Modal/WhitelistEditProgressDialog'
import WhitelistEditErrorDialog from '$mp/components/Modal/WhitelistEditErrorDialog'

import useUpdateWhitelist, { actionsTypes } from './useUpdateWhitelist'

export type AddModalProps = {
    onClose: () => void,
    onSave: (string) => void,
    requiredOwner: string,
}

type Props = {
    productId: ProductId,
    removedAddress: Address,
    api: Object,
}

export const AddOrRemoveWhitelistAddress = ({ productId, removedAddress, api }: Props) => {
    const { updateWhitelist } = useUpdateWhitelist()

    const [queue, setQueue] = useState(undefined)
    const [contractProduct, setContractProduct] = useState(undefined)
    const [started, setStarted] = useState(false)
    const [finished, setFinished] = useState(false)
    const [currentAction, setCurrentAction] = useState(undefined)
    const [status, setStatus] = useState({})
    const statusRef = useRef(status)
    statusRef.current = status
    const [modalError, setModalError] = useState(null)
    const [web3Actions, setWeb3Actions] = useState(new Set([]))
    const { web3Error, checkingWeb3, account } = useWeb3Status()
    const { isPending, start: startPending, end: endPending } = usePending('product.WHITELIST')

    const { ownerAddress, requiresWhitelist } = contractProduct || {}

    const setActionStatus = useCallback((name, s) => {
        setStatus((prevStatus) => ({
            ...prevStatus,
            [name]: s,
        }))
    }, [setStatus])

    useEffect(() => {
        try {
            startPending()

            if (!productId) {
                throw new Error('No product id')
            }

            getProductFromContract(productId)
                .then(
                    (nextContractProduct) => {
                        setContractProduct(nextContractProduct)
                    },
                    (e) => {
                        setModalError(e)
                    },
                )
        } catch (e) {
            setModalError(e)
        } finally {
            endPending()
        }
    }, [productId, startPending, endPending])

    useEffect(() => {
        if (!queue) { return () => {} }

        setStatus(queue.getActions().reduce((result, { id }) => ({
            ...result,
            [id]: transactionStates.STARTED,
        }), {}))
        setWeb3Actions(new Set(queue.getActions().map(({ id }) => id)))

        queue
            .subscribe('started', (id) => {
                setCurrentAction(id)
            })
            .subscribe('status', (id, nextStatus) => {
                setActionStatus(id, nextStatus)
            })

        return () => {
            queue.unsubscribeAll()
        }
    }, [setActionStatus, queue])

    const somePending = useMemo(() => Object.values(status).some((value) => (
        value !== transactionStates.CONFIRMED && value !== transactionStates.FAILED
    )), [status])
    const allSucceeded = useMemo(() => Object.values(status).every((value) => (
        value === transactionStates.CONFIRMED
    )), [status])

    useEffect(() => {
        if (!started || !allSucceeded) { return }

        setTimeout(() => {
            setFinished(true)
        }, 500)
    }, [started, allSucceeded])

    const onClose = useCallback(() => {
        const didEnableWhitelist = !!(
            !!statusRef.current &&
            !!statusRef.current[actionsTypes.SET_REQUIRES_WHITELIST] &&
            statusRef.current[actionsTypes.SET_REQUIRES_WHITELIST] === transactionStates.CONFIRMED
        )

        api.close({
            didEnableWhitelist,
        })
    }, [api])

    useEffect(() => {
        if (finished) {
            onClose()
        }
    }, [finished, onClose])

    const onStart = useCallback(async (address: Address, remove = false) => {
        try {
            const nextQueue = await updateWhitelist({
                productId,
                setWhitelist: !requiresWhitelist,
                addresses: [{
                    address,
                    remove,
                }],
            })
            setQueue(nextQueue)
            setStarted(true)
            nextQueue.start()
        } catch (e) {
            setModalError(e)
        }
    }, [productId, updateWhitelist, requiresWhitelist])

    if (web3Error) {
        return (
            <Web3ErrorDialog
                onClose={onClose}
                error={web3Error}
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

    if (!checkingWeb3 && (!account || !areAddressesEqual(account, ownerAddress))) {
        return (
            <UnlockWalletDialog onClose={onClose} requiredAddress={ownerAddress}>
                <Translate
                    value="unlockWalletDialog.message"
                    tag="p"
                />
            </UnlockWalletDialog>
        )
    }

    if (!started && !!removedAddress) {
        return (
            <RemoveWhitelistedAddressDialog
                disabled={checkingWeb3 || isPending}
                onContinue={() => onStart(removedAddress, true)}
                onClose={onClose}
            />
        )
    } else if (!started) {
        return (
            <AddWhitelistedAddressDialog
                disabled={checkingWeb3 || isPending}
                onContinue={(addedAddress) => onStart(addedAddress)}
                onClose={onClose}
            />
        )
    } else if (somePending || allSucceeded) {
        return (
            <WhitelistEditProgressDialog
                status={status}
                onClose={onClose}
                isPrompted={web3Actions.has(currentAction) && currentAction && status[currentAction] === transactionStates.STARTED}
            />
        )
    }

    return (
        <WhitelistEditErrorDialog
            status={status}
            onClose={onClose}
        />
    )
}

export default () => {
    const { isOpen, api, value } = useModal('whitelistEdit')

    if (!isOpen) {
        return null
    }

    const { productId, removedAddress } = value || {}

    return (
        <AddOrRemoveWhitelistAddress
            productId={productId}
            removedAddress={removedAddress}
            api={api}
        />
    )
}
