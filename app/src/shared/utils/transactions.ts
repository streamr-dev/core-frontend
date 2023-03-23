import { isSessionStorageAvailable } from '$shared/utils/storage'
import { Hash } from '$shared/types/web3-types'
import { TransactionType } from '$shared/types/common-types'
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
