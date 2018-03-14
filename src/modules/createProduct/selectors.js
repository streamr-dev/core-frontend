// @flow

import { createSelector } from 'reselect'

import type { StoreState, CreateProductState } from '../../flowtype/store-state'
import type { ProductPreview } from '../../flowtype/product-types'

const selectCreateProductState = (state: StoreState): CreateProductState => state.createProduct

export const selectProduct = createSelector(
    selectCreateProductState,
    (subState: CreateProductState): ProductPreview => subState.product
)
