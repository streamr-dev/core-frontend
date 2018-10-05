// @flow

import { createSelector } from 'reselect'

import { denormalize } from 'normalizr'

import type { ModifyContractProductState, StoreState, EntitiesState } from '$mp/flowtype/store-state'
import type { Hash, TransactionEntity } from '$mp/flowtype/web3-types'
import { transactionSchema } from '$mp/modules/entities/schema'
import { selectEntities } from '$mp/modules/entities/selectors'
import type { ErrorInUi } from '$mp/flowtype/common-types'

const selectCreateContractProductState = (state: StoreState): ModifyContractProductState => state.createContractProduct

export const selectCreateContractProductTx: (state: StoreState) => ?Hash = createSelector(
    selectCreateContractProductState,
    (subState: ModifyContractProductState): ?Hash => subState.modifyTx,
)

export const selectCreateContractProductTransaction: (state: StoreState) => ?TransactionEntity = createSelector(
    selectCreateContractProductTx,
    selectEntities,
    (modifyTx: ?Hash, entities: EntitiesState): TransactionEntity => denormalize(modifyTx, transactionSchema, entities),
)

export const selectCreateContractProductError: (state: StoreState) => ?ErrorInUi = createSelector(
    selectCreateContractProductState,
    (subState: ModifyContractProductState): ?ErrorInUi => subState.error,
)
