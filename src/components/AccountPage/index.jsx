// @flow

import React from 'react'

import type { User } from '../../flowtype/user-types'
import type { AccountPageTab } from '../../containers/AccountPage'
import type { ProductList } from '../../flowtype/product-types'
import styles from './accountpage.pcss'
import Products from './Products'
import AccountPageHero from './AccountPageHero'
import AccountPageContent from './AccountPageContent'
import NoProductsView from './NoProductsView'

export type Props = {
    tab: AccountPageTab,
    user: ?User,
    myProducts: ProductList,
    isFetchingMyProducts: boolean,
    myPurchases: ProductList,
    isFetchingMyPurchases: boolean
}

const AccountPage = ({
    user,
    tab,
    myProducts,
    isFetchingMyProducts,
    myPurchases,
    isFetchingMyPurchases,
}: Props) => (
    <div className={styles.accountPage}>
        <AccountPageHero user={user} tab={tab} />
        <AccountPageContent>
            {tab === 'products' && !isFetchingMyProducts && myProducts && (
                <Products
                    products={myProducts}
                    productTileProps={{
                        showOwner: false,
                        showPrice: false,
                        showSubscriptionStatus: false,
                    }}
                >
                    <NoProductsView />
                </Products>
            )}
            {tab === 'purchases' && !isFetchingMyPurchases && myPurchases && (
                <Products
                    products={myPurchases}
                    productTileProps={{
                        showOwner: true,
                        showPrice: false,
                        showPublishStatus: false,
                    }}
                >
                    <NoProductsView />
                </Products>
            )}
        </AccountPageContent>
    </div>
)

export default AccountPage
