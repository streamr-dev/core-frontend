// @flow

import React from 'react'

import UserHeader from '../UserHeader'
import styles from './userSettingsPage.pcss'

export type Props = {
}

const UserSettingsPage = () => (
    <div className={styles.userTransactionsPage}>
        <UserHeader />
        <span>User Settings Page</span>
    </div>
)

export default UserSettingsPage
