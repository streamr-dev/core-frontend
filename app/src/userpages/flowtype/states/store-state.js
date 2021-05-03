// @flow

import type { PermissionState } from './permission-state'
import type { UserPageStreamsState } from './stream-state'
import type { TransactionHistoryState } from './transaction-history-state'

export type StoreState = {
    permission: PermissionState,
    userPageStreams: UserPageStreamsState,
    transactionHistory: TransactionHistoryState,
}
