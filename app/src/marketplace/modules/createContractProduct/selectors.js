// @flow

import { createSelector } from 'reselect'

import type { ModifyContractProductState, StoreState } from '../../flowtype/store-state'
import type { TransactionState } from '../../flowtype/common-types'
import type { Hash } from '../../flowtype/web3-types'

const selectCreateContractProductState = (state: StoreState): ModifyContractProductState => state.createContractProduct

export const selectTransactionState: (state: StoreState) => ?TransactionState = createSelector(
    selectCreateContractProductState,
    (subState: ModifyContractProductState): ?TransactionState => subState.transactionState,
)

export const selectTransactionHash: (state: StoreState) => ?Hash = createSelector(
    selectCreateContractProductState,
    (subState: ModifyContractProductState): ?Hash => subState.hash,
)
