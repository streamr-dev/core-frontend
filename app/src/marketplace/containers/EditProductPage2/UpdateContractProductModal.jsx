// @flow

import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import { transactionStates } from '$shared/utils/constants'
import SaveContractProductDialogComponent from '$mp/components/Modal/SaveContractProductDialog'
import withWeb3 from '$shared/utils/withWeb3'
import { updateContractProduct, resetUpdateContractProductTransaction } from '$mp/modules/updateContractProduct/actions'
import { selectUpdateProductTransaction, selectUpdateContractProductError } from '$mp/modules/updateContractProduct/selectors'
import useIsMounted from '$shared/hooks/useIsMounted'
import UnlockWalletDialog from '$mp/components/Modal/UnlockWalletDialog'
import { selectAccountId } from '$mp/modules/web3/selectors'
import { areAddressesEqual } from '$mp/utils/smartContract'

import useModal from './useModal'

const SaveDialog = withWeb3(SaveContractProductDialogComponent)

export default () => {
    const [modalResult, setModalResult] = useState(false)
    const { api, isOpen, value } = useModal('updateContract')
    const dispatch = useDispatch()
    const isMounted = useIsMounted()
    const { product, contractProduct } = value || {}

    const contractUpdateError = useSelector(selectUpdateContractProductError)
    const contractTransaction = useSelector(selectUpdateProductTransaction)
    const accountId = useSelector(selectAccountId)

    const isOwner = !!contractProduct && !!accountId && areAddressesEqual(accountId || '', contractProduct.ownerAddress)

    const update = useCallback(() => {
        if (isOwner) {
            dispatch(updateContractProduct(product.id || '', {
                ...contractProduct,
                pricePerSecond: product.pricePerSecond,
                beneficiaryAddress: product.beneficiaryAddress,
                priceCurrency: product.priceCurrency,
            }))
        }
    }, [dispatch, product, contractProduct, isOwner])

    // If the user cancels the transaction, the error won't be automatically detected.
    // We need to check the error object here for that.
    const state: string = (contractUpdateError && transactionStates.FAILED) ||
        (contractTransaction && contractTransaction.state) || transactionStates.STARTED

    useEffect(() => {
        if (!isMounted || !isOpen || state !== transactionStates.STARTED) {
            return
        }

        update()
    }, [isOpen, isMounted, update, state])

    useEffect(() => {
        dispatch(resetUpdateContractProductTransaction())
    }, [dispatch, isOpen])

    useEffect(() => {
        setModalResult(state === transactionStates.PENDING || state === transactionStates.CONFIRMED)
    }, [state])

    if (!isOpen) {
        return null
    }

    if (!isOwner && state === transactionStates.STARTED) {
        return (
            <UnlockWalletDialog
                onClose={() => api.close(false)}
                message={I18n.t('unlockWalletDialog.message', {
                    address: contractProduct.ownerAddress,
                })}
            />
        )
    }

    return (
        <SaveDialog
            transactionState={state}
            onClose={() => api.close(modalResult)}
        />
    )
}
