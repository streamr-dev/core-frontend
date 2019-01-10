// @flow

import type { DashboardState } from './dashboard-state'
import type { CanvasState } from './canvas-state'
import type { PermissionState } from './permission-state'
import type { UserPageStreamsState } from './stream-state'
import type { TransactionHistoryState } from './transaction-history-state'

export type StoreState = {
    dashboard: DashboardState,
    canvas: CanvasState,
    permission: PermissionState,
    userPageStreams: UserPageStreamsState,
    transactionHistory: TransactionHistoryState,
}
