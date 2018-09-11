// @flow

import React from 'react'

import UserHeader from '../UserHeader'
import styles from './userTransactionsPage.pcss'

export type Props = {
}

const UserTransactionsPage = () => (
    <div className={styles.userTransactionsPage}>
        <UserHeader />
        <span>User Transactions Page</span>
    </div>
)

export default UserTransactionsPage
