// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { PublishState, StoreState } from '$mp/flowtype/store-state'
import type { TransactionState, ErrorInUi } from '$shared/flowtype/common-types'
import type { Hash, TransactionEntity } from '$shared/flowtype/web3-types'

import type { EntitiesState } from '$shared/flowtype/store-state'
import { selectEntities } from '$shared/modules/entities/selectors'
import { transactionSchema } from '$shared/modules/entities/schema'

const selectPublishState = (state: StoreState): PublishState => state.publish

const selectContractTx: (state: StoreState) => ?Hash = createSelector(
    selectPublishState,
    (subState: PublishState): ?Hash => subState.contractTx,
)

export const selectContractTransaction: (state: StoreState) => ?TransactionEntity = createSelector(
    selectContractTx,
    selectEntities,
    (purchaseTx: ?Hash, entities: EntitiesState): TransactionEntity => denormalize(purchaseTx, transactionSchema, entities),
)

export const selectContractError: (state: StoreState) => ?ErrorInUi = createSelector(
    selectPublishState,
    (subState: PublishState): ?ErrorInUi => subState.contractError,
)

export const selectFreeProductState: (state: StoreState) => ?TransactionState = createSelector(
    selectPublishState,
    (subState: PublishState): ?TransactionState => subState.freeProductState,
)

export const selectFreeProductError: (state: StoreState) => ?ErrorInUi = createSelector(
    selectPublishState,
    (subState: PublishState): ?ErrorInUi => subState.freeProductError,
)
