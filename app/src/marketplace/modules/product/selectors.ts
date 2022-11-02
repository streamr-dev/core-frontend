import { createSelector } from 'reselect'
import type { Subscription } from '../../types/product-types'
import type { ProductState, StoreState } from '../../types/store-state'

const selectProductState = (state: StoreState): ProductState => state.product

export const selectContractSubscription: (arg0: StoreState) => Subscription | null | undefined = createSelector(
    selectProductState,
    (subState: ProductState): Subscription | null | undefined => subState.contractSubscription,
)
