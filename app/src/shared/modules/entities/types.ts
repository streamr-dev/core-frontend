import type { PayloadAction } from '$shared/types/common-types'
export type UpdateEntitiesParam = {
    entities: EntitiesValue
}
export interface EntitiesValue {
    products?: object
    contractProducts?: object
    dataUnions?: object
    relatedProducts?: object
    subscriptions?: object
    categories?: object
    streams?: object
    transactions?: object
    joinRequests?: object
    whitelistedAddresses?: object
}
export type UpdateEntitiesAction = PayloadAction<UpdateEntitiesParam>
export type UpdateEntitiesActionCreator = (arg0: EntitiesValue) => UpdateEntitiesAction
