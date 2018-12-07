// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { PurchaseState, StoreState } from '../../flowtype/store-state'
import type { EntitiesState } from '$shared/flowtype/store-state'
import type { Hash, TransactionEntity } from '$shared/flowtype/web3-types'
import { transactionSchema } from '$shared/modules/entities/schema'
import { selectEntities } from '$shared/modules/entities/selectors'

const selectPurchaseState = (state: StoreState): PurchaseState => state.purchase

export const selectPurchaseStarted: (state: StoreState) => boolean = createSelector(
    selectPurchaseState,
    (subState: PurchaseState): boolean => subState.processing,
)

export const selectPurchaseTx: (state: StoreState) => ?Hash = createSelector(
    selectPurchaseState,
    (subState: PurchaseState): ?Hash => subState.purchaseTx,
)

export const selectPurchaseTransaction: (state: StoreState) => ?TransactionEntity = createSelector(
    selectPurchaseTx,
    selectEntities,
    (purchaseTx: ?Hash, entities: EntitiesState): TransactionEntity => denormalize(purchaseTx, transactionSchema, entities),
)
