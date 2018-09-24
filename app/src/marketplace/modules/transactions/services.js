// @flow

import { isSessionStorageAvailable } from '../../utils/storage'
import type { Hash } from '../../flowtype/web3-types'
import type { TransactionType } from '../../flowtype/common-types'

export const getTransactionsFromSessionStorage = (): Object => (
    isSessionStorageAvailable() ? JSON.parse(sessionStorage.getItem('pendingTransactions') || '{}') : {}
)

const setTransactionsToSessionStorage = (txList: Object): void => {
    if (isSessionStorageAvailable()) {
        sessionStorage.setItem('pendingTransactions', JSON.stringify(txList))
    }
}

export const addTransactionToSessionStorage = (id: Hash, type: TransactionType): void => {
    const txList = {
        ...getTransactionsFromSessionStorage(),
        [id]: type,
    }

    setTransactionsToSessionStorage(txList)
}

export const removeTransactionFromSessionStorage = (id: Hash): void => {
    const txList = {
        ...getTransactionsFromSessionStorage(),
        [id]: undefined,
    }

    setTransactionsToSessionStorage(txList)
}

