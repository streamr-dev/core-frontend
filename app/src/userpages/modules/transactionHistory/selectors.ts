import { denormalize } from 'normalizr'
import { createSelector } from 'reselect'
import type { StoreState, EntitiesState } from '$shared/flowtype/store-state'
import type { TransactionHistoryState } from '$userpages/flowtype/states/transaction-history-state'
import type { HashList, EventLogList, TransactionEntityList } from '$shared/flowtype/web3-types'
import { selectEntities } from '$shared/modules/entities/selectors'
import { transactionsSchema } from '$shared/modules/entities/schema'

const selectTransactionHistoryState = (state: StoreState): TransactionHistoryState => state.transactionHistory

export const selectTransactionEvents: (arg0: StoreState) => EventLogList | null | undefined = createSelector(
    selectTransactionHistoryState,
    (subState: TransactionHistoryState): EventLogList | null | undefined => subState.events,
)
export const selectFetching: (arg0: StoreState) => boolean = createSelector(
    selectTransactionHistoryState,
    (subState: TransactionHistoryState): boolean => subState.fetching,
)
export const selectOffset: (arg0: StoreState) => number = createSelector(
    selectTransactionHistoryState,
    (subState: TransactionHistoryState): number => subState.offset,
)
export const selectVisibleTransactionIds: (state: StoreState) => HashList = createSelector(
    selectTransactionHistoryState,
    (subState: TransactionHistoryState): HashList => subState.ids,
)
export const selectVisibleTransactions: (state: StoreState) => TransactionEntityList = createSelector(
    selectVisibleTransactionIds,
    selectEntities,
    (ids: HashList, entities: EntitiesState): TransactionEntityList => denormalize(ids, transactionsSchema, entities),
)
