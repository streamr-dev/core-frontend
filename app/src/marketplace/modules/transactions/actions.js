// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import type { Hash, Receipt } from '../../flowtype/web3-types'
import type { TransactionType } from '../../flowtype/common-types'
import { updateEntities } from '../entities/actions'
import { transactionSchema } from '../entities/schema'
import { transactionStates, transactionTypes } from '../../utils/constants'
import type TransactionError from '../../errors/TransactionError'
import { showTransactionNotification } from '../notifications/actions'
import { isSessionStorageAvailable } from '../../utils/storage'

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

export const getTransactionsFromSessionStorage = (): Object => (
    isSessionStorageAvailable() ? JSON.parse(sessionStorage.getItem('pendingTransactions') || '{}') : {}
)

const setTransactionsToSessionStorage = (txList: Object): void => {
    if (isSessionStorageAvailable()) {
        sessionStorage.setItem('pendingTransactions', JSON.stringify(txList))
    }
}

const addTransactionToSessionStorage = (id: Hash, type: TransactionType): void => {
    const txList = {
        ...getTransactionsFromSessionStorage(),
        [id]: type,
    }

    setTransactionsToSessionStorage(txList)
}

const removeTransactionFromSessionStorage = (id: Hash): void => {
    const txList = {
        ...getTransactionsFromSessionStorage(),
        [id]: undefined,
    }

    setTransactionsToSessionStorage(txList)
}

export const addTransaction = (id: Hash, type: TransactionType) => (dispatch: Function) => {
    dispatch(addTransactionRequest(id))
    addTransactionToSessionStorage(id, type)

    const { entities } = normalize({
        id,
        type,
        state: transactionStates.PENDING,
    }, transactionSchema)

    dispatch(updateEntities(entities))

    // Show a notification for certain type of transctions (they will complete when mined)
    if ([transactionTypes.PURCHASE,
        transactionTypes.UNDEPLOY_PRODUCT,
        transactionTypes.REDEPLOY_PRODUCT,
        transactionTypes.CREATE_CONTRACT_PRODUCT].indexOf(type) >= 0) {
        dispatch(showTransactionNotification(id))
    }
}

export const completeTransaction = (id: Hash, receipt: Receipt) => (dispatch: Function) => {
    dispatch(completeTransactionRequest(id))
    removeTransactionFromSessionStorage(id)

    const { entities } = normalize({
        id,
        state: transactionStates.CONFIRMED,
        receipt,
    }, transactionSchema)

    dispatch(updateEntities(entities))
}

export const transactionError = (id: Hash, error: TransactionError) => (dispatch: Function) => {
    dispatch(completeTransactionRequest(id))
    removeTransactionFromSessionStorage(id)

    const { entities } = normalize({
        id,
        state: transactionStates.FAILED,
        error,
    }, transactionSchema)

    dispatch(updateEntities(entities))
}
