// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { TransactionsState, StoreState } from '../../flowtype/store-state'
import type { EntitiesState } from '$shared/flowtype/store-state'
import type { Hash, TransactionEntity, HashList } from '$shared/flowtype/web3-types'

import { selectEntities } from '$shared/modules/entities/selectors'
import { transactionSchema } from '$shared/modules/entities/schema'

const selectTransactionsState = (state: StoreState): TransactionsState => state.transactions

export const selectPendingTransactionIds: (StoreState) => HashList = createSelector(
    selectTransactionsState,
    (subState: TransactionsState): HashList => subState.pending,
)

export const selectCompletedTransactionIds: (StoreState) => HashList = createSelector(
    selectTransactionsState,
    (subState: TransactionsState): HashList => subState.completed,
)

export const makeSelectTransaction: (Hash) => (StoreState) => TransactionEntity = (id: Hash) => createSelector(
    selectEntities,
    (entities: EntitiesState): TransactionEntity => denormalize(id, transactionSchema, entities),
)
