// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import { productSchema } from '$shared/modules/entities/schema'
import { selectEntities } from '$shared/modules/entities/selectors'

import type { StoreState, PublishDialogState, PublishStep } from '$mp/flowtype/store-state'
import type { EntitiesState } from '$shared/flowtype/store-state'

import type { ProductId, Product } from '$mp/flowtype/product-types'

const selectPublishDialogState = (state: StoreState): PublishDialogState => state.publishDialog

export const selectStep: (StoreState) => PublishStep = createSelector(
    selectPublishDialogState,
    (subState: PublishDialogState): PublishStep => subState.step,
)

const selectProductId: (StoreState) => ?ProductId = createSelector(
    selectPublishDialogState,
    (subState: PublishDialogState): ?ProductId => subState.productId,
)

export const selectProduct: (StoreState) => ?Product = createSelector(
    selectProductId,
    selectEntities,
    (id: ?ProductId, entities: EntitiesState): ?Product => denormalize(id, productSchema, entities),
)
