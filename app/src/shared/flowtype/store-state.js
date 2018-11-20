// @flow

import type { CategoryEntities } from '$mp/flowtype/category-types'
import type {
    ProductEntities,
    SmartContractProductEntities,
} from '$mp/flowtype/product-types'
import type { TransactionEntities, Web3AccountList } from '$shared/flowtype/web3-types'
import type { StreamEntities } from '$shared/flowtype/stream-types'
import type { StoreState as MarketplaceStoreState } from '$mp/flowtype/store-state'
import type { StoreState as UserPagesStoreState } from '$userpages/flowtype/states/store-state'
import type { ApiKey, User } from '$shared/flowtype/user-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { DashboardEntities } from '$userpages/flowtype/dashboard-types'
import type { CanvasEntities } from '$userpages/flowtype/canvas-types'

// entities
export type EntitiesState = {
    products?: ProductEntities,
    contractProducts?: SmartContractProductEntities,
    myProducts?: ProductEntities,
    muPurchases?: ProductEntities,
    categories?: CategoryEntities,
    relatedProducts?: ProductEntities,
    streams?: StreamEntities,
    transactions?: TransactionEntities,
    dashboards?: DashboardEntities,
    canvases?: CanvasEntities,
}

// user
export type UserState = {
    user: ?User,
    fetchingUserData: boolean,
    userDataError: ?ErrorInUi,
    apiKey: ?ApiKey,
    fetchingApiKey: boolean,
    apiKeyError: ?ErrorInUi,
    web3Accounts: ?Web3AccountList,
    fetchingWeb3Accounts: boolean,
    web3AccountsError: ?ErrorInUi,
    fetchingExternalLogin: boolean,
    logoutError: ?ErrorInUi,
    fetchingLogout: boolean,
}

export type StoreState = MarketplaceStoreState & UserPagesStoreState
