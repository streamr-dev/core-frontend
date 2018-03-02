// @flow

import { createSelector } from 'reselect'
import type { ProductState, StoreState } from '../../flowtype/store-state'
import type { OwnProps } from '../../components/ProductPage'

const selectProductState = (state: StoreState): ProductState => state.product

export const selectProductById = createSelector(
    [selectProductState, (state: StoreState, props: OwnProps) => props],
    (state: ProductState, props: OwnProps) => state.byId[props.match.params.id]
)
