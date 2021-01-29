// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { EntitiesState } from '$shared/flowtype/store-state'
import type { ErrorInUi } from '$shared/flowtype/common-types'

import { selectEntities } from '$shared/modules/entities/selectors'
import { productsSchema } from '$shared/modules/entities/schema'
import type { ProductIdList, ProductList } from '../../flowtype/product-types'
import type { RelatedProductListState, StoreState } from '../../flowtype/store-state'

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
    (result: ProductIdList, entities: EntitiesState): ProductList => denormalize(result, productsSchema, entities),
)

export const selectRelatedProductListError: (StoreState) => ?ErrorInUi = createSelector(
    selectRelatedProductListState,
    (subState: RelatedProductListState): ?ErrorInUi => subState.error,
)
