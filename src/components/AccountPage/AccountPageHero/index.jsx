// @flow

import React from 'react'
import links from '../../../links'
import type { User } from '../../../flowtype/user-types'
import type { AccountPageTab } from '../../../containers/AccountPage'
import Tab from './Tab'
import CreateProductButton from './CreateProductButton'

import styles from './accountPageHero.pcss'

type Props = {
    user: ?User,
    tab: AccountPageTab,
}

const AccountPageHero = ({ user, tab }: Props) => (
    <section className={styles.accountPageHero}>
        <h1 className={styles.title}>
            {user && user.name}
        </h1>
        <div className={styles.tabBar}>
            <Tab selected={tab} name="products" to={links.myProducts}>
                Products
            </Tab>
            <Tab selected={tab} name="purchases" to={links.myPurchases}>
                Purchases
            </Tab>
        </div>
        <CreateProductButton
            className={styles.createProductButton}
            to={links.createProduct}
        />
    </section>
)

export default AccountPageHero
