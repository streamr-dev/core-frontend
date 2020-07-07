// @flow

import { useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { whitelistApprove, whitelistReject } from '$mp/modules/contractProduct/services'
import { addTransaction } from '$mp/modules/transactions/actions'
import { transactionTypes } from '$shared/utils/constants'

import useEditableProduct from '../ProductController/useEditableProduct'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { useWhitelistContext } from './WhitelistContext'

export function useWhitelist() {
    const product = useEditableProduct()
    const { updateRequiresWhitelist } = useEditableProductActions()
    const isEnabled = product.requiresWhitelist
    const productId = product.id
    const { items, addPendingItem, removePendingItem } = useWhitelistContext()
    const dispatch = useDispatch()

    const approve = useCallback(async (address: string) => {
        // Do not require transaction if address is already approved
        if (items.find((i) => i.address === address && i.status !== 'removed')) {
            return null
        }

        return whitelistApprove(productId, address)
            .onTransactionHash((hash) => {
                dispatch(addTransaction(hash, transactionTypes.WHITELIST_APPROVE))
                addPendingItem(hash, address, transactionTypes.WHITELIST_APPROVE)
            })
            .onTransactionComplete((receipt) => {
                removePendingItem(receipt.transactionHash)
            })
            .onError((error) => {
                if (error.receipt && error.receipt.transactionHash) {
                    removePendingItem(error.receipt.transactionHash)
                }
            })
    }, [dispatch, productId, items, addPendingItem, removePendingItem])

    const reject = useCallback(async (address: string) => {
        // Do not require transaction if address is already rejected
        if (items.find((i) => i.address === address && i.status === 'removed')) {
            return null
        }

        return whitelistReject(productId, address)
            .onTransactionHash((hash) => {
                dispatch(addTransaction(hash, transactionTypes.WHITELIST_REJECT))
                addPendingItem(hash, address, transactionTypes.WHITELIST_REJECT)
            })
            .onTransactionComplete((receipt) => {
                removePendingItem(receipt.transactionHash)
            })
            .onError((error) => {
                if (error.receipt && error.receipt.transactionHash) {
                    removePendingItem(error.receipt.transactionHash)
                }
            })
    }, [dispatch, productId, items, addPendingItem, removePendingItem])

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
