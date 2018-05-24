// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { RelatedProductListState, StoreState, EntitiesState } from '../../flowtype/store-state'
import type { ProductIdList, ProductList } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import { selectEntities } from '../../modules/entities/selectors'
import { relatedProductsSchema } from '../../modules/entities/schema'

const selectRelatedProductListState = (state: StoreState): RelatedProductListState => state.relatedProducts

export const selectFetchingRelatedProductList: (state: StoreState) => boolean = createSelector(
    selectRelatedProductListState,
    (subState: RelatedProductListState): boolean => subState.fetching,
)

export const selectRelatedProductListIds: (state: StoreState) => ProductIdList = createSelector(
    selectRelatedProductListState,
    (subState: RelatedProductListState) => subState.ids,
)

export const selectRelatedProductList: (StoreState) => ProductList = createSelector(
    selectRelatedProductListIds,
    selectEntities,
    (result: ProductIdList, entities: EntitiesState): ProductList => denormalize(result, relatedProductsSchema, entities),
)

export const selectRelatedProductListError: (StoreState) => ?ErrorInUi = createSelector(
    selectRelatedProductListState,
    (subState: RelatedProductListState): ?ErrorInUi => subState.error,
)
