// @flow

import type { ErrorFromApi, PayloadAction } from '$shared/flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'

export type ProductIdAction = PayloadAction<{
    id: ProductId,
}>
export type ProductIdActionCreator = (ProductId) => ProductIdAction

export type ProductErrorAction = PayloadAction<{
    id: ProductId,
    error: ErrorFromApi
}>
export type ProductErrorActionCreator = (id: ProductId, error: ErrorFromApi) => ProductErrorAction

export type WhitelistStatus = 'added' | 'removed' | 'subscribed'

export type WhitelistItem = {
    address: string,
    status: WhitelistStatus,
    isPending?: boolean,
}
