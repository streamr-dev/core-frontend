// @flow

import React from 'react'
import { Container, Button } from '@streamr/streamr-layout'

import styles from './accountpage.pcss'
import MyPurchasesPage from './MyPurchasesPage'
import MyProductsPage from './MyProductsPage'
import type { User } from '../../flowtype/user-types'
import type { AccountPageTab } from '../../containers/AccountPage'
import AccountPageHero from './AccountPageHero'

export type Props = {
    tab: AccountPageTab,
    user: ?User,
    onLogout: () => void,
}

const AccountPage = ({ onLogout, user, tab }: Props) => (
    <div className={styles.accountPage}>
        <Container>
            <AccountPageHero user={user} tab={tab} />
            {(tab === 'purchases' && (
                <MyPurchasesPage />
            )) ||
            (tab === 'products' && (
                <MyProductsPage />
            ))}
            <div className={styles.logout}>
                <Button color="primary" onClick={() => onLogout()}>Logout</Button>
            </div>
        </Container>
    </div>
)

export default AccountPage
