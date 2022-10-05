import type { ErrorFromApi, PayloadAction } from '$shared/flowtype/common-types'
import type { Address } from '$shared/flowtype/web3-types'
import type { ProductId, WhitelistStatus } from '../../flowtype/product-types'
export type ProductIdAction = PayloadAction<{
    id: ProductId
}>
export type ProductIdActionCreator = (arg0: ProductId) => ProductIdAction
export type ProductErrorAction = PayloadAction<{
    id: ProductId
    error: ErrorFromApi
}>
export type ProductErrorActionCreator = (id: ProductId, error: ErrorFromApi) => ProductErrorAction
export type WhiteListedAddressAction = PayloadAction<{
    id: ProductId
    address: Address
}>
export type WhiteListedAddressActionCreator = (arg0: ProductId, arg1: Address) => WhiteListedAddressAction
export type WhiteListedAddressesAction = PayloadAction<{
    id: ProductId
    addresses: Array<Address>
}>
export type WhiteListedAddressesActionCreator = (arg0: ProductId, arg1: Array<Address>) => WhiteListedAddressesAction
export type WhitelistItem = {
    address: string
    status: WhitelistStatus
    isPending?: boolean
}
