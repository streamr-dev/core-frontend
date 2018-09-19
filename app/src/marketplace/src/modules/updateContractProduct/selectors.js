// @flow

import { createSelector } from 'reselect'

import type { ModifyContractProductState, StoreState } from '../../flowtype/store-state'
import type { TransactionState } from '../../flowtype/common-types'

const selectUpdateContractProductState = (state: StoreState): ModifyContractProductState => state.updateContractProduct

export const selectTransactionState: (state: StoreState) => ?TransactionState = createSelector(
    selectUpdateContractProductState,
    (subState: ModifyContractProductState): ?TransactionState => subState.transactionState,
)
