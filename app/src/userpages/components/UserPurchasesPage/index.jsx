// @flow

import React from 'react'

import UserHeader from '../UserHeader'
import styles from './userPurchasesPage.pcss'

export type Props = {
}

const UserPurchasesPage = () => (
    <div className={styles.userPurchasesPage}>
        <UserHeader />
        <span>User Purchases Page</span>
    </div>
)

export default UserPurchasesPage
