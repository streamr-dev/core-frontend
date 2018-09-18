// @flow

import React from 'react'

import type { User } from '../../../../../marketplace/src/flowtype/user-types'
import type { AccountPageTab } from '../../../../../marketplace/src/containers/AccountPage/index'
import type { ProductList, ProductId, ProductSubscription } from '../../../../../marketplace/src/flowtype/product-types'
import Products from '../Products/index'
import styles from './accountpage.pcss'
import AccountPageHero from './AccountPageHero/index'
import AccountPageContent from './AccountPageContent/index'

export type Props = {
    tab: AccountPageTab,
    user: ?User,
    products: ProductList,
    isFetchingProducts: boolean,
    redirectToEditProduct?: (id: ProductId) => void,
    redirectToPublishProduct?: (id: ProductId) => void,
    subscriptions: Array<ProductSubscription>,
}

const AccountPage = ({
    user,
    tab,
    products,
    isFetchingProducts,
    redirectToEditProduct,
    redirectToPublishProduct,
    subscriptions,
}: Props) => (
    <div className={styles.accountPage}>
        <AccountPageHero user={user} tab={tab} />
        <AccountPageContent>
            {!isFetchingProducts && (
                <Products
                    products={products}
                    type={tab === 'products' ? 'myProducts' : 'myPurchases'}
                    productTileProps={{
                        showDropdownMenu: tab === 'products',
                        redirectToEditProduct,
                        redirectToPublishProduct,
                    }}
                    subscriptions={subscriptions}
                />
            )}
        </AccountPageContent>
    </div>
)

export default AccountPage
