// @flow

import { createSelector } from 'reselect'

import type { StoreState, ProductState, EditProductState } from '../../flowtype/store-state'
import type { EditProduct } from '../../flowtype/product-types'

export const selectProductState = (state: StoreState): ProductState => state.product

const selectEditProductState = (state: StoreState): EditProductState => state.editProduct

export const selectEditProduct = createSelector(
    selectEditProductState,
    (subState: EditProductState): ?EditProduct => subState.product,
)
