// @flow

import type { PermissionState } from './permission-state'
import type { TransactionHistoryState } from './transaction-history-state'

export type StoreState = {
    permission: PermissionState,
    transactionHistory: TransactionHistoryState,
}
