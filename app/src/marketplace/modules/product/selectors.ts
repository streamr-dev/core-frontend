import { createSelector } from 'reselect'
import { Subscription } from '../../types/project-types'
import { ProductState, StoreState } from '../../types/store-state'

const selectProductState = (state: StoreState): ProductState => state.product

export const selectContractSubscription: (arg0: StoreState) => Subscription | null | undefined = createSelector(
    selectProductState,
    (subState: ProductState): Subscription | null | undefined => subState.contractSubscription,
)
