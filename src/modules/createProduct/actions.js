// @flow

import { createAction } from 'redux-actions'

import { UPDATE_PRODUCT } from './constants'
import type { UpdateProductActionCreator } from './types'

export const updateProduct: UpdateProductActionCreator = createAction(UPDATE_PRODUCT, (field: string, data: any) => ({
    field,
    data,
}))
