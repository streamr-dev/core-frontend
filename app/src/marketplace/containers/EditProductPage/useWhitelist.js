// @flow

import { useMemo, useEffect, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { getWhitelistAddresses, whitelistApprove, whitelistReject } from '$mp/modules/contractProduct/services'
import { addTransaction } from '$mp/modules/transactions/actions'
import { transactionTypes } from '$shared/utils/constants'

import useEditableProduct from '../ProductController/useEditableProduct'
import useEditableProductActions from '../ProductController/useEditableProductActions'

export function useWhitelist() {
    const product = useEditableProduct()
    const { updateRequiresWhitelist } = useEditableProductActions()
    const isEnabled = product.requiresWhitelist
    const productId = product.id
    const [items, setItems] = useState([])
    const [pendingItems, setPendingItems] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        const loadWhitelist = async () => {
            const whitelist = await getWhitelistAddresses(productId)
            setItems(whitelist)
        }

        loadWhitelist()
    }, [productId])

    const approve = useCallback(async (address: string) => (
        whitelistApprove(productId, address)
            .onTransactionHash((hash) => {
                dispatch(addTransaction(hash, transactionTypes.DEPLOY_DATA_UNION))
                setPendingItems((prev) => [
                    ...prev,
                    hash,
                ])
            })
    ), [dispatch, productId])

    const reject = useCallback(async (address: string) => (
        whitelistReject(productId, address)
            .onTransactionHash((hash) => {
                dispatch(addTransaction(hash, transactionTypes.DEPLOY_DATA_UNION))
                setPendingItems((prev) => [
                    ...prev,
                    hash,
                ])
            })
    ), [dispatch, productId])

    console.log('Pending', pendingItems)

    return useMemo(() => ({
        isEnabled,
        setEnabled: updateRequiresWhitelist,
        items,
        approve,
        reject,
    }), [
        isEnabled,
        updateRequiresWhitelist,
        items,
        approve,
        reject,
    ])
}

export default useWhitelist
