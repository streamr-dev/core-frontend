// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { ModifyContractProductState, StoreState, EntitiesState } from '../../flowtype/store-state'
import type { Hash, TransactionEntity } from '../../flowtype/web3-types'
import { transactionSchema } from '../entities/schema'
import { selectEntities } from '../entities/selectors'

const selectUpdateContractProductState = (state: StoreState): ModifyContractProductState => state.updateContractProduct

export const selectUpdateProductTransactionStarted: (state: StoreState) => boolean = createSelector(
    selectUpdateContractProductState,
    (subState: ModifyContractProductState): boolean => subState.processing,
)

export const selectUpdateProductTx: (state: StoreState) => ?Hash = createSelector(
    selectUpdateContractProductState,
    (subState: ModifyContractProductState): ?Hash => subState.modifyTx,
)

export const selectUpdateProductTransaction: (state: StoreState) => ?TransactionEntity = createSelector(
    selectUpdateProductTx,
    selectEntities,
    (modifyTx: ?Hash, entities: EntitiesState): TransactionEntity => denormalize(modifyTx, transactionSchema, entities),
)
