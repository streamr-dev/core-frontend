import type { ErrorFromApi, PayloadAction } from '$shared/types/common-types'
import type { Address } from '$shared/types/web3-types'
import type { ProjectId, WhitelistStatus } from '../../types/project-types'
export type ProductIdAction = PayloadAction<{
    id: ProjectId
}>
export type ProductIdActionCreator = (arg0: ProjectId) => ProductIdAction
export type ProductErrorAction = PayloadAction<{
    id: ProjectId
    error: ErrorFromApi
}>
export type ProductErrorActionCreator = (id: ProjectId, error: ErrorFromApi) => ProductErrorAction
export type WhiteListedAddressAction = PayloadAction<{
    id: ProjectId
    address: Address
}>
export type WhiteListedAddressActionCreator = (arg0: ProjectId, arg1: Address) => WhiteListedAddressAction
export type WhiteListedAddressesAction = PayloadAction<{
    id: ProjectId
    addresses: Array<Address>
}>
export type WhiteListedAddressesActionCreator = (arg0: ProjectId, arg1: Array<Address>) => WhiteListedAddressesAction
export type WhitelistItem = {
    address: string
    status: WhitelistStatus
    isPending?: boolean
}
