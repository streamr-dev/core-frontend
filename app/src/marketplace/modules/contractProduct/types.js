// @flow

import type { ErrorFromApi, PayloadAction } from '$shared/flowtype/common-types'
import type { Address } from '$shared/flowtype/web3-types'
import type { ProductId, WhitelistStatus } from '../../flowtype/product-types'

export type ProductIdAction = PayloadAction<{
    id: ProductId,
}>
export type ProductIdActionCreator = (ProductId) => ProductIdAction

export type ProductErrorAction = PayloadAction<{
    id: ProductId,
    error: ErrorFromApi
}>
export type ProductErrorActionCreator = (id: ProductId, error: ErrorFromApi) => ProductErrorAction

export type WhiteListedAddressAction = PayloadAction<{
    id: ProductId,
    address: Address,
}>
export type WhiteListedAddressActionCreator = (ProductId, Address) => WhiteListedAddressAction

export type WhiteListedAddressesAction = PayloadAction<{
    id: ProductId,
    addresses: Array<Address>,
}>
export type WhiteListedAddressesActionCreator = (ProductId, Array<Address>) => WhiteListedAddressesAction

export type WhitelistItem = {
    address: string,
    status: WhitelistStatus,
    isPending?: boolean,
}
