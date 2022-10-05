import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'
import type { TransactionsState } from '$mp/flowtype/store-state'
import type { StoreState, EntitiesState } from '$shared/flowtype/store-state'
import type { Hash, TransactionEntity, TransactionEntityList, HashList } from '$shared/flowtype/web3-types'
import { selectEntities } from '$shared/modules/entities/selectors'
import { transactionSchema, transactionsSchema } from '$shared/modules/entities/schema'

const selectTransactionsState = (state: StoreState): TransactionsState => state.transactions

export const selectPendingTransactionIds: (arg0: StoreState) => HashList = createSelector(
    selectTransactionsState,
    (subState: TransactionsState): HashList => subState.pending,
)
export const selectPendingTransactions: (state: StoreState) => TransactionEntityList = createSelector(
    selectPendingTransactionIds,
    selectEntities,
    (ids: HashList, entities: EntitiesState): TransactionEntityList => denormalize(ids, transactionsSchema, entities),
)
export const selectCompletedTransactionIds: (arg0: StoreState) => HashList = createSelector(
    selectTransactionsState,
    (subState: TransactionsState): HashList => subState.completed,
)
export const selectCompletedTransactions: (state: StoreState) => TransactionEntityList = createSelector(
    selectCompletedTransactionIds,
    selectEntities,
    (ids: HashList, entities: EntitiesState): TransactionEntityList => denormalize(ids, transactionsSchema, entities),
)
export const makeSelectTransaction: (arg0: Hash) => (arg0: StoreState) => TransactionEntity = (id: Hash) =>
    createSelector(
        selectEntities,
        (entities: EntitiesState): TransactionEntity => denormalize(id, transactionSchema, entities),
    )
