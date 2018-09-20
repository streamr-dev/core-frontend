// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import { productSchema } from '../entities/schema'
import { selectEntities } from '../entities/selectors'

import type { StoreState, PurchaseDialogState, EntitiesState, PurchaseStep } from '../../flowtype/store-state'
import type { Purchase } from '../../flowtype/common-types'

import type { ProductId, Product } from '../../flowtype/product-types'

const selectPurchaseState = (state: StoreState): PurchaseDialogState => state.purchaseDialog

export const selectStep: (StoreState) => PurchaseStep = createSelector(
    selectPurchaseState,
    (subState: PurchaseDialogState): PurchaseStep => subState.step,
)

export const selectStepParams: (StoreState) => any = createSelector(
    selectPurchaseState,
    (subState: PurchaseDialogState): any => subState.stepParams,
)

export const selectProductId: (StoreState) => ?ProductId = createSelector(
    selectPurchaseState,
    (subState: PurchaseDialogState): ?ProductId => subState.productId,
)

export const selectProduct: (StoreState) => ?Product = createSelector(
    selectProductId,
    selectEntities,
    (id: ?ProductId, entities: EntitiesState): ?Product => denormalize(id, productSchema, entities),
)

export const selectPurchaseData: (StoreState) => ?Purchase = createSelector(
    selectPurchaseState,
    (subState: PurchaseDialogState): ?Purchase => subState.data,
)
