// @flow

import type { CategoryEntities } from '$mp/flowtype/category-types'
import type {
    ProductEntities,
    SmartContractProductEntities,
} from '$mp/flowtype/product-types'
import type { TransactionEntities } from '$shared/flowtype/web3-types'
import type { StreamEntities } from '$shared/flowtype/stream-types'
import type { StoreState as MarketplaceStoreState } from '$mp/flowtype/store-state'
import type { StoreState as UserPagesStoreState } from '$userpages/flowtype/states/store-state'
import type { User } from '$shared/flowtype/user-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { IntegrationKeyEntities, IntegrationKeyIdList, BalanceList } from '$shared/flowtype/integration-key-types'

// entities
export type EntitiesState = {
    products?: ProductEntities,
    contractProducts?: SmartContractProductEntities,
    myProducts?: ProductEntities,
    myPurchases?: ProductEntities,
    subscriptions?: ProductEntities,
    categories?: CategoryEntities,
    relatedProducts?: ProductEntities,
    streams?: StreamEntities,
    transactions?: TransactionEntities,
    integrationKeys?: IntegrationKeyEntities,
}

// user
export type UserState = {
    user: ?User,
    fetchingUserData: boolean,
    userDataError: ?ErrorInUi,
    deletingUserAccount: boolean,
    deleteUserAccountError: ?ErrorInUi,
}

// integration key
export type IntegrationKeyState = {
    ethereumIdentities: IntegrationKeyIdList,
    privateKeys: IntegrationKeyIdList,
    fetchingIntegrationKeys: boolean,
    integrationKeysError: ?ErrorInUi,
    creatingIntegrationKey: boolean,
    creatingIntegrationKeyError: ?ErrorInUi,
    creatingIdentity: boolean,
    creatingIdentityError: ?ErrorInUi,
    removingIntegrationKey: boolean,
    removingIntegrationError: ?ErrorInUi,
    balances: BalanceList
}

export type StoreState = MarketplaceStoreState & UserPagesStoreState & {
    entities: EntitiesState,
    user: UserState,
    integrationKey: IntegrationKeyState,
}
