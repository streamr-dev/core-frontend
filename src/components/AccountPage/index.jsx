// @flow

import React from 'react'

import type { User } from '../../flowtype/user-types'
import type { AccountPageTab } from '../../containers/AccountPage'
import type { ProductList, ProductId, Product } from '../../flowtype/product-types'
import Products from '../Products'
import styles from './accountpage.pcss'
import AccountPageHero from './AccountPageHero'
import AccountPageContent from './AccountPageContent'

export type Props = {
    tab: AccountPageTab,
    user: ?User,
    products: ProductList,
    isFetchingProducts: boolean,
    redirectToEditProduct?: (id: ProductId) => void,
    showPublishDialog?: (product: Product, redirectOnCancel: boolean) => void,
}

const AccountPage = ({
    user,
    tab,
    products,
    isFetchingProducts,
    redirectToEditProduct,
    showPublishDialog,
}: Props) => (
    <div className={styles.accountPage}>
        <AccountPageHero user={user} tab={tab} />
        <AccountPageContent>
            {!isFetchingProducts && (
                <Products
                    products={products}
                    type={tab === 'products' ? 'myProducts' : 'myPurchases'}
                    productTileProps={{
                        showDropdownMenu: true,
                        redirectToEditProduct,
                        showPublishDialog,
                    }}
                />
            )}
        </AccountPageContent>
    </div>
)

export default AccountPage
