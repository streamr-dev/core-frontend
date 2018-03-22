// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import { productSchema } from '../entities/schema'
import { selectEntities } from '../entities/selectors'

import type { StoreState, UiState, PurchaseUiState, EntitiesState, PurchaseStep } from '../../flowtype/store-state'
import type { ProductId, Product } from '../../flowtype/product-types'

const selectUiState = (state: StoreState): UiState => state.ui

export const selectPurchaseState: (StoreState) => ?PurchaseUiState = createSelector(
    selectUiState,
    (subState: UiState): ?PurchaseUiState => subState.purchase
)

export const selectStep: (StoreState) => ?PurchaseStep = createSelector(
    selectPurchaseState,
    (subState: ?PurchaseUiState): ?PurchaseStep => subState && subState.step || null
)

export const selectWaiting: (StoreState) => boolean = createSelector(
    selectPurchaseState,
    (subState: ?PurchaseUiState): boolean => subState && subState.waiting || false
)

export const selectProductId: (StoreState) => ?ProductId = createSelector(
    selectPurchaseState,
    (subState: ?PurchaseUiState): ?ProductId => subState && subState.product || null
)

export const selectProduct: (StoreState) => ?Product = createSelector(
    selectProductId,
    selectEntities,
    (id: ?ProductId, entities: EntitiesState): ?Product => denormalize(id, productSchema, entities)
)
