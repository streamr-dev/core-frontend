import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import {
    setRequiresWhitelist,
    whitelistApprove,
    whitelistReject,
} from '$mp/modules/contractProduct/services'

import { addTransaction } from '$mp/modules/transactions/actions'
import { transactionTypes, transactionStates } from '$shared/utils/constants'
import ActionQueue from '$mp/utils/actionQueue'
import useWhitelist from '$mp/modules/contractProduct/hooks/useWhitelist'
import useEntities from '$shared/hooks/useEntities'
import { productSchema } from '$shared/modules/entities/schema'

export const actionsTypes = {
    SET_REQUIRES_WHITELIST: 'setRequiresWhitelist',
    ADD_WHITELIST_ADDRESS: 'addWhiteListAddress',
    REMOVE_WHITELIST_ADDRESS: 'removeWhiteListAddress',
}

export function useUpdateWhitelist() {
    const dispatch = useDispatch()
    const { add: addToWhitelist, edit: editInWhitelist, remove: removeFromWhitelist } = useWhitelist()
    const { update: updateEntities } = useEntities()

    return useCallback(({ productId, setWhitelist, addresses }) => {
        if (!addresses || addresses.length < 1) {
            throw new Error('No addresses given.')
        }

        const queue = new ActionQueue()

        // Enable white list before any action if not enabled in contract,
        // otherwise removing or adding will fail
        if (setWhitelist) {
            queue.add({
                id: actionsTypes.SET_REQUIRES_WHITELIST,
                handler: (update, done) => (
                    setRequiresWhitelist(productId, true)
                        .onTransactionHash((hash) => {
                            update(transactionStates.PENDING)
                            dispatch(addTransaction(hash, transactionTypes.SET_REQUIRES_WHITELIST))
                            done()
                        })
                        .onTransactionComplete(() => {
                            // update the loaded product with the new value
                            updateEntities({
                                data: {
                                    id: productId,
                                    requiresWhitelist: true,
                                },
                                schema: productSchema,
                            })
                            update(transactionStates.CONFIRMED)
                        })
                        .onError((error) => {
                            done()
                            update(transactionStates.FAILED, error)
                        })
                ),
            })
        }

        addresses.forEach(({ address, remove = false }) => {
            if (remove) {
                queue.add({
                    id: actionsTypes.REMOVE_WHITELIST_ADDRESS,
                    handler: (update, done) => (
                        whitelistReject(productId, address)
                            .onTransactionHash((hash) => {
                                update(transactionStates.PENDING)
                                dispatch(addTransaction(hash, transactionTypes.WHITELIST_REJECT))
                                addToWhitelist({
                                    productId,
                                    address,
                                    status: 'removed',
                                    isPending: true,
                                })
                                done()
                            })
                            .onTransactionComplete(() => {
                                editInWhitelist({
                                    productId,
                                    address,
                                    isPending: false,
                                })
                                update(transactionStates.CONFIRMED)
                            })
                            .onError((error) => {
                                if (error.receipt && error.receipt.transactionHash) {
                                    editInWhitelist({
                                        productId,
                                        address,
                                        isPending: false,
                                    })
                                }
                                update(transactionStates.FAILED, error)
                                done()
                            })
                    ),
                })
            } else {
                queue.add({
                    id: actionsTypes.ADD_WHITELIST_ADDRESS,
                    handler: (update, done) => (
                        whitelistApprove(productId, address)
                            .onTransactionHash((hash) => {
                                update(transactionStates.PENDING)
                                dispatch(addTransaction(hash, transactionTypes.WHITELIST_APPROVE))
                                addToWhitelist({
                                    productId,
                                    address,
                                    status: 'added',
                                    isPending: true,
                                })
                                done()
                            })
                            .onTransactionComplete(() => {
                                editInWhitelist({
                                    productId,
                                    address,
                                    isPending: false,
                                })
                                update(transactionStates.CONFIRMED)
                            })
                            .onError((error) => {
                                if (error.receipt && error.receipt.transactionHash) {
                                    removeFromWhitelist({
                                        productId,
                                        address,
                                    })
                                }
                                update(transactionStates.FAILED, error)
                                done()
                            })
                    ),
                })
            }
        })

        return queue
    }, [dispatch, updateEntities, addToWhitelist, editInWhitelist, removeFromWhitelist])
}

export default useUpdateWhitelist
