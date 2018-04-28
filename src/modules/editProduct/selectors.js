// @flow

import { createSelector } from 'reselect'

import type { StoreState, EditProductState } from '../../flowtype/store-state'
import type { EditProduct } from '../../flowtype/product-types'
import type { TransactionState } from '../../flowtype/common-types'

const selectEditProductState = (state: StoreState): EditProductState => state.editProduct

export const selectEditProduct = createSelector(
    selectEditProductState,
    (subState: EditProductState): ?EditProduct => subState.product,
)

export const selectTransactionState: (state: StoreState) => ?TransactionState = createSelector(
    selectEditProductState,
    (subState: EditProductState): ?TransactionState => subState.transactionState,
)
