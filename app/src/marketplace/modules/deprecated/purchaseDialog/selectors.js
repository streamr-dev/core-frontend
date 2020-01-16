// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import { productSchema } from '$shared/modules/entities/schema'
import { selectEntities } from '$shared/modules/entities/selectors'

import type { StoreState, PurchaseDialogState, PurchaseStep } from '$mp/flowtype/store-state'
import type { EntitiesState } from '$shared/flowtype/store-state'
import type { Purchase } from '$mp/flowtype/common-types'

import type { ProductId, Product } from '$mp/flowtype/product-types'

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
