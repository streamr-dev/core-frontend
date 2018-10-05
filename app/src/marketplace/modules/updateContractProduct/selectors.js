// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { ModifyContractProductState, StoreState, EntitiesState } from '$mp/flowtype/store-state'
import type { Hash, TransactionEntity } from '$mp/flowtype/web3-types'
import type { ErrorInUi } from '$mp/flowtype/common-types'
import { transactionSchema } from '$mp/modules/entities/schema'
import { selectEntities } from '$mp/modules/entities/selectors'

const selectUpdateContractProductState = (state: StoreState): ModifyContractProductState => state.updateContractProduct

export const selectUpdateProductTx: (state: StoreState) => ?Hash = createSelector(
    selectUpdateContractProductState,
    (subState: ModifyContractProductState): ?Hash => subState.modifyTx,
)

export const selectUpdateProductTransaction: (state: StoreState) => ?TransactionEntity = createSelector(
    selectUpdateProductTx,
    selectEntities,
    (modifyTx: ?Hash, entities: EntitiesState): TransactionEntity => denormalize(modifyTx, transactionSchema, entities),
)

export const selectUpdateContractProductError: (state: StoreState) => ?ErrorInUi = createSelector(
    selectUpdateContractProductState,
    (subState: ModifyContractProductState): ?ErrorInUi => subState.error,
)
