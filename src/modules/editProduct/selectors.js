// @flow

import { createSelector } from 'reselect'

import type { StoreState, ProductState, EditProductState } from '../../flowtype/store-state'
import type { EditProduct } from '../../flowtype/product-types'
import { selectProductWritePermission } from '../user/selectors'
import { selectAccountId } from '../web3/selectors'

export const selectProductState = (state: StoreState): ProductState => state.product

const selectEditProductState = (state: StoreState): EditProductState => state.editProduct

export const selectEditProduct = createSelector(
    selectEditProductState,
    (subState: EditProductState): ?EditProduct => subState.product,
)

export const selectProductEditPermission = createSelector([
    selectProductState,
    selectAccountId,
    selectProductWritePermission,
], (product, ownerAddress, canWrite): boolean => (
    canWrite || (
        product.ownerAddress && product.ownerAddress === ownerAddress
    )
))
