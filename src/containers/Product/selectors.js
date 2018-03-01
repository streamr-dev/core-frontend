// @flow
import { createSelector } from 'reselect'

import type {StoreState} from '../../flowtype/store-state'
import type {Product, ProductEntities} from '../../flowtype/product-types'

import { selectProductEntities } from '../../modules/entities/selectors'

export const selectProductIdParam = (state: StoreState, props: Object): string => {
    return props.match.params.id
}

export const selectCurrentProduct: (StoreState, Object) => ?Product = createSelector(
    selectProductIdParam,
    selectProductEntities,
    (id: string, entities: ProductEntities): ?Product => entities[id] || null
)
