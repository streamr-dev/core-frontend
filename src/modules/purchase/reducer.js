// @flow

import { handleActions } from 'redux-actions'

import {
    BUY_PRODUCT_REQUEST,
    BUY_PRODUCT_SUCCESS,
    BUY_PRODUCT_FAILURE,
    RECEIVE_PURCHASE_HASH_SUCCESS,
    RECEIVE_PURCHASE_HASH_FAILURE,
} from './constants'
import type { PurchaseListState } from '../../flowtype/store-state'
import type {} from './types'

const initialState: PurchaseListState = {
    items: [],
}

const reducer: (ProductListState) => ProductListState = handleActions({}, initialState)

export default reducer
