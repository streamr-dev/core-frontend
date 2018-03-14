// @flow

import type {PayloadAction} from '../../flowtype/common-types'

export type UpdateProductAction = PayloadAction<{
    field: string,
    data: any,
}>
export type UpdateProductActionCreator = (field: string, data: any) => UpdateProductActionCreator
