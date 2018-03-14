// @flow

import { handleActions } from 'redux-actions'

import { UPDATE_PRODUCT } from './constants'
import type { UpdateProductAction } from './types'
import type {CreateProductState} from '../../flowtype/store-state'

const initialState: CreateProductState = {
    product: {
        name: '',
        description: '',
        imageUrl: '',
        category: null,
        streams: [],
        previewStream: null,
        ownerAddress: '',
        beneficiaryAddress: '',
        pricePerSecond: 0,
        priceCurrency: 'DATA',
        priceUnit: null,
    },
}

const reducer: (CreateProductState) => CreateProductState = handleActions({
    [UPDATE_PRODUCT]: (state: CreateProductState, action: UpdateProductAction) => ({
        product: {
            ...state.product,
            [action.payload.field]: action.payload.data,
        },
    }),
}, initialState)

export default reducer
