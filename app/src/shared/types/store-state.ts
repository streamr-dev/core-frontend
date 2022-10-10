import type { CategoryEntities } from '$mp/types/category-types'
import type { ProductEntities, SmartContractProductEntities } from '$mp/types/product-types'
import type { TransactionEntities } from '$shared/types/web3-types'
import type { StreamEntities } from '$shared/types/stream-types'
import type { StoreState as MarketplaceStoreState } from '$mp/types/store-state'
import type { StoreState as UserPagesStoreState } from '$userpages/types/states/store-state'
import type { User, Balances } from '$shared/types/user-types'
import type { ErrorInUi } from '$shared/types/common-types'
// entities
export type EntitiesState = {
    products?: ProductEntities
    contractProducts?: SmartContractProductEntities
    myProducts?: ProductEntities
    myPurchases?: ProductEntities
    subscriptions?: ProductEntities
    categories?: CategoryEntities
    relatedProducts?: ProductEntities
    streams?: StreamEntities
    transactions?: TransactionEntities
}
// user
export type UserState = {
    user: User | null | undefined
    balances: Balances
    fetchingUserData: boolean
    userDataError: ErrorInUi | null | undefined
    deletingUserAccount: boolean
    deleteUserAccountError: ErrorInUi | null | undefined
}
export type StoreState = MarketplaceStoreState &
    UserPagesStoreState & {
        entities: EntitiesState
        user: UserState
    }
