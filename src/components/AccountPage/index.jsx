// @flow

import React from 'react'
import { Button } from '@streamr/streamr-layout'

import type { User } from '../../flowtype/user-types'
import type { AccountPageTab } from '../../containers/AccountPage'

import styles from './accountpage.pcss'
import MyPurchasesPage from './MyPurchasesView'
import MyProductsPage from './MyProductsView'
import AccountPageHero from './AccountPageHero'
import AccountPageContent from './AccountPageContent'

export type Props = {
    tab: AccountPageTab,
    user: ?User,
    onLogout: () => void,
}

const AccountPage = ({ onLogout, user, tab }: Props) => (
    <div className={styles.accountPage}>
        <AccountPageHero user={user} tab={tab} />
        <AccountPageContent>
            {(tab === 'purchases' && (
                <MyPurchasesPage />
            )) ||
            (tab === 'products' && (
                <MyProductsPage />
            ))}
            <div className={styles.logout}>
                <Button color="primary" onClick={() => onLogout()}>Logout</Button>
            </div>
        </AccountPageContent>
    </div>
)

export default AccountPage
