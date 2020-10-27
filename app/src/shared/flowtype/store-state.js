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
import type { DashboardEntities } from '$userpages/flowtype/dashboard-types'
import type { CanvasEntities } from '$userpages/flowtype/canvas-types'
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
    dashboards?: DashboardEntities,
    canvases?: CanvasEntities,
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

// i18n
export type Locale = string

export type Translations = {
    [Locale]: string | {
        language: {
            name: string,
            [string]: string,
        },
        [string]: string | {},
    },
}

export type I18nState = {
    translations: Translations,
    locale: Locale,
}

export type StoreState = MarketplaceStoreState & UserPagesStoreState & {
    entities: EntitiesState,
    user: UserState,
    integrationKey: IntegrationKeyState,
    i18n: I18nState,
}
