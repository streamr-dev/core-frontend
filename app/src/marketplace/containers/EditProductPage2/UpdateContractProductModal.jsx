// @flow

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useModal from './useModal'

import { transactionStates } from '$shared/utils/constants'

import SaveContractProductDialogComponent from '$mp/components/Modal/SaveContractProductDialog'
import withWeb3 from '$shared/utils/withWeb3'
import { updateContractProduct, resetUpdateContractProductTransaction } from '$mp/modules/updateContractProduct/actions'
import { selectUpdateProductTransaction, selectUpdateContractProductError } from '$mp/modules/updateContractProduct/selectors'

const SaveDialog = withWeb3(SaveContractProductDialogComponent)

export default () => {
    const [modalResult, setModalResult] = useState(false)
    const { api, isOpen, value } = useModal('updateContract')
    const { product, originalProduct, contractProduct } = value || {}
    const dispatch = useDispatch()

    const contractUpdateError = useSelector(selectUpdateContractProductError)
    const contractTransaction = useSelector(selectUpdateProductTransaction)

    useEffect(() => {
        if (!isOpen) {
            return
        }

        dispatch(resetUpdateContractProductTransaction())
        dispatch(updateContractProduct(product.id || '', {
            ...contractProduct,
            pricePerSecond: product.pricePerSecond,
            beneficiaryAddress: product.beneficiaryAddress,
            priceCurrency: product.priceCurrency,
        }))
    }, [isOpen, dispatch, product, originalProduct, contractProduct])

    // If the user cancels the transaction, the error won't be automatically detected.
    // We need to check the error object here for that.
    const state: string = (contractUpdateError && transactionStates.FAILED) ||
        (contractTransaction && contractTransaction.state) || transactionStates.STARTED

    useEffect(() => {
        setModalResult(state === transactionStates.CONFIRMED)
    }, [state])

    if (!isOpen) {
        return null
    }

    return (
        <SaveDialog
            transactionState={state}
            onClose={() => api.close(modalResult)}
        />
    )
}
