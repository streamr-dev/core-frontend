import { CategoryEntities } from '$mp/types/category-types'
import { ProjectEntities, SmartContractProjectEntities } from '$mp/types/project-types'
import { TransactionEntities } from '$shared/types/web3-types'
import { StreamEntities } from '$shared/types/stream-types'
import { StoreState as MarketplaceStoreState } from '$mp/types/store-state'
import { StoreState as UserPagesStoreState } from '$userpages/types/states/store-state'
import { Balances } from '$shared/types/user-types'

// entities
export type EntitiesState = {
    products?: ProjectEntities
    contractProducts?: SmartContractProjectEntities
    myProducts?: ProjectEntities
    myPurchases?: ProjectEntities
    subscriptions?: ProjectEntities
    categories?: CategoryEntities
    relatedProducts?: ProjectEntities
    streams?: StreamEntities
    transactions?: TransactionEntities
    dataUnions?: any // TODO add typing
    dataUnionStats?: any // TODO add typing
    dataUnionSecrets?: any // TODO add typing
    joinRequests?: any // TODO add typing
    whitelistedAddresses?: any // TODO add typing
}
// user
export type UserState = {
    balances: Balances
}
export type StoreState = MarketplaceStoreState &
    UserPagesStoreState & {
        entities: EntitiesState
        user: UserState
    }
