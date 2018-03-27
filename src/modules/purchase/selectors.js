// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import { productSchema } from '../entities/schema'
import { selectEntities } from '../entities/selectors'

import type { StoreState, PurchaseUiState, EntitiesState, PurchaseStep } from '../../flowtype/store-state'
import type { Purchase } from '../../flowtype/common-types'

import type { ProductId, Product } from '../../flowtype/product-types'

const selectPurchaseState = (state: StoreState): PurchaseUiState => state.purchase

export const selectStep: (StoreState) => PurchaseStep = createSelector(
    selectPurchaseState,
    (subState: PurchaseUiState): PurchaseStep => subState.step
)

export const selectWaiting: (StoreState) => boolean = createSelector(
    selectPurchaseState,
    (subState: PurchaseUiState): boolean => subState.waiting
)

export const selectProductId: (StoreState) => ?ProductId = createSelector(
    selectPurchaseState,
    (subState: PurchaseUiState): ?ProductId => subState.product
)

export const selectProduct: (StoreState) => ?Product = createSelector(
    selectProductId,
    selectEntities,
    (id: ?ProductId, entities: EntitiesState): ?Product => denormalize(id, productSchema, entities)
)

export const selectPurchaseData: (StoreState) => ?Purchase = createSelector(
    selectPurchaseState,
    (subState: PurchaseUiState): ?Purchase => subState.data
)
