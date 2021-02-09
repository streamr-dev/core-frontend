// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import Notification from '$shared/utils/Notification'
import type { TransactionType } from '$shared/flowtype/common-types'
import type { Hash, Receipt } from '$shared/flowtype/web3-types'
import { updateEntities } from '$shared/modules/entities/actions'
import { transactionSchema } from '$shared/modules/entities/schema'
import { transactionStates, transactionTypes } from '$shared/utils/constants'
import type TransactionError from '$shared/errors/TransactionError'

import { addTransactionToSessionStorage, removeTransactionFromSessionStorage } from '$shared/utils/transactions'
import {
    ADD_TRANSACTION,
    COMPLETE_TRANSACTION,
} from './constants'
import type { TransactionIdActionCreator } from './types'

const addTransactionRequest: TransactionIdActionCreator = createAction(
    ADD_TRANSACTION,
    (id: Hash) => ({
        id,
    }),
)

export const completeTransactionRequest: TransactionIdActionCreator = createAction(
    COMPLETE_TRANSACTION,
    (id: Hash) => ({
        id,
    }),
)

export const addTransaction = (id: Hash, type: TransactionType) => (dispatch: Function) => {
    const { entities } = normalize({
        id,
        hash: id,
        type,
        state: transactionStates.PENDING,
    }, transactionSchema)

    dispatch(updateEntities(entities))
    dispatch(addTransactionRequest(id))

    addTransactionToSessionStorage(id, type)

    switch (type) {
        case transactionTypes.SUBSCRIPTION:
        case transactionTypes.UNDEPLOY_PRODUCT:
        case transactionTypes.REDEPLOY_PRODUCT:
        case transactionTypes.CREATE_CONTRACT_PRODUCT:
        case transactionTypes.UPDATE_CONTRACT_PRODUCT:
            Notification.push({
                txHash: id,
            })
            break
        default:
    }
}

export const completeTransaction = (
    id: Hash,
    receipt: Receipt,
) => (dispatch: Function) => {
    const { entities } = normalize({
        id,
        hash: id,
        state: transactionStates.CONFIRMED,
        receipt,
    }, transactionSchema)

    dispatch(updateEntities(entities))
    dispatch(completeTransactionRequest(id))
    removeTransactionFromSessionStorage(id)
}

export const transactionError = (
    id: Hash,
    error: TransactionError,
) => (dispatch: Function) => {
    const { entities } = normalize({
        id,
        hash: id,
        state: transactionStates.FAILED,
        error,
    }, transactionSchema)

    dispatch(updateEntities(entities))
    dispatch(completeTransactionRequest(id))
    removeTransactionFromSessionStorage(id)
}
