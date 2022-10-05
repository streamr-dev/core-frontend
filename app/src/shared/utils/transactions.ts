import { isSessionStorageAvailable } from '$shared/utils/storage'
import type { Hash } from '$shared/flowtype/web3-types'
import type { TransactionType } from '$shared/flowtype/common-types'
export const getTransactionsFromSessionStorage = (): Record<string, any> =>
    isSessionStorageAvailable() ? JSON.parse(sessionStorage.getItem('pendingTransactions') || '{}') : {}

const setTransactionsToSessionStorage = (txList: Record<string, any>): void => {
    if (isSessionStorageAvailable()) {
        sessionStorage.setItem('pendingTransactions', JSON.stringify(txList))
    }
}

export const addTransactionToSessionStorage = (id: Hash, type: TransactionType): void => {
    const txList = { ...getTransactionsFromSessionStorage(), [id]: type }
    setTransactionsToSessionStorage(txList)
}
export const removeTransactionFromSessionStorage = (id: Hash): void => {
    const txList = { ...getTransactionsFromSessionStorage(), [id]: undefined }
    setTransactionsToSessionStorage(txList)
}
